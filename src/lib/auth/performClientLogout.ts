'use client';

import { apiClient } from '@/lib/apiClient';
import { clearOAuthClientState } from '@/lib/auth/clearOAuthClientState';
import { authUserStore } from '@/stores/authUserStore';

type LogoutRouter = {
  replace: (href: string) => void;
  refresh: () => void;
};

/**
 * BFF `POST /api/auth/logout`로 HttpOnly 쿠키 제거 후, 클라이언트 세션(Zustand·OAuth 잔여 상태) 정리.
 * 화면 라우트 없이 버튼·훅에서 직접 호출한다.
 *
 * @see `src/app/api/auth/logout/route.ts`
 */
export async function performClientLogout(router: LogoutRouter): Promise<void> {
  try {
    await apiClient<{ success?: boolean }>('/logout', {
      method: 'POST',
      clientPublicBase: '/api/auth',
      retry: false,
    });
  } catch {
    // BFF 실패해도 클라이언트 세션은 반드시 비움 (ApiClientError 시 unhandled rejection 방지)
  } finally {
    clearOAuthClientState('google');
    clearOAuthClientState('kakao');
    authUserStore.getState().clearUser();
    router.refresh();
    router.replace('/');
  }
}
