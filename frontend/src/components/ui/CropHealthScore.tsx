"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, Droplets, Thermometer, Wind, Info, Leaf, AlertTriangle, ShieldAlert } from "lucide-react";

interface Props {
  state: string;
}

function computeScore(weather: any, yieldConf: number | null): {
  score: number;
  factors: { label: string; impact: "positive" | "neutral" | "negative"; detail: string }[];
} {
  let score = 60; // baseline
  const factors: { label: string; impact: "positive" | "neutral" | "negative"; detail: string }[] = [];

  if (!weather) return { score, factors };

  const { temp, humidity, rain, code } = weather;

  // Temperature scoring
  if (temp >= 18 && temp <= 30) {
    score += 12;
    factors.push({ label: "Temperature", impact: "positive", detail: `${temp}°C — ideal range for most crops` });
  } else if (temp > 30 && temp <= 38) {
    score -= 5;
    factors.push({ label: "Temperature", impact: "neutral", detail: `${temp}°C — warm, monitor water levels` });
  } else if (temp > 38) {
    score -= 18;
    factors.push({ label: "Temperature", impact: "negative", detail: `${temp}°C — heat stress risk for crops` });
  } else if (temp < 10) {
    score -= 15;
    factors.push({ label: "Temperature", impact: "negative", detail: `${temp}°C — frost risk, protect seedlings` });
  } else {
    factors.push({ label: "Temperature", impact: "neutral", detail: `${temp}°C — slightly cool but manageable` });
  }

  // Humidity scoring
  if (humidity >= 40 && humidity <= 70) {
    score += 8;
    factors.push({ label: "Humidity", impact: "positive", detail: `${humidity}% — optimal moisture in air` });
  } else if (humidity > 80) {
    score -= 10;
    factors.push({ label: "Humidity", impact: "negative", detail: `${humidity}% — high, fungal disease risk` });
  } else if (humidity < 30) {
    score -= 6;
    factors.push({ label: "Humidity", impact: "neutral", detail: `${humidity}% — low, increase irrigation` });
  } else {
    factors.push({ label: "Humidity", impact: "neutral", detail: `${humidity}% — acceptable range` });
  }

  // Rain scoring
  if (rain === 0) {
    score += 3;
    factors.push({ label: "Rainfall", impact: "positive", detail: "No rain — safe for fieldwork today" });
  } else if (rain > 0 && rain <= 5) {
    score += 5;
    factors.push({ label: "Rainfall", impact: "positive", detail: `${rain}mm — light, beneficial for crops` });
  } else if (rain > 5 && rain <= 20) {
    score -= 5;
    factors.push({ label: "Rainfall", impact: "neutral", detail: `${rain}mm — moderate, watch for runoff` });
  } else {
    score -= 14;
    factors.push({ label: "Rainfall", impact: "negative", detail: `${rain}mm — heavy rain, waterlogging risk` });
  }

  // Weather code scoring
  if (code >= 95) {
    score -= 15;
    factors.push({ label: "Storm Alert", impact: "negative", detail: "Thunderstorm — avoid all fieldwork" });
  } else if (code >= 61 && code < 95) {
    score -= 8;
    factors.push({ label: "Weather", impact: "negative", detail: "Rainy conditions — limit outdoor activity" });
  } else if (code <= 1) {
    score += 5;
    factors.push({ label: "Clear Sky", impact: "positive", detail: "Sunny — great for harvesting and drying" });
  }

  // Yield confidence bonus
  if (yieldConf !== null) {
    if (yieldConf >= 80) {
      score += 10;
      factors.push({ label: "Yield Forecast", impact: "positive", detail: `${yieldConf}% confidence — strong prediction` });
    } else if (yieldConf >= 60) {
      score += 4;
      factors.push({ label: "Yield Forecast", impact: "neutral", detail: `${yieldConf}% confidence — moderate outlook` });
    } else {
      score -= 4;
      factors.push({ label: "Yield Forecast", impact: "negative", detail: `${yieldConf}% confidence — uncertain season` });
    }
  }

  return { score: Math.max(0, Math.min(100, Math.round(score))), factors };
}

