"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Home, TrendingUp, ShieldCheck, MessageSquare, Users, BarChart2, Briefcase, User } from "lucide-react";

const farmerTabs = [
  { href: "/farmer",           icon: Home,          label: "Home"     },
  { href: "/farmer/yield-predictor", icon: TrendingUp,  label: "Yield"    },
  { href: "/farmer/fair-price",icon: ShieldCheck,   label: "Price"    },
  { href: "/farmer/coach",     icon: MessageSquare, label: "Coach"    },
  { href: "/farmer/profile",   icon: User,          label: "Profile"  },
];
const investorTabs = [
  { href: "/investor",         icon: Home,          label: "Home"     },
  { href: "/investor/browse",  icon: BarChart2,     label: "Browse"   },
  { href: "/investor/portfolio",icon: Briefcase,    label: "Portfolio"},
  { href: "/investor/profile", icon: User,          label: "Profile"  },
];

export default function BottomNav() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const tabs = user?.role === "investor" ? investorTabs : farmerTabs;
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "var(--glass)", backdropFilter: "blur(20px) saturate(1.4)",
      WebkitBackdropFilter: "blur(20px) saturate(1.4)",
      borderTop: "1px solid var(--glass-border)",
    }}>
      <div className="max-w-2xl mx-auto px-2 flex items-center justify-around h-16">
        {tabs.map(t => {
          const active = pathname === t.href || (t.href !== "/farmer" && t.href !== "/investor" && pathname.startsWith(t.href));
          return (
            <Link key={t.href} href={t.href}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all"
              style={{
                color: active ? "var(--green-dark)" : "var(--text-3)",
                background: active ? "var(--green-pale)" : "transparent",
              }}>
              <t.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em" }}>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
