/**
 * POST /api/auth/signup (BFF)
 *
 * **login(`/api/auth/login`)과 토큰 누락 처리 차이**
 * - Login: 목적이 **세션(토큰) 확보**이므로 백엔드 2xx인데 토큰 쌍이 없으면 **502** — BFF·백엔드 간 **응답 계약 위반**으로 처리 (`login/route.ts` 참고).
 * - Signup: 백엔드가 **이메일 인증 대기** 등으로 2xx이면서 토큰을 주지 않을 수 있음 — **정상 분기**로 간주.
 *   → **200 OK** + `success: true` + `sessionIssued: false` + `emailVerificationRequired: true`
 * - 가입과 동시에 로그인(토큰 발급)이면 **201 Created** + `sessionIssued: true` + HttpOnly 쿠키 설정.
 */
import type { TokenPairBackendResponse } from '@/lib/auth/parseTokenPairFromBackendJson';

import { NextRequest, NextResponse } from 'next/server';
import { ApiClientError } from '@/lib/apiClient';
import { apiClientServer } from '@/lib/apiClient.server';
import { setAuthCookies } from '@/lib/auth/cookies';
import { isAbortError } from '@/lib/auth/isAbortError';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';
import { signupBodySchema, signupValidationMessage } from '@/lib/auth/schemas/signup';

import { API_TIMEOUT_MS } from '@/constants/api';
import {
  AUTH_SERVICE_ERROR_MESSAGE_KO,
  DUPLICATE_ACCOUNT_MESSAGE_KO,
} from '@/constants/error-message';

export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: '잘못된 요청' }, { status: 400 });
  }

  const parsedBody = signupBodySchema.safeParse(rawBody);
  if (!parsedBody.success) {
    return NextResponse.json(
      { success: false, message: signupValidationMessage(parsedBody.error) },
      { status: 400 },
    );
  }

  const { email, name, password } = parsedBody.data;

  let data: TokenPairBackendResponse;
  try {
    data = await apiClientServer<TokenPairBackendResponse>('/auth/signup', {
      method: 'POST',
      body: { email, name, password },
      timeoutMs: API_TIMEOUT_MS,
      skipSessionExpiredRedirect: true,
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.status === 409) {
        return NextResponse.json(
          { success: false, message: DUPLICATE_ACCOUNT_MESSAGE_KO },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { success: false, message: error.message || '회원가입 실패' },
        { status: error.status },
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

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      {
        success: true,
        sessionIssued: false,
        // emailVerificationRequired: true,
        message: '회원가입이 완료되었습니다. 로그인해 주세요.',
      },
      { status: 200 },
    );
  }

  await setAuthCookies(accessToken, refreshToken);

  return NextResponse.json(
    {
      success: true,
      sessionIssued: true,
      message: '회원가입이 완료되었습니다.',
      ...(user ? { user } : {}),
    },
    { status: 201 },
  );
}
