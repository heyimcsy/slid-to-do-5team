import { API_BASE_URL, AUTH_CONFIG } from '@/constants/api';
import { setAuthCookies } from '@/lib/auth/cookies';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: '잘못된 요청' }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: '이메일과 비밀번호를 입력하세요.' },
      { status: 400 },
    );
  }

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
        message: `토큰 응답 형식 오류 (${AUTH_CONFIG.ACCESS_TOKEN_KEY}/${AUTH_CONFIG.REFRESH_TOKEN_KEY} 또는 camelCase 대체 키 누락)`,
      },
      { status: 502 },
    );
  }

  await setAuthCookies(accessToken, refreshToken);

  return NextResponse.json({ success: true });
}
