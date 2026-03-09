"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { investorAPI } from "@/api/investor";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { TrendingUp, DollarSign, Users, ArrowRight, Briefcase } from "lucide-react";
import { formatINR } from "@/utils/formatCurrency";
import Link from "next/link";
import toast from "react-hot-toast";

export default function InvestorHome() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    investorAPI.browseProposals()
      .then(setProposals)
      .catch(() => toast.error("Failed to load proposals"))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const stats = [
    { label: "Open Deals", value: proposals.length, icon: Briefcase, color: "#16a34a", bg: "#dcfce7" },
    { label: "Avg ROI", value: "18%", icon: TrendingUp, color: "#3b82f6", bg: "#dbeafe" },
    { label: "Min Invest", value: "₹10K", icon: DollarSign, color: "#f59e0b", bg: "#fef3c7" },
  ];

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }} className="pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 page">

        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 mb-5 flex items-center justify-between"
          style={{ background: "#1d4ed8", boxShadow: "0 8px 32px rgba(29,78,216,0.2)" }}>
          <div>
            <p className="text-blue-200 text-xs font-medium mb-0.5">Investor Dashboard</p>
            <h2 className="font-display text-2xl text-white" style={{ letterSpacing: "-0.02em" }}>
              Hello, {user?.name?.split(" ")[0]} 👋
            </h2>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-xs">Role</p>
            <p className="text-white font-semibold capitalize">{user?.role}</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card p-4 text-center">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                style={{ background: s.bg }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <p className="font-display text-xl font-semibold" style={{ color: "var(--text-1)" }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { href: "/investor/browse", icon: Briefcase, title: "Browse Deals", desc: "ML-verified proposals", color: "#16a34a", bg: "#dcfce7" },
            { href: "/investor/portfolio", icon: TrendingUp, title: "My Portfolio", desc: "Track investments", color: "#3b82f6", bg: "#dbeafe" },
          ].map((a, i) => (
            <motion.div key={a.href}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }} whileHover={{ y: -2 }}>
              <Link href={a.href}>
                <div className="card p-5 hover:shadow-card-hover transition-all duration-200 cursor-pointer">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: a.bg }}>
                    <a.icon style={{ width: 18, height: 18, color: a.color }} />
                  </div>
                  <h4 className="font-semibold text-sm mb-0.5" style={{ color: "var(--text-1)" }}>{a.title}</h4>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>{a.desc}</p>
                  <ArrowRight className="w-3.5 h-3.5 mt-3" style={{ color: "var(--text-3)" }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent proposals preview */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
            Latest Proposals
          </p>
          <Link href="/investor/browse"
            className="text-xs font-semibold flex items-center gap-1 hover:underline"
            style={{ color: "var(--green)" }}>
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="card p-8 text-center">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : proposals.length === 0 ? (
          <div className="card p-10 text-center">
            <Briefcase className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-3)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text-2)" }}>No open proposals yet</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>Check back soon</p>
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.slice(0, 3).map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="card p-5 hover:shadow-card-hover transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{p.title}</h4>
                  <span className="badge badge-green ml-2 flex-shrink-0">{p.status}</span>
                </div>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--text-3)" }}>{p.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>Asking</p>
                    <p className="font-display font-semibold text-base" style={{ color: "var(--text-1)" }}>
                      {formatINR(p.amount_requested)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>ROI</p>
                    <p className="font-display font-semibold text-base" style={{ color: "var(--green)" }}>
                      {p.roi_percent}%
                    </p>
                  </div>
                  <Link href={`/investor/browse`}>
                    <button className="btn btn-primary !py-1.5 !px-4 text-xs">View →</button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
