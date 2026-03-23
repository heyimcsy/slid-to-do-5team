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
        message: '회원가입이 완료되었습니다. 로그인해 주세요.',
        authenticated: false,
      },
      { status: 201 },
    );
  }

  await setAuthCookies(accessToken, refreshToken);

  return NextResponse.json({
    success: true,
    authenticated: true,
    message: '회원가입이 완료되었습니다.',
  });
}
