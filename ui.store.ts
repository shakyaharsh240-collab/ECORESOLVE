/**
 * EcoResolve — UI State Zustand Store
 */

import { create } from 'zustand';

interface UIState {
  isAIAssistantOpen: boolean;
  activeToast: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  isOnline: boolean;

  // Actions
  openAIAssistant: () => void;
  closeAIAssistant: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
  setOnline: (online: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAIAssistantOpen: false,
  activeToast: null,
  isOnline: true,

  openAIAssistant: () => set({ isAIAssistantOpen: true }),
  closeAIAssistant: () => set({ isAIAssistantOpen: false }),

  showToast: (message, type = 'info') =>
    set({ activeToast: { message, type } }),

  hideToast: () => set({ activeToast: null }),

  setOnline: (isOnline) => set({ isOnline }),
}));
