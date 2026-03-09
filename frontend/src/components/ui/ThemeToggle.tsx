"use client";
import { Sun, Moon } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
export default function ThemeToggle() {
  const { isDarkMode, toggleDark } = useUIStore();
  return (
    <button onClick={toggleDark}
      className="btn-ghost w-9 h-9 !p-0 rounded-xl flex items-center justify-center"
      style={{ color: "var(--text-2)" }}>
      {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
