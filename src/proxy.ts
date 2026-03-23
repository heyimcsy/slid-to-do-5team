import 'server-only';

import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';

import { ALLOWED_ORIGINS, API_BASE_URL, AUTH_CONFIG } from '@/constants/api';

// PUBLIC_PATHS 에서는 인증을 거치지 않음(로그인 이전에 접근 가능한 페이지)
const PUBLIC_PATHS = ['/', '/login', '/signup', '/com'];

/** @internal 테스트용 export */
export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * @description proxy - Next.js 16 라우트 보호 (proxy.ts = 구 middleware.ts)
 * @param request - NextRequest
 * @returns {NextResponse} - NextResponse
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_CONFIG.ACCESS_TOKEN_KEY);
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!token?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon\\.ico|fonts).*)'],
};

/**
 * @description BFF 요청 origin 검증 (cross-site 요청 차단)
 * @note Server Component는 API_BASE_URL 직통이라 /api/proxy 미사용. Client만 사용.
 * @note Origin 없음 → 동일 출처 GET 또는 서버 fetch (허용). Origin 있으면 화이트리스트 검사.
 */
/** @internal 테스트용 export */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const targetOrigin = new URL(request.url).origin;
  // 동일 출처: Origin/Referer 없으면 허용 (same-origin GET, 일부 브라우저)
  if (!origin && !referer) return true;
  if (origin) {
    // 동일 출처 또는 화이트리스트
    return (
      origin === targetOrigin ||
      ALLOWED_ORIGINS.some((o) => origin === o || origin.startsWith(o + '/'))
    );
  }
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      return (
        refOrigin === targetOrigin ||
        ALLOWED_ORIGINS.some((o) => refOrigin === o || refOrigin.startsWith(o + '/'))
      );
    } catch {
      return false;
    }
  }
  return true;
}

/**
 * @description forwardToBackend - 클라이언트 요청을 백엔드 API로 전달하는 BFF 프록시
 * @param request - 클라이언트 요청
 * @param path - 백엔드 API 경로(세그먼트만, 선행 `/` 없음). 원 요청의 쿼리스트링은 `request.url`에서 이어붙임.
 * @returns {Promise<Response>} - 백엔드 API 응답
 * @note Route Handler에서 호출 (cookies()로 accessToken 읽기 가능)
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export async function forwardToBackend(request: Request, path: string): Promise<Response> {
  if (!isAllowedOrigin(request)) {
    return new Response(JSON.stringify({ message: '허용된 출처가 아닙니다.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // accessToken 만료 직전이면 백엔드로 refresh 후 쿠키 갱신
  const { getAccessToken, getRefreshToken, isAccessTokenExpiringSoon, setAuthCookies } =
    await import('@/lib/auth/cookies');

  if (await isAccessTokenExpiringSoon()) {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      const base = API_BASE_URL?.replace(/\/$/, '') ?? '';
      const res = await fetch(`${base}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [AUTH_CONFIG.REFRESH_TOKEN_KEY]: refreshToken }),
      });
      if (res.ok) {
        const data = (await res.json()) as Record<string, unknown>;
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          parseTokenPairFromBackendJson(data);
        if (newAccessToken && newRefreshToken) {
          await setAuthCookies(newAccessToken, newRefreshToken);
        }
      }
    }
  }

  const accessToken = await getAccessToken();
  const base = API_BASE_URL?.replace(/\/$/, '') ?? '';
  /** BFF `/api/proxy/...?a=1` → 백엔드 `.../...?a=1` (필터·페이지네이션 유지) */
  const search = new URL(request.url).search;
  const pathPart = path ? `${base}/${path}` : base;
  const url = `${pathPart}${search}`;

  const headers = new Headers(request.headers);
  headers.delete('cookie');
  /** 클라이언트의 Host는 백엔드 호스트와 다름 — undici가 `url` 기준으로 설정하도록 제거 */
  headers.delete('host');
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  /** Node.js: ReadableStream 바디 전달 시 안전한 요청 처리를 위해 요청과 응답 스트림 분리 `duplex: half` 필요 (multipart 등) */
  const upstreamInit: RequestInit & { duplex?: 'half' } = {
    method: request.method,
    headers,
    body: request.body,
  };
  if (request.body) {
    upstreamInit.duplex = 'half';
  }

  return fetch(url, upstreamInit);
}
