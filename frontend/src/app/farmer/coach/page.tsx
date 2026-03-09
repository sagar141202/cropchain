"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { groqAPI } from "@/api/groq";
import { useAuthStore } from "@/store/authStore";
import { useFarmerStore } from "@/store/farmerStore";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import toast from "react-hot-toast";
import { MessageSquare, Loader2, Send, Sparkles } from "lucide-react";
import { LANGUAGES } from "@/utils/cropConstants";

export default function CoachPage() {
  const { user } = useAuthStore();
  const { lastYieldPrediction } = useFarmerStore();
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [language, setLanguage] = useState(user?.language || "en");
  const [form, setForm] = useState({
    crop_name: "wheat",
    area_acres: lastYieldPrediction?.area_acres?.toString() || "5",
    predicted_yield: lastYieldPrediction?.predicted_yield?.toString() || "",
    investment_ask: "", roi_percent: "18",
  });

  const generateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.predicted_yield || !form.investment_ask) { toast.error("Fill all fields"); return; }
    setLoading(true);
    try {
      const r = await groqAPI.generateProposal({
        crop_name: form.crop_name, area_acres: parseFloat(form.area_acres),
        predicted_yield: parseFloat(form.predicted_yield), investment_ask: parseFloat(form.investment_ask),
        roi_percent: parseFloat(form.roi_percent), state: user?.state || "haryana", language,
      });
      setProposal(r.proposal);
      toast.success("Proposal generated");
    } catch { toast.error("Groq API error"); }
    finally { setLoading(false); }
  };

  const chat = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    try {
      const r = await groqAPI.negotiate({ question: chatInput, context: `Farmer growing ${form.crop_name}`, language });
      setChatResponse(r.advice);
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
          <form onSubmit={generateProposal} className="space-y-3">
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

        {proposal && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4" style={{ color: "#f59e0b" }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
                Generated Pitch · {LANGUAGES.find(l => l.code === language)?.label}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>{proposal}</p>
          </motion.div>
        )}

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
              onKeyDown={e => e.key === "Enter" && chat()} />
            <button onClick={chat} disabled={chatLoading} className="btn btn-primary !px-3 !py-2.5">
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
