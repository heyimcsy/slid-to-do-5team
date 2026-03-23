/**
 * POST /api/auth/signup (BFF)
 *
 * **login(`/api/auth/login`)과 토큰 누락 처리 차이**
 * - Login: 목적이 **세션(토큰) 확보**이므로 백엔드 2xx인데 토큰 쌍이 없으면 **502** — BFF·백엔드 간 **응답 계약 위반**으로 처리 (`login/route.ts` 참고).
 * - Signup: 백엔드가 **이메일 인증 대기** 등으로 2xx이면서 토큰을 주지 않을 수 있음 — **정상 분기**로 간주.
 *   → **200 OK** + `success: true` + `sessionIssued: false` + `emailVerificationRequired: true`
 * - 가입과 동시에 로그인(토큰 발급)이면 **201 Created** + `sessionIssued: true` + HttpOnly 쿠키 설정.
 */
import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/auth/cookies';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';
import { signupBodySchema, signupValidationMessage } from '@/lib/auth/schemas/signup';

import { API_BASE_URL } from '@/constants/api';

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

  const { email, password } = parsedBody.data;

  const base = API_BASE_URL?.replace(/\/$/, '') ?? '';

  let data: Record<string, unknown>;
  try {
    // 백엔드가 다른 경로면 여기만 변경 (예: `/users`, `/auth/register`)
    const response = await fetch(`${base}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, message: (err as { message?: string }).message ?? '회원가입 실패' },
        { status: response.status },
      );
    }

    data = (await response.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: '인증 서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      },
      { status: 502 },
    );
  }

  const { accessToken, refreshToken } = parseTokenPairFromBackendJson(data);

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      {
        success: true,
        sessionIssued: false,
        emailVerificationRequired: true,
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
      emailVerificationRequired: false,
      message: '회원가입이 완료되었습니다.',
    },
    { status: 201 },
  );
}
