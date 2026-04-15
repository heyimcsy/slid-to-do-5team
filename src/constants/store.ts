import type { PersistStore } from '@/providers/PersistRehydrationProvider';

import { authUserStore } from '@/stores/authUserStore';

export { LOCAL_STORAGE_KEYS } from './localStorageKeys';

/**
 * @description 사용할 Persist store를 여기에 추가해야 함(기본은 빈 배열)
 */
export const PERSIST_STORES: PersistStore[] = [authUserStore as unknown as PersistStore];
