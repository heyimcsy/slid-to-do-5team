import type { CompleteKakaoBackendLoginResult } from '@/lib/auth/kakao/completeKakaoBackendLogin';
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
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

import {
  BACKEND_LOGIN_FAILED_MESSAGE_KO,
  MISMATCHED_REDIRECT_URI_MESSAGE_KO,
  MISSING_OAUTH_RESPONSE_MESSAGE_KO,
  SESSION_EXPIRED_OR_INVALID_MESSAGE_KO,
  TOKEN_EXCHANGE_FAILED_MESSAGE_KO,
} from '@/constants/error-message';

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
    return loginError(MISSING_OAUTH_RESPONSE_MESSAGE_KO);
  }

  const storedState = request.cookies.get(COOKIE_OAUTH_KAKAO_STATE)?.value;
  if (!storedState || storedState !== state) {
    return loginError(SESSION_EXPIRED_OR_INVALID_MESSAGE_KO);
  }

  let redirectUri: string;
  try {
    redirectUri = resolveKakaoOAuthRedirectUriForServer();
  } catch (e) {
    // TODO: Sentry 등에 event 파라미터를 받아 원인 로깅 (URL에는 고정 문구만)
    const msg = e instanceof Error ? e.message : MISMATCHED_REDIRECT_URI_MESSAGE_KO;
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }

  let kakaoAccessToken: string;
  try {
    kakaoAccessToken = (await exchangeKakaoAuthorizationCode(code, redirectUri)).access_token;
  } catch {
    return loginError(TOKEN_EXCHANGE_FAILED_MESSAGE_KO);
  }

  let backend: CompleteKakaoBackendLoginResult;
  try {
    backend = await completeKakaoBackendLogin(kakaoAccessToken);
  } catch {
    return loginError(BACKEND_LOGIN_FAILED_MESSAGE_KO);
  }
  if (!backend.ok) {
    return loginError(backend.message ?? BACKEND_LOGIN_FAILED_MESSAGE_KO);
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
