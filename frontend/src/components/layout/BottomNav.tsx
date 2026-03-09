"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Home, TrendingUp, ShieldCheck, MessageSquare, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const tabs = user?.role === "investor"
    ? [
        { href: "/investor", icon: Home, label: "Home" },
        { href: "/investor/browse", icon: TrendingUp, label: "Browse" },
        { href: "/investor/portfolio", icon: ShieldCheck, label: "Portfolio" },
        { href: "/investor/profile", icon: User, label: "Profile" },
      ]
    : [
        { href: "/farmer", icon: Home, label: "Home" },
        { href: "/farmer/yield-predictor", icon: TrendingUp, label: "Predict" },
        { href: "/farmer/fair-price", icon: ShieldCheck, label: "Prices" },
        { href: "/farmer/coach", icon: MessageSquare, label: "Coach" },
        { href: "/farmer/profile", icon: User, label: "Profile" },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
              style={{ color: active ? "var(--green)" : "var(--text-3)" }}>
              <div className={`p-1.5 rounded-lg transition-all ${active ? "bg-green-light" : ""}`}
                style={{ background: active ? "var(--green-light)" : "transparent" }}>
                <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              </div>
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
