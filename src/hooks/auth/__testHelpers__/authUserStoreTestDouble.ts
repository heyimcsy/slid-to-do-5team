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
  const setUser = jest.fn();
  const clearUser = jest.fn();

  type MockAuthUserState = {
    user: User | null;
    setUser: typeof setUser;
    clearUser: typeof clearUser;
  };
  return {
    authUserStore: {
      getState: (): MockAuthUserState => ({
        user: authUserStoreTestConfig.user,
        setUser,
        clearUser,
      }),
      subscribe: jest.fn(() => jest.fn()),
      persist: {
        hasHydrated: () => authUserStoreTestConfig.hasHydrated,
        onFinishHydration: (fn: (state: MockAuthUserState) => void) => {
          if (authUserStoreTestConfig.hasHydrated) {
            return jest.fn();
          }
          queueMicrotask(() => {
            fn({ user: authUserStoreTestConfig.user, setUser, clearUser });
          });
          return jest.fn();
        },
      },
    },
  };
}
