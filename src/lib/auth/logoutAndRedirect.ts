import { buildLoginRedirectUrlAfterUnauthorized } from '@/lib/navigation/loginRedirectOnUnauthorized';
import { isPublicPath } from '@/lib/navigation/publicPaths';
import { authUserStore } from '@/stores/authUserStore';

import { isAuthRouteGuardEnabled } from '@/constants/auth-config';

/**
 * userStore 클리어 + 로그인 페이지 리다이렉트.
 *
 * - `isAuthRouteGuardEnabled()` false(개발/E2E)이면 아무 동작 안 함.
 * - `isPublicPath`이면(예: `/`, `/login`, `/signup`, `/com/...`) `clearUser()`만 하고 리다이렉트하지 않는다.
 *   비로그인 사용자가 머무를 수 있는 경로와 `proxy.ts` 공개 경로를 맞춘다.
 *
 * @note `useTokenRefreshOnMount` 401 처리, `apiClient.browser` `onUnauthorized` 양쪽에서 호출.
 */
export function logoutAndRedirect(): void {
  if (typeof window === 'undefined' || !isAuthRouteGuardEnabled()) return;
  authUserStore.getState().clearUser();
  if (isPublicPath(window.location.pathname)) return;
  window.location.href = buildLoginRedirectUrlAfterUnauthorized(window.location);
}
