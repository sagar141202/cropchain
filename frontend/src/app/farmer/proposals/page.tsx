"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { proposalsAPI } from "@/api/proposals";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { formatINR } from "@/utils/formatCurrency";
import { FileText, Share2, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function FarmerProposals() {
  const { isAuthenticated, hydrated } = useAuthStore();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hydrated && !isAuthenticated) { router.push("/login"); return; }
    if (isAuthenticated) proposalsAPI.getMyProposals().then(setProposals).catch(()=>toast.error("Failed")).finally(()=>setLoading(false));
  }, [hydrated, isAuthenticated]);
  if (!hydrated) return null;

  const publish = async (id:string) => {
    try { await proposalsAPI.publish(id); toast.success("Published!"); setProposals(p=>p.map(x=>x.id===id?{...x,status:"open"}:x)); }
    catch { toast.error("Failed to publish"); }
  };
  const del = async (id:string) => {
    try { await proposalsAPI.delete(id); setProposals(p=>p.filter(x=>x.id!==id)); toast.success("Deleted"); }
    catch { toast.error("Delete failed"); }
  };

  const statusStyle: Record<string,{badge:string}> = {
    draft:  { badge:"badge-amber" },
    open:   { badge:"badge-green" },
    funded: { badge:"badge-blue"  },
  };

  return (
    <div className="min-h-screen pb-24 page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="display text-2xl font-bold" style={{ color:"var(--text-1)" }}>My Proposals</h1>
            <p className="text-sm" style={{ color:"var(--text-3)" }}>Manage your investor pitches</p>
          </div>
          <Link href="/farmer/coach">
            <button className="btn btn-green !py-2 !px-4 text-xs"><Plus className="w-3.5 h-3.5" /> New</button>
          </Link>
        </div>

        {loading ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-sm" style={{ color:"var(--text-3)" }}>Loading…</p>
          </div>
        ) : proposals.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color:"var(--text-3)" }} />
            <p className="font-medium mb-1" style={{ color:"var(--text-2)" }}>No proposals yet</p>
            <p className="text-xs mb-4" style={{ color:"var(--text-3)" }}>Use the AI Coach to generate your first pitch</p>
            <Link href="/farmer/coach"><button className="btn btn-green text-xs">Go to AI Coach</button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.map((p,i) => (
              <motion.div key={p.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
                className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-sm pr-3" style={{ color:"var(--text-1)" }}>{p.title}</h3>
                  <span className={`badge ${statusStyle[p.status]?.badge || "badge-amber"} flex-shrink-0`}>
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold" style={{ color:"var(--green-dark)" }}>{formatINR(p.amount_requested)}</span>
                  <span className="text-xs" style={{ color:"var(--text-3)" }}>·</span>
                  <span className="text-xs" style={{ color:"var(--text-3)" }}>{p.roi_percent}% ROI</span>
                </div>
                <div className="flex gap-2">
                  {p.status === "draft" && (
                    <button className="btn btn-green flex-1 text-xs !py-2" onClick={() => publish(p.id)}>
                      <Share2 className="w-3.5 h-3.5" /> Publish
                    </button>
                  )}
                  <button className="btn btn-ghost !py-2 !px-3 text-xs" onClick={() => del(p.id)}>
                    <Trash2 className="w-3.5 h-3.5" style={{ color:"var(--red)" }} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
