"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TrendingUp, IndianRupee, Clock, ChevronRight, Info } from "lucide-react";

const PRESETS = [
  { label: "₹5K",   value: 5000   },
  { label: "₹10K",  value: 10000  },
  { label: "₹25K",  value: 25000  },
  { label: "₹50K",  value: 50000  },
  { label: "₹1L",   value: 100000 },
  { label: "₹2L",   value: 200000 },
];

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function fmtFull(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

// Custom slider with gradient track fill
function Slider({
  min, max, value, onChange, color, step = 1,
}: {
  min: number; max: number; value: number;
  onChange: (v: number) => void;
  color: string; step?: number;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ position: "relative", height: 36, display: "flex", alignItems: "center" }}>
      {/* Track background */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 5,
        borderRadius: 99, background: "var(--glass-border)",
      }} />
      {/* Filled track */}
      <div style={{
        position: "absolute", left: 0, height: 5, borderRadius: 99,
        width: `${pct}%`, background: color,
        transition: "width 0.05s",
      }} />
      {/* Native input — invisible but functional */}
      <input
        type="range" min={min} max={max} value={value} step={step}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          opacity: 0, cursor: "pointer", zIndex: 2,
        }}
      />
      {/* Custom thumb */}
      <div style={{
        position: "absolute",
        left: `calc(${pct}% - 11px)`,
        width: 22, height: 22,
        borderRadius: "50%",
        background: "white",
        border: `3px solid ${color}`,
        boxShadow: `0 2px 8px ${color}55`,
        transition: "left 0.05s",
        pointerEvents: "none",
        zIndex: 1,
      }} />
    </div>
  );
}

