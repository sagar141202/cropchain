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
import { ShieldCheck, Loader2, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

export default function FairPricePage() {
  const { setFairPriceResult, lastFairPriceResult } = useFarmerStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [script, setScript] = useState("");
  const [form, setForm] = useState({ crop_name: "wheat", market_name: "Local Mandi", state: "haryana", offered_price: "" });

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setScript("");
    try {
      const result = await mlAPI.checkFairPrice({ ...form, offered_price: parseFloat(form.offered_price) });
      setFairPriceResult(result);
    } catch { toast.error("Analysis failed"); }
    finally { setLoading(false); }
  };

  const handleGetScript = async () => {
    if (!lastFairPriceResult) return;
    setScriptLoading(true);
    try {
      const res = await groqAPI.priceScript({
        crop_name: lastFairPriceResult.crop_name,
        offered_price: lastFairPriceResult.offered_price,
        modal_price: lastFairPriceResult.modal_price,
        deviation_percent: lastFairPriceResult.deviation_percent,
        language: user?.language || "en",
      });
      setScript(res.script);
    } catch { toast.error("Script generation failed"); }
    finally { setScriptLoading(false); }
  };

  const severityConfig = {
    "Fair": { color: "#00ff88", bg: "rgba(0,255,136,0.08)", border: "rgba(0,255,136,0.3)", icon: CheckCircle, badge: "badge-glow-green" },
    "Slightly Low": { color: "#f5c842", bg: "rgba(245,200,66,0.08)", border: "rgba(245,200,66,0.3)", icon: AlertTriangle, badge: "badge-glow-gold" },
    "Exploitative": { color: "#ff6b6b", bg: "rgba(255,107,107,0.08)", border: "rgba(255,107,107,0.3)", icon: AlertTriangle, badge: "badge-glow-red" },
  };

  const radialData = lastFairPriceResult ? [
    { name: "deviation", value: Math.min(lastFairPriceResult.deviation_percent, 100), fill: lastFairPriceResult.severity === "Fair" ? "#00ff88" : lastFairPriceResult.severity === "Slightly Low" ? "#f5c842" : "#ff6b6b" }
  ] : [];

  return (
    <div className="min-h-screen bg-void pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[rgba(245,200,66,0.1)] border border-[rgba(245,200,66,0.3)] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#f5c842]" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-[#e8f5e8]">Fair Price Radar</h1>
              <p className="font-mono text-xs text-[#5a7a5a] tracking-wider">IsolationForest · Real-time detection</p>
            </div>
          </div>

          <form onSubmit={handleCheck} className="glass p-6 mb-6 space-y-4 scanlines">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-dark">Crop</label>
                <select className="input-dark" value={form.crop_name} onChange={(e) => setForm({ ...form, crop_name: e.target.value })}>
                  {CROPS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="label-dark">State</label>
                <select className="input-dark" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label-dark">Market / Mandi Name</label>
              <input className="input-dark" placeholder="e.g. Karnal Mandi" value={form.market_name}
                onChange={(e) => setForm({ ...form, market_name: e.target.value })} />
            </div>
            <div>
              <label className="label-dark">Offered Price (₹/quintal)</label>
              <input type="number" className="input-dark" placeholder="e.g. 1400" value={form.offered_price}
                onChange={(e) => setForm({ ...form, offered_price: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-3 font-body font-bold">
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Scanning market...</span>
                : "Scan for Anomaly →"}
            </button>
          </form>

          {lastFairPriceResult && (() => {
            const cfg = severityConfig[lastFairPriceResult.severity as keyof typeof severityConfig];
            const SeverityIcon = cfg.icon;
            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass p-6 scanlines" style={{ borderColor: cfg.border }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="font-mono text-xs text-[#5a7a5a] uppercase tracking-wider mb-1">Analysis Result</p>
                      <h3 className="font-display text-xl" style={{ color: cfg.color }}>{lastFairPriceResult.severity}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                      <SeverityIcon className="w-6 h-6" style={{ color: cfg.color }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-6">
                    {/* Radial gauge */}
                    <div className="w-28 h-28 flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" data={radialData} startAngle={90} endAngle={-270}>
                          <RadialBar dataKey="value" cornerRadius={4} background={{ fill: "rgba(255,255,255,0.03)" }} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <p className="font-mono text-xs text-center -mt-2" style={{ color: cfg.color }}>
                        {lastFairPriceResult.deviation_percent.toFixed(1)}% off
                      </p>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.1)" }}>
                        <span className="font-mono text-xs text-[#5a7a5a] uppercase">Offered</span>
                        <span className="font-display text-xl text-[#ff6b6b]">{formatINR(lastFairPriceResult.offered_price)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.1)" }}>
                        <span className="font-mono text-xs text-[#5a7a5a] uppercase">Fair Price</span>
                        <span className="font-display text-xl text-[#00ff88]">{formatINR(lastFairPriceResult.modal_price)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl mb-4" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                    <p className="text-sm leading-relaxed" style={{ color: cfg.color }}>{lastFairPriceResult.recommendation}</p>
                  </div>

                  {lastFairPriceResult.is_anomaly && (
                    <button onClick={handleGetScript} disabled={scriptLoading} className="btn-glow w-full py-3">
                      {scriptLoading
                        ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Generating script...</span>
                        : <span className="flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4" />Get AI Negotiation Script</span>}
                    </button>
                  )}
                </div>

                {script && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="glass p-6 scanlines" style={{ borderColor: "rgba(0,255,136,0.2)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-4 h-4 text-[#00ff88]" />
                      <span className="font-mono text-xs text-[#5a7a5a] uppercase tracking-wider">Negotiation Script · Groq Llama 3.3 70B</span>
                    </div>
                    <p className="text-[#e8f5e8] text-sm leading-relaxed whitespace-pre-wrap">{script}</p>
                  </motion.div>
                )}
              </motion.div>
            );
          })()}
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
