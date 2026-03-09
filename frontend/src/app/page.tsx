"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Leaf, TrendingUp, ShieldCheck, MessageSquare, Users, ArrowRight, Sparkles, Zap } from "lucide-react";

const features = [
  { icon: TrendingUp,    color: "#22c55e", bg: "#dcfce7", title: "Yield Predictor",   desc: "ML-powered forecasts based on soil, weather & crop patterns" },
  { icon: ShieldCheck,   color: "#f59e0b", bg: "#fef3c7", title: "Fair Price Radar",  desc: "Anomaly detection to catch unfair market prices instantly" },
  { icon: MessageSquare, color: "#6366f1", bg: "#e0e7ff", title: "AI Negotiation Coach", desc: "Groq-powered multilingual coach for better deals" },
  { icon: Users,         color: "#ec4899", bg: "#fce7f3", title: "Investor Connect",  desc: "Publish proposals and attract verified investors" },
];

const stats = [
  { value: "14 Crops", label: "Supported" },
  { value: "92%", label: "Yield Accuracy" },
  { value: "6 Languages", label: "AI Coach" },
  { value: "₹0", label: "Platform Fee" },
];

export default function Landing() {
  return (
    <div className="min-h-screen page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-semibold"
            style={{ background: "var(--green-pale)", color: "var(--green-dark)" }}>
            <Sparkles className="w-3 h-3" /> AI-powered • Made for India
          </div>
          <h1 className="display text-5xl font-bold leading-tight mb-4" style={{ color: "var(--text-1)" }}>
            Farm smarter,<br />
            <span className="display-italic" style={{ color: "var(--green-dark)" }}>earn better.</span>
          </h1>
          <p className="text-base mb-8 max-w-sm mx-auto" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
            CropChain gives Indian farmers ML predictions, fair price protection, and direct access to investors — in their language.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/register">
              <button className="btn btn-green gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/login">
              <button className="btn btn-ghost">I already have an account</button>
            </Link>
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4 mb-8">
          <div className="grid grid-cols-4 divide-x" style={{ divideColor: "var(--glass-border)" }}>
            {stats.map(s => (
              <div key={s.label} className="text-center px-2">
                <p className="font-bold text-lg" style={{ color: "var(--text-1)" }}>{s.value}</p>
                <p className="text-xs" style={{ color: "var(--text-3)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <p className="text-xs font-bold uppercase tracking-widest mb-4 text-center" style={{ color: "var(--text-3)" }}>
          Everything you need
        </p>
        <div className="grid grid-cols-2 gap-3 mb-10">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="glass rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: f.bg }}>
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-1)" }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="glass rounded-3xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(99,102,241,0.1))" }}>
          <Zap className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--green-dark)" }} />
          <h2 className="display text-2xl font-bold mb-2" style={{ color: "var(--text-1)" }}>
            Ready to transform your farm?
          </h2>
          <p className="text-sm mb-5" style={{ color: "var(--text-2)" }}>
            Join thousands of farmers already using AI to grow smarter.
          </p>
          <Link href="/register">
            <button className="btn btn-green">Create Free Account</button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
