import 'server-only'; // Client Component에서 import 시 빌드 에러 발생하므로 server-only 사용

import type { NextResponse } from 'next/server';

import { cookies } from 'next/headers';
import { COOKIE_OAUTH_USER_FLASH } from '@/lib/auth/oauth-urls';
import { oauthProviderCookieSchema } from '@/lib/auth/schemas/oauth';

import { AUTH_CONFIG } from '@/constants/auth-config';

/** 세션 쿠키 설정 시 OAuth provider 쿠키 동작 — `unchanged`는 refresh 시 토큰만 갱신 */
export type AuthSessionSource = 'unchanged' | 'password' | 'google' | 'kakao';

type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  maxAge: number;
};

// 공통 쿠키 옵션
function baseCookieOptions(maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // CSRF 방어: cross-site POST 차단(서버는 요청 차단 무관)
    path: '/',
    maxAge,
  };
}

/**
 * OAuth 콜백에서 심는 `oauth_user_flash`와 동일 속성.
 * 삭제(Set-Cookie maxAge:0) 시에도 httpOnly/secure/sameSite가 같아야 브라우저가 제거함.
 */
export function oauthUserFlashCookieOptions(maxAge: number): CookieOptions {
  return baseCookieOptions(maxAge);
}
/**
 * @description OAuth로 들어온 임시 사용자 정보 쿠키 삭제 시 쿠키 옵션을 사용하여 쿠키를 삭제합니다.
 */
export function clearOAuthUserFlashCookie(res: NextResponse): void {
  res.cookies.delete({ name: COOKIE_OAUTH_USER_FLASH, ...oauthUserFlashCookieOptions(0) });
}

/** JWT 만료 시간(exp) 추출(단순 디코딩만) - @internal 테스트용 export */
export function getJwtExp(token: string): number | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    // server-only 선언으로 Server Component가 확실하므로 atob 대신 Buffer.from 사용 가능
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    return typeof decoded.exp === 'number' ? decoded.exp : null;
  } catch {
    return null;
  }
}

/**
 * @description accessToken이 없거나 JWT exp가 현재 시각 이하이면 true (갱신·재발급 대상).
 * 파싱 불가 시 안전하게 true.
 */
export async function isAccessTokenExpired(): Promise<boolean> {
  const accessToken = await getAccessToken();
  if (!accessToken) return true;
  const exp = getJwtExp(accessToken);
  if (exp === null) return true;
  const now = Date.now() / 1000;
  return exp <= now;
}

/**
 * Route Handler에서 인증 쿠키 설정.
 * @param sessionSource - `google`/`kakao`: OAuth provider 쿠키 설정(만료는 refresh와 동일). `password`: provider 제거. `unchanged`: 토큰만 갱신.
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  sessionSource: AuthSessionSource = 'unchanged',
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    AUTH_CONFIG.ACCESS_TOKEN_KEY,
    accessToken,
    baseCookieOptions(AUTH_CONFIG.ACCESS_TOKEN_MAX_AGE),
  );

  cookieStore.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, refreshToken, {
    ...baseCookieOptions(AUTH_CONFIG.REFRESH_TOKEN_MAX_AGE),
  });

  if (sessionSource === 'google' || sessionSource === 'kakao') {
    cookieStore.set(
      AUTH_CONFIG.OAUTH_PROVIDER_COOKIE_KEY,
      sessionSource,
      baseCookieOptions(AUTH_CONFIG.REFRESH_TOKEN_MAX_AGE),
    );
  } else if (sessionSource === 'password') {
    cookieStore.delete(AUTH_CONFIG.OAUTH_PROVIDER_COOKIE_KEY);
  }
}

/** 인증 쿠키·OAuth provider 쿠키 제거 (로그아웃) */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_CONFIG.ACCESS_TOKEN_KEY);
  cookieStore.delete(AUTH_CONFIG.REFRESH_TOKEN_KEY);
  cookieStore.delete(AUTH_CONFIG.OAUTH_PROVIDER_COOKIE_KEY);
}

/** OAuth 세션일 때만 `google` | `kakao`, 그 외·손상 값은 `undefined` */
export async function getOAuthProvider(): Promise<'google' | 'kakao' | undefined> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_CONFIG.OAUTH_PROVIDER_COOKIE_KEY)?.value;
  if (!raw) return undefined;
  const parsed = oauthProviderCookieSchema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
}

/** Server Component / Route Handler에서 accessToken 읽기 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_CONFIG.ACCESS_TOKEN_KEY)?.value;
}

/** Route Handler에서 refreshToken 읽기 */
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_CONFIG.REFRESH_TOKEN_KEY)?.value;
}

/**
 * `proxy`와 동일 기준: access·refresh 중 하나라도 있으면 비로그인 강제 리다이렉트 대상이 아님(세션·갱신 가능).
 */
export async function hasAuthSessionCookies(): Promise<boolean> {
  const [access, refresh] = await Promise.all([getAccessToken(), getRefreshToken()]);
  return Boolean(access || refresh);
}
