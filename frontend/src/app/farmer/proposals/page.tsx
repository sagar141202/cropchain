"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { proposalsAPI } from "@/api/proposals";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { formatINR, formatNumber } from "@/utils/formatCurrency";
import { FileText, Plus, Loader2, Globe, Trash2, Check } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function MyProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    proposalsAPI.getMine()
      .then(setProposals)
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handlePublish = async (id: string) => {
    setPublishing(id);
    try {
      await proposalsAPI.publish(id);
      toast.success("Published! Investors can now see this.");
      load();
    } catch { toast.error("Publish failed"); }
    finally { setPublishing(null); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await proposalsAPI.delete(id);
      toast.success("Deleted");
      setProposals(prev => prev.filter(p => p.id !== id));
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(null); }
  };

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }} className="pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 page">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#ede9fe" }}>
              <FileText className="w-5 h-5" style={{ color: "#8b5cf6" }} />
            </div>
            <div>
              <h1 className="font-display text-2xl" style={{ color: "var(--text-1)", letterSpacing: "-0.02em" }}>
                My Proposals
              </h1>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>
                {proposals.filter(p => p.status === "open").length} live · {proposals.filter(p => p.status === "draft").length} drafts
              </p>
            </div>
          </div>
          <Link href="/farmer/coach">
            <button className="btn btn-primary !py-2 !px-4 text-xs">
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "var(--green)" }} />
          </div>
        ) : proposals.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-3)" }} />
            <p className="font-medium text-sm mb-1" style={{ color: "var(--text-2)" }}>No proposals yet</p>
            <p className="text-xs mb-5" style={{ color: "var(--text-3)" }}>
              Generate one using the AI Coach
            </p>
            <Link href="/farmer/coach">
              <button className="btn btn-primary">Generate Proposal</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 mr-3">
                    <h3 className="font-semibold text-base mb-0.5" style={{ color: "var(--text-1)" }}>{p.title}</h3>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>
                      {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`badge flex-shrink-0 capitalize ${
                    p.status === "open" ? "badge-green"
                    : p.status === "funded" ? "badge-green"
                    : "badge-amber"
                  }`}>
                    {p.status === "open" ? "🟢 Live" : p.status === "funded" ? "✅ Funded" : "📝 Draft"}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Asking", value: formatINR(p.amount_requested) },
                    { label: "Yield", value: `${formatNumber(p.expected_yield)} qtl` },
                    { label: "ROI", value: `${p.roi_percent}%` },
                  ].map(s => (
                    <div key={s.label} className="rounded-lg p-2.5 text-center" style={{ background: "var(--surface-2)" }}>
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-3)" }}>{s.label}</p>
                      <p className="font-semibold text-xs" style={{ color: "var(--text-1)" }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Pitch preview */}
                {p.generated_pitch && (
                  <div className="rounded-lg p-3 mb-4" style={{ background: "var(--surface-2)" }}>
                    <p className="text-xs line-clamp-2" style={{ color: "var(--text-3)" }}>{p.generated_pitch}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {p.status === "draft" && (
                    <button onClick={() => handlePublish(p.id)}
                      disabled={publishing === p.id}
                      className="btn btn-primary flex-1 !py-2 text-xs">
                      {publishing === p.id
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Publishing...</>
                        : <><Globe className="w-3.5 h-3.5" />Publish to Investors</>
                      }
                    </button>
                  )}
                  {p.status === "open" && (
                    <div className="flex-1 rounded-lg py-2 px-3 text-xs font-semibold text-center"
                      style={{ background: "#dcfce7", color: "#14532d" }}>
                      <Check className="w-3.5 h-3.5 inline mr-1" />
                      Live — visible to investors
                    </div>
                  )}
                  {p.status !== "funded" && (
                    <button onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="btn btn-secondary !py-2 !px-3">
                      {deleting === p.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
                      }
                    </button>
                  )}
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
