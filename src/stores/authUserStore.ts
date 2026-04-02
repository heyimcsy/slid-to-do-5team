import type { User } from '@/lib/auth/schemas/user';

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
        if (r.success) set({ user: r.data });
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
