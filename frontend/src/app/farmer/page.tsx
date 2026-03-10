"use client";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import WeatherWidget from "@/components/ui/WeatherWidget";
import CropHealthScore from "@/components/ui/CropHealthScore";
import PullIndicator from "@/components/ui/PullIndicator";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { TrendingUp, ShieldCheck, MessageSquare, Users, ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";

const actions = [
  { href: "/farmer/yield-predictor", icon: TrendingUp,    title: "Yield Predictor", desc: "ML-powered forecast",  color: "#16a34a", bg: "#dcfce7" },
  { href: "/farmer/fair-price",      icon: ShieldCheck,   title: "Fair Price Radar", desc: "Anomaly detection",   color: "#f59e0b", bg: "#fef9c3" },
  { href: "/farmer/coach",           icon: MessageSquare, title: "AI Coach",         desc: "Groq negotiation AI", color: "#3b82f6", bg: "#dbeafe" },
  { href: "/farmer/proposals",       icon: Users,         title: "My Proposals",     desc: "Investor pitches",    color: "#8b5cf6", bg: "#ede9fe" },
];

const PRICES = [
  { crop: "Wheat",  price: "₹2,200", change: "+2.3%", up: true  },
  { crop: "Rice",   price: "₹2,800", change: "+1.1%", up: true  },
  { crop: "Cotton", price: "₹6,500", change: "+3.2%", up: true  },
  { crop: "Onion",  price: "₹1,500", change: "-1.2%", up: false },
];

export default function FarmerHome() {
  const { user, isAuthenticated, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.push("/login");
  }, [hydrated, isAuthenticated]);

  const handleRefresh = useCallback(async () => {
    await new Promise(r => setTimeout(r, 900));
  }, []);

  const { pulling, refreshing, pullY } = usePullToRefresh({ onRefresh: handleRefresh });

  if (!hydrated) return null;

  const state = user?.state || "maharashtra";

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }} className="pb-20">
      <PullIndicator pullY={pullY} pulling={pulling} refreshing={refreshing} />
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 page">

        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-4 text-white"
          style={{ background: "var(--green)" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs opacity-80">Good day,</p>
              <h2 className="font-display font-bold text-xl">{user?.name?.split(" ")[0] || "Farmer"}</h2>
            </div>
          </div>
          <p className="text-xs opacity-70 mb-4">
            {state?.replace(/_/g, " ")?.replace(/\b\w/g, l => l.toUpperCase())} · Farmer
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {PRICES.map(p => (
              <div key={p.crop} className="flex-shrink-0 rounded-xl px-3 py-2"
                style={{ background: "rgba(255,255,255,0.15)" }}>
                <p className="text-xs opacity-70">{p.crop}</p>
                <p className="font-bold text-sm">{p.price}</p>
                <p className={`text-xs ${p.up ? "text-green-200" : "text-red-200"}`}>{p.change}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live weather */}
        <WeatherWidget state={state} />

        {/* Crop health score */}
        <CropHealthScore state={state} />

        {/* Quick actions */}
        <p className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: "var(--text-3)" }}>Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((a, i) => (
            <motion.div key={a.href}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}>
              <Link href={a.href}>
                <div className="rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all"
                  style={{ background: a.bg }}>
                  <a.icon className="w-6 h-6 mb-3" style={{ color: a.color }} />
                  <h4 className="font-semibold text-sm mb-0.5" style={{ color: "var(--text-1)" }}>{a.title}</h4>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>{a.desc}</p>
                  <ArrowRight className="w-3.5 h-3.5 mt-3" style={{ color: "var(--text-3)" }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
