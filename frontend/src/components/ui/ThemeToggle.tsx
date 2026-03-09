"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button onClick={toggle}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      aria-label="Toggle theme">
      {dark
        ? <Sun className="w-4 h-4" style={{ color: "var(--amber)" }} />
        : <Moon className="w-4 h-4" style={{ color: "var(--text-2)" }} />
      }
    </button>
  );
}
