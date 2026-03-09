"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { mlAPI } from "@/api/ml";
import { groqAPI } from "@/api/groq";
import { useFarmerStore } from "@/store/farmerStore";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import toast from "react-hot-toast";
import { CROPS, INDIAN_STATES } from "@/utils/cropConstants";
import { formatINR } from "@/utils/formatCurrency";
import { ShieldCheck, Loader2, MessageSquare, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const SEV = {
  Fair: { color: "#16a34a", bg: "#dcfce7", border: "#86efac", badge: "badge-green", Icon: CheckCircle },
  "Slightly Low": { color: "#d97706", bg: "#fef3c7", border: "#fde68a", badge: "badge-amber", Icon: AlertTriangle },
  Exploitative: { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5", badge: "badge-red", Icon: XCircle },
};

export default function FairPricePage() {
  const { setFairPriceResult, lastFairPriceResult } = useFarmerStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [script, setScript] = useState("");
  const [form, setForm] = useState({ crop_name: "wheat", market_name: "Local Mandi", state: "haryana", offered_price: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setScript("");
    try {
      const r = await mlAPI.checkFairPrice({ ...form, offered_price: parseFloat(form.offered_price) });
      setFairPriceResult(r);
    } catch { toast.error("Analysis failed"); }
    finally { setLoading(false); }
  };

  const getScript = async () => {
    if (!lastFairPriceResult) return;
    setScriptLoading(true);
    try {
      const r = await groqAPI.priceScript({
        crop_name: lastFairPriceResult.crop_name,
        offered_price: lastFairPriceResult.offered_price,
        modal_price: lastFairPriceResult.modal_price,
        deviation_percent: lastFairPriceResult.deviation_percent,
        language: user?.language || "en",
      });
      setScript(r.script);
    } catch { toast.error("Script failed"); }
    finally { setScriptLoading(false); }
  };

  const cfg = lastFairPriceResult ? SEV[lastFairPriceResult.severity as keyof typeof SEV] : null;

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }} className="pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 page">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#fef3c7" }}>
            <ShieldCheck className="w-5 h-5" style={{ color: "#f59e0b" }} />
          </div>
          <div>
            <h1 className="font-display text-2xl" style={{ color: "var(--text-1)", letterSpacing: "-0.02em" }}>Fair Price Radar</h1>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>IsolationForest · Real-time anomaly detection</p>
          </div>
        </div>

        <form onSubmit={submit} className="card p-6 mb-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="field-label">Crop</label>
              <select className="field" value={form.crop_name} onChange={e => setForm({ ...form, crop_name: e.target.value })}>
                {CROPS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div><label className="field-label">State</label>
              <select className="field" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>)}
              </select>
            </div>
          </div>
          <div><label className="field-label">Market / Mandi Name</label>
            <input className="field" placeholder="e.g. Karnal Mandi" value={form.market_name}
              onChange={e => setForm({ ...form, market_name: e.target.value })} />
          </div>
          <div><label className="field-label">Offered Price (₹/quintal)</label>
            <input type="number" className="field" placeholder="e.g. 1400" value={form.offered_price}
              onChange={e => setForm({ ...form, offered_price: e.target.value })} required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-amber w-full !py-2.5">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Scanning...</> : "Check Fair Price"}
          </button>
        </form>

        {lastFairPriceResult && cfg && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="card p-6" style={{ borderColor: cfg.border, borderWidth: 1.5 }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <cfg.Icon className="w-5 h-5" style={{ color: cfg.color }} />
                  <span className="font-semibold" style={{ color: cfg.color }}>{lastFairPriceResult.severity}</span>
                </div>
                <span className={`badge ${cfg.badge}`}>{lastFairPriceResult.deviation_percent.toFixed(1)}% below market</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl p-4" style={{ background: "#fee2e2" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "#991b1b" }}>Offered</p>
                  <p className="font-display text-2xl font-semibold num" style={{ color: "#dc2626" }}>
                    {formatINR(lastFairPriceResult.offered_price)}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#991b1b" }}>/quintal</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "#dcfce7" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "#14532d" }}>Fair Price</p>
                  <p className="font-display text-2xl font-semibold num" style={{ color: "#16a34a" }}>
                    {formatINR(lastFairPriceResult.modal_price)}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#14532d" }}>/quintal</p>
                </div>
              </div>

              <div className="rounded-xl p-4 mb-4" style={{ background: cfg.bg }}>
                <p className="text-sm" style={{ color: cfg.color, lineHeight: 1.6 }}>
                  {lastFairPriceResult.recommendation}
                </p>
              </div>

              {lastFairPriceResult.is_anomaly && (
                <button onClick={getScript} disabled={scriptLoading}
                  className="btn btn-primary w-full !py-2.5">
                  {scriptLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Generating script...</>
                    : <><MessageSquare className="w-4 h-4" />Get Negotiation Script</>}
                </button>
              )}
            </div>

            {script && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4" style={{ color: "var(--green)" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
                    Negotiation Script · Groq Llama 3.3 70B
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>{script}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
