"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { investorAPI } from "@/api/investor";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { formatINR } from "@/utils/formatCurrency";
import { X, TrendingUp, IndianRupee, Percent, FileText } from "lucide-react";
import toast from "react-hot-toast";

function stripMarkdown(t: string) {
  return t.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1")
    .replace(/#{1,6}\s*/g,"").replace(/__(.*?)__/g,"$1").replace(/`(.*?)`/g,"$1").trim();
}

export default function InvestorBrowse() {
  const { isAuthenticated, hydrated } = useAuthStore();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [investing, setInvesting] = useState(false);

  useEffect(() => {
    if (hydrated && !isAuthenticated) { router.push("/login"); return; }
    if (isAuthenticated) investorAPI.browseProposals().then(setProposals).catch(() => toast.error("Failed to load"));
  }, [hydrated, isAuthenticated]);

  const invest = async () => {
    if (!amount || isNaN(Number(amount))) return toast.error("Enter a valid amount");
    setInvesting(true);
    try {
      await investorAPI.invest(selected.id, Number(amount));
      toast.success("Investment submitted!");
      setSelected(null);
      setAmount("");
      const updated = await investorAPI.browseProposals();
      setProposals(updated);
    } catch { toast.error("Investment failed"); }
    finally { setInvesting(false); }
  };

  if (!hydrated) return null;

  return (
    <div className="min-h-screen pb-24 page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="display text-2xl font-bold mb-1" style={{ color:"var(--text-1)" }}>Browse Proposals</h1>
        <p className="text-sm mb-6" style={{ color:"var(--text-3)" }}>ML-verified farm investment opportunities</p>

        {proposals.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color:"var(--text-3)" }} />
            <p className="font-medium" style={{ color:"var(--text-2)" }}>No open proposals</p>
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
                className="glass rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => setSelected(p)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-3">
                    <h3 className="font-semibold text-sm mb-1" style={{ color:"var(--text-1)" }}>{p.title}</h3>
                    <p className="text-xs line-clamp-2" style={{ color:"var(--text-3)" }}>
                      {stripMarkdown(p.pitch_content || "").slice(0, 100)}…
                    </p>
                  </div>
                  <span className="badge badge-green flex-shrink-0">Open</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" style={{ color:"var(--green-dark)" }} />
                    <span className="text-xs font-bold" style={{ color:"var(--green-dark)" }}>{formatINR(p.amount_requested)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Percent className="w-3 h-3" style={{ color:"var(--text-3)" }} />
                    <span className="text-xs font-semibold" style={{ color:"var(--text-2)" }}>{p.roi_percent}% ROI</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <TrendingUp className="w-3 h-3" style={{ color:"var(--text-3)" }} />
                    <span className="text-xs" style={{ color:"var(--text-3)" }}>{p.duration_months}mo</span>
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
              initial={{ opacity:0, y:60, scale:0.95 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:40, scale:0.95 }}
              transition={{ type:"spring", stiffness:400, damping:30 }}
              onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="display text-xl font-bold pr-4" style={{ color:"var(--text-1)" }}>{selected.title}</h2>
                  <button onClick={() => setSelected(null)}
                    className="btn-ghost w-8 h-8 !p-0 rounded-xl flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="badge badge-green">{formatINR(selected.amount_requested)} Asking</span>
                  <span className="badge badge-blue">{selected.roi_percent}% ROI</span>
                  <span className="badge badge-amber">{selected.duration_months} months</span>
                </div>
                <div className="rounded-2xl p-4 mb-4 text-sm leading-relaxed"
                  style={{ background:"var(--glass2)", border:"1px solid var(--glass-border)", color:"var(--text-2)", maxHeight:260, overflowY:"auto" }}>
                  {stripMarkdown(selected.pitch_content || "No pitch provided.")}
                </div>
                <div className="field">
                  <label className="field-label">Your Investment Amount (₹)</label>
                  <input type="number" placeholder="e.g. 25000" value={amount}
                    onChange={e => setAmount(e.target.value)} />
                </div>
                <button className="btn btn-green w-full" onClick={invest} disabled={investing}>
                  {investing ? "Processing…" : "Invest Now"}
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
