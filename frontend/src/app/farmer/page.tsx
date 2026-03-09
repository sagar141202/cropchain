"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { TrendingUp, ShieldCheck, MessageSquare, Users, ArrowRight, Leaf, Sprout } from "lucide-react";
import Link from "next/link";

const actions = [
  { href:"/farmer/yield-predictor", icon:TrendingUp,    title:"Yield Predictor",   desc:"ML crop forecast",      color:"#22c55e", bg:"#dcfce7" },
  { href:"/farmer/fair-price",      icon:ShieldCheck,   title:"Fair Price Radar",  desc:"Anomaly detection",     color:"#f59e0b", bg:"#fef3c7" },
  { href:"/farmer/coach",           icon:MessageSquare, title:"AI Coach",          desc:"Negotiation + pitches", color:"#6366f1", bg:"#e0e7ff" },
  { href:"/farmer/proposals",       icon:Users,         title:"My Proposals",      desc:"Investor pitches",      color:"#ec4899", bg:"#fce7f3" },
];
const PRICES = [
  { crop:"Wheat",  price:"₹2,200", change:"+2.3%", up:true  },
  { crop:"Rice",   price:"₹2,800", change:"+1.1%", up:true  },
  { crop:"Cotton", price:"₹6,500", change:"+3.2%", up:true  },
  { crop:"Onion",  price:"₹1,500", change:"-1.2%", up:false },
  { crop:"Maize",  price:"₹1,900", change:"+0.8%", up:true  },
];

export default function FarmerHome() {
  const { user, isAuthenticated, hydrated } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (hydrated && !isAuthenticated) router.push("/login"); }, [hydrated, isAuthenticated]);
  if (!hydrated) return null;

  return (
    <div className="min-h-screen pb-24 page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Hero card */}
        <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
          className="rounded-3xl p-6 mb-6 relative overflow-hidden"
          style={{ background:"linear-gradient(135deg,#16a34a,#15803d,#166534)", color:"white" }}>
          <div style={{
            position:"absolute", top:-30, right:-30,
            width:160, height:160, borderRadius:"50%",
            background:"rgba(255,255,255,0.07)"
          }} />
          <div style={{
            position:"absolute", bottom:-20, left:-20,
            width:100, height:100, borderRadius:"50%",
            background:"rgba(255,255,255,0.05)"
          }} />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background:"rgba(255,255,255,0.2)" }}>
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs" style={{ opacity:0.7 }}>Good day,</p>
                <h2 className="text-2xl font-bold display">{user?.name?.split(" ")[0] || "Farmer"}</h2>
              </div>
            </div>
            <p className="text-xs mb-5" style={{ opacity:0.6 }}>
              {user?.state?.replace(/_/g," ")?.replace(/\b\w/g,l=>l.toUpperCase()) || "India"} · Farmer
            </p>
            {/* Price pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {PRICES.map(p => (
                <div key={p.crop} className="flex-shrink-0 rounded-2xl px-3 py-2 text-center"
                  style={{ background:"rgba(255,255,255,0.15)", minWidth:70 }}>
                  <p className="text-xs mb-0.5" style={{ opacity:0.75 }}>{p.crop}</p>
                  <p className="font-bold text-sm">{p.price}</p>
                  <p className={`text-xs font-semibold ${p.up ? "text-green-200":"text-red-300"}`}>{p.change}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:"var(--text-3)" }}>
          Quick Actions
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {actions.map((a,i) => (
            <motion.div key={a.href} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}>
              <Link href={a.href}>
                <div className="glass rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background:a.bg }}>
                    <a.icon className="w-5 h-5" style={{ color:a.color }} />
                  </div>
                  <h4 className="font-semibold text-sm mb-0.5" style={{ color:"var(--text-1)" }}>{a.title}</h4>
                  <p className="text-xs" style={{ color:"var(--text-3)" }}>{a.desc}</p>
                  <ArrowRight className="w-3.5 h-3.5 mt-3 group-hover:translate-x-1 transition-transform"
                    style={{ color:"var(--text-3)" }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
          className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold" style={{ color:"var(--text-2)" }}>All Systems Online</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[{label:"ML Model",status:"Online"},{label:"Weather API",status:"Live"},{label:"Groq AI",status:"Active"}].map(s=>(
              <div key={s.label} className="text-center rounded-xl py-2"
                style={{ background:"var(--glass2)", border:"1px solid var(--glass-border)" }}>
                <p className="text-xs mb-1" style={{ color:"var(--text-3)" }}>{s.label}</p>
                <span className="badge badge-green">{s.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
