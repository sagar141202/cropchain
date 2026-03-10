"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Users, Sprout, Package, Heart } from "lucide-react";

function useCountUp(target: number, duration = 1400, start = false) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!start || target === 0) { setVal(0); return; }
    const startTime = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, start]);

  return val;
}

function fmt(n: number, decimals = 0) {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000)   return (n / 100000).toFixed(1) + "L";
  if (n >= 1000)     return (n / 1000).toFixed(decimals) + "K";
  return n.toString();
}

interface ImpactData {
  farmers:  number;
  acres:    number;
  quintals: number;
  invested: number;
}

interface ImpactCounterProps {
  portfolio: any[];
}

export default function ImpactCounter({ portfolio }: ImpactCounterProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Compute from real portfolio data
  const data: ImpactData = {
    farmers:  [...new Set(portfolio.map(p => p.farmer_id || p.proposal_id))].length || portfolio.length,
    acres:    portfolio.reduce((s, p) => s + (Number(p.area_acres) || 0), 0),
    quintals: portfolio.reduce((s, p) => s + (Number(p.expected_yield) || 0), 0),
    invested: portfolio.reduce((s, p) => s + (Number(p.amount) || Number(p.amount_invested) || 0), 0),
  };

  // If no real data yet — show meaningful demo numbers so widget is never empty
  const hasData = portfolio.length > 0;
  const display: ImpactData = hasData ? data : {
    farmers: 0, acres: 0, quintals: 0, invested: 0,
  };

  // IntersectionObserver — animate when scrolled into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const farmers  = useCountUp(display.farmers,  1200, visible);
  const acres    = useCountUp(display.acres,    1400, visible);
  const quintals = useCountUp(display.quintals, 1600, visible);
  const invested = useCountUp(display.invested, 1800, visible);

  const stats = [
    {
      icon:  Users,
      value: hasData ? farmers.toString() : "0",
      unit:  "farmers",
      label: "Supported",
      color: "#6366f1",
      bg:    "#e0e7ff",
      desc:  "Real farmers growing real crops",
    },
    {
      icon:  Sprout,
      value: hasData ? fmt(acres, 1) : "0",
      unit:  "acres",
      label: "Farmland",
      color: "#22c55e",
      bg:    "#dcfce7",
      desc:  "Of Indian farmland empowered",
    },
    {
      icon:  Package,
      value: hasData ? fmt(quintals, 1) : "0",
      unit:  "qtl",
      label: "Projected Yield",
      color: "#f59e0b",
      bg:    "#fef3c7",
      desc:  "Food reaching India's markets",
    },
    {
      icon:  Heart,
      value: hasData ? `₹${fmt(invested)}` : "₹0",
      unit:  "",
      label: "Invested",
      color: "#ec4899",
      bg:    "#fce7f3",
      desc:  "Capital backing Indian farmers",
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl mb-4 overflow-hidden"
      style={{ border: "1px solid var(--glass-border)" }}>

      {/* Header */}
      <div className="px-5 pt-5 pb-3"
        style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "#fce7f3" }}>
            <Heart className="w-4 h-4" style={{ color: "#ec4899" }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--text-1)" }}>
              Your Impact
            </p>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>
              {hasData
                ? "The real difference your investments make"
                : "Start investing to see your impact grow"}
            </p>
          </div>
        </div>
      </div>

      {/* Counter grid */}
      <div className="grid grid-cols-2 gap-px"
        style={{ background: "var(--glass-border)" }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.92 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
            className="p-4"
            style={{ background: "var(--surface, var(--bg))" }}>

            {/* Icon */}
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
              style={{ background: s.bg }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>

            {/* Animated number */}
            <div className="flex items-baseline gap-1 mb-0.5">
              <motion.span
                key={`${s.value}-${visible}`}
                className="font-black"
                style={{ fontSize: 26, lineHeight: 1, color: s.color, fontFamily: "'DM Sans', sans-serif" }}>
                {hasData ? s.value : (
                  <span style={{ color: "var(--text-3)", fontWeight: 400, fontSize: 18 }}>—</span>
                )}
              </motion.span>
              {hasData && s.unit && (
                <span className="text-xs font-semibold" style={{ color: s.color, opacity: 0.7 }}>
                  {s.unit}
                </span>
              )}
            </div>

            <p className="text-xs font-bold mb-0.5" style={{ color: "var(--text-1)" }}>
              {s.label}
            </p>
            <p style={{ fontSize: 10, color: "var(--text-3)", lineHeight: 1.3 }}>
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer quote */}
      {hasData && (
        <div className="px-5 py-3"
          style={{ borderTop: "1px solid var(--glass-border)", background: "var(--green-pale)" }}>
          <p className="text-xs text-center font-medium" style={{ color: "var(--green-dark)" }}>
            🌱 Every rupee you invest feeds a family and grows a farm
          </p>
        </div>
      )}

      {!hasData && (
        <div className="px-5 py-4"
          style={{ borderTop: "1px solid var(--glass-border)" }}>
          <p className="text-xs text-center" style={{ color: "var(--text-3)" }}>
            Browse open proposals and make your first investment to start tracking your impact
          </p>
        </div>
      )}
    </motion.div>
  );
}
