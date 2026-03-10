"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { investorAPI } from "@/api/investor";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import ROICalculator from "@/components/ui/ROICalculator";
import ImpactCounter from "@/components/ui/ImpactCounter";
import PullIndicator from "@/components/ui/PullIndicator";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { formatINR } from "@/utils/formatCurrency";
import { TrendingUp, Users, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function InvestorHome() {
  const { user, isAuthenticated, hydrated } = useAuthStore();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [p, port] = await Promise.all([
        investorAPI.browseProposals(),
        investorAPI.getPortfolio().catch(() => []),
      ]);
      setProposals(p);
      setPortfolio(port || []);
    } catch { toast.error("Failed to load data"); }
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) { router.push("/login"); return; }
    if (isAuthenticated) {
      fetchData();
      const t = setInterval(fetchData, 5000);
      return () => clearInterval(t);
    }
  }, [hydrated, isAuthenticated, fetchData]);

  const { pulling, refreshing, pullY } = usePullToRefresh({ onRefresh: fetchData });

  if (!hydrated) return null;

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }} className="pb-20">
      <PullIndicator pullY={pullY} pulling={pulling} refreshing={refreshing} />
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 page">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-4 text-white" style={{ background: "var(--green)" }}>
          <h2 className="font-display font-bold text-xl mb-1">
            Welcome, {user?.name?.split(" ")[0]}
          </h2>
          <p className="text-xs opacity-80">Browse ML-verified farm investment opportunities</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Open Deals", value: proposals.length, icon: Users,     color: "#3b82f6"      },
            { label: "Avg ROI",    value: "18%",            icon: TrendingUp, color: "var(--green)" },
            { label: "Min Invest", value: "₹1K",            icon: DollarSign, color: "#f59e0b"      },
          ].map(s => (
            <div key={s.label} className="card p-3 text-center">
              <s.icon className="w-4 h-4 mx-auto mb-1" style={{ color: s.color }} />
              <p className="font-bold text-sm" style={{ color: "var(--text-1)" }}>{s.value}</p>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Impact counter — reads from real portfolio */}
        <ImpactCounter portfolio={portfolio} />

        {/* ROI Calculator */}
        <ROICalculator />

        {/* Proposals preview */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>Open Proposals</h3>
          <Link href="/investor/browse" className="flex items-center gap-1 text-xs"
            style={{ color: "var(--green)" }}>
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {proposals.length === 0 ? (
          <div className="card p-10 text-center">
            <Users className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-3)" }} />
            <p className="text-sm" style={{ color: "var(--text-3)" }}>No open proposals yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.slice(0, 3).map(p => (
              <div key={p.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{p.title}</h4>
                  <span className="badge badge-green">Open</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold" style={{ color: "var(--green)" }}>
                    {formatINR(p.amount_requested)}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>ROI: {p.roi_percent}%</p>
                  <Link href="/investor/browse">
                    <button className="btn btn-primary !py-1.5 !px-3 text-xs">View</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
