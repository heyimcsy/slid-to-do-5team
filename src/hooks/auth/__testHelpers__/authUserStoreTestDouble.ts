import type { User } from '@/lib/auth/schemas/user';

/** `jest.mock('@/stores/authUserStore')`에서만 사용 — 테스트마다 beforeEach로 덮어쓴다 */
export const authUserStoreTestConfig: {
  user: User | null;
  hasHydrated: boolean;
} = {
  user: {
    id: '1',
    email: 'a@b.com',
    name: 'Test',
    image: null,
  },
  hasHydrated: true,
};

export function createAuthUserStoreMock() {
  return {
    authUserStore: {
      getState: () => ({
        user: authUserStoreTestConfig.user,
        setUser: jest.fn(),
        clearUser: jest.fn(),
      }),
      subscribe: jest.fn(() => jest.fn()),
      persist: {
        hasHydrated: () => authUserStoreTestConfig.hasHydrated,
        onFinishHydration: (fn: (state: { user: User | null }) => void) => {
          if (authUserStoreTestConfig.hasHydrated) {
            return jest.fn();
          }
          queueMicrotask(() => {
            fn({
              user: authUserStoreTestConfig.user,
              setUser: jest.fn(),
              clearUser: jest.fn(),
            } as never);
          });
          return jest.fn();
        },
      },
    },
  };
}
