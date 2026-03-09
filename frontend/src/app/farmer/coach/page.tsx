"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { groqAPI } from "@/api/groq";
import { proposalsAPI } from "@/api/proposals";
import { useAuthStore } from "@/store/authStore";
import { useFarmerStore } from "@/store/farmerStore";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import toast from "react-hot-toast";
import { MessageSquare, Loader2, Send, Sparkles, Save, Globe, Check } from "lucide-react";
import { LANGUAGES } from "@/utils/cropConstants";
import { formatINR } from "@/utils/formatCurrency";

export default function CoachPage() {
  const { user } = useAuthStore();
  const { lastYieldPrediction } = useFarmerStore();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [proposal, setProposal] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [language, setLanguage] = useState(user?.language || "en");
  const [form, setForm] = useState({
    crop_name: "wheat",
    area_acres: lastYieldPrediction?.area_acres?.toString() || "5",
    predicted_yield: lastYieldPrediction?.predicted_yield?.toString() || "",
    investment_ask: "",
    roi_percent: "18",
  });

  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.predicted_yield || !form.investment_ask) { toast.error("Fill all fields"); return; }
    setLoading(true); setSaved(false); setSavedId(null); setPublished(false);
    try {
      const res = await groqAPI.generateProposal({
        crop_name: form.crop_name,
        area_acres: parseFloat(form.area_acres),
        predicted_yield: parseFloat(form.predicted_yield),
        investment_ask: parseFloat(form.investment_ask),
        roi_percent: parseFloat(form.roi_percent),
        state: user?.state || "haryana",
        language,
      });
      setProposal(res.proposal);
      toast.success("Pitch generated!");
    } catch { toast.error("Groq API error"); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!proposal) return;
    setSaveLoading(true);
    try {
      const cropName = form.crop_name.charAt(0).toUpperCase() + form.crop_name.slice(1);
      const saved = await proposalsAPI.create({
        title: `${cropName} Farm Investment — ${parseFloat(form.area_acres)} Acres`,
        description: `ML-verified ${cropName} farming proposal from ${user?.state?.replace(/_/g, " ")?.replace(/\b\w/g, l => l.toUpperCase())}. Predicted yield: ${form.predicted_yield} quintals. Seeking ${formatINR(parseFloat(form.investment_ask))} at ${form.roi_percent}% ROI.`,
        crop_name: form.crop_name,
        area_acres: parseFloat(form.area_acres),
        expected_yield: parseFloat(form.predicted_yield),
        amount_requested: parseFloat(form.investment_ask),
        roi_percent: parseFloat(form.roi_percent),
        language,
        generated_pitch: proposal,
      });
      setSavedId(saved.id);
      setSaved(true);
      toast.success("Proposal saved as draft!");
    } catch { toast.error("Save failed"); }
    finally { setSaveLoading(false); }
  };

  const handlePublish = async () => {
    if (!savedId) { toast.error("Save first before publishing"); return; }
    setPublishing(true);
    try {
      await proposalsAPI.publish(savedId);
      setPublished(true);
      toast.success("🎉 Proposal published! Investors can now see it.");
    } catch { toast.error("Publish failed"); }
    finally { setPublishing(false); }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    try {
      const res = await groqAPI.negotiate({
        question: chatInput,
        context: `Farmer growing ${form.crop_name}, ${form.area_acres} acres, asking ${formatINR(parseFloat(form.investment_ask || "0"))}`,
        language,
      });
      setChatResponse(res.advice);
    } catch { toast.error("Coach unavailable"); }
    finally { setChatLoading(false); }
  };

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }} className="pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 page">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#dbeafe" }}>
            <MessageSquare className="w-5 h-5" style={{ color: "#3b82f6" }} />
          </div>
          <div>
            <h1 className="font-display text-2xl" style={{ color: "var(--text-1)", letterSpacing: "-0.02em" }}>AI Coach</h1>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>Groq Llama 3.3 70B · 6 Indian languages</p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => setLanguage(l.code)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                background: language === l.code ? "var(--green)" : "var(--surface)",
                color: language === l.code ? "white" : "var(--text-2)",
                border: `1px solid ${language === l.code ? "var(--green)" : "var(--border)"}`,
              }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Pitch Generator */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" style={{ color: "#f59e0b" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
              Investor Pitch Generator
            </span>
          </div>
          <form onSubmit={handleGenerateProposal} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="field-label">Crop</label>
                <input className="field" value={form.crop_name} onChange={e => setForm({ ...form, crop_name: e.target.value })} /></div>
              <div><label className="field-label">Area (acres)</label>
                <input type="number" className="field" value={form.area_acres} onChange={e => setForm({ ...form, area_acres: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="field-label">Yield (quintals)</label>
                <input type="number" className="field" placeholder="From predictor" value={form.predicted_yield}
                  onChange={e => setForm({ ...form, predicted_yield: e.target.value })} /></div>
              <div><label className="field-label">Investment Ask (₹)</label>
                <input type="number" className="field" placeholder="50000" value={form.investment_ask}
                  onChange={e => setForm({ ...form, investment_ask: e.target.value })} /></div>
            </div>
            <div><label className="field-label">Expected ROI %</label>
              <input type="number" className="field" value={form.roi_percent}
                onChange={e => setForm({ ...form, roi_percent: e.target.value })} /></div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full !py-2.5">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4" />Generate Pitch</>}
            </button>
          </form>
        </div>

        {/* Generated proposal + save/publish */}
        <AnimatePresence>
          {proposal && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" style={{ color: "#f59e0b" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
                    Generated Pitch · {LANGUAGES.find(l => l.code === language)?.label}
                  </span>
                </div>
                {published && <span className="badge badge-green">Published ✓</span>}
              </div>

              <p className="text-sm whitespace-pre-wrap mb-5" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>{proposal}</p>

              {/* Save + Publish flow */}
              {!published ? (
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saveLoading || saved}
                    className="btn btn-secondary flex-1 !py-2">
                    {saveLoading
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                      : saved
                      ? <><Check className="w-4 h-4" style={{ color: "var(--green)" }} />Saved as Draft</>
                      : <><Save className="w-4 h-4" />Save as Draft</>
                    }
                  </button>
                  <button onClick={handlePublish} disabled={publishing || !saved || published}
                    className="btn btn-primary flex-1 !py-2"
                    title={!saved ? "Save first" : ""}>
                    {publishing
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Publishing...</>
                      : <><Globe className="w-4 h-4" />Publish to Investors</>
                    }
                  </button>
                </div>
              ) : (
                <div className="rounded-xl p-4 text-center" style={{ background: "#dcfce7" }}>
                  <p className="text-sm font-semibold" style={{ color: "#14532d" }}>
                    ✅ Live! Investors can now discover and fund your proposal.
                  </p>
                  <a href="/farmer/proposals" className="text-xs mt-1 block hover:underline" style={{ color: "var(--green)" }}>
                    View my proposals →
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Coach */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4" style={{ color: "#3b82f6" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
              Ask Your Coach
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--text-3)" }}>
            e.g. "What if investor asks about drought risk?"
          </p>
          <div className="flex gap-2">
            <input className="field flex-1 text-sm" placeholder="Ask a negotiation question..."
              value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleChat()} />
            <button onClick={handleChat} disabled={chatLoading} className="btn btn-primary !px-3 !py-2.5">
              {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          {chatResponse && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl p-4" style={{ background: "#dbeafe" }}>
              <p className="text-sm whitespace-pre-wrap" style={{ color: "#1e40af", lineHeight: 1.7 }}>{chatResponse}</p>
            </motion.div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
