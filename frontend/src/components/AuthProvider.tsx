// src/components/AuthProvider.tsx
// Single provider mounted in root layout.
// Handles:
//   1. Zustand store rehydration (already done by persist middleware)
//   2. Capacitor App plugin — re-validate token on resume from background
//   3. Theme rehydration from localStorage
//   4. No flicker — renders children immediately; pages gate on `hydrated`

"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

// Dynamic import so Capacitor plugin doesn't break SSR / web builds
async function getCapacitorApp() {
  try {
    const { App } = await import("@capacitor/app");
    return App;
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token, logout } = useAuthStore();
  const { initTheme } = useUIStore();

  useEffect(() => {
    // 1. Restore theme (dark/light) from localStorage
    initTheme?.();

    // 2. Capacitor App resume listener — recheck token validity
    //    This fires every time the user switches back to the app from background
    getCapacitorApp().then((App) => {
      if (!App) return; // Running in browser, not native

      App.addListener("appStateChange", async ({ isActive }) => {
        if (!isActive) return; // App going to background — nothing to do

        const { token, refreshToken, logout } = useAuthStore.getState();
        if (!token) return;

        // Quick sanity check — decode JWT exp without a library
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const expiresIn = payload.exp * 1000 - Date.now();

          // If token expires within 5 minutes, try silent refresh
          if (expiresIn < 5 * 60 * 1000) {
            if (!refreshToken) { logout(); return; }
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/refresh`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token: refreshToken }),
              }
            );
            if (res.ok) {
              const data = await res.json();
              useAuthStore.getState().updateToken(data.access_token);
            } else {
              logout();
            }
          }
        } catch {
          // Malformed token — logout cleanly
          logout();
        }
      });
    });
  }, []);

  return <>{children}</>;
}