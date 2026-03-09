"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { mlAPI } from "@/api/ml";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { CROPS } from "@/utils/cropConstants";
import { ShieldCheck, AlertTriangle, CheckCircle, X } from "lucide-react";
import toast from "react-hot-toast";

export default function FairPrice() {
  const { isAuthenticated, hydrated } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ crop:"wheat", offered_price:"2000", market_price:"2200", quantity:"100", location:"maharashtra" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => { if (hydrated && !isAuthenticated) router.push("/login"); }, [hydrated, isAuthenticated]);
  if (!hydrated) return null;
  const f = (k:string) => (e:any) => setForm(p => ({ ...p, [k]:e.target.value }));

  const check = async () => {
    setLoading(true);
    try {
      const res = await mlAPI.detectAnomaly({
        crop_type: form.crop,
        offered_price: Number(form.offered_price),
        market_price: Number(form.market_price),
        quantity_qtl: Number(form.quantity),
        location: form.location,
      });
      setResult(res);
      setShowResult(true);
    } catch { toast.error("Check failed"); }
    finally { setLoading(false); }
  };

  const isAnomaly = result?.is_anomaly;
  const severity = result?.severity || "normal";

  return (
    <div className="min-h-screen pb-24 page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="display text-2xl font-bold mb-1" style={{ color:"var(--text-1)" }}>Fair Price Radar</h1>
        <p className="text-sm mb-6" style={{ color:"var(--text-3)" }}>Detect unfair pricing with ML anomaly detection</p>

        <div className="glass rounded-2xl p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="field"><label className="field-label">Crop</label>
              <select value={form.crop} onChange={f("crop")}>
                {CROPS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
            <div className="field"><label className="field-label">Quantity (qtl)</label>
              <input type="number" value={form.quantity} onChange={f("quantity")} /></div>
            <div className="field"><label className="field-label">Offered Price ₹/qtl</label>
              <input type="number" value={form.offered_price} onChange={f("offered_price")} /></div>
            <div className="field"><label className="field-label">Market Price ₹/qtl</label>
              <input type="number" value={form.market_price} onChange={f("market_price")} /></div>
            <div className="field col-span-2"><label className="field-label">Location</label>
              <input placeholder="e.g. Maharashtra" value={form.location} onChange={f("location")} /></div>
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
              initial={{ opacity:0, y:80 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:60 }}
              transition={{ type:"spring", stiffness:380, damping:28 }}
              onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="display text-xl font-bold" style={{ color:"var(--text-1)" }}>Price Analysis</h2>
                  <button onClick={() => setShowResult(false)}
                    className="btn-ghost w-8 h-8 !p-0 rounded-xl flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="rounded-2xl p-5 mb-4 text-center"
                  style={{ background: isAnomaly ? "var(--red-pale)" : "var(--green-pale)",
                    border: `2px solid ${isAnomaly ? "var(--red)":"var(--green)"}` }}>
                  {isAnomaly
                    ? <AlertTriangle className="w-10 h-10 mx-auto mb-2" style={{ color:"var(--red)" }} />
                    : <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color:"var(--green-dark)" }} />}
                  <h3 className="font-bold text-lg" style={{ color: isAnomaly ? "var(--red)":"var(--green-dark)" }}>
                    {isAnomaly ? "⚠️ Unfair Price Detected" : "✅ Price is Fair"}
                  </h3>
                  <p className="text-sm mt-1" style={{ color:"var(--text-2)" }}>
                    {result.message || (isAnomaly ? "The offered price is significantly below market rate." : "The offered price is within normal market range.")}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label:"Offered", value:`₹${form.offered_price}` },
                    { label:"Market", value:`₹${form.market_price}` },
                    { label:"Diff", value:`${(((Number(form.market_price)-Number(form.offered_price))/Number(form.market_price))*100).toFixed(1)}%` },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-3 text-center"
                      style={{ background:"var(--glass2)", border:"1px solid var(--glass-border)" }}>
                      <p className="font-bold text-sm" style={{ color:"var(--text-1)" }}>{s.value}</p>
                      <p className="text-xs" style={{ color:"var(--text-3)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                {result.negotiation_script && (
                  <div className="rounded-2xl p-4"
                    style={{ background:"var(--glass2)", border:"1px solid var(--glass-border)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:"var(--text-3)" }}>Negotiation Script</p>
                    <p className="text-sm leading-relaxed" style={{ color:"var(--text-2)" }}>{result.negotiation_script}</p>
                  </div>
                )}
                <button className="btn btn-ghost w-full mt-4" onClick={() => setShowResult(false)}>Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
