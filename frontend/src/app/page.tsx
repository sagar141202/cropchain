"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";

const TICKER_ITEMS = [
  "WHEAT ₹2,200/qtl ▲2.3%", "RICE ₹2,800/qtl ▲1.1%", "MAIZE ₹1,800/qtl ▼0.5%",
  "COTTON ₹6,500/qtl ▲3.2%", "SOYBEAN ₹4,200/qtl ▲0.8%", "MUSTARD ₹5,200/qtl ▲1.5%",
  "TURMERIC ₹8,500/qtl ▲4.1%", "CHILLI ₹9,000/qtl ▲2.7%", "ONION ₹1,500/qtl ▼1.2%",
];

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.1,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.05 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

function CountUp({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <>{count}{suffix}</>;
}

const features = [
  {
    id: "01", title: "Yield Intelligence", tag: "LinearRegression ML",
    desc: "Weather-calibrated yield forecasting using Open-Meteo atmospheric data + soil matrix analysis",
    metric: "±15% confidence band", color: "#00ff88",
  },
  {
    id: "02", title: "Price Anomaly Radar", tag: "IsolationForest",
    desc: "Real-time exploitation detection against live Agmarknet modal prices across 14 crop types",
    metric: "76% detection accuracy", color: "#f5c842",
  },
  {
    id: "03", title: "Negotiation AI", tag: "Groq Llama 3.3 70B",
    desc: "Multilingual investor pitches generated in Hindi, Telugu, Kannada, Tamil, Marathi, English",
    metric: "6 Indian languages", color: "#60a5fa",
  },
  {
    id: "04", title: "Investor Marketplace", tag: "DeFi Layer",
    desc: "ML-verified proposals connect farmers directly to urban capital — no middlemen",
    metric: "₹0 platform fee", color: "#c084fc",
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="min-h-screen bg-void relative">
      <Navbar />

      {/* Ticker */}
      <div className="border-b border-[rgba(0,255,136,0.1)] bg-[rgba(0,255,136,0.02)] py-2 overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="font-mono text-xs text-[#5a7a5a] px-6">
                {item.includes("▲")
                  ? <><span className="text-[#00ff88]">{item.split("▲")[0]}▲</span>{item.split("▲")[1]}</>
                  : <><span className="text-[#ff6b6b]">{item.split("▼")[0]}▼</span>{item.split("▼")[1]}</>
                }
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleField />

        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Center glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)" }} />
        </div>

        <motion.div style={{ y: heroY }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 border border-[rgba(0,255,136,0.3)] bg-[rgba(0,255,136,0.05)] rounded-full px-4 py-2 text-xs font-mono text-[#00ff88] mb-8 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
              LIVE MARKET INTELLIGENCE · 14 CROPS · 6 LANGUAGES
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-display leading-[0.9] mb-6"
          >
            <span className="text-[#e8f5e8]">The Intelligence</span>
            <br />
            <em className="text-glow-green not-italic">Layer</em>
            <span className="text-[#e8f5e8]"> for</span>
            <br />
            <span className="text-glow-gold">Indian Farming</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#5a7a5a] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            ML-verified yield predictions · IsolationForest price protection ·
            Groq-powered negotiation coaching · Direct investor access
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register">
              <button className="btn-glow text-base px-8 py-4">
                Start as Farmer →
              </button>
            </Link>
            <Link href="/register">
              <button className="btn-ghost text-base px-8 py-4">
                Invest in Farms
              </button>
            </Link>
          </motion.div>

          {/* Live stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-8 mt-16 pt-8 border-t border-[rgba(0,255,136,0.08)]"
          >
            {[
              { label: "Crops Tracked", end: 14, suffix: "" },
              { label: "ML Accuracy", end: 99, suffix: "%" },
              { label: "Languages", end: 6, suffix: "" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-display text-glow-green font-bold">
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <div className="text-xs text-[#5a7a5a] font-mono uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-[rgba(0,255,136,0.4)]" />
          <div className="w-1 h-1 rounded-full bg-[#00ff88]" />
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs text-[#5a7a5a] tracking-widest uppercase mb-3">Intelligence Stack</p>
          <h2 className="text-4xl md:text-5xl font-display text-[#e8f5e8]">
            Four systems. <em className="text-glow-green">One platform.</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass p-8 group cursor-default relative overflow-hidden scanlines"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle, ${f.color}15 0%, transparent 70%)`, transform: "translate(30%,-30%)" }} />

              <div className="flex items-start justify-between mb-6">
                <span className="font-mono text-4xl font-bold opacity-10 text-[#e8f5e8]">{f.id}</span>
                <span className="badge-glow-green" style={{ color: f.color, borderColor: `${f.color}40`, background: `${f.color}10` }}>
                  {f.tag}
                </span>
              </div>

              <h3 className="text-2xl font-display mb-3" style={{ color: f.color }}>{f.title}</h3>
              <p className="text-[#5a7a5a] text-sm leading-relaxed mb-6">{f.desc}</p>

              <div className="flex items-center gap-2 font-mono text-xs text-[#5a7a5a] border-t border-[rgba(255,255,255,0.05)] pt-4">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: f.color }} />
                {f.metric}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(0,255,136,0.08) 0%, rgba(245,200,66,0.05) 100%)",
            border: "1px solid rgba(0,255,136,0.2)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(0,255,136,0.06) 0%, transparent 70%)" }} />
          <h2 className="text-4xl md:text-5xl font-display text-[#e8f5e8] mb-4 relative z-10">
            Ready to <em className="text-glow-green">grow smarter</em>?
          </h2>
          <p className="text-[#5a7a5a] mb-8 relative z-10">Join thousands of Indian farmers using AI to maximize their harvest value</p>
          <Link href="/register">
            <button className="btn-glow text-base px-10 py-4 relative z-10">
              Get Started Free →
            </button>
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-[rgba(0,255,136,0.08)] py-8 text-center">
        <p className="font-mono text-xs text-[#5a7a5a] tracking-wider">
          © 2024 CROPCHAIN · BUILT BY SAGAR MADDI · NIT KURUKSHETRA · ECE
        </p>
      </footer>
    </div>
  );
}
