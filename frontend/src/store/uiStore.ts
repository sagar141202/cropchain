import { create } from "zustand";
interface UIState {
  isDarkMode: boolean;
  toggleDark: () => void;
  initTheme: () => void;
}
export const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  initTheme: () => {
    if (typeof window === "undefined") return;
    const dark = localStorage.getItem("theme") === "dark";
    document.documentElement.classList.toggle("dark", dark);
    set({ isDarkMode: dark });
  },
  toggleDark: () => set((s) => {
    const next = !s.isDarkMode;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    return { isDarkMode: next };
  }),
}));
