import { create } from 'zustand';

interface UIState {
  isCartOpen: boolean;
  isAuthModalOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isAuthModalOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
