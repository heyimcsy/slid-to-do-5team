import type { User } from '@/lib/auth/schemas/user';

import { userSchema } from '@/lib/auth/schemas/user';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthUserState = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

/** 프로필 없음을 `undefined`가 아닌 명시적 `null`로 두어 JSON/localStorage에 `image` 키가 남게 한다. */
function withExplicitNullableImage(user: User): User {
  return { ...user, image: user.image ?? null };
}

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
        if (r.success) set({ user: withExplicitNullableImage(r.data) });
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
