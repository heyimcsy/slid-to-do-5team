import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/auth/cookies';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';
import {
  loginBodySchema,
  loginValidationMessage,
  mapLoginBackendFailureMessage,
  resolveLoginFailureHttpStatus,
} from '@/lib/auth/schemas/login';

import { API_BASE_URL, API_TIMEOUT_MS } from '@/constants/api';
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

  const base = API_BASE_URL?.replace(/\/$/, '') ?? '';

  /** 백엔드 연결 실패·성공 본문 JSON 파싱 실패 등 → 제어된 502 (미처리 시 Route Handler 500) */
  let data: Record<string, unknown>;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const raw =
        err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
          ? err.message
          : '로그인 실패';
      const status = resolveLoginFailureHttpStatus(response.status, err);
      return NextResponse.json(
        { success: false, message: mapLoginBackendFailureMessage(raw) },
        { status },
      );
    }

    data = (await response.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: AUTH_SERVICE_ERROR_MESSAGE_KO,
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
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
