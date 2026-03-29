import { NextResponse } from 'next/server';
import { getRefreshToken } from '@/lib/auth/cookies';

/**
 * 클라이언트가 HttpOnly refresh 존재 여부만 알 수 있게 함 (persist `user === null` + 쿠키만 남은 경우 등).
 */
export async function GET() {
  const refreshToken = await getRefreshToken();
  return NextResponse.json({ hasRefreshToken: Boolean(refreshToken) });
}
