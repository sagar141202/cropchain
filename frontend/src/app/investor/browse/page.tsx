"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { investorAPI } from "@/api/investor";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { formatINR, formatNumber } from "@/utils/formatCurrency";
import { Briefcase, TrendingUp, Wheat, MapPin, Loader2, X, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function BrowseDealsPage() {
  const { isAuthenticated } = useAuthStore();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [investing, setInvesting] = useState(false);
  const [amount, setAmount] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    investorAPI.browseProposals()
      .then(setProposals)
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const handleInvest = async () => {
    if (!selected || !amount) { toast.error("Enter investment amount"); return; }
    setInvesting(true);
    try {
      await investorAPI.invest(selected.id, parseFloat(amount));
      toast.success("Investment successful!");
      setSelected(null);
      setAmount("");
      const updated = await investorAPI.browseProposals();
      setProposals(updated);
    } catch { toast.error("Investment failed"); }
    finally { setInvesting(false); }
  };

  const roiColor = (roi: number) =>
    roi >= 20 ? "#16a34a" : roi >= 15 ? "#3b82f6" : "#f59e0b";

  const roiBg = (roi: number) =>
    roi >= 20 ? "#dcfce7" : roi >= 15 ? "#dbeafe" : "#fef3c7";

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }} className="pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 page">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#dcfce7" }}>
            <Briefcase className="w-5 h-5" style={{ color: "#16a34a" }} />
          </div>
          <div>
            <h1 className="font-display text-2xl" style={{ color: "var(--text-1)", letterSpacing: "-0.02em" }}>
              Browse Deals
            </h1>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>ML-verified farm investment proposals</p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {["all", "high roi", "wheat", "rice", "cotton"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-all"
              style={{
                background: filter === f ? "var(--green)" : "var(--surface)",
                color: filter === f ? "white" : "var(--text-2)",
                border: `1px solid ${filter === f ? "var(--green)" : "var(--border)"}`,
              }}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "var(--green)" }} />
            <p className="text-sm mt-3" style={{ color: "var(--text-3)" }}>Loading proposals...</p>
          </div>
        ) : proposals.length === 0 ? (
          <div className="card p-12 text-center">
            <Briefcase className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-3)" }} />
            <p className="font-medium text-sm" style={{ color: "var(--text-2)" }}>No open proposals yet</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>Farmers will publish proposals soon</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card p-5 hover:shadow-card-hover transition-all duration-200 cursor-pointer"
                onClick={() => setSelected(p)}>

                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 mr-3">
                    <h3 className="font-semibold text-base mb-1" style={{ color: "var(--text-1)" }}>{p.title}</h3>
                    <p className="text-xs line-clamp-2" style={{ color: "var(--text-3)" }}>{p.description}</p>
                  </div>
                  <span className="badge flex-shrink-0"
                    style={{ background: roiBg(p.roi_percent), color: roiColor(p.roi_percent) }}>
                    {p.roi_percent}% ROI
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Asking", value: formatINR(p.amount_requested) },
                    { label: "Yield", value: `${formatNumber(p.expected_yield)} qtl` },
                    { label: "Status", value: p.status },
                  ].map(s => (
                    <div key={s.label} className="rounded-lg p-2.5" style={{ background: "var(--surface-2)" }}>
                      <p className="text-xs mb-1" style={{ color: "var(--text-3)" }}>{s.label}</p>
                      <p className="font-semibold text-xs" style={{ color: "var(--text-1)" }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="badge badge-green text-[10px]">ML Verified</span>
                    <span className="badge badge-green text-[10px]">{p.language?.toUpperCase()}</span>
                  </div>
                  <button className="btn btn-primary !py-1.5 !px-4 text-xs"
                    onClick={e => { e.stopPropagation(); setSelected(p); }}>
                    Invest →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Investment Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            onClick={() => setSelected(null)}>
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-md"
              style={{ background: "var(--surface)", borderRadius: 24, boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}
              onClick={e => e.stopPropagation()}>

              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-xl" style={{ color: "var(--text-1)", letterSpacing: "-0.02em" }}>
                    Invest Now
                  </h3>
                  <button onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: "var(--surface-2)" }}>
                    <X className="w-4 h-4" style={{ color: "var(--text-2)" }} />
                  </button>
                </div>

                {/* Proposal summary */}
                <div className="rounded-xl p-4 mb-5" style={{ background: "var(--surface-2)" }}>
                  <p className="font-semibold text-sm mb-3" style={{ color: "var(--text-1)" }}>{selected.title}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Amount Requested", value: formatINR(selected.amount_requested) },
                      { label: "Expected ROI", value: `${selected.roi_percent}%` },
                      { label: "Expected Yield", value: `${formatNumber(selected.expected_yield)} qtl` },
                      { label: "Status", value: selected.status },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-xs mb-0.5" style={{ color: "var(--text-3)" }}>{item.label}</p>
                        <p className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generated pitch */}
                {selected.generated_pitch && (
                  <div className="rounded-xl p-4 mb-5" style={{ background: "#dcfce7" }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: "#14532d" }}>
                      Farmer's Pitch
                    </p>
                    <p className="text-xs line-clamp-3" style={{ color: "#166534" }}>
                      {selected.generated_pitch}
                    </p>
                  </div>
                )}

                {/* Amount input */}
                <div className="mb-5">
                  <label className="field-label">Your Investment Amount (₹)</label>
                  <input type="number" className="field" placeholder="e.g. 25000"
                    value={amount} onChange={e => setAmount(e.target.value)} />
                  {amount && parseFloat(amount) > 0 && (
                    <p className="text-xs mt-1.5" style={{ color: "var(--text-3)" }}>
                      Estimated return: {formatINR(parseFloat(amount) * (1 + selected.roi_percent / 100))} at {selected.roi_percent}% ROI
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setSelected(null)} className="btn btn-secondary flex-1 !py-2.5">
                    Cancel
                  </button>
                  <button onClick={handleInvest} disabled={investing || !amount} className="btn btn-primary flex-1 !py-2.5">
                    {investing
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</>
                      : <><Check className="w-4 h-4" />Confirm Investment</>
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
