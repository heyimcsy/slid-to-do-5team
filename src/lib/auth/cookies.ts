import 'server-only'; // Client Component에서 import 시 빌드 에러 발생하므로 server-only 사용

import { cookies } from 'next/headers';

import { AUTH_CONFIG } from '@/constants/api';

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
 * @description accessToken이 토큰 갱신 버퍼(REFRESH_BUFFER_SECONDS) 이내에 만료되는지 확인
 * @returns {Promise<boolean>} - accessToken 만료 여부 반환
 */
export async function isAccessTokenExpiringSoon(): Promise<boolean> {
  const accessToken = await getAccessToken();
  if (!accessToken) return true; // 없음 = 만료 = 401 Unauthorized 반환
  const exp = getJwtExp(accessToken);
  if (exp === null) return true; // 파싱 불가/만료시간 없음 = 안전하게 갱신 시도
  const now = Date.now() / 1000;
  return exp - now < AUTH_CONFIG.REFRESH_BUFFER_SECONDS;
}

/** Route Handler에서 인증 쿠키 설정 */
export async function setAuthCookies(accessToken: string, refreshToken: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    AUTH_CONFIG.ACCESS_TOKEN_KEY,
    accessToken,
    baseCookieOptions(AUTH_CONFIG.ACCESS_TOKEN_MAX_AGE),
  );

  cookieStore.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, refreshToken, {
    ...baseCookieOptions(AUTH_CONFIG.REFRESH_TOKEN_MAX_AGE),
  });
}

/** 인증 쿠키 제거 (로그아웃) */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_CONFIG.ACCESS_TOKEN_KEY);
  cookieStore.delete(AUTH_CONFIG.REFRESH_TOKEN_KEY);
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
