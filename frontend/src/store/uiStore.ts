import { create } from "zustand";

interface UIState {
  isDarkMode: boolean;
  isLoading: boolean;
  activeTab: string;
  toggleDarkMode: () => void;
  setLoading: (loading: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  isLoading: false,
  activeTab: "home",

  toggleDarkMode: () =>
    set((state) => {
      const newMode = !state.isDarkMode;
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", newMode);
      }
      return { isDarkMode: newMode };
    }),

  setLoading: (loading) => set({ isLoading: loading }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
