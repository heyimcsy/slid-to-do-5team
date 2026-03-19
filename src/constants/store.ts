import type { PersistStore } from '@/providers/PersistRehydrationProvider';

import { testStore } from '@/stores/testStore';

/**
 * @description 사용할 Persist store를 여기에 추가해야 함(기본은 빈 배열)
 */
export const PERSIST_STORES: PersistStore[] = [testStore];
