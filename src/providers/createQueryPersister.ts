import type { QueryPersistStorageType } from '@/constants/query';
import type { PersistStore } from '@/providers/PersistRehydrationProvider';
import type { Persister } from '@tanstack/react-query-persist-client';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import { QUERY_CACHE_KEY } from '@/constants/query';
import { PERSIST_STORES } from '@/constants/store';

/**
 * 클라이언트에서 마운트된 `PersistQueryClientProvider`의 persister 단일 참조.
 * 로그아웃 시 `persistQueryClientSave`가 구독/스로틀과 **같은** `persistClient`를 타도록 한다.
 */
let registeredQueryPersister: Persister | null = null;

/** `AppProviders` 마운트 시 호출, 언마운트 시 null로 해제 */
export function registerQueryPersister(persister: Persister | null): void {
  registeredQueryPersister = persister;
}

/** `performClientLogout` 등에서 `persistQueryClientSave`에 넘길 인스턴스 조회(미등록이면 null) */
export function getRegisteredQueryPersister(): Persister | null {
  return registeredQueryPersister;
}

/**
 * `PERSIST_STORES` 항목의 localStorage 키 이름(`persist.getOptions().name`)을 얻는다.
 * `PersistStore['persist']`는 `Pick`으로 좁혀져 TS에서 `getOptions`가 `never`가 되는 경우가 있어 unknown 경유.
 */
const getZustandPersistStorageName = (store: PersistStore): string | undefined => {
  const persist = store.persist as unknown as { getOptions?: () => { name?: string } } | undefined;
  const getOptions = persist?.getOptions;
  if (typeof getOptions !== 'function') return undefined;
  return getOptions().name;
};

/**
 * @description SSR 환경에서는 persister 동작 안함. 동일 Provider 트리로 hydration mismatch 방지.
 * @note Node.js에서는 window 객체가 없으므로 호출은 하지만 아무 동작 안함
 * @returns Persister (서버: no-op, 클라이언트: localStorage | sessionStorage)
 */
const noopPersister: Persister = {
  persistClient: () => Promise.resolve(),
  restoreClient: () => Promise.resolve(undefined),
  removeClient: () => Promise.resolve(),
};

/**
 * @description QueryClient persist용 persister 생성.
 * SSR 환경에서는 no-op persister 반환 (동일 컴포넌트 트리로 hydration 안정화).
 * @param storageType - localStorage: 탭 간 유지. sessionStorage: 탭 닫을 때 삭제.
 * @returns Persister (서버: no-op, 클라이언트: 지정 storage)
 */
export function createQueryPersister(
  storageType: QueryPersistStorageType = 'localStorage',
): Persister {
  if (typeof window === 'undefined') return noopPersister;
  const storage = storageType === 'sessionStorage' ? window.sessionStorage : window.localStorage;
  return createAsyncStoragePersister({
    storage,
    key: QUERY_CACHE_KEY,
    /**
     * 라이브러리 기본 1000ms 스로틀은 로그아웃 시 `await persistQueryClientSave` 대기를 길게 하고
     * `removeItem`과의 레이스 창을 넓힌다. 캐시 쓰기 빈도와의 절충으로 200ms.
     */
    throttleTime: 200,
  });
}

/**
 * @description 로그아웃·세션 만료 시 TanStack Query·Zustand persist 저장소 키 삭제.
 * - `QUERY_CACHE_KEY` 및 `PERSIST_STORES`에 등록된 키(`user-info` 등)를 localStorage/sessionStorage에서 제거.
 *
 * **Zustand:** `clearUser()`/`setUser` 직후 persist가 다시 `setItem`하므로, 키를 완전히 없애려면
 * 스토어 작업 **이후**에 호출한다 (`performClientLogout` 참고).
 *
 * @example
 * import { clearQueryPersistStorage } from '@/providers';
 * async function handleLogout() {
 *   signOut();
 *   authUserStore.getState().clearUser();
 *   clearQueryPersistStorage();
 *   router.push('/login');
 * }
 */
export function clearQueryPersistStorage(): void {
  // Node.js 환경에서는 호출 안함
  if (typeof window === 'undefined') return;
  // Tanstack Query 키 삭제
  window.localStorage.removeItem(QUERY_CACHE_KEY);
  window.sessionStorage.removeItem(QUERY_CACHE_KEY);
  // Zustand persist 저장소 키(name) 삭제 — 호출 시점에 스토어가 다시 persist 하지 않도록 주의
  PERSIST_STORES.forEach((store) => {
    const name = getZustandPersistStorageName(store);
    if (name) {
      window.localStorage.removeItem(name);
      window.sessionStorage.removeItem(name);
    }
  });
}
