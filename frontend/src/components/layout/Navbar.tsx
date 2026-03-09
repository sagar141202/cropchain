"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Leaf } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "var(--glass)", backdropFilter: "blur(20px) saturate(1.4)",
      WebkitBackdropFilter: "blur(20px) saturate(1.4)",
      borderBottom: "1px solid var(--glass-border)",
    }}>
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#22c55e,#15803d)" }}>
            <Leaf className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text-1)" }}>
            Crop<span style={{ color: "var(--green-dark)" }}>Chain</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!isAuthenticated && (
            <Link href="/login">
              <button className="btn btn-green !py-1.5 !px-4 text-xs">Sign In</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
