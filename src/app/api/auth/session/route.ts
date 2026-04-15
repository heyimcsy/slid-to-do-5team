import { NextResponse } from 'next/server';
import { getOAuthProvider, getRefreshToken } from '@/lib/auth/cookies';

/**
 * 클라이언트가 HttpOnly 세션 메타를 알 수 있게 함:
 * - `hasRefreshToken` — persist `user === null` + 쿠키만 남은 경우 등
 * - `oauthProvider` — `oauth_provider` 쿠키(`google` | `kakao`), 없으면 `null`(이메일 세션)
 */
export async function GET() {
  const [refreshToken, oauthProvider] = await Promise.all([getRefreshToken(), getOAuthProvider()]);
  return NextResponse.json({
    hasRefreshToken: Boolean(refreshToken),
    oauthProvider: oauthProvider ?? null,
  });
}
