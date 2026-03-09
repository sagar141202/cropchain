"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { investorAPI } from "@/api/investor";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { formatINR } from "@/utils/formatCurrency";
import { TrendingUp, Users, DollarSign, ArrowRight, BarChart2, Briefcase } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function InvestorHome() {
  const { user, isAuthenticated, hydrated } = useAuthStore();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  useEffect(() => {
    if (hydrated && !isAuthenticated) { router.push("/login"); return; }
    if (isAuthenticated) investorAPI.browseProposals().then(setProposals).catch(() => toast.error("Failed to load"));
  }, [hydrated, isAuthenticated]);
  if (!hydrated) return null;

  return (
    <div className="min-h-screen pb-24 page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Hero */}
        <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
          className="rounded-3xl p-6 mb-6 relative overflow-hidden"
          style={{ background:"linear-gradient(135deg,#1d4ed8,#1e40af,#1e3a8a)", color:"white" }}>
          <div style={{ position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.07)" }} />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background:"rgba(255,255,255,0.2)" }}>
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs" style={{ opacity:0.7 }}>Investor Dashboard</p>
                <h2 className="text-2xl font-bold display">{user?.name?.split(" ")[0] || "Investor"}</h2>
              </div>
            </div>
            <p className="text-xs" style={{ opacity:0.6 }}>Browse ML-verified farm investment opportunities</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label:"Open Deals", value:proposals.length||"—", icon:Users,      color:"#6366f1", bg:"#e0e7ff" },
            { label:"Avg ROI",    value:"18%",                  icon:TrendingUp, color:"#22c55e", bg:"#dcfce7" },
            { label:"Min Invest", value:"₹1K",                  icon:DollarSign, color:"#f59e0b", bg:"#fef3c7" },
          ].map((s,i) => (
            <motion.div key={s.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
              className="glass rounded-2xl p-4 text-center">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background:s.bg }}>
                <s.icon className="w-4 h-4" style={{ color:s.color }} />
              </div>
              <p className="font-bold text-base" style={{ color:"var(--text-1)" }}>{s.value}</p>
              <p className="text-xs" style={{ color:"var(--text-3)" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color:"var(--text-3)" }}>Open Proposals</p>
          <Link href="/investor/browse" className="flex items-center gap-1 text-xs font-semibold"
            style={{ color:"var(--green-dark)" }}>
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {proposals.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Briefcase className="w-10 h-10 mx-auto mb-3" style={{ color:"var(--text-3)" }} />
            <p className="text-sm font-medium" style={{ color:"var(--text-2)" }}>No open proposals yet</p>
            <p className="text-xs mt-1" style={{ color:"var(--text-3)" }}>Farmers will publish soon</p>
          </div>
        ) : proposals.slice(0,3).map((p,i) => (
          <motion.div key={p.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
            className="glass rounded-2xl p-4 mb-3">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-sm pr-2" style={{ color:"var(--text-1)" }}>{p.title}</h4>
              <span className="badge badge-green flex-shrink-0">Open</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ color:"var(--text-3)" }}>Asking</p>
                <p className="font-bold text-sm" style={{ color:"var(--green-dark)" }}>{formatINR(p.amount_requested)}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color:"var(--text-3)" }}>ROI</p>
                <p className="font-bold text-sm" style={{ color:"var(--text-1)" }}>{p.roi_percent}%</p>
              </div>
              <Link href="/investor/browse">
                <button className="btn btn-blue !py-1.5 !px-4 text-xs">Invest</button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