function getStatus(score: number): {
  label: string; color: string; bg: string; ring: string;
  trackColor: string; description: string; icon: "leaf" | "warn" | "shield";
} {
  if (score >= 70) return {
    label: "Healthy",   color: "#16a34a", bg: "#dcfce7", ring: "#22c55e",
    trackColor: "#bbf7d0",
    description: "Your crops are in great shape. Keep up current practices.",
    icon: "leaf",
  };
  if (score >= 45) return {
    label: "Watch",     color: "#d97706", bg: "#fef3c7", ring: "#f59e0b",
    trackColor: "#fde68a",
    description: "Some factors need attention. Monitor your field closely.",
    icon: "warn",
  };
  return {
    label: "At Risk",   color: "#dc2626", bg: "#fee2e2", ring: "#ef4444",
    trackColor: "#fecaca",
    description: "Multiple risk factors detected. Take action soon.",
    icon: "shield",
  };
}

// SVG ring math
const R = 44;
const CIRC = 2 * Math.PI * R;

export default function CropHealthScore({ state }: Props) {
  const [score, setScore]     = useState<number | null>(null);
  const [factors, setFactors] = useState<ReturnType<typeof computeScore>["factors"]>([]);
  const [expanded, setExpanded] = useState(false);
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    // Pull cached weather
    const weatherRaw = localStorage.getItem(`weather_${state}`);
    const weather = weatherRaw ? JSON.parse(weatherRaw).data : null;

    // Pull last yield prediction confidence if saved
    const yieldRaw = localStorage.getItem(`last_yield_${state}`);
    const yieldConf = yieldRaw ? JSON.parse(yieldRaw).confidence : null;

    const { score: s, factors: f } = computeScore(weather, yieldConf);
    setScore(s);
    setFactors(f);
  }, [state]);

  // Animate the score number and ring on mount
  useEffect(() => {
    if (score === null) return;
    let start = 0;
    const step = () => {
      start += 2.5;
      if (start >= score) { setAnimScore(score); return; }
      setAnimScore(Math.round(start));
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  if (score === null) return null;

  const status  = getStatus(score);
  const offset  = CIRC - (animScore / 100) * CIRC;

  return (
    <>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => setExpanded(true)}
        className="glass rounded-2xl p-4 mb-4 cursor-pointer hover:shadow-lg transition-all"
        style={{ border: "1px solid var(--glass-border)" }}>

        <div className="flex items-center gap-4">
          {/* Ring */}
          <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
            <svg width="88" height="88" viewBox="0 0 100 100"
              style={{ transform: "rotate(-90deg)" }}>
              {/* Track */}
              <circle cx="50" cy="50" r={R}
                fill="none" stroke={status.trackColor} strokeWidth="8" />
              {/* Progress */}
              <motion.circle
                cx="50" cy="50" r={R}
                fill="none"
                stroke={status.ring}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                initial={{ strokeDashoffset: CIRC }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            {/* Score number in centre */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: status.color, lineHeight: 1 }}>
                {animScore}
              </span>
              <span style={{ fontSize: 9, color: "var(--text-3)", fontWeight: 600, marginTop: 2 }}>
                /100
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg"
                style={{ background: status.bg, color: status.color }}>
                {status.label}
              </span>
              <Info className="w-3 h-3" style={{ color: "var(--text-3)" }} />
            </div>
            <p className="font-bold text-sm mb-1" style={{ color: "var(--text-1)" }}>
              Crop Health Score
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
              {status.description}
            </p>
            <p className="text-xs mt-1.5 font-medium" style={{ color: status.color }}>
              Tap to see what's affecting it →
            </p>
          </div>
        </div>

        {/* Mini factor dots */}
        {factors.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {factors.slice(0, 5).map((f, i) => (
              <span key={i}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: f.impact === "positive" ? "#dcfce7"
                    : f.impact === "negative" ? "#fee2e2" : "#fef3c7",
                  color: f.impact === "positive" ? "#15803d"
                    : f.impact === "negative" ? "#b91c1c" : "#92400e",
                  fontSize: 10,
                }}>
                {f.impact === "positive" ? "↑" : f.impact === "negative" ? "↓" : "·"} {f.label}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Expanded breakdown modal */}
      <AnimatePresence>
        {expanded && (
          <div className="modal-overlay" onClick={() => setExpanded(false)}>
            <motion.div
              className="modal-sheet glass"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 40,  scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={e => e.stopPropagation()}>
              <div className="p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="display text-xl font-bold" style={{ color: "var(--text-1)" }}>
                    Health Breakdown
                  </h2>
                  <button onClick={() => setExpanded(false)}
                    className="btn-ghost w-8 h-8 !p-0 rounded-xl flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Big ring */}
                <div className="flex flex-col items-center mb-6">
                  <div style={{ position: "relative", width: 140, height: 140 }}>
                    <svg width="140" height="140" viewBox="0 0 100 100"
                      style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="50" cy="50" r={R}
                        fill="none" stroke={status.trackColor} strokeWidth="7" />
                      <motion.circle
                        cx="50" cy="50" r={R}
                        fill="none" stroke={status.ring} strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={CIRC}
                        initial={{ strokeDashoffset: CIRC }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                      />
                    </svg>
                    <div style={{
                      position: "absolute", inset: 0,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: 36, fontWeight: 900, color: status.color, lineHeight: 1 }}>
                        {animScore}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600 }}>/100</span>
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-xl"
                      style={{ background: status.bg, color: status.color }}>
                      {status.icon === "leaf"   && <Leaf className="w-3.5 h-3.5" />}
                      {status.icon === "warn"   && <AlertTriangle className="w-3.5 h-3.5" />}
                      {status.icon === "shield" && <ShieldAlert className="w-3.5 h-3.5" />}
                      {status.label}
                    </span>
                    <p className="text-xs mt-2" style={{ color: "var(--text-3)" }}>
                      {status.description}
                    </p>
                  </div>
                </div>

                {/* Score legend */}
                <div className="flex gap-2 mb-5">
                  {[
                    { label: "Healthy",  range: "70–100", color: "#22c55e", bg: "#dcfce7" },
                    { label: "Watch",    range: "45–69",  color: "#f59e0b", bg: "#fef3c7" },
                    { label: "At Risk",  range: "0–44",   color: "#ef4444", bg: "#fee2e2" },
                  ].map(l => (
                    <div key={l.label} className="flex-1 rounded-xl p-2 text-center"
                      style={{ background: l.bg }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: l.color }}>{l.label}</p>
                      <p style={{ fontSize: 9, color: l.color, opacity: 0.8 }}>{l.range}</p>
                    </div>
                  ))}
                </div>

                {/* Factors */}
                <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: "var(--text-3)" }}>
                  Factors affecting your score
                </p>
                <div className="space-y-2">
                  {factors.map((f, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{
                        background: f.impact === "positive" ? "#f0fdf4"
                          : f.impact === "negative" ? "#fef2f2" : "#fffbeb",
                        border: `1px solid ${
                          f.impact === "positive" ? "#bbf7d0"
                          : f.impact === "negative" ? "#fecaca" : "#fde68a"}`,
                      }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: f.impact === "positive" ? "#dcfce7"
                            : f.impact === "negative" ? "#fee2e2" : "#fef3c7",
                        }}>
                        {f.impact === "positive" && <TrendingUp   className="w-3 h-3" style={{ color: "#16a34a" }} />}
                        {f.impact === "negative" && <AlertTriangle className="w-3 h-3" style={{ color: "#dc2626" }} />}
                        {f.impact === "neutral"  && <Droplets      className="w-3 h-3" style={{ color: "#d97706" }} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold" style={{
                          color: f.impact === "positive" ? "#15803d"
                            : f.impact === "negative" ? "#b91c1c" : "#92400e",
                        }}>
                          {f.label}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-3)" }}>{f.detail}</p>
                      </div>
                      <span className="text-sm font-bold"
                        style={{ color: f.impact === "positive" ? "#16a34a" : f.impact === "negative" ? "#dc2626" : "#d97706" }}>
                        {f.impact === "positive" ? "▲" : f.impact === "negative" ? "▼" : "●"}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {factors.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>
                      Run a yield prediction to get a more accurate score.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
