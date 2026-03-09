"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CROPS } from "@/utils/cropConstants";
import { Sprout, Ruler, Bell, ChevronRight, ChevronLeft, Check, X } from "lucide-react";

interface OnboardingProps {
  role: "farmer" | "investor";
  onComplete: (data: { crops?: string[]; farmSize?: string; notifications?: boolean }) => void;
  onSkip: () => void;
}

const steps = [
  { id: 0, icon: Sprout,       title: "What do you grow?",       subtitle: "Select all crops you cultivate",      color: "#22c55e", bg: "#dcfce7" },
  { id: 1, icon: Ruler,        title: "How big is your farm?",   subtitle: "Helps us give better predictions",    color: "#6366f1", bg: "#e0e7ff" },
  { id: 2, icon: Bell,         title: "Stay in the loop",        subtitle: "Get price alerts & seasonal tips",    color: "#f59e0b", bg: "#fef3c7" },
];

const investorSteps = [
  { id: 0, icon: Sprout,       title: "Which crops interest you?", subtitle: "We'll show relevant proposals first", color: "#22c55e", bg: "#dcfce7" },
  { id: 1, icon: Ruler,        title: "Investment range",          subtitle: "How much do you plan to invest?",     color: "#6366f1", bg: "#e0e7ff" },
  { id: 2, icon: Bell,         title: "Stay in the loop",          subtitle: "Get alerts when new proposals drop",  color: "#f59e0b", bg: "#fef3c7" },
];

const FARM_SIZES = [
  { value: "small",  label: "Small",  desc: "Under 2 acres",    icon: "🌱" },
  { value: "medium", label: "Medium", desc: "2 – 10 acres",     icon: "🌾" },
  { value: "large",  label: "Large",  desc: "10 – 50 acres",    icon: "🚜" },
  { value: "xlarge", label: "Big Farm",desc: "50+ acres",       icon: "🏡" },
];

const INVEST_RANGES = [
  { value: "small",  label: "₹1K – ₹10K",   icon: "💰" },
  { value: "medium", label: "₹10K – ₹50K",  icon: "💵" },
  { value: "large",  label: "₹50K – ₹2L",   icon: "💎" },
  { value: "xlarge", label: "₹2L+",          icon: "🏦" },
];

export default function Onboarding({ role, onComplete, onSkip }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [farmSize, setFarmSize] = useState("");
  const [notifications, setNotifications] = useState(true);

  const stepsData = role === "investor" ? investorSteps : steps;
  const totalSteps = stepsData.length;
  const current = stepsData[step];

  const goNext = () => {
    if (step < totalSteps - 1) { setDirection(1); setStep(s => s + 1); }
    else finish();
  };
  const goPrev = () => { if (step > 0) { setDirection(-1); setStep(s => s - 1); } };

  const finish = () => {
    onComplete({ crops: selectedCrops, farmSize, notifications });
  };

  const toggleCrop = (v: string) =>
    setSelectedCrops(p => p.includes(v) ? p.filter(c => c !== v) : [...p, v]);

  const canProceed = () => {
    if (step === 0) return selectedCrops.length > 0;
    if (step === 1) return farmSize !== "";
    return true;
  };

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="modal-overlay" style={{ alignItems: "center", padding: 24 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="glass w-full max-w-sm rounded-3xl overflow-hidden"
        style={{ maxHeight: "88vh" }}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            {/* Step dots */}
            <div className="flex gap-1.5">
              {stepsData.map((_, i) => (
                <div key={i} className="rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 20 : 6,
                    height: 6,
                    background: i === step ? current.color : "var(--glass-border)",
                  }} />
              ))}
            </div>
            <button onClick={onSkip}
              className="btn-ghost w-7 h-7 !p-0 rounded-xl flex items-center justify-center text-xs"
              style={{ color: "var(--text-3)" }}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step icon + title */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step}
              custom={direction}
              variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: current.bg }}>
                <current.icon className="w-6 h-6" style={{ color: current.color }} />
              </div>
              <h2 className="display text-2xl font-bold mb-1" style={{ color: "var(--text-1)" }}>
                {current.title}
              </h2>
              <p className="text-sm" style={{ color: "var(--text-3)" }}>{current.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step content */}
        <div className="px-6 pb-2" style={{ maxHeight: 320, overflowY: "auto" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={`content-${step}`}
              custom={direction}
              variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}>

              {/* Step 0 — crop selector */}
              {step === 0 && (
                <div className="grid grid-cols-3 gap-2 py-2">
                  {CROPS.map(c => {
                    const active = selectedCrops.includes(c.value);
                    return (
                      <button key={c.value} onClick={() => toggleCrop(c.value)}
                        className="rounded-2xl p-3 text-center transition-all duration-150"
                        style={{
                          background: active ? current.bg : "var(--glass2)",
                          border: `1.5px solid ${active ? current.color : "var(--glass-border)"}`,
                          transform: active ? "scale(1.04)" : "scale(1)",
                        }}>
                        <p className="text-xs font-semibold" style={{ color: active ? current.color : "var(--text-2)" }}>
                          {c.label}
                        </p>
                        {active && (
                          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center mx-auto mt-1"
                            style={{ background: current.color }}>
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 1 — farm size or invest range */}
              {step === 1 && (
                <div className="space-y-2 py-2">
                  {(role === "investor" ? INVEST_RANGES : FARM_SIZES).map(s => {
                    const active = farmSize === s.value;
                    return (
                      <button key={s.value} onClick={() => setFarmSize(s.value)}
                        className="w-full rounded-2xl px-4 py-3 flex items-center gap-3 transition-all"
                        style={{
                          background: active ? current.bg : "var(--glass2)",
                          border: `1.5px solid ${active ? current.color : "var(--glass-border)"}`,
                        }}>
                        <span className="text-xl">{s.icon}</span>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-sm" style={{ color: active ? current.color : "var(--text-1)" }}>
                            {s.label}
                          </p>
                          {"desc" in s && (
                            <p className="text-xs" style={{ color: "var(--text-3)" }}>{(s as any).desc}</p>
                          )}
                        </div>
                        {active && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: current.color }}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 2 — notifications */}
              {step === 2 && (
                <div className="space-y-3 py-2">
                  {[
                    { key: true,  label: "Yes, keep me updated",  desc: "Price alerts, seasonal tips, proposal updates", icon: "🔔" },
                    { key: false, label: "Not right now",          desc: "You can enable this later in profile",          icon: "🔕" },
                  ].map(opt => {
                    const active = notifications === opt.key;
                    return (
                      <button key={String(opt.key)} onClick={() => setNotifications(opt.key)}
                        className="w-full rounded-2xl px-4 py-4 flex items-center gap-3 transition-all"
                        style={{
                          background: active ? current.bg : "var(--glass2)",
                          border: `1.5px solid ${active ? current.color : "var(--glass-border)"}`,
                        }}>
                        <span className="text-2xl">{opt.icon}</span>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-sm" style={{ color: active ? current.color : "var(--text-1)" }}>
                            {opt.label}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{opt.desc}</p>
                        </div>
                        {active && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: current.color }}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-5 flex gap-3">
          {step > 0 && (
            <button onClick={goPrev} className="btn btn-ghost !px-4">
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={goNext}
            disabled={!canProceed()}
            className="btn btn-green flex-1"
            style={{ opacity: canProceed() ? 1 : 0.4 }}>
            {step === totalSteps - 1 ? (
              <><Check className="w-4 h-4" /> All done!</>
            ) : (
              <>Continue <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
