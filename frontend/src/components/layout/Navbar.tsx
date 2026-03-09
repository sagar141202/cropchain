"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Sprout, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  return (
    <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
      className="sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "var(--green-light)" }}>
            <Sprout className="w-4 h-4" style={{ color: "var(--green)" }} />
          </div>
          <span className="font-display font-semibold text-lg" style={{ color: "var(--text-1)", letterSpacing: "-0.03em" }}>
            CropChain
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span className="text-sm hidden sm:block px-3 py-1.5 rounded-lg"
                style={{ color: "var(--text-2)", background: "var(--surface-2)" }}>
                {user?.name}
              </span>
              <button onClick={() => { logout(); router.push("/"); }}
                className="btn btn-secondary !py-1.5 !px-3">
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login"><button className="btn btn-secondary !py-1.5">Login</button></Link>
              <Link href="/register"><button className="btn btn-primary !py-1.5">Sign up</button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
