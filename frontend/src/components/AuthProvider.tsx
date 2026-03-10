"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initTheme } = useUIStore();

  useEffect(() => {
    // Restore theme
    initTheme?.();

    // Capacitor App resume listener — only runs inside the native APK, never on web
    const isNative =
      typeof window !== "undefined" &&
      (window as any)?.Capacitor?.isNativePlatform?.();

    if (!isNative) return;

    // Lazy-load Capacitor App plugin only on native
    import("@capacitor/app").then(({ App }) => {
      App.addListener("appStateChange", async ({ isActive }) => {
        if (!isActive) return;

        const { token, refreshToken, logout, updateToken } = useAuthStore.getState();
        if (!token) return;

        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const expiresIn = payload.exp * 1000 - Date.now();

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
              updateToken(data.access_token);
            } else {
              logout();
            }
          }
        } catch {
          logout();
        }
      });
    }).catch(() => {
      // Capacitor not available — silently ignore
    });
  }, []);

  return <>{children}</>;
}
