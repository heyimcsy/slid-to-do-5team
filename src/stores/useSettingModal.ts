import { create } from 'zustand';

interface UseSettingModal {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}
export const useSettingsModal = create<UseSettingModal>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
