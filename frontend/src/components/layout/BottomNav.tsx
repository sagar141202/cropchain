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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(0,255,136,0.1)] bg-[rgba(8,12,8,0.95)] backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                active ? "text-[#00ff88]" : "text-[#5a7a5a] hover:text-[#e8f5e8]"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "drop-shadow-[0_0_6px_rgba(0,255,136,0.8)]" : ""}`} />
              <span className={`text-[10px] font-mono tracking-wider uppercase ${active ? "text-[#00ff88]" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