export default function ROICalculator() {
  const [investment, setInvestment] = useState(25000);
  const [roi, setRoi]               = useState(18);
  const [months, setMonths]         = useState(12);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Pure math — no API
  const returns    = investment * (roi / 100) * (months / 12);
  const total      = investment + returns;
  const monthly    = returns / months;
  const annualised = (returns / investment / (months / 12)) * 100;

  // Breakdown: monthly compounding approximation
  const breakdown = Array.from({ length: Math.min(months, 12) }, (_, i) => {
    const m = i + 1;
    const val = investment + (investment * (roi / 100) * (m / 12));
    return { month: m, value: val, gain: val - investment };
  });

  const barMax = Math.max(...breakdown.map(b => b.value));

  const onInvestmentChange = useCallback((v: number) => setInvestment(v), []);
  const onRoiChange        = useCallback((v: number) => setRoi(v),        []);
  const onMonthsChange     = useCallback((v: number) => setMonths(v),     []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl mb-4 overflow-hidden"
      style={{ border: "1px solid var(--glass-border)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4"
        style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "#e0e7ff" }}>
            <Calculator className="w-4 h-4" style={{ color: "#6366f1" }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--text-1)" }}>ROI Calculator</p>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>Estimate your farm returns</p>
          </div>
        </div>
        <button onClick={() => setShowBreakdown(s => !s)}
          className="flex items-center gap-1 text-xs font-semibold"
          style={{ color: "#6366f1" }}>
          {showBreakdown ? "Hide" : "Breakdown"}
          <ChevronRight className="w-3 h-3"
            style={{ transform: showBreakdown ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
        </button>
      </div>

      <div className="px-5 py-4">
        {/* Result hero */}
        <motion.div
          key={`${investment}-${roi}-${months}`}
          initial={{ scale: 0.97, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="rounded-2xl p-4 mb-5 text-center"
          style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
          <p className="text-xs text-white opacity-70 mb-1">You get back</p>
          <p className="display font-bold text-white" style={{ fontSize: 36, lineHeight: 1 }}>
            {fmtFull(total)}
          </p>
          <p className="text-white opacity-70 mt-1" style={{ fontSize: 11 }}>
            {fmtFull(investment)} invested + {fmtFull(returns)} earned
          </p>
          {/* Mini stats */}
          <div className="flex justify-center gap-5 mt-3 pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <div className="text-center">
              <p className="text-white font-bold text-sm">{fmtFull(monthly)}</p>
              <p className="text-white opacity-60" style={{ fontSize: 10 }}>/ month</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm">{annualised.toFixed(1)}%</p>
              <p className="text-white opacity-60" style={{ fontSize: 10 }}>Annual return</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm">{fmt(returns)}</p>
              <p className="text-white opacity-60" style={{ fontSize: 10 }}>Total profit</p>
            </div>
          </div>
        </motion.div>

        {/* Investment amount slider */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5" style={{ color: "#6366f1" }} />
              <p className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>Investment</p>
            </div>
            <motion.p
              key={investment}
              initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="font-bold text-sm" style={{ color: "#6366f1" }}>
              {fmt(investment)}
            </motion.p>
          </div>
          <Slider min={1000} max={500000} value={investment}
            onChange={onInvestmentChange} color="#6366f1" step={1000} />
          {/* Presets */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {PRESETS.map(p => (
              <button key={p.value} onClick={() => setInvestment(p.value)}
                className="rounded-lg px-2 py-1 text-xs font-semibold transition-all"
                style={{
                  background: investment === p.value ? "#e0e7ff" : "var(--glass2)",
                  border: `1px solid ${investment === p.value ? "#6366f1" : "var(--glass-border)"}`,
                  color: investment === p.value ? "#4338ca" : "var(--text-3)",
                }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ROI slider */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
              <p className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>ROI %</p>
            </div>
            <motion.p
              key={roi}
              initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="font-bold text-sm" style={{ color: "#22c55e" }}>
              {roi}%
            </motion.p>
          </div>
          <Slider min={5} max={50} value={roi} onChange={onRoiChange} color="#22c55e" />
          {/* ROI labels */}
          <div className="flex justify-between mt-1">
            {["5%","15%","25%","35%","50%"].map(l => (
              <p key={l} style={{ fontSize: 9, color: "var(--text-3)" }}>{l}</p>
            ))}
          </div>
        </div>

        {/* Duration slider */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
              <p className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>Duration</p>
            </div>
            <motion.p
              key={months}
              initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="font-bold text-sm" style={{ color: "#f59e0b" }}>
              {months} month{months !== 1 ? "s" : ""}
            </motion.p>
          </div>
          <Slider min={1} max={36} value={months} onChange={onMonthsChange} color="#f59e0b" />
          <div className="flex justify-between mt-1">
            {["1m","6m","12m","18m","24m","36m"].map(l => (
              <p key={l} style={{ fontSize: 9, color: "var(--text-3)" }}>{l}</p>
            ))}
          </div>
        </div>

        {/* Monthly breakdown chart */}
        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ overflow: "hidden" }}>
              <div className="pt-4 mt-4"
                style={{ borderTop: "1px solid var(--glass-border)" }}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Info className="w-3 h-3" style={{ color: "var(--text-3)" }} />
                  <p className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>
                    Month-by-month growth
                  </p>
                </div>

                {/* Bar chart */}
                <div className="flex items-end gap-1" style={{ height: 80 }}>
                  {breakdown.map((b, i) => {
                    const h = Math.max(((b.value / barMax) * 72), 8);
                    return (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }} animate={{ height: h }}
                        transition={{ delay: i * 0.04, duration: 0.35, ease: "easeOut" }}
                        title={`Month ${b.month}: ${fmtFull(b.value)}`}
                        style={{
                          flex: 1, borderRadius: "4px 4px 0 0",
                          background: i === breakdown.length - 1
                            ? "#6366f1"
                            : `rgba(99,102,241,${0.25 + (i / breakdown.length) * 0.55})`,
                          cursor: "default",
                          minWidth: 0,
                        }}
                      />
                    );
                  })}
                </div>

                {/* X axis labels */}
                <div className="flex gap-1 mt-1">
                  {breakdown.map((b, i) => (
                    <p key={i} style={{
                      flex: 1, textAlign: "center", fontSize: 8,
                      color: "var(--text-3)", minWidth: 0,
                    }}>
                      {i === 0 ? "1m" : i === breakdown.length - 1 ? `${b.month}m` : ""}
                    </p>
                  ))}
                </div>

                {/* Summary row */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { label: "Principal",    value: fmtFull(investment), color: "var(--text-2)" },
                    { label: "Total return", value: fmtFull(total),      color: "#6366f1"       },
                    { label: "Profit",       value: fmtFull(returns),    color: "#22c55e"       },
                    { label: "Per month",    value: fmtFull(monthly),    color: "#f59e0b"       },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl px-3 py-2"
                      style={{ background: "var(--glass2)", border: "1px solid var(--glass-border)" }}>
                      <p className="text-xs font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p style={{ fontSize: 10, color: "var(--text-3)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
