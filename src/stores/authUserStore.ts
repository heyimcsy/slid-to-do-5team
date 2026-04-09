import type { User } from '@/lib/auth/schemas/user';

import { applyOauthProviderToUser, fetchAuthSessionMeta } from '@/lib/auth/authSessionMeta';
import { userSchema } from '@/lib/auth/schemas/user';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthUserState = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const authUserStore = create<AuthUserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (next) => {
        if (next === null) {
          set({ user: null });
          return;
        }
        const r = userSchema.safeParse(next);
        if (!r.success) return;
        set({ user: r.data });
        if (typeof window !== 'undefined') {
          queueMicrotask(() => reconcileAuthSessionOAuthFromServer());
        }
      },
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-info',
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

/**
 * HttpOnly `oauth_provider`와 `User.oauthProvider`를 맞춤.
 * persist 리하이드레이션 직후·`setUser` 직후(내부 microtask)에서 호출.
 */
export function reconcileAuthSessionOAuthFromServer(): void {
  if (typeof window === 'undefined') return;
  void fetchAuthSessionMeta().then((meta) => {
    authUserStore.setState((s) => ({
      user: s.user ? applyOauthProviderToUser(s.user, meta.oauthProvider) : null,
    }));
  });
}
