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
import { TrendingUp, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function YieldPredictorPage() {
  const { setYieldPrediction, lastYieldPrediction } = useFarmerStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ crop_name: "wheat", area_acres: "5", soil_type: "alluvial", irrigation_type: "canal", season: "rabi", state: "haryana" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const r = await mlAPI.predictYield({ ...form, area_acres: parseFloat(form.area_acres) });
      setYieldPrediction(r); toast.success("Prediction ready");
    } catch { toast.error("Prediction failed"); }
    finally { setLoading(false); }
  };

  const chart = lastYieldPrediction ? [
    { name: "Min", value: lastYieldPrediction.confidence_min },
    { name: "Predicted", value: lastYieldPrediction.predicted_yield },
    { name: "Max", value: lastYieldPrediction.confidence_max },
  ] : [];

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }} className="pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 page">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#dcfce7" }}>
            <TrendingUp className="w-5 h-5" style={{ color: "#16a34a" }} />
          </div>
          <div>
            <h1 className="font-display text-2xl" style={{ color: "var(--text-1)", letterSpacing: "-0.02em" }}>Yield Predictor</h1>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>LinearRegression · Weather-calibrated</p>
          </div>
        </div>

        <form onSubmit={submit} className="card p-6 mb-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="field-label">Crop</label>
              <select className="field" value={form.crop_name} onChange={e => setForm({ ...form, crop_name: e.target.value })}>
                {CROPS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div><label className="field-label">Area (acres)</label>
              <input type="number" className="field" min="0.1" step="0.1" value={form.area_acres}
                onChange={e => setForm({ ...form, area_acres: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="field-label">Soil Type</label>
              <select className="field" value={form.soil_type} onChange={e => setForm({ ...form, soil_type: e.target.value })}>
                {SOIL_TYPES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div><label className="field-label">Irrigation</label>
              <select className="field" value={form.irrigation_type} onChange={e => setForm({ ...form, irrigation_type: e.target.value })}>
                {IRRIGATION_TYPES.map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="field-label">Season</label>
              <select className="field" value={form.season} onChange={e => setForm({ ...form, season: e.target.value })}>
                {SEASONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div><label className="field-label">State</label>
              <select className="field" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full !py-2.5">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Running model...</> : "Predict Yield"}
          </button>
        </form>

        {lastYieldPrediction && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Minimum", val: lastYieldPrediction.confidence_min, color: "#f59e0b", bg: "#fef3c7" },
                { label: "Predicted", val: lastYieldPrediction.predicted_yield, color: "#16a34a", bg: "#dcfce7", main: true },
                { label: "Maximum", val: lastYieldPrediction.confidence_max, color: "#3b82f6", bg: "#dbeafe" },
              ].map(s => (
                <div key={s.label} className="card p-4 text-center"
                  style={s.main ? { border: "2px solid #16a34a" } : {}}>
                  <p className="text-xs font-medium mb-2" style={{ color: "var(--text-3)" }}>{s.label}</p>
                  <p className="font-display text-2xl font-semibold num" style={{ color: s.color }}>
                    {formatNumber(s.val)}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>qtl</p>
                  {s.main && <span className="badge badge-green mt-2 text-[10px]">ML Verified</span>}
                </div>
              ))}
            </div>

            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-3)" }}>
                Confidence Range
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chart}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-3)", fontFamily: "Plus Jakarta Sans" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--text-3)", fontFamily: "Plus Jakarta Sans" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, fontFamily: "Plus Jakarta Sans" }} />
                  <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2.5} fill="url(#grad)"
                    dot={{ fill: "#16a34a", strokeWidth: 0, r: 5 }} activeDot={{ r: 7, fill: "#16a34a" }} />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-xs text-center mt-2" style={{ color: "var(--text-3)" }}>
                Weather via Open-Meteo · {form.state.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
