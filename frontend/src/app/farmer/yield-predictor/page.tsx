"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { mlAPI } from "@/api/ml";
import { useFarmerStore } from "@/store/farmerStore";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import toast from "react-hot-toast";
import { CROPS, SOIL_TYPES, IRRIGATION_TYPES, SEASONS, INDIAN_STATES } from "@/utils/cropConstants";
import { formatNumber } from "@/utils/formatCurrency";
import { TrendingUp, Loader2, Cpu } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass px-3 py-2 text-xs font-mono">
      <p className="text-[#00ff88]">{payload[0]?.name}: {formatNumber(payload[0]?.value)} qtl</p>
    </div>
  );
};

export default function YieldPredictorPage() {
  const { setYieldPrediction, lastYieldPrediction } = useFarmerStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ crop_name: "wheat", area_acres: "5", soil_type: "alluvial", irrigation_type: "canal", season: "rabi", state: "haryana" });

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await mlAPI.predictYield({ ...form, area_acres: parseFloat(form.area_acres) });
      setYieldPrediction(result);
      toast.success("Prediction complete");
    } catch { toast.error("Prediction failed"); }
    finally { setLoading(false); }
  };

  const chartData = lastYieldPrediction ? [
    { name: "Min", yield: lastYieldPrediction.confidence_min },
    { name: "Predicted", yield: lastYieldPrediction.predicted_yield },
    { name: "Max", yield: lastYieldPrediction.confidence_max },
  ] : [];

  return (
    <div className="min-h-screen bg-void pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#00ff88]" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-[#e8f5e8]">Yield Intelligence</h1>
              <p className="font-mono text-xs text-[#5a7a5a] tracking-wider">LinearRegression · Weather-calibrated</p>
            </div>
          </div>

          <form onSubmit={handlePredict} className="glass p-6 mb-6 space-y-4 scanlines">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-dark">Crop Type</label>
                <select className="input-dark" value={form.crop_name} onChange={(e) => setForm({ ...form, crop_name: e.target.value })}>
                  {CROPS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="label-dark">Area (acres)</label>
                <input type="number" className="input-dark" min="0.1" step="0.1" value={form.area_acres}
                  onChange={(e) => setForm({ ...form, area_acres: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-dark">Soil Type</label>
                <select className="input-dark" value={form.soil_type} onChange={(e) => setForm({ ...form, soil_type: e.target.value })}>
                  {SOIL_TYPES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="label-dark">Irrigation</label>
                <select className="input-dark" value={form.irrigation_type} onChange={(e) => setForm({ ...form, irrigation_type: e.target.value })}>
                  {IRRIGATION_TYPES.map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-dark">Season</label>
                <select className="input-dark" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })}>
                  {SEASONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="label-dark">State</label>
                <select className="input-dark" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-glow w-full py-3">
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Running ML Model...</span>
                : <span className="flex items-center justify-center gap-2"><Cpu className="w-4 h-4" />Predict Yield</span>}
            </button>
          </form>

          {lastYieldPrediction && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Minimum", value: lastYieldPrediction.confidence_min, color: "#f5c842" },
                  { label: "Predicted", value: lastYieldPrediction.predicted_yield, color: "#00ff88", main: true },
                  { label: "Maximum", value: lastYieldPrediction.confidence_max, color: "#60a5fa" },
                ].map((s) => (
                  <div key={s.label} className={`stat-card text-center ${s.main ? "border-[rgba(0,255,136,0.3)]" : ""}`}>
                    <p className="font-mono text-[10px] text-[#5a7a5a] uppercase tracking-wider mb-2">{s.label}</p>
                    <p className="font-display text-3xl font-bold animate-count" style={{ color: s.color }}>
                      {formatNumber(s.value)}
                    </p>
                    <p className="font-mono text-[10px] text-[#5a7a5a] mt-1">quintals</p>
                    {s.main && <div className="mt-2"><span className="badge-glow-green">ML Verified</span></div>}
                  </div>
                ))}
              </div>

              <div className="glass p-6 scanlines">
                <p className="font-mono text-xs text-[#5a7a5a] uppercase tracking-wider mb-4">Confidence Range Visualization</p>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" tick={{ fill: "#5a7a5a", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#5a7a5a", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={lastYieldPrediction.predicted_yield} stroke="rgba(0,255,136,0.3)" strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="yield" stroke="#00ff88" strokeWidth={2} fill="url(#yieldGrad)" dot={{ fill: "#00ff88", strokeWidth: 0, r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="font-mono text-[10px] text-[#5a7a5a] text-center mt-2">
                  Weather data via Open-Meteo · {form.state.replace(/_/g, " ").toUpperCase()}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
