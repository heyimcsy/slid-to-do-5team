import type { QueryPersistStorageType } from '@/constants/query';
import type { Persister } from '@tanstack/react-query-persist-client';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import { QUERY_CACHE_KEY } from '@/constants/query';
import { PERSIST_STORES } from '@/constants/store';

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
  });
}

/**
 * @description 로그아웃·세션 만료 시 모든 persist 저장소 삭제.
 * - Tanstack Query 캐시(QUERY_CACHE_KEY) 삭제
 * - PERSIST_STORES에 등록된 Zustand persist 저장소 삭제
 * JWT(HttpOnly) 환경에서 로그아웃 시 반드시 호출하여 사용자 데이터를 제거.
 *
 * @example
 * // 로그아웃 핸들러에서 호출
 * import { clearQueryPersistStorage } from '@/providers';
 * async function handleLogout() {
 *   clearQueryPersistStorage();
 *   await signOut(); // auth 라이브러리 로그아웃
 *   router.push('/login');
 * }
 */
export function clearQueryPersistStorage(): void {
  // Node.js 환경에서는 호출 안함
  if (typeof window === 'undefined') return;
  // Tanstack Query 키 삭제
  window.localStorage.removeItem(QUERY_CACHE_KEY);
  window.sessionStorage.removeItem(QUERY_CACHE_KEY);
  // Zustand persist 저장소 키(name) 삭제
  PERSIST_STORES.forEach((store) => {
    const name = store.persist?.getOptions().name;
    if (name) {
      window.localStorage.removeItem(name);
      window.sessionStorage.removeItem(name);
    }
  });
}
