"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { groqAPI } from "@/api/groq";
import { useAuthStore } from "@/store/authStore";
import { useFarmerStore } from "@/store/farmerStore";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import toast from "react-hot-toast";
import { MessageSquare, Loader2, Send, Sparkles, Zap } from "lucide-react";
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

  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.predicted_yield || !form.investment_ask) { toast.error("Fill all fields"); return; }
    setLoading(true);
    try {
      const res = await groqAPI.generateProposal({
        crop_name: form.crop_name,
        area_acres: parseFloat(form.area_acres),
        predicted_yield: parseFloat(form.predicted_yield),
        investment_ask: parseFloat(form.investment_ask),
        roi_percent: parseFloat(form.roi_percent),
        state: user?.state || "haryana", language,
      });
      setProposal(res.proposal);
      toast.success("Proposal generated");
    } catch { toast.error("Groq API error"); }
    finally { setLoading(false); }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    try {
      const res = await groqAPI.negotiate({
        question: chatInput,
        context: `Farmer growing ${form.crop_name}, ${form.area_acres} acres`,
        language,
      });
      setChatResponse(res.advice);
    } catch { toast.error("Coach unavailable"); }
    finally { setChatLoading(false); }
  };

  return (
    <div className="min-h-screen bg-void pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[rgba(96,165,250,0.1)] border border-[rgba(96,165,250,0.3)] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#60a5fa]" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-[#e8f5e8]">Negotiation Coach</h1>
              <p className="font-mono text-xs text-[#5a7a5a] tracking-wider">Groq Llama 3.3 70B · 6 Languages</p>
            </div>
          </div>

          {/* Language pills */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {LANGUAGES.map((l) => (
              <button key={l.code} onClick={() => setLanguage(l.code)}
                className={`px-4 py-2 rounded-full font-mono text-xs font-bold tracking-wider transition-all whitespace-nowrap ${
                  language === l.code
                    ? "bg-[rgba(96,165,250,0.15)] border border-[#60a5fa] text-[#60a5fa]"
                    : "border border-[rgba(255,255,255,0.06)] text-[#5a7a5a] hover:border-[rgba(96,165,250,0.3)]"
                }`}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Proposal Generator */}
          <div className="glass p-6 mb-6 scanlines">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-[#f5c842]" />
              <span className="font-mono text-xs text-[#5a7a5a] uppercase tracking-wider">Investor Pitch Generator</span>
            </div>
            <form onSubmit={handleGenerateProposal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label-dark">Crop</label>
                  <input className="input-dark" value={form.crop_name} onChange={(e) => setForm({ ...form, crop_name: e.target.value })} /></div>
                <div><label className="label-dark">Area (acres)</label>
                  <input type="number" className="input-dark" value={form.area_acres} onChange={(e) => setForm({ ...form, area_acres: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label-dark">Predicted Yield (qtl)</label>
                  <input type="number" className="input-dark" placeholder="From predictor" value={form.predicted_yield}
                    onChange={(e) => setForm({ ...form, predicted_yield: e.target.value })} /></div>
                <div><label className="label-dark">Investment Ask (₹)</label>
                  <input type="number" className="input-dark" placeholder="50000" value={form.investment_ask}
                    onChange={(e) => setForm({ ...form, investment_ask: e.target.value })} /></div>
              </div>
              <div><label className="label-dark">Expected ROI %</label>
                <input type="number" className="input-dark" value={form.roi_percent}
                  onChange={(e) => setForm({ ...form, roi_percent: e.target.value })} /></div>
              <button type="submit" disabled={loading} className="btn-gold w-full py-3 font-body font-bold flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating with Groq...</>
                  : <><Zap className="w-4 h-4" />Generate Pitch</>}
              </button>
            </form>
          </div>

          {proposal && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass p-6 mb-6 scanlines" style={{ borderColor: "rgba(245,200,66,0.2)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#f5c842]" />
                <span className="font-mono text-xs text-[#5a7a5a] uppercase tracking-wider">
                  Generated Pitch · {LANGUAGES.find(l => l.code === language)?.label}
                </span>
              </div>
              <p className="text-[#e8f5e8] text-sm leading-relaxed whitespace-pre-wrap">{proposal}</p>
            </motion.div>
          )}

          {/* Chat Coach */}
          <div className="glass p-6 scanlines">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-[#60a5fa]" />
              <span className="font-mono text-xs text-[#5a7a5a] uppercase tracking-wider">Ask Your Coach</span>
            </div>
            <p className="text-xs text-[#5a7a5a] mb-4 font-mono">"What if investor asks about drought risk?"</p>

            <div className="flex gap-2">
              <input className="input-dark flex-1 text-sm" placeholder="Ask a negotiation question..."
                value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChat()} />
              <button onClick={handleChat} disabled={chatLoading}
                className="btn-glow px-3 py-2">
                {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>

            {chatResponse && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl" style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.15)" }}>
                <p className="text-[#e8f5e8] text-sm leading-relaxed whitespace-pre-wrap">{chatResponse}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
