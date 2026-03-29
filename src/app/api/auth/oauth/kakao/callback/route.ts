import type { NextRequest } from 'next/server';

import { oauthUserFlashCookieOptions } from '@/lib/auth/cookies';
import { completeKakaoBackendLogin } from '@/lib/auth/kakao/completeKakaoBackendLogin';
import { exchangeKakaoAuthorizationCode } from '@/lib/auth/kakao/kakaoTokenExchange';
import {
  COOKIE_OAUTH_KAKAO_RETURN_PATH,
  COOKIE_OAUTH_KAKAO_STATE,
  COOKIE_OAUTH_USER_FLASH,
  OAUTH_SYNC_USER_QUERY,
  resolveKakaoOAuthRedirectUriForServer,
} from '@/lib/auth/oauth-urls';
import { getSafeCallbackPath } from '@/lib/navigation/safeCallbackPath';
import { NextResponse } from 'next/server';

/**
 * Kakao 로그인 redirect_uri — `GET ?code=&state=` 후 토큰 교환·백엔드 로그인·쿠키 설정·리다이렉트.
 * 라우트 파일: `kakao/callback/route.ts` → URL `/api/auth/oauth/kakao/callback`
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const err = searchParams.get('error');
  const errDesc = searchParams.get('error_description');
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const loginError = (message: string) =>
    NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}`, origin));

  if (err) {
    return loginError(errDesc ?? err);
  }

  if (!code?.trim() || !state?.trim()) {
    return loginError('카카오 인가 응답(code/state)이 없습니다.');
  }

  const storedState = request.cookies.get(COOKIE_OAUTH_KAKAO_STATE)?.value;
  if (!storedState || storedState !== state) {
    return loginError('로그인 세션이 만료되었거나 유효하지 않습니다. 다시 시도해 주세요.');
  }

  let redirectUri: string;
  try {
    redirectUri = resolveKakaoOAuthRedirectUriForServer();
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'redirect_uri 설정 오류';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }

  let kakaoAccessToken: string;
  try {
    kakaoAccessToken = (await exchangeKakaoAuthorizationCode(code, redirectUri)).access_token;
  } catch (e) {
    const msg = e instanceof Error ? e.message : '카카오 토큰 교환 실패';
    return loginError(msg);
  }

  const backend = await completeKakaoBackendLogin(kakaoAccessToken);
  if (!backend.ok) {
    return loginError(backend.message);
  }

  const rawReturn = request.cookies.get(COOKIE_OAUTH_KAKAO_RETURN_PATH)?.value;
  let decodedReturn: string | null = null;
  if (rawReturn) {
    try {
      decodedReturn = decodeURIComponent(rawReturn);
    } catch {
      decodedReturn = null;
    }
  }
  const nextPath = getSafeCallbackPath(decodedReturn) ?? '/dashboard';

  const target = new URL(nextPath, origin);
  if (backend.user) {
    target.searchParams.set(OAUTH_SYNC_USER_QUERY, '1');
  }

  const res = NextResponse.redirect(target);
  res.cookies.set(COOKIE_OAUTH_KAKAO_STATE, '', { path: '/', maxAge: 0 });
  res.cookies.set(COOKIE_OAUTH_KAKAO_RETURN_PATH, '', { path: '/', maxAge: 0 });

  if (backend.user) {
    res.cookies.set(
      COOKIE_OAUTH_USER_FLASH,
      JSON.stringify(backend.user),
      oauthUserFlashCookieOptions(120),
    );
  }

  return res;
}
