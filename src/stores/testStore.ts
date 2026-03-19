import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const testStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((s: { count: number }) => ({ count: s.count + 1 })),
    }),
    { name: 'test-store', skipHydration: true },
  ),
);
