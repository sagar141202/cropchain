"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { investorAPI } from "@/api/investor";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { formatINR } from "@/utils/formatCurrency";
import { X, TrendingUp, IndianRupee, Percent, FileText, Search, SlidersHorizontal, Check } from "lucide-react";
import toast from "react-hot-toast";

function stripMarkdown(t: string) {
  return t.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s*/g, "").replace(/__(.*?)__/g, "$1").replace(/`(.*?)`/g, "$1").trim();
}

const CROP_FILTERS = [
  { value: "all",       label: "All Crops" },
  { value: "wheat",     label: "Wheat"     },
  { value: "rice",      label: "Rice"      },
  { value: "cotton",    label: "Cotton"    },
  { value: "maize",     label: "Maize"     },
  { value: "sugarcane", label: "Sugarcane" },
  { value: "onion",     label: "Onion"     },
  { value: "soybean",   label: "Soybean"   },
];

const ROI_FILTERS = [
  { value: "all",    label: "Any ROI"  },
  { value: "10",     label: "10%+"     },
  { value: "15",     label: "15%+"     },
  { value: "20",     label: "20%+"     },
  { value: "25",     label: "25%+"     },
];

const AREA_FILTERS = [
  { value: "all",   label: "Any Size"    },
  { value: "small", label: "< 5 acres"  },
  { value: "mid",   label: "5–20 acres" },
  { value: "large", label: "20+ acres"  },
];

