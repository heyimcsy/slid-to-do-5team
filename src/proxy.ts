import 'server-only';

import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { isPublicPath } from '@/lib/navigation/publicPaths';

import { ALLOWED_ORIGINS, API_BASE_URL } from '@/constants/api';
import { AUTH_CONFIG, isAuthRouteGuardEnabled } from '@/constants/auth-config';
import { AUTH_MISSING_REFRESH_TOKEN_MESSAGE_KO } from '@/constants/error-message';

/** 갱신 실패·액세스 토큰 없음 — 백엔드로 무인증 프록시하지 않음 */
function proxyAuthRequiredResponse(): Response {
  return new Response(
    JSON.stringify({
      success: false,
      message: AUTH_MISSING_REFRESH_TOKEN_MESSAGE_KO,
    }),
    { status: 401, headers: { 'Content-Type': 'application/json' } },
  );
}

/** @internal 테스트용 re-export */
export { isPublicPath, PUBLIC_PATHS } from '@/lib/navigation/publicPaths';

/**
 * @description proxy - Next.js 16 라우트 보호 (proxy.ts = 구 middleware.ts)
 * @note access만 없고 refresh가 있으면 **통과** — 세션 복구 가능(클라이언트 `POST /api/auth/refresh` 등으로 access 재발급).
 *       둘 다 없을 때만 로그인으로 보냄.
 * @param request - NextRequest
 * @returns {NextResponse} - NextResponse
 */
export function proxy(request: NextRequest) {
  const accessCookie = request.cookies.get(AUTH_CONFIG.ACCESS_TOKEN_KEY);
  const refreshCookie = request.cookies.get(AUTH_CONFIG.REFRESH_TOKEN_KEY);
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!isAuthRouteGuardEnabled()) {
    return NextResponse.next();
  }

  const hasAccess = Boolean(accessCookie?.value);
  const hasRefresh = Boolean(refreshCookie?.value);

  if (!hasAccess && !hasRefresh) {
    const loginUrl = new URL('/login', request.url);
    const returnTo = `${pathname}${request.nextUrl.search}`;
    loginUrl.searchParams.set('callbackUrl', returnTo);
    return NextResponse.redirect(loginUrl);
  }

  if (/^\/goals\/\d+\/notes\/new$/.test(pathname)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.delete('next-url');

    return NextResponse.rewrite(request.nextUrl, {
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon\\.ico|fonts|images|icons).*)'],
};

/**
 * `ALLOWED_ORIGINS` 항목이 `Origin` 헤더 값과 맞는지 확인.
 * - 리터럴: `===` 또는 `startsWith(entry + '/')` (기존 동작)
 * - `*` 포함(예: `https://*.ngrok-free.app`): `*` 는 호스트 내 **한 라벨**(점 없음)에 대응
 *
 * @internal 테스트용 export
 */
export function originMatchesAllowedEntry(allowed: string, candidateOrigin: string): boolean {
  if (!allowed.includes('*')) {
    return candidateOrigin === allowed || candidateOrigin.startsWith(allowed + '/');
  }
  try {
    const parts = allowed.split('*');
    const escaped = parts.map((p) => p.replace(/[.+?^${}()|[\]\\]/g, '\\$&'));
    return new RegExp(`^${escaped.join('[^.]+')}$`).test(candidateOrigin);
  } catch {
    return false;
  }
}

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
      origin === targetOrigin || ALLOWED_ORIGINS.some((o) => originMatchesAllowedEntry(o, origin))
    );
  }
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      return (
        refOrigin === targetOrigin ||
        ALLOWED_ORIGINS.some((o) => originMatchesAllowedEntry(o, refOrigin))
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

  const { getAccessToken, getRefreshToken, isAccessTokenExpired } =
    await import('@/lib/auth/cookies');
  const { refreshSessionWithMutex } = await import('@/lib/auth/refreshSession.server');

  const apiBase = API_BASE_URL?.replace(/\/$/, '') ?? '';

  /** access 만료(또는 없음) 시에만 refresh — 실패 시 백엔드로 무인증 프록시하지 않음 */
  if (await isAccessTokenExpired()) {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return proxyAuthRequiredResponse();
    }
    const refreshed = await refreshSessionWithMutex();
    if (!refreshed.ok) {
      return proxyAuthRequiredResponse();
    }
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return proxyAuthRequiredResponse();
  }

  const base = apiBase;
  /** BFF `/api/proxy/...?a=1` → 백엔드 `.../...?a=1` (필터·페이지네이션 유지) */
  const search = new URL(request.url).search;
  const pathPart = path ? `${base}/${path}` : base;
  const url = `${pathPart}${search}`;

  const headers = new Headers(request.headers);
  headers.delete('cookie');
  /** 클라이언트의 Host는 백엔드 호스트와 다름 — undici가 `url` 기준으로 설정하도록 제거 */
  headers.delete('host');
  headers.set('Authorization', `Bearer ${accessToken}`);
  /**
   * 브라우저의 Accept-Encoding(gzip 등)을 그대로 넘기면 업스트림이 압축 응답을 보내고,
   * Node fetch → BFF 응답 전달 시 Content-Encoding과 바디가 어긋나 브라우저에서
   * ERR_CONTENT_DECODING_FAILED가 날 수 있음 — 백엔드 요청만 비압축으로 고정.
   */
  headers.set('Accept-Encoding', 'identity');
  /**
   * 스트림 바디 + `duplex: 'half'` 업스트림 fetch는 로컬에선 동작해도 Vercel 등 서버리스에서
   * undici/Request 조합으로 예외 → 500(빈 바디)이 나는 경우가 있음.
   * 바디를 버퍼로 읽어 넘기면 duplex 불필요·Content-Length 일치.
   */
  headers.delete('content-length');
  headers.delete('transfer-encoding');

  const method = request.method;
  let body: BodyInit | undefined;
  if (method !== 'GET' && method !== 'HEAD' && request.body) {
    const buf = await request.arrayBuffer();
    if (buf.byteLength > 0) {
      /** 원본 AB는 런타임에 detached 될 수 있음 — undici 업스트림 fetch가 slice 시 실패(Vercel). */
      body = Buffer.from(buf);
    }
  }

  return fetch(url, { method, headers, body });
}
