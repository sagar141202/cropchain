"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { TrendingUp, ShieldCheck, MessageSquare, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const actions = [
  { href: "/farmer/yield-predictor", icon: TrendingUp, title: "Yield Predictor", desc: "ML-powered forecast", color: "#00ff88", glow: "rgba(0,255,136,0.15)" },
  { href: "/farmer/fair-price", icon: ShieldCheck, title: "Fair Price Radar", desc: "Anomaly detection", color: "#f5c842", glow: "rgba(245,200,66,0.15)" },
  { href: "/farmer/coach", icon: MessageSquare, title: "AI Coach", desc: "Groq negotiation AI", color: "#60a5fa", glow: "rgba(96,165,250,0.15)" },
  { href: "/farmer/proposals", icon: Users, title: "My Proposals", desc: "Investor pitches", color: "#c084fc", glow: "rgba(192,132,252,0.15)" },
];

const PRICES = [
  { crop: "Wheat", price: "₹2,200", change: "+2.3%", up: true },
  { crop: "Rice", price: "₹2,800", change: "+1.1%", up: true },
  { crop: "Cotton", price: "₹6,500", change: "+3.2%", up: true },
  { crop: "Onion", price: "₹1,500", change: "-1.2%", up: false },
];

export default function FarmerHome() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.push("/login"); }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-void pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6 mb-6 scanlines"
          style={{ background: "linear-gradient(135deg, rgba(0,255,136,0.08) 0%, rgba(0,255,136,0.02) 100%)", border: "1px solid rgba(0,255,136,0.2)" }}>
          <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(0,255,136,0.1) 0%, transparent 70%)", transform: "translate(30%,-30%)" }} />
          <p className="font-mono text-xs text-[#5a7a5a] tracking-widest uppercase mb-1">Dashboard</p>
          <h2 className="font-display text-3xl text-[#e8f5e8] mb-1">
            Good day, <span className="text-glow-green">{user?.name?.split(" ")[0]}</span>
          </h2>
          <p className="font-mono text-xs text-[#5a7a5a]">
            {user?.state?.replace(/_/g, " ").toUpperCase()} · FARMER
          </p>

          {/* Mini price tickers */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
            {PRICES.map((p) => (
              <div key={p.crop} className="flex-shrink-0 bg-[rgba(0,0,0,0.3)] rounded-xl px-3 py-2 border border-[rgba(255,255,255,0.04)]">
                <p className="font-mono text-[10px] text-[#5a7a5a] uppercase">{p.crop}</p>
                <p className="font-bold text-sm text-[#e8f5e8]">{p.price}</p>
                <p className={`font-mono text-[10px] ${p.up ? "text-[#00ff88]" : "text-[#ff6b6b]"}`}>{p.change}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action grid */}
        <p className="font-mono text-xs text-[#5a7a5a] tracking-widest uppercase mb-4">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((a, i) => (
            <motion.div key={a.href}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} whileHover={{ y: -3, scale: 1.01 }}>
              <Link href={a.href}>
                <div className="relative overflow-hidden rounded-2xl p-5 group cursor-pointer transition-all"
                  style={{ background: a.glow, border: `1px solid ${a.color}25` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle at top right, ${a.glow} 0%, transparent 70%)` }} />
                  <a.icon className="w-6 h-6 mb-3" style={{ color: a.color }} />
                  <h4 className="font-body font-bold text-[#e8f5e8] text-sm mb-0.5">{a.title}</h4>
                  <p className="text-[#5a7a5a] text-xs">{a.desc}</p>
                  <ArrowRight className="w-3.5 h-3.5 text-[#5a7a5a] mt-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* System status */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-6 p-4 rounded-2xl border border-[rgba(0,255,136,0.08)] bg-[rgba(0,255,136,0.02)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="font-mono text-xs text-[#5a7a5a] tracking-wider uppercase">System Status</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "ML Model", status: "Online" },
              { label: "Weather API", status: "Live" },
              { label: "Groq AI", status: "Active" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-mono text-[10px] text-[#5a7a5a] uppercase mb-1">{s.label}</p>
                <span className="badge-glow-green text-[10px]">{s.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
