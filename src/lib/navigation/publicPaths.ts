/**
 * proxy.ts 와 클라이언트(`logoutAndRedirect` 등)가 동일한 공개 경로 정의를 공유한다.
 * `@/proxy`를 클라이언트에서 import하면 `cookies.ts` → `next/headers`가 번들에 끌려 들어간다.
 */

export const PUBLIC_PATHS = ['/', '/login', '/signup', '/com'] as const;

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** 로그인·회원가입 화면: 마운트 refresh 생략 — 401→`logoutAndRedirect` 시 동일 URL 리로드 루프 방지 */
export function isAuthFlowPagePathname(pathname: string): boolean {
  return pathname === '/login' || pathname === '/signup';
}