export default function InvestorBrowse() {
  const { isAuthenticated, hydrated } = useAuthStore();
  const router = useRouter();

  // Data
  const [proposals, setProposals]     = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Filters
  const [search, setSearch]       = useState("");
  const [cropFilter, setCrop]     = useState("all");
  const [roiFilter, setRoi]       = useState("all");
  const [areaFilter, setArea]     = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Modal
  const [selected, setSelected] = useState<any>(null);
  const [amount, setAmount]     = useState("");
  const [investing, setInvesting] = useState(false);

  const fetchProposals = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await investorAPI.browseProposals();
      setProposals(data);
      setLastUpdated(new Date());
    } catch {
      if (!silent) toast.error("Failed to load proposals");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) { router.push("/login"); return; }
    if (!isAuthenticated) return;
    fetchProposals();
    const t = setInterval(() => fetchProposals(true), 3000);
    return () => clearInterval(t);
  }, [hydrated, isAuthenticated, fetchProposals]);

  // Pure frontend filtering — instant, zero API calls
  const filtered = useMemo(() => {
    return proposals.filter(p => {
      // Search — title, description, crop name, farmer name
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = [p.title, p.description, p.crop_name, p.farmer_name].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Crop filter
      if (cropFilter !== "all" && p.crop_name?.toLowerCase() !== cropFilter) return false;
      // ROI filter
      if (roiFilter !== "all" && (p.roi_percent || 0) < Number(roiFilter)) return false;
      // Area filter
      const acres = p.area_acres || 0;
      if (areaFilter === "small"  && acres >= 5)  return false;
      if (areaFilter === "mid"    && (acres < 5 || acres >= 20)) return false;
      if (areaFilter === "large"  && acres < 20)  return false;
      return true;
    });
  }, [proposals, search, cropFilter, roiFilter, areaFilter]);

  const activeFilterCount = [
    cropFilter !== "all",
    roiFilter  !== "all",
    areaFilter !== "all",
  ].filter(Boolean).length;

  const clearAll = () => { setCrop("all"); setRoi("all"); setArea("all"); setSearch(""); };

  const invest = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      return toast.error("Enter a valid amount");
    setInvesting(true);
    try {
      await investorAPI.invest(selected.id, Number(amount));
      toast.success("Investment submitted! 🎉");
      setSelected(null); setAmount("");
      fetchProposals(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Investment failed");
    } finally { setInvesting(false); }
  };

  if (!hydrated) return null;

  return (
    <div className="min-h-screen pb-24 page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="display text-2xl font-bold" style={{ color: "var(--text-1)" }}>Browse Proposals</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs" style={{ color: "var(--text-3)" }}>Live</span>
          </div>
        </div>
        <p className="text-xs mb-5" style={{ color: "var(--text-3)" }}>
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Loading…"}
        </p>

        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-3)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by crop, farmer, title…"
            style={{
              width: "100%",
              background: "var(--glass2)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--glass-border)",
              borderRadius: 14,
              padding: "10px 40px 10px 38px",
              fontSize: 14,
              color: "var(--text-1)",
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
            }}
            onFocus={e => e.target.style.borderColor = "var(--green)"}
            onBlur={e  => e.target.style.borderColor = "var(--glass-border)"}
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-3)" }}>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter toggle row */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setShowFilters(f => !f)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all"
            style={{
              background: showFilters || activeFilterCount > 0 ? "var(--green-pale)" : "var(--glass2)",
              border: `1px solid ${showFilters || activeFilterCount > 0 ? "var(--green)" : "var(--glass-border)"}`,
              color: showFilters || activeFilterCount > 0 ? "var(--green-dark)" : "var(--text-2)",
            }}>
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full text-white flex items-center justify-center"
                style={{ background: "var(--green-dark)", fontSize: 9, fontWeight: 800 }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Active filter pills */}
          <div className="flex gap-1.5 overflow-x-auto flex-1">
            {cropFilter !== "all" && (
              <span className="badge badge-green flex items-center gap-1 flex-shrink-0 cursor-pointer"
                onClick={() => setCrop("all")}>
                {CROP_FILTERS.find(c => c.value === cropFilter)?.label}
                <X className="w-2.5 h-2.5" />
              </span>
            )}
            {roiFilter !== "all" && (
              <span className="badge badge-blue flex items-center gap-1 flex-shrink-0 cursor-pointer"
                onClick={() => setRoi("all")}>
                ROI {roiFilter}%+
                <X className="w-2.5 h-2.5" />
              </span>
            )}
            {areaFilter !== "all" && (
              <span className="badge badge-amber flex items-center gap-1 flex-shrink-0 cursor-pointer"
                onClick={() => setArea("all")}>
                {AREA_FILTERS.find(a => a.value === areaFilter)?.label}
                <X className="w-2.5 h-2.5" />
              </span>
            )}
            {(activeFilterCount > 0 || search) && (
              <button onClick={clearAll}
                className="text-xs flex-shrink-0 font-semibold"
                style={{ color: "var(--text-3)" }}>
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
              className="mb-4">
              <div className="glass rounded-2xl p-4 space-y-4">

                {/* Crop filter */}
                <div>
                  <p className="field-label mb-2">Crop Type</p>
                  <div className="flex flex-wrap gap-1.5">
                    {CROP_FILTERS.map(c => (
                      <button key={c.value} onClick={() => setCrop(c.value)}
                        className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1"
                        style={{
                          background: cropFilter === c.value ? "var(--green-pale)" : "var(--glass2)",
                          border: `1px solid ${cropFilter === c.value ? "var(--green)" : "var(--glass-border)"}`,
                          color: cropFilter === c.value ? "var(--green-dark)" : "var(--text-2)",
                        }}>
                        {cropFilter === c.value && <Check className="w-2.5 h-2.5" />}
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divider" />

                {/* ROI filter */}
                <div>
                  <p className="field-label mb-2">Minimum ROI</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ROI_FILTERS.map(r => (
                      <button key={r.value} onClick={() => setRoi(r.value)}
                        className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1"
                        style={{
                          background: roiFilter === r.value ? "#e0e7ff" : "var(--glass2)",
                          border: `1px solid ${roiFilter === r.value ? "#6366f1" : "var(--glass-border)"}`,
                          color: roiFilter === r.value ? "#3730a3" : "var(--text-2)",
                        }}>
                        {roiFilter === r.value && <Check className="w-2.5 h-2.5" />}
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divider" />

                {/* Area filter */}
                <div>
                  <p className="field-label mb-2">Farm Size</p>
                  <div className="flex flex-wrap gap-1.5">
                    {AREA_FILTERS.map(a => (
                      <button key={a.value} onClick={() => setArea(a.value)}
                        className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1"
                        style={{
                          background: areaFilter === a.value ? "var(--amber-pale)" : "var(--glass2)",
                          border: `1px solid ${areaFilter === a.value ? "var(--amber)" : "var(--glass-border)"}`,
                          color: areaFilter === a.value ? "#92400e" : "var(--text-2)",
                        }}>
                        {areaFilter === a.value && <Check className="w-2.5 h-2.5" />}
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <p className="text-xs mb-3 font-medium" style={{ color: "var(--text-3)" }}>
          {loading ? "Loading…" : `${filtered.length} proposal${filtered.length !== 1 ? "s" : ""} found`}
          {(activeFilterCount > 0 || search) && filtered.length !== proposals.length &&
            ` (filtered from ${proposals.length})`}
        </p>

        {/* Proposal cards */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                <div className="h-4 rounded-lg mb-3" style={{ background: "var(--glass2)", width: "60%" }} />
                <div className="h-3 rounded-lg mb-4" style={{ background: "var(--glass2)", width: "40%" }} />
                <div className="h-8 rounded-xl" style={{ background: "var(--glass2)" }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass rounded-2xl p-12 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-3)" }} />
            <p className="font-medium mb-1" style={{ color: "var(--text-2)" }}>
              {proposals.length === 0 ? "No open proposals yet" : "No proposals match your filters"}
            </p>
            <p className="text-xs mb-4" style={{ color: "var(--text-3)" }}>
              {proposals.length === 0 ? "Farmers will publish soon — auto-refreshing" : "Try adjusting your search or filters"}
            </p>
            {(activeFilterCount > 0 || search) && (
              <button onClick={clearAll} className="btn btn-ghost text-xs">Clear filters</button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => { setSelected(p); setAmount(""); }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 pr-3">
                    <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-1)" }}>{p.title}</h3>
                    <p className="text-xs line-clamp-2" style={{ color: "var(--text-3)" }}>
                      {stripMarkdown(p.generated_pitch || p.description || "").slice(0, 120)}…
                    </p>
                  </div>
                  <span className="badge badge-green flex-shrink-0">Open</span>
                </div>
                {/* Highlight matched search term */}
                {search && p.crop_name?.toLowerCase().includes(search.toLowerCase()) && (
                  <span className="badge badge-amber mb-2">{p.crop_name}</span>
                )}
                <div className="divider" />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" style={{ color: "var(--green-dark)" }} />
                    <span className="text-xs font-bold" style={{ color: "var(--green-dark)" }}>
                      {formatINR(p.amount_requested)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Percent className="w-3 h-3" style={{ color: "var(--text-3)" }} />
                    <span className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>
                      {p.roi_percent}% ROI
                    </span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <TrendingUp className="w-3 h-3" style={{ color: "var(--text-3)" }} />
                    <span className="text-xs" style={{ color: "var(--text-3)" }}>{p.area_acres} acres</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Invest Modal */}
      <AnimatePresence>
        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <motion.div className="modal-sheet glass"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="display text-xl font-bold pr-4" style={{ color: "var(--text-1)" }}>
                    {selected.title}
                  </h2>
                  <button onClick={() => setSelected(null)}
                    className="btn-ghost w-8 h-8 !p-0 rounded-xl flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="badge badge-green">{formatINR(selected.amount_requested)} asking</span>
                  <span className="badge badge-blue">{selected.roi_percent}% ROI</span>
                  <span className="badge badge-amber">{selected.area_acres} acres</span>
                </div>
                {selected.farmer_name && (
                  <div className="rounded-xl px-3 py-2 mb-4 flex items-center gap-2"
                    style={{ background: "var(--glass2)", border: "1px solid var(--glass-border)" }}>
                    <span className="text-xs" style={{ color: "var(--text-3)" }}>Farmer:</span>
                    <span className="text-xs font-semibold" style={{ color: "var(--text-1)" }}>
                      {selected.farmer_name}
                    </span>
                    {selected.farmer_state && (
                      <span className="text-xs" style={{ color: "var(--text-3)" }}>· {selected.farmer_state}</span>
                    )}
                  </div>
                )}
                <div className="rounded-2xl p-4 mb-4 text-sm leading-relaxed"
                  style={{
                    background: "var(--glass2)", border: "1px solid var(--glass-border)",
                    color: "var(--text-2)", maxHeight: 220, overflowY: "auto",
                  }}>
                  {stripMarkdown(selected.generated_pitch || selected.description || "No pitch provided.")}
                </div>
                <div className="field">
                  <label className="field-label">Your Investment Amount (₹)</label>
                  <input type="number" placeholder="e.g. 25000" value={amount}
                    onChange={e => setAmount(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && invest()} />
                </div>
                <button className="btn btn-green w-full" onClick={invest}
                  disabled={investing || !amount}>
                  {investing ? "Processing…" : `Invest ${amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "Now"}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
