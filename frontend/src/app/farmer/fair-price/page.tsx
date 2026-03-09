"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { mlAPI } from "@/api/ml";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { CROPS, INDIAN_STATES } from "@/utils/cropConstants";
import { ShieldCheck, AlertTriangle, CheckCircle, X, TrendingDown } from "lucide-react";
import toast from "react-hot-toast";

export default function FairPrice() {
  const { user, isAuthenticated, hydrated } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({
    crop_name: "wheat",
    market_name: "APMC Pune",
    state: user?.state || "karnataka",
    offered_price: "2000",
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => { if (hydrated && !isAuthenticated) router.push("/login"); }, [hydrated, isAuthenticated]);
  if (!hydrated) return null;
  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target.value }));

  const check = async () => {
    setLoading(true);
    try {
      const res = await mlAPI.detectAnomaly({
        crop_name: form.crop_name,
        market_name: form.market_name,
        state: form.state,
        offered_price: Number(form.offered_price),
      });
      setResult(res);
      setShowResult(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.detail?.[0]?.msg || "Check failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pb-24 page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="display text-2xl font-bold mb-1" style={{ color: "var(--text-1)" }}>Fair Price Radar</h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-3)" }}>Detect unfair pricing with ML anomaly detection</p>

        <div className="glass rounded-2xl p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="field"><label className="field-label">Crop</label>
              <select value={form.crop_name} onChange={f("crop_name")}>
                {CROPS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select></div>
            <div className="field"><label className="field-label">State</label>
              <select value={form.state} onChange={f("state")}>
                {INDIAN_STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select></div>
            <div className="field col-span-2"><label className="field-label">Market / Mandi Name</label>
              <input placeholder="e.g. APMC Pune" value={form.market_name} onChange={f("market_name")} /></div>
            <div className="field col-span-2"><label className="field-label">Offered Price (₹/qtl)</label>
              <input type="number" placeholder="e.g. 2000" value={form.offered_price} onChange={f("offered_price")} /></div>
          </div>
          <button className="btn btn-amber w-full mt-1" onClick={check} disabled={loading}>
            {loading ? "Analysing…" : <><ShieldCheck className="w-4 h-4" /> Check Fairness</>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showResult && result && (
          <div className="modal-overlay" onClick={() => setShowResult(false)}>
            <motion.div className="modal-sheet glass"
              initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="display text-xl font-bold" style={{ color: "var(--text-1)" }}>Price Analysis</h2>
                  <button onClick={() => setShowResult(false)}
                    className="btn-ghost w-8 h-8 !p-0 rounded-xl flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Verdict */}
                <div className="rounded-2xl p-5 mb-4 text-center"
                  style={{
                    background: result.is_anomaly ? "var(--red-pale)" : "var(--green-pale)",
                    border: `2px solid ${result.is_anomaly ? "var(--red)" : "var(--green)"}`,
                  }}>
                  {result.is_anomaly
                    ? <AlertTriangle className="w-10 h-10 mx-auto mb-2" style={{ color: "var(--red)" }} />
                    : <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: "var(--green-dark)" }} />}
                  <h3 className="font-bold text-lg" style={{ color: result.is_anomaly ? "var(--red)" : "var(--green-dark)" }}>
                    {result.is_anomaly ? "⚠️ Unfair Price Detected" : "✅ Price is Fair"}
                  </h3>
                  <span className={`badge mt-2 ${result.severity === "high" ? "badge-red" : result.severity === "medium" ? "badge-amber" : "badge-green"}`}>
                    {result.severity} severity
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Offered",    value: `₹${result.offered_price}` },
                    { label: "Modal Price", value: `₹${result.modal_price}` },
                    { label: "Deviation",  value: `${result.deviation_percent?.toFixed(1)}%` },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-3 text-center"
                      style={{ background: "var(--glass2)", border: "1px solid var(--glass-border)" }}>
                      <p className="font-bold text-sm" style={{ color: "var(--text-1)" }}>{s.value}</p>
                      <p className="text-xs" style={{ color: "var(--text-3)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                {result.recommendation && (
                  <div className="rounded-2xl p-4 mb-4"
                    style={{ background: "var(--glass2)", border: "1px solid var(--glass-border)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-3)" }}>
                      Recommendation
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                      {result.recommendation}
                    </p>
                  </div>
                )}
                <button className="btn btn-ghost w-full" onClick={() => setShowResult(false)}>Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
