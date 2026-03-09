"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { investorAPI } from "@/api/investor";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { formatINR } from "@/utils/formatCurrency";
import { X, TrendingUp, IndianRupee, Percent, FileText, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

function stripMarkdown(t: string) {
  return t.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s*/g, "").replace(/__(.*?)__/g, "$1").replace(/`(.*?)`/g, "$1").trim();
}

export default function InvestorBrowse() {
  const { isAuthenticated, hydrated } = useAuthStore();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [investing, setInvesting] = useState(false);

  const fetchProposals = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await investorAPI.browseProposals();
      setProposals(data);
      setLastUpdated(new Date());
    } catch {
      if (!silent) toast.error("Failed to load proposals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) { router.push("/login"); return; }
    if (!isAuthenticated) return;

    // Initial fetch
    fetchProposals();

    // Poll every 3 seconds for real-time updates
    const interval = setInterval(() => fetchProposals(true), 3000);
    return () => clearInterval(interval);
  }, [hydrated, isAuthenticated, fetchProposals]);

  const invest = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      return toast.error("Enter a valid amount");
    setInvesting(true);
    try {
      await investorAPI.invest(selected.id, Number(amount));
      toast.success("Investment submitted! 🎉");
      setSelected(null);
      setAmount("");
      fetchProposals(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Investment failed");
    } finally { setInvesting(false); }
  };

  if (!hydrated) return null;

  return (
    <div className="min-h-screen pb-24 page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="flex items-center justify-between mb-1">
          <h1 className="display text-2xl font-bold" style={{ color: "var(--text-1)" }}>Browse Proposals</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs" style={{ color: "var(--text-3)" }}>Live</span>
          </div>
        </div>
        <p className="text-xs mb-6" style={{ color: "var(--text-3)" }}>
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Loading…"}
        </p>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                <div className="h-4 rounded-lg mb-3" style={{ background: "var(--glass2)", width: "60%" }} />
                <div className="h-3 rounded-lg mb-4" style={{ background: "var(--glass2)", width: "40%" }} />
                <div className="h-8 rounded-xl" style={{ background: "var(--glass2)" }} />
              </div>
            ))}
          </div>
        ) : proposals.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-3)" }} />
            <p className="font-medium mb-1" style={{ color: "var(--text-2)" }}>No open proposals yet</p>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>Farmers will publish soon — this page auto-refreshes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => { setSelected(p); setAmount(""); }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 pr-3">
                    <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-1)" }}>{p.title}</h3>
                    <p className="text-xs line-clamp-2" style={{ color: "var(--text-3)" }}>
                      {stripMarkdown(p.generated_pitch || p.description || "").slice(0, 120)}…
                    </p>
                  </div>
                  <span className="badge badge-green flex-shrink-0">Open</span>
                </div>
                <div className="divider" />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" style={{ color: "var(--green-dark)" }} />
                    <span className="text-xs font-bold" style={{ color: "var(--green-dark)" }}>
                      {formatINR(p.amount_requested)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Percent className="w-3 h-3" style={{ color: "var(--text-3)" }} />
                    <span className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>{p.roi_percent}% ROI</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <TrendingUp className="w-3 h-3" style={{ color: "var(--text-3)" }} />
                    <span className="text-xs" style={{ color: "var(--text-3)" }}>{p.area_acres} acres</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Invest Modal */}
      <AnimatePresence>
        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <motion.div className="modal-sheet glass"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="display text-xl font-bold pr-4" style={{ color: "var(--text-1)" }}>
                    {selected.title}
                  </h2>
                  <button onClick={() => setSelected(null)}
                    className="btn-ghost w-8 h-8 !p-0 rounded-xl flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="badge badge-green">{formatINR(selected.amount_requested)} asking</span>
                  <span className="badge badge-blue">{selected.roi_percent}% ROI</span>
                  <span className="badge badge-amber">{selected.area_acres} acres</span>
                </div>

                {/* Farmer info */}
                {selected.farmer_name && (
                  <div className="rounded-xl px-3 py-2 mb-4 flex items-center gap-2"
                    style={{ background: "var(--glass2)", border: "1px solid var(--glass-border)" }}>
                    <span className="text-xs" style={{ color: "var(--text-3)" }}>Farmer:</span>
                    <span className="text-xs font-semibold" style={{ color: "var(--text-1)" }}>{selected.farmer_name}</span>
                    {selected.farmer_state && (
                      <span className="text-xs" style={{ color: "var(--text-3)" }}>· {selected.farmer_state}</span>
                    )}
                  </div>
                )}

                {/* Pitch content */}
                <div className="rounded-2xl p-4 mb-4 text-sm leading-relaxed"
                  style={{
                    background: "var(--glass2)", border: "1px solid var(--glass-border)",
                    color: "var(--text-2)", maxHeight: 220, overflowY: "auto"
                  }}>
                  {stripMarkdown(selected.generated_pitch || selected.description || "No pitch provided.")}
                </div>

                {/* Invest input */}
                <div className="field">
                  <label className="field-label">Your Investment Amount (₹)</label>
                  <input type="number" placeholder="e.g. 25000" value={amount}
                    onChange={e => setAmount(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && invest()} />
                </div>

                <button className="btn btn-green w-full" onClick={invest} disabled={investing || !amount}>
                  {investing ? "Processing…" : `Invest ${amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "Now"}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
