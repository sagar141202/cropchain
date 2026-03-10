"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldX, X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { computeRisk, type RiskResult } from "@/utils/riskScore";

function RiskIcon({ level, size = 12 }: { level: string; size?: number }) {
  const s = { width: size, height: size };
  if (level === "Low")    return <ShieldCheck style={s} />;
  if (level === "Medium") return <ShieldAlert style={s} />;
  return <ShieldX style={s} />;
}

// Mini bar — shows score visually
function RiskBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{
      height: 4, borderRadius: 99, background: "var(--glass-border)",
      overflow: "hidden", flex: 1,
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ height: "100%", borderRadius: 99, background: color }}
      />
    </div>
  );
}

export function RiskBadge({ proposal, onClick }: { proposal: any; onClick?: (r: RiskResult) => void }) {
  const risk = computeRisk(proposal);
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={e => { e.stopPropagation(); onClick?.(risk); }}
      className="flex items-center gap-1 rounded-lg px-2 py-1 flex-shrink-0"
      style={{ background: risk.bg, border: `1px solid ${risk.border}` }}>
      <RiskIcon level={risk.level} size={10} />
      <span style={{ fontSize: 10, fontWeight: 700, color: risk.color }}>
        {risk.level} Risk
      </span>
    </motion.button>
  );
}

// Full breakdown modal
export function RiskDetailModal({ risk, proposal, onClose }: {
  risk: RiskResult; proposal: any; onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-sheet glass"
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={{    opacity: 0, y: 40,  scale: 0.95 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        onClick={e => e.stopPropagation()}>
        <div className="p-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="display text-xl font-bold" style={{ color: "var(--text-1)" }}>
                Risk Analysis
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                {proposal.title}
              </p>
            </div>
            <button onClick={onClose}
              className="btn-ghost w-8 h-8 !p-0 rounded-xl flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Score hero */}
          <div className="rounded-2xl p-5 mb-4 flex items-center gap-4"
            style={{ background: risk.bg, border: `1px solid ${risk.border}` }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <RiskIcon level={risk.level} size={28} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg" style={{ color: risk.color }}>
                  {risk.level} Risk
                </span>
                <span className="text-xs px-2 py-0.5 rounded-lg font-semibold"
                  style={{ background: "white", color: risk.color }}>
                  Score: {risk.score}/100
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RiskBar score={risk.score} color={risk.color} />
                <span style={{ fontSize: 10, color: risk.color, fontWeight: 700, flexShrink: 0 }}>
                  {risk.score}
                </span>
              </div>
              <p style={{ fontSize: 10, color: risk.color, marginTop: 4, opacity: 0.8 }}>
                {risk.level === "Low"    ? "Well-structured proposal with realistic projections"
               : risk.level === "Medium" ? "Reasonable but verify key claims before investing"
               :                          "Multiple risk factors — due diligence strongly advised"}
              </p>
            </div>
          </div>

          {/* Risk legend */}
          <div className="flex gap-2 mb-4">
            {[
              { level: "Low",    range: "0–28",  color: "#15803d", bg: "#dcfce7" },
              { level: "Medium", range: "29–55", color: "#b45309", bg: "#fef3c7" },
              { level: "High",   range: "56–100",color: "#b91c1c", bg: "#fee2e2" },
            ].map(l => (
              <div key={l.level} className="flex-1 rounded-xl p-2 text-center"
                style={{ background: l.bg }}>
                <RiskIcon level={l.level} size={12} />
                <p style={{ fontSize: 10, fontWeight: 700, color: l.color, marginTop: 2 }}>{l.level}</p>
                <p style={{ fontSize: 9, color: l.color, opacity: 0.7 }}>{l.range}</p>
              </div>
            ))}
          </div>

          {/* Factor breakdown */}
          <p className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--text-3)" }}>What's driving this score</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {risk.factors.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                style={{
                  background: f.impact === "good"    ? "#f0fdf4"
                            : f.impact === "bad"     ? "#fef2f2" : "#fffbeb",
                  border: `1px solid ${
                    f.impact === "good"  ? "#bbf7d0"
                  : f.impact === "bad"  ? "#fecaca" : "#fde68a"}`,
                }}>
                <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: f.impact === "good" ? "#dcfce7"
                              : f.impact === "bad"  ? "#fee2e2" : "#fef3c7",
                  }}>
                  {f.impact === "good"    && <TrendingUp   className="w-3 h-3" style={{ color: "#16a34a" }} />}
                  {f.impact === "bad"     && <TrendingDown className="w-3 h-3" style={{ color: "#dc2626" }} />}
                  {f.impact === "neutral" && <Minus        className="w-3 h-3" style={{ color: "#d97706" }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{
                    color: f.impact === "good" ? "#15803d"
                         : f.impact === "bad"  ? "#b91c1c" : "#92400e",
                  }}>{f.label}</p>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>{f.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-center mt-4" style={{ color: "var(--text-3)" }}>
            Risk score is indicative only. Always verify farm details before investing.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
