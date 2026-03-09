"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/api/client";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { formatINR, formatNumber } from "@/utils/formatCurrency";
import { FileText, Plus, Loader2, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function MyProposalsPage() {
  const { user } = useAuthStore();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/investor/proposals")
      .then(r => setProposals(r.data))
      .catch(() => toast.error("Failed to load proposals"))
      .finally(() => setLoading(false));
  }, []);

  const statusColor: Record<string, string> = {
    draft: "badge-amber", open: "badge-green",
    funded: "badge-green", closed: "badge",
  };

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }} className="pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 page">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#ede9fe" }}>
              <FileText className="w-5 h-5" style={{ color: "#8b5cf6" }} />
            </div>
            <div>
              <h1 className="font-display text-2xl" style={{ color: "var(--text-1)", letterSpacing: "-0.02em" }}>
                My Proposals
              </h1>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>Investor pitch proposals</p>
            </div>
          </div>
          <Link href="/farmer/coach">
            <button className="btn btn-primary !py-2 !px-4 text-xs">
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "var(--green)" }} />
          </div>
        ) : proposals.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-3)" }} />
            <p className="font-medium text-sm mb-1" style={{ color: "var(--text-2)" }}>No proposals yet</p>
            <p className="text-xs mb-5" style={{ color: "var(--text-3)" }}>
              Use the AI Coach to generate your first investor pitch
            </p>
            <Link href="/farmer/coach">
              <button className="btn btn-primary">Generate Proposal</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>{p.title}</h3>
                  <span className={`badge ${statusColor[p.status] || "badge"} ml-2 flex-shrink-0 capitalize`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-xs mb-4 line-clamp-2" style={{ color: "var(--text-3)" }}>{p.description}</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Asking", value: formatINR(p.amount_requested) },
                    { label: "Yield", value: `${formatNumber(p.expected_yield)} qtl` },
                    { label: "ROI", value: `${p.roi_percent}%` },
                  ].map(s => (
                    <div key={s.label} className="rounded-lg p-2.5 text-center"
                      style={{ background: "var(--surface-2)" }}>
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-3)" }}>{s.label}</p>
                      <p className="font-semibold text-xs" style={{ color: "var(--text-1)" }}>{s.value}</p>
                    </div>
                  ))}
                </div>
                {p.generated_pitch && (
                  <div className="mt-3 rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
                    <p className="text-xs line-clamp-2" style={{ color: "var(--text-3)" }}>{p.generated_pitch}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
