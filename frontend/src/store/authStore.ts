import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: "farmer" | "investor";
  language: string;
  phone?: string;
  state?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  hydrated: false,

  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const token = localStorage.getItem("accessToken");
      const refresh = localStorage.getItem("refreshToken");
      const userRaw = localStorage.getItem("user");
      if (token && userRaw) {
        const user = JSON.parse(userRaw);
        set({ user, accessToken: token, refreshToken: refresh, isAuthenticated: true, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },

  setAuth: (user, accessToken, refreshToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user, accessToken, refreshToken, isAuthenticated: true, hydrated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));
