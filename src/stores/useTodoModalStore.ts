import { create } from 'zustand';

interface TodoModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useTodoModalStore = create<TodoModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
