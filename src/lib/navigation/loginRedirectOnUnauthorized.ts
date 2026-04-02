export type LoginLocationSlice = Pick<Location, 'pathname' | 'search'>;

/**
 * 브라우저 API 클라이언트 401 시 이동할 로그인 URL.
 * - `/login`: 이미 로그인 화면이면 `callbackUrl=/login` 자기참조를 붙이지 않음. 쿼리는 유지.
 * - `/signup`: 인증 전용 화면 → 로그인으로 보내며 `callbackUrl=%2Fsignup` 중복을 붙이지 않음. 쿼리는 유지.
 * - 그 외: `callbackUrl`에 현재 경로·쿼리를 넣음.
 */
export function buildLoginRedirectUrlAfterUnauthorized(loc: LoginLocationSlice): string {
  const { pathname, search } = loc;
  if (pathname === '/login') {
    return `/login${search}`;
  }
  if (pathname === '/signup') {
    return `/login${search}`;
  }
  const returnTo = `${pathname}${search}`;
  return `/login?${new URLSearchParams({ callbackUrl: returnTo }).toString()}`;
}
