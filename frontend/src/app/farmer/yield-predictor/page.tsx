"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { mlAPI } from "@/api/ml";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { CROPS, SOIL_TYPES, IRRIGATION_TYPES, SEASONS } from "@/utils/cropConstants";
import { TrendingUp, Leaf, Droplets, Thermometer, X } from "lucide-react";
import toast from "react-hot-toast";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function YieldPredictor() {
  const { isAuthenticated, hydrated } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ crop:"wheat", area:"5", soil:"loamy", irrigation:"drip", season:"kharif", rainfall:"800", temp:"25" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => { if (hydrated && !isAuthenticated) router.push("/login"); }, [hydrated, isAuthenticated]);
  if (!hydrated) return null;

  const f = (k:string) => (e:any) => setForm(p => ({ ...p, [k]:e.target.value }));

  const predict = async () => {
    setLoading(true);
    try {
      const res = await mlAPI.predictYield({
        crop_type: form.crop, area_acres: Number(form.area),
        soil_type: form.soil, irrigation_type: form.irrigation,
        season: form.season, avg_rainfall: Number(form.rainfall), avg_temp: Number(form.temp),
      });
      setResult(res);
      setShowResult(true);
    } catch { toast.error("Prediction failed"); }
    finally { setLoading(false); }
  };

  const chartData = result ? [
    { month:"Apr", yield: result.predicted_yield * 0.6 },
    { month:"Jun", yield: result.predicted_yield * 0.8 },
    { month:"Aug", yield: result.predicted_yield * 0.95 },
    { month:"Oct", yield: result.predicted_yield },
    { month:"Dec", yield: result.predicted_yield * 0.9 },
  ] : [];

  return (
    <div className="min-h-screen pb-24 page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="display text-2xl font-bold mb-1" style={{ color:"var(--text-1)" }}>Yield Predictor</h1>
        <p className="text-sm mb-6" style={{ color:"var(--text-3)" }}>ML-powered crop yield forecast</p>

        <div className="glass rounded-2xl p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="field"><label className="field-label">Crop</label>
              <select value={form.crop} onChange={f("crop")}>
                {CROPS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
            <div className="field"><label className="field-label">Area (acres)</label>
              <input type="number" value={form.area} onChange={f("area")} /></div>
            <div className="field"><label className="field-label">Soil Type</label>
              <select value={form.soil} onChange={f("soil")}>
                {SOIL_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
            <div className="field"><label className="field-label">Irrigation</label>
              <select value={form.irrigation} onChange={f("irrigation")}>
                {IRRIGATION_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
            <div className="field"><label className="field-label">Season</label>
              <select value={form.season} onChange={f("season")}>
                {SEASONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
            <div className="field"><label className="field-label">Rainfall (mm)</label>
              <input type="number" value={form.rainfall} onChange={f("rainfall")} /></div>
            <div className="field col-span-2"><label className="field-label">Avg Temp (°C)</label>
              <input type="number" value={form.temp} onChange={f("temp")} /></div>
          </div>
          <button className="btn btn-green w-full mt-1" onClick={predict} disabled={loading}>
            {loading ? "Predicting…" : <><TrendingUp className="w-4 h-4" /> Predict Yield</>}
          </button>
        </div>
      </div>

      {/* Result modal */}
      <AnimatePresence>
        {showResult && result && (
          <div className="modal-overlay" onClick={() => setShowResult(false)}>
            <motion.div className="modal-sheet glass"
              initial={{ opacity:0, y:80 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:60 }}
              transition={{ type:"spring", stiffness:380, damping:28 }}
              onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="display text-xl font-bold" style={{ color:"var(--text-1)" }}>Yield Forecast</h2>
                  <button onClick={() => setShowResult(false)}
                    className="btn-ghost w-8 h-8 !p-0 rounded-xl flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label:"Predicted Yield", value:`${result.predicted_yield?.toFixed(1)} qtl`, icon:Leaf, color:"var(--green-dark)", bg:"var(--green-pale)" },
                    { label:"Revenue Est.", value:`₹${((result.predicted_yield||0)*2200).toLocaleString("en-IN")}`, icon:TrendingUp, color:"#6366f1", bg:"#e0e7ff" },
                    { label:"Confidence", value:`${result.confidence_score || 78}%`, icon:Thermometer, color:"#f59e0b", bg:"#fef3c7" },
                    { label:"Per Acre", value:`${((result.predicted_yield||0)/Number(form.area)).toFixed(1)} qtl`, icon:Droplets, color:"#ec4899", bg:"#fce7f3" },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl p-4"
                      style={{ background:"var(--glass2)", border:"1px solid var(--glass-border)" }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background:s.bg }}>
                        <s.icon className="w-4 h-4" style={{ color:s.color }} />
                      </div>
                      <p className="font-bold text-base" style={{ color:"var(--text-1)" }}>{s.value}</p>
                      <p className="text-xs" style={{ color:"var(--text-3)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <div style={{ height:140 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="yg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize:11, fill:"var(--text-3)" }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ background:"var(--glass)", border:"1px solid var(--glass-border)", borderRadius:12, fontSize:12 }} />
                      <Area type="monotone" dataKey="yield" stroke="#22c55e" strokeWidth={2} fill="url(#yg)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
