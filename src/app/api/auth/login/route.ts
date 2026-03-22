import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/auth/cookies';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';
import { z } from 'zod';

import { API_BASE_URL, AUTH_CONFIG } from '@/constants/api';

const loginBodySchema = z.object({
  email: z.string().trim().email({ message: '유효한 이메일을 입력하세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력하세요.' }),
});

const loginValidationMessage = (error: z.ZodError): string => {
  const issue = error.issues[0];
  // 오류가 없으면 기본 메시지 반환
  if (!issue) return '이메일과 비밀번호를 올바르게 입력하세요.';
  // 숫자·객체 등 비문자열은 Zod 기본 영문 메시지 대신 고정 문구
  if (issue.code === 'invalid_type') return '이메일과 비밀번호를 올바른 형식으로 입력하세요.';
  // 오류 메시지 반환
  return issue.message;
};

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
  const response = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return NextResponse.json(
      { success: false, message: (err as { message?: string }).message ?? '로그인 실패' },
      { status: response.status },
    );
  }

  const data = (await response.json()) as Record<string, unknown>;
  const { accessToken, refreshToken } = parseTokenPairFromBackendJson(data);

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

  return NextResponse.json({ success: true });
}
