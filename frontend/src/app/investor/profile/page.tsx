"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { User, Mail, MapPin, Globe, LogOut, ChevronRight, Briefcase } from "lucide-react";
import { LANGUAGES } from "@/utils/cropConstants";

export default function InvestorProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push("/"); };

  const langLabel = LANGUAGES.find(l => l.code === user?.language)?.label || "English";

  const items = [
    { icon: User, label: "Full Name", value: user?.name },
    { icon: Mail, label: "Email", value: user?.email },
    { icon: MapPin, label: "State", value: user?.state?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) },
    { icon: Globe, label: "Language", value: langLabel },
    { icon: Briefcase, label: "Role", value: "Investor" },
  ];

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }} className="pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 page">

        {/* Avatar card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-5 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#dbeafe" }}>
            <User className="w-8 h-8" style={{ color: "#3b82f6" }} />
          </div>
          <h2 className="font-display text-2xl mb-1" style={{ color: "var(--text-1)", letterSpacing: "-0.02em" }}>
            {user?.name}
          </h2>
          <p className="text-sm" style={{ color: "var(--text-3)" }}>{user?.email}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="badge badge-green">Investor</span>
            {user?.state && (
              <span className="badge" style={{ background: "var(--surface-2)", color: "var(--text-2)" }}>
                {user.state.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            )}
          </div>
        </motion.div>

        {/* Profile details */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }} className="card mb-4 overflow-hidden">
          {items.map((item, i) => (
            <div key={item.label}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--surface-2)]"
              style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--surface-2)" }}>
                <item.icon className="w-4 h-4" style={{ color: "var(--text-2)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs" style={{ color: "var(--text-3)" }}>{item.label}</p>
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-1)" }}>
                  {item.value || "—"}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-3)" }} />
            </div>
          ))}
        </motion.div>

        {/* Quick links */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }} className="card mb-4 overflow-hidden">
          {[
            { label: "Browse Deals", href: "/investor/browse", color: "#16a34a", bg: "#dcfce7", Icon: Briefcase },
            { label: "My Portfolio", href: "/investor/portfolio", color: "#3b82f6", bg: "#dbeafe", Icon: Briefcase },
          ].map((item, i) => (
            <a key={item.label} href={item.href}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--surface-2)]"
              style={{ borderBottom: i === 0 ? "1px solid var(--border)" : "none" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: item.bg }}>
                <item.Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <span className="flex-1 text-sm font-medium" style={{ color: "var(--text-1)" }}>{item.label}</span>
              <ChevronRight className="w-4 h-4" style={{ color: "var(--text-3)" }} />
            </a>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <button onClick={handleLogout}
            className="w-full card p-4 flex items-center justify-center gap-2 transition-colors hover:bg-red-50"
            style={{ color: "#dc2626" }}>
            <LogOut className="w-4 h-4" />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
