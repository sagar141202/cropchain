"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { LogOut, Mail, Phone, MapPin, Globe, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function InvestorProfile() {
  const { user, isAuthenticated, hydrated, logout } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (hydrated && !isAuthenticated) router.push("/login"); }, [hydrated, isAuthenticated]);
  if (!hydrated || !user) return null;
  const doLogout = () => { logout(); router.push("/"); };
  const fields = [
    { icon: Mail,   label: "Email",    value: user.email },
    { icon: Phone,  label: "Phone",    value: user.phone || "Not set" },
    { icon: MapPin, label: "State",    value: user.state?.replace(/_/g," ")?.replace(/\b\w/g,l=>l.toUpperCase()) || "—" },
    { icon: Globe,  label: "Language", value: user.language || "Hindi" },
  ];
  return (
    <div className="min-h-screen pb-24 page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
          className="glass rounded-3xl p-6 mb-4 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background:"linear-gradient(135deg,#1d4ed8,#1e40af)" }}>
            <BarChart2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="display text-2xl font-bold" style={{ color:"var(--text-1)" }}>{user.name}</h2>
          <p className="text-xs mt-1" style={{ color:"var(--text-3)" }}>Investor · CropChain Member</p>
        </motion.div>
        <div className="glass rounded-2xl p-5 mb-4 space-y-3">
          {fields.map(f => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background:"var(--blue-pale)" }}>
                <f.icon className="w-4 h-4" style={{ color:"var(--blue)" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color:"var(--text-3)" }}>{f.label}</p>
                <p className="text-sm font-medium" style={{ color:"var(--text-1)" }}>{f.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl p-4 mb-4 space-y-2">
          {[{href:"/investor/browse",label:"Browse Proposals"},{href:"/investor/portfolio",label:"My Portfolio"}].map(l=>(
            <Link key={l.href} href={l.href} className="flex items-center justify-between py-2 px-1" style={{ color:"var(--text-1)" }}>
              <span className="text-sm font-medium">{l.label}</span>
              <span style={{ color:"var(--text-3)" }}>›</span>
            </Link>
          ))}
        </div>
        <button className="btn btn-ghost w-full" style={{ color:"var(--red)" }} onClick={doLogout}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
