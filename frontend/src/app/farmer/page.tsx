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
  { href: "/farmer/yield-predictor", icon: TrendingUp, title: "Yield Predictor", desc: "ML crop forecast", color: "#16a34a", bg: "#dcfce7" },
  { href: "/farmer/fair-price", icon: ShieldCheck, title: "Fair Price", desc: "Anomaly detection", color: "#f59e0b", bg: "#fef3c7" },
  { href: "/farmer/coach", icon: MessageSquare, title: "AI Coach", desc: "Groq negotiation", color: "#3b82f6", bg: "#dbeafe" },
  { href: "/farmer/proposals", icon: Users, title: "Proposals", desc: "Investor pitches", color: "#8b5cf6", bg: "#ede9fe" },
];

const prices = [
  { name: "Wheat", price: "₹2,200", delta: "+2.3%", up: true },
  { name: "Rice", price: "₹2,800", delta: "+1.1%", up: true },
  { name: "Cotton", price: "₹6,500", delta: "+3.2%", up: true },
  { name: "Onion", price: "₹1,500", delta: "−1.2%", up: false },
];

export default function FarmerHome() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.push("/login"); }, [isAuthenticated]);

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }} className="pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 page">

        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 mb-5 flex items-center justify-between"
          style={{ background: "var(--green)", boxShadow: "0 8px 32px rgba(22,163,74,0.2)" }}>
          <div>
            <p className="text-green-100 text-xs font-medium mb-0.5">
              {user?.state?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </p>
            <h2 className="font-display text-2xl text-white" style={{ letterSpacing: "-0.02em" }}>
              Hello, {user?.name?.split(" ")[0]} 👋
            </h2>
          </div>
          <div className="text-right">
            <p className="text-green-200 text-xs">Role</p>
            <p className="text-white font-semibold capitalize">{user?.role}</p>
          </div>
        </motion.div>

        {/* Price strip */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
          {prices.map((p) => (
            <div key={p.name} className="flex-shrink-0 card px-4 py-3 !rounded-xl">
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-3)" }}>{p.name}</p>
              <p className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{p.price}</p>
              <p className="text-xs font-medium" style={{ color: p.up ? "var(--green)" : "var(--red)" }}>{p.delta}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((a, i) => (
            <motion.div key={a.href}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} whileHover={{ y: -2 }}>
              <Link href={a.href}>
                <div className="card p-5 hover:shadow-card-hover transition-all duration-200 cursor-pointer">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: a.bg }}>
                    <a.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18, color: a.color }} />
                  </div>
                  <h4 className="font-semibold text-sm mb-0.5" style={{ color: "var(--text-1)" }}>{a.title}</h4>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>{a.desc}</p>
                  <ArrowRight className="w-3.5 h-3.5 mt-3" style={{ color: "var(--text-3)" }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Status */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="card p-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
              System Status
            </span>
          </div>
          <div className="flex gap-3">
            {[["ML Model", "green"], ["Weather API", "green"], ["Groq AI", "green"]].map(([s, c]) => (
              <span key={s} className="badge badge-green text-xs">{s}</span>
            ))}
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
