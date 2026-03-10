// src/store/authStore.ts
// Zustand store with persist middleware — survives app restarts, backgrounding, kills
// Token is kept in localStorage (web) and survives Capacitor WebView restarts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "farmer" | "investor";
  state: string;
  language?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;

  // Actions
  login: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
  setHydrated: () => void;
  updateToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      hydrated: false,

      login: (user, token, refreshToken) =>
        set({
          user,
          token,
          refreshToken: refreshToken ?? null,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      setHydrated: () => set({ hydrated: true }),

      updateToken: (token) => set({ token }),
    }),
    {
      name: "cropchain-auth",           // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields — hydrated is runtime-only
      partialize: (state) => ({
        user:            state.user,
        token:           state.token,
        refreshToken:    state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      // Called after rehydration from storage — set hydrated flag
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);