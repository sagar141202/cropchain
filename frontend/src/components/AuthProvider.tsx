"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore(s => s.hydrate);
  const initTheme = useUIStore(s => s.initTheme);
  useEffect(() => { hydrate(); initTheme(); }, []);
  return <>{children}</>;
}
