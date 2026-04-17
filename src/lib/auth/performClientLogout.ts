'use client';

import type { QueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/apiClient';
import { clearOAuthClientState } from '@/lib/auth/clearOAuthClientState';
import {
  clearQueryPersistStorage,
  getRegisteredQueryPersister,
} from '@/providers/createQueryPersister';
import { authUserStore } from '@/stores/authUserStore';
import { persistQueryClientSave } from '@tanstack/query-persist-client-core';

type LogoutRouter = {
  replace: (href: string) => void;
  refresh: () => void;
};

/**
 * BFF `POST /api/auth/logout`로 HttpOnly 쿠키 제거 후, 클라이언트 세션(Zustand·OAuth 잔여 상태) 정리.
 * 화면 라우트 없이 버튼·훅에서 직접 호출한다.
 *
 * **TanStack Query persist:** `removeItem`만 하면 비동기·스로틀된 `persistClient`가 나중에 옛 스냅샷을 다시 쓸 수 있다.
 * `AppProviders`에 등록된 persister로 `persistQueryClientSave`를 한 번 `await`해 빈 캐시를 플러시한 뒤 저장소를 비운다.
 *
 * **Zustand:** `clearUser()`가 persist로 `user-info` 등에 `{ user: null }`을 다시 쓰므로, 키를 통째로 지우려면
 * `clearQueryPersistStorage()`는 `clearUser()` **이후**에 호출해야 한다.
 *
 * @see `src/app/api/auth/logout/route.ts`
 * @param queryClient - 있으면 메모리 RQ `clear` + 위 persist 플러시에 사용
 */
export async function performClientLogout(
  router: LogoutRouter,
  queryClient?: QueryClient,
): Promise<void> {
  try {
    await apiClient<{ success?: boolean }>('/logout', {
      method: 'POST',
      clientPublicBase: '/api/auth',
      retry: false,
    });
  } catch {
    // BFF 실패해도 클라이언트 세션은 반드시 비움 (ApiClientError 시 unhandled rejection 방지)
  }

  // 메모리 캐시 비움 → 이후 save는 빈 dehydrate 상태(스로틀된 이전 write와의 레이스 완화)
  queryClient?.clear();
  const persister = getRegisteredQueryPersister();
  if (queryClient && persister) {
    try {
      // Provider와 동일 persister로 한 번 저장까지 기다린 뒤 아래에서 removeItem
      await persistQueryClientSave({
        queryClient,
        persister,
        buster: process.env.NEXT_PUBLIC_APP_VERSION ?? '',
      });
    } catch {
      // persist 실패해도 저장소 제거·세션 정리는 진행
    }
  }
  clearOAuthClientState('google');
  clearOAuthClientState('kakao');
  authUserStore.getState().clearUser();
  // RQ·Zustand persist 키 제거(clearUser 이후 호출 — 그렇지 않으면 null 스냅샷만 남음)
  clearQueryPersistStorage();
  router.refresh();
  router.replace('/');
}
