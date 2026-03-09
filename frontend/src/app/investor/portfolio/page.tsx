"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { investorAPI } from "@/api/investor";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { formatINR } from "@/utils/formatCurrency";
import { TrendingUp, Wallet, Clock, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function PortfolioPage() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investorAPI.getPortfolio()
      .then(setInvestments)
      .catch(() => toast.error("Failed to load portfolio"))
      .finally(() => setLoading(false));
  }, []);

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const activeCount = investments.filter(i => i.status === "active").length;

  const pieData = investments.length > 0
    ? [
        { name: "Active", value: investments.filter(i => i.status === "active").length, color: "#16a34a" },
        { name: "Completed", value: investments.filter(i => i.status === "completed").length, color: "#3b82f6" },
        { name: "Pending", value: investments.filter(i => i.status === "pending").length, color: "#f59e0b" },
      ].filter(d => d.value > 0)
    : [];

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }} className="pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 page">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#dbeafe" }}>
            <TrendingUp className="w-5 h-5" style={{ color: "#3b82f6" }} />
          </div>
          <div>
            <h1 className="font-display text-2xl" style={{ color: "var(--text-1)", letterSpacing: "-0.02em" }}>
              My Portfolio
            </h1>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>Track your farm investments</p>
          </div>
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "var(--green)" }} />
          </div>
        ) : investments.length === 0 ? (
          <div className="card p-12 text-center">
            <Wallet className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-3)" }} />
            <p className="font-medium text-sm" style={{ color: "var(--text-2)" }}>No investments yet</p>
            <p className="text-xs mt-1 mb-4" style={{ color: "var(--text-3)" }}>
              Browse deals and make your first investment
            </p>
            <a href="/investor/browse">
              <button className="btn btn-primary">Browse Deals</button>
            </a>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Total Invested", value: formatINR(totalInvested), icon: Wallet, color: "#16a34a", bg: "#dcfce7" },
                { label: "Active", value: activeCount, icon: CheckCircle, color: "#3b82f6", bg: "#dbeafe" },
                { label: "Deals", value: investments.length, icon: TrendingUp, color: "#f59e0b", bg: "#fef3c7" },
              ].map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="card p-4 text-center">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                    style={{ background: s.bg }}>
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <p className="font-display font-semibold text-base" style={{ color: "var(--text-1)" }}>
                    {s.value}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Pie chart */}
            {pieData.length > 0 && (
              <div className="card p-5 mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-3)" }}>
                  Portfolio Breakdown
                </p>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55}
                        dataKey="value" strokeWidth={0}>
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        fontSize: 12,
                        fontFamily: "Plus Jakarta Sans",
                      }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {pieData.map(d => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                        <span className="text-xs" style={{ color: "var(--text-2)" }}>
                          {d.name}: <span className="font-semibold">{d.value}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Investment list */}
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-3)" }}>
              All Investments
            </p>
            <div className="space-y-3">
              {investments.map((inv, i) => (
                <motion.div key={inv.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {inv.status === "active"
                        ? <CheckCircle className="w-4 h-4" style={{ color: "#16a34a" }} />
                        : <Clock className="w-4 h-4" style={{ color: "#f59e0b" }} />
                      }
                      <p className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>
                        Proposal #{inv.proposal_id?.slice(-6)}
                      </p>
                    </div>
                    <span className={`badge ${inv.status === "active" ? "badge-green" : "badge-amber"}`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
                      <p className="text-xs mb-1" style={{ color: "var(--text-3)" }}>Amount Invested</p>
                      <p className="font-display font-semibold text-lg" style={{ color: "var(--text-1)" }}>
                        {formatINR(inv.amount)}
                      </p>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: "#dcfce7" }}>
                      <p className="text-xs mb-1" style={{ color: "#14532d" }}>Date</p>
                      <p className="font-semibold text-xs" style={{ color: "#166534" }}>
                        {new Date(inv.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
