import type { TokenPairBackendResponse } from '@/lib/auth/parseTokenPairFromBackendJson';

import { NextRequest, NextResponse } from 'next/server';
import { ApiClientError } from '@/lib/apiClient';
import { apiClientServer } from '@/lib/apiClient.server';
import { setAuthCookies } from '@/lib/auth/cookies';
import { isAbortError } from '@/lib/auth/isAbortError';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';
import {
  loginBodySchema,
  loginValidationMessage,
  mapLoginBackendFailureMessage,
  resolveLoginFailureHttpStatus,
} from '@/lib/auth/schemas/login';

import { API_TIMEOUT_MS } from '@/constants/api';
import { AUTH_CONFIG } from '@/constants/auth-config';
import { AUTH_SERVICE_ERROR_MESSAGE_KO } from '@/constants/error-message';

export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: '잘못된 요청' }, { status: 400 });
  }

  const parsedBody = loginBodySchema.safeParse(rawBody);
  if (!parsedBody.success) {
    return NextResponse.json(
      { success: false, message: loginValidationMessage(parsedBody.error) },
      { status: 400 },
    );
  }

  const { email, password } = parsedBody.data;

  /** 백엔드 연결 실패·성공 본문 JSON 파싱 실패 등 → 제어된 502 (미처리 시 Route Handler 500) */
  let data: TokenPairBackendResponse;
  try {
    data = await apiClientServer<TokenPairBackendResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
      retry: false,
      timeoutMs: API_TIMEOUT_MS,
      skipSessionExpiredRedirect: true,
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      const backendError = {
        status: error.status,
        code: error.code,
        message: error.message,
      };
      const status = resolveLoginFailureHttpStatus(error.status, backendError);
      const mappedMessage = mapLoginBackendFailureMessage(error.message);
      return NextResponse.json(
        { success: false, message: mappedMessage || '로그인 실패' },
        { status },
      );
    }
    if (isAbortError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: AUTH_SERVICE_ERROR_MESSAGE_KO,
        },
        { status: 504 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: AUTH_SERVICE_ERROR_MESSAGE_KO,
      },
      { status: 502 },
    );
  }

  const { accessToken, refreshToken, user } = parseTokenPairFromBackendJson(data);

  /**
   * 로그인은 **반드시** 세션(토큰 쌍) 확보가 목적이다. 2xx인데 토큰이 없으면 signup과 달리
   * 정상 분기가 아니라 **BFF·백엔드 응답 계약 위반**으로 본다 (`/api/auth/signup` 주석 참고).
   */
  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      {
        success: false,
        message: `토큰 응답 형식 오류 (${AUTH_CONFIG.ACCESS_TOKEN_KEY}/${AUTH_CONFIG.REFRESH_TOKEN_KEY})`,
      },
      { status: 502 },
    );
  }

  await setAuthCookies(accessToken, refreshToken);

  return NextResponse.json(user ? { success: true as const, user } : { success: true as const });
}
