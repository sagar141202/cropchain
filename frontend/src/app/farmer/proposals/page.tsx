"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { proposalsAPI } from "@/api/proposals";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import EmptyState from "@/components/ui/EmptyState";
import { formatINR } from "@/utils/formatCurrency";
import { Plus, Trash2, Share2, FileText } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function FarmerProposals() {
  const { isAuthenticated, hydrated } = useAuthStore();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (hydrated && !isAuthenticated) { router.push("/login"); return; }
    if (!isAuthenticated) return;
    proposalsAPI.getMyProposals()
      .then(setProposals).catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  }, [hydrated, isAuthenticated]);

  const publish = async (id: string) => {
    try {
      await proposalsAPI.publish(id);
      setProposals(p => p.map(x => x.id === id || x._id === id ? { ...x, status: "open" } : x));
      toast.success("Published!");
    } catch { toast.error("Publish failed"); }
  };

  const remove = async (id: string) => {
    try {
      await proposalsAPI.delete(id);
      setProposals(p => p.filter(x => x.id !== id && x._id !== id));
      toast.success("Deleted");
    } catch { toast.error("Delete failed"); }
  };

  if (!hydrated) return null;

  return (
    <div className="min-h-screen pb-24 page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="display text-2xl font-bold" style={{ color: "var(--text-1)" }}>My Proposals</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
              {proposals.length} proposal{proposals.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/farmer/coach">
            <button className="btn btn-green !px-4 !py-2 text-xs flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> New Pitch
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                <div className="h-4 rounded-lg mb-2" style={{ background: "var(--glass2)", width: "55%" }} />
                <div className="h-3 rounded-lg mb-4" style={{ background: "var(--glass2)", width: "35%" }} />
                <div className="h-8 rounded-xl" style={{ background: "var(--glass2)" }} />
              </div>
            ))}
          </div>
        ) : proposals.length === 0 ? (
          <EmptyState
            type="farmer-proposals"
            title="No proposals yet"
            subtitle="Use the AI Coach to generate your first investor pitch. It only takes 30 seconds!"
            action={{ label: "Create my first pitch →", onClick: () => router.push("/farmer/coach") }}
          />
        ) : (
          <div className="space-y-3">
            {proposals.map((p, i) => {
              const id = p.id || p._id;
              const isDraft = p.status === "draft" || !p.status;
              return (
                <motion.div key={id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{p.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${isDraft ? "badge-amber" : "badge-green"}`}>
                          {isDraft ? "Draft" : "Published"}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-3)" }}>
                          {p.crop_name} · {p.area_acres} acres
                        </span>
                      </div>
                    </div>
                    <button onClick={() => remove(id)}
                      className="btn-ghost w-7 h-7 !p-0 rounded-lg flex items-center justify-center"
                      style={{ color: "#ef4444" }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divider" />

                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <p className="text-xs" style={{ color: "var(--text-3)" }}>Asking</p>
                      <p className="font-bold text-sm" style={{ color: "var(--green-dark)" }}>
                        {formatINR(p.amount_requested)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: "var(--text-3)" }}>ROI</p>
                      <p className="font-bold text-sm" style={{ color: "var(--text-1)" }}>{p.roi_percent}%</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: "var(--text-3)" }}>Yield</p>
                      <p className="font-bold text-sm" style={{ color: "var(--text-1)" }}>{p.expected_yield} qtl</p>
                    </div>
                  </div>

                  {isDraft && (
                    <button className="btn btn-green w-full text-xs" onClick={() => publish(id)}>
                      <Share2 className="w-3.5 h-3.5" /> Publish to Investors
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
