"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { LogOut, Leaf } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(0,255,136,0.1)] bg-[rgba(8,12,8,0.85)] backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] flex items-center justify-center group-hover:bg-[rgba(0,255,136,0.2)] transition-all">
            <Leaf className="w-4 h-4 text-[#00ff88]" />
          </div>
          <span className="font-display font-bold text-[#e8f5e8] text-lg tracking-tight">
            Crop<span className="text-[#00ff88]">Chain</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="font-mono text-xs text-[#5a7a5a] hidden sm:block tracking-wider">
                {user?.name?.toUpperCase()}
              </span>
              <button onClick={() => { logout(); router.push("/"); }}
                className="flex items-center gap-1.5 font-mono text-xs text-[#5a7a5a] hover:text-[#ff6b6b] transition-colors">
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:block">LOGOUT</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="btn-ghost text-xs px-4 py-2">Login</button>
              </Link>
              <Link href="/register">
                <button className="btn-glow text-xs px-4 py-2">Get Started</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
