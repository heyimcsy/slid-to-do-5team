/** zustand persist 등 — `authUserStore`가 `store.ts`보다 먼저 로드될 수 있으므로 키만 별도 모듈로 둔다. */
export const LOCAL_STORAGE_KEYS = {
  USER_INFO: 'user-info',
} as const;
