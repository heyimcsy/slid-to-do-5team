import 'server-only';

import type { TokenPairBackendResponse } from '@/lib/auth/parseTokenPairFromBackendJson';
import type { User } from '@/lib/auth/schemas/user';

import { ApiClientError } from '@/lib/apiClient';
import { apiClientServer } from '@/lib/apiClient.server';
import { setAuthCookies } from '@/lib/auth/cookies';
import { isAbortError } from '@/lib/auth/isAbortError';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';

import { API_TIMEOUT_MS } from '@/constants/api';
import { AUTH_CONFIG } from '@/constants/auth-config';
import {
  AUTH_SERVICE_ERROR_MESSAGE_KO,
  DUPLICATE_ACCOUNT_MESSAGE_KO,
} from '@/constants/error-message';

export type CompleteKakaoBackendLoginResult =
  | { ok: true; user?: User }
  | { ok: false; status: number; message: string };

/**
 * 카카오 OAuth 액세스 토큰으로 백엔드 로그인 후 앱 인증 쿠키 설정.
 * `POST /api/auth/oauth/kakao` 와 동일한 본문 규약(`{ token }`).
 */
export async function completeKakaoBackendLogin(
  kakaoAccessToken: string,
): Promise<CompleteKakaoBackendLoginResult> {
  try {
    const data = await apiClientServer<TokenPairBackendResponse>('/oauth/kakao', {
      method: 'POST',
      body: { token: kakaoAccessToken },
      timeoutMs: API_TIMEOUT_MS,
      skipSessionExpiredRedirect: true,
    });
    const { accessToken: at, refreshToken: rt, user } = parseTokenPairFromBackendJson(data);

    if (!at || !rt) {
      return {
        ok: false,
        status: 502,
        message: `토큰 응답 형식 오류 (${AUTH_CONFIG.ACCESS_TOKEN_KEY}/${AUTH_CONFIG.REFRESH_TOKEN_KEY})`,
      };
    }

    await setAuthCookies(at, rt, 'kakao');
    return { ok: true, user };
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.status === 409) {
        return { ok: false, status: 409, message: DUPLICATE_ACCOUNT_MESSAGE_KO };
      }
      return { ok: false, status: error.status, message: error.message || '카카오 로그인 실패' };
    }
    if (isAbortError(error)) {
      return {
        ok: false,
        status: 504,
        message: AUTH_SERVICE_ERROR_MESSAGE_KO,
      };
    }
    return {
      ok: false,
      status: 502,
      message: AUTH_SERVICE_ERROR_MESSAGE_KO,
    };
  }
}
