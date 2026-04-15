/** TanStack Query staleTime (데이터가 fresh로 간주되는 시간) */
export const QUERY_STALE_TIME = 60 * 1000; // 60초

/** persistQueryClient maxAge / QueryClient gcTime (캐시 유지 시간) */
export const QUERY_MAX_AGE = 1000 * 60 * 60 * 24; // 24시간

/** Tanstack QueryClient 캐시 키(다른 캐시 키와 중복되지 않도록 고유값 사용) */
export const QUERY_CACHE_KEY = 'SLID_TODO_QUERY_CACHE';

/** persist 저장소 타입. sessionStorage: 탭 닫을 때 삭제, localStorage: 탭 간 유지 */
export type QueryPersistStorageType = 'localStorage' | 'sessionStorage';

/** 할 일 검색 지연 시간 */
export const SEARCH_DEBOUNCE_MS = 200;
