"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { TrendingUp, ShieldCheck, MessageSquare, Users, ArrowRight, Sprout, Check } from "lucide-react";

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const features = [
  { icon: TrendingUp, color: "#16a34a", bg: "#dcfce7", title: "Yield Predictor", desc: "ML-verified forecasts using weather, soil & crop data", tag: "LinearRegression" },
  { icon: ShieldCheck, color: "#f59e0b", bg: "#fef3c7", title: "Fair Price Radar", desc: "Catch middleman exploitation with anomaly detection", tag: "IsolationForest" },
  { icon: MessageSquare, color: "#3b82f6", bg: "#dbeafe", title: "Negotiation Coach", desc: "Investor pitches in Hindi, Telugu, Kannada & more", tag: "Groq Llama 3.3" },
  { icon: Users, color: "#8b5cf6", bg: "#ede9fe", title: "Investor Market", desc: "Publish ML-verified proposals, get funded directly", tag: "DeFi Layer" },
];

const crops = ["Wheat ₹2,200", "Rice ₹2,800", "Cotton ₹6,500", "Mustard ₹5,200", "Soybean ₹4,200", "Turmeric ₹8,500"];

export default function Landing() {
  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <motion.div variants={stagger} initial="initial" animate="animate">
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
              style={{ background: "var(--green-light)", color: "var(--green-dark)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live market data · 14 crops · 6 languages
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp}
            className="font-display text-5xl md:text-7xl leading-tight mb-6"
            style={{ color: "var(--text-1)", letterSpacing: "-0.03em" }}>
            Smart farming
            <br />
            <em style={{ color: "var(--green)", fontStyle: "italic" }}>starts here.</em>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg max-w-xl mx-auto mb-10"
            style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
            CropChain gives Indian farmers ML-verified yield predictions,
            fair price protection, and direct investor access — in their own language.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <button className="btn btn-primary text-base !px-7 !py-3">
                Start as Farmer <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/register">
              <button className="btn btn-ghost text-base !px-7 !py-3">
                Join as Investor
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Live price pills */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mt-14">
          {crops.map((c) => (
            <span key={c} className="text-xs font-medium px-3 py-1.5 rounded-full"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
              {c}<span className="ml-1" style={{ color: "var(--green)" }}>/qtl</span>
            </span>
          ))}
        </motion.div>
      </section>

      {/* Stats strip */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="rounded-xl p-6 grid grid-cols-3 gap-4 text-center"
          style={{ background: "var(--green)", boxShadow: "0 8px 32px rgba(22,163,74,0.2)" }}>
          {[["14+", "Crops"], ["6", "Languages"], ["99%", "Accuracy"]].map(([v, l]) => (
            <div key={l}>
              <div className="font-display text-3xl font-semibold text-white mb-0.5">{v}</div>
              <div className="text-sm text-green-100">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl mb-3" style={{ color: "var(--text-1)", letterSpacing: "-0.02em" }}>
            Everything a farmer needs
          </h2>
          <p className="text-base" style={{ color: "var(--text-2)" }}>Four AI-powered tools in one platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
              className="card p-6 transition-all duration-200 cursor-default">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: f.bg }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <span className="badge" style={{ background: f.bg, color: f.color }}>{f.tag}</span>
              </div>
              <h3 className="font-semibold text-base mb-1.5" style={{ color: "var(--text-1)" }}>{f.title}</h3>
              <p className="text-sm" style={{ color: "var(--text-2)", lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="card p-10 text-center" style={{ background: "var(--surface)" }}>
          <h2 className="font-display text-3xl mb-3" style={{ color: "var(--text-1)", letterSpacing: "-0.02em" }}>
            Ready to grow smarter?
          </h2>
          <p className="mb-7" style={{ color: "var(--text-2)" }}>Join farmers using AI to protect and grow their income</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register"><button className="btn btn-primary !px-8 !py-3 text-base">Get started free</button></Link>
            <Link href="/login"><button className="btn btn-secondary !px-8 !py-3 text-base">Sign in</button></Link>
          </div>
          <div className="flex items-center justify-center gap-5 mt-7">
            {["Free forever", "No credit card", "6 languages"].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-2)" }}>
                <Check className="w-3.5 h-3.5" style={{ color: "var(--green)" }} /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-sm" style={{ color: "var(--text-3)", borderTop: "1px solid var(--border)" }}>
        © 2024 CropChain · Built by Sagar Maddi, NIT Kurukshetra
      </footer>
    </div>
  );
}
