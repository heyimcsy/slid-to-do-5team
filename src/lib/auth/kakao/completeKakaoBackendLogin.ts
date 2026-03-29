import 'server-only';

import type { User } from '@/lib/auth/schemas/user';

import { setAuthCookies } from '@/lib/auth/cookies';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';

import { API_BASE_URL, API_TIMEOUT_MS } from '@/constants/api';
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
  const base = API_BASE_URL?.replace(/\/$/, '') ?? '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${base}/oauth/kakao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: kakaoAccessToken }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      if (response.status === 409) {
        return { ok: false, status: 409, message: DUPLICATE_ACCOUNT_MESSAGE_KO };
      }
      const raw =
        err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
          ? err.message
          : '카카오 로그인 실패';
      return { ok: false, status: response.status, message: raw };
    }

    const data = (await response.json()) as Record<string, unknown>;
    const { accessToken: at, refreshToken: rt, user } = parseTokenPairFromBackendJson(data);

    if (!at || !rt) {
      return {
        ok: false,
        status: 502,
        message: `토큰 응답 형식 오류 (${AUTH_CONFIG.ACCESS_TOKEN_KEY}/${AUTH_CONFIG.REFRESH_TOKEN_KEY})`,
      };
    }

    await setAuthCookies(at, rt);
    return { ok: true, user };
  } catch {
    return {
      ok: false,
      status: 502,
      message: AUTH_SERVICE_ERROR_MESSAGE_KO,
    };
  } finally {
    clearTimeout(timeout);
  }
}
