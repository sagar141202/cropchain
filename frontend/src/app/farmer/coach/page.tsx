"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { groqAPI } from "@/api/groq";
import { proposalsAPI } from "@/api/proposals";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { CROPS, LANGUAGES } from "@/utils/cropConstants";
import { MessageSquare, Send, Sparkles, Save, Share2, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

function stripMarkdown(t: string) {
  return t.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1")
    .replace(/#{1,6}\s*/g,"").replace(/__(.*?)__/g,"$1").replace(/`(.*?)`/g,"$1").trim();
}

export default function FarmerCoach() {
  const { user, isAuthenticated, hydrated } = useAuthStore();
  const router = useRouter();

  const [form, setForm] = useState({ crop:"wheat", language:"hindi", area:"5", asking_price:"2500", market_price:"2200" });
  const [pitch, setPitch] = useState("");
  const [savedId, setSavedId] = useState<string|null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPublished, setShowPublished] = useState(false);

  // Chat
  const [msgs, setMsgs] = useState<{ role:"user"|"assistant"; text:string }[]>([]);
  const [chat, setChat] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => { if (hydrated && !isAuthenticated) router.push("/login"); }, [hydrated, isAuthenticated]);
  if (!hydrated) return null;

  const f = (k:string) => (e:any) => setForm(p => ({ ...p, [k]:e.target.value }));

  const generate = async () => {
    setGenerating(true); setSavedId(null); setPitch("");
    try {
      const res = await groqAPI.generatePitch({ ...form, area_acres: Number(form.area), language: form.language });
      setPitch(stripMarkdown(res.pitch || res.script || res.content || JSON.stringify(res)));
    } catch { toast.error("Generation failed"); }
    finally { setGenerating(false); }
  };

  const save = async () => {
    if (!pitch) return;
    setSaving(true);
    try {
      const res = await proposalsAPI.create({
        title: `${form.crop.charAt(0).toUpperCase()+form.crop.slice(1)} Farm — ${form.area} acres`,
        pitch_content: pitch,
        amount_requested: Number(form.asking_price) * Number(form.area) * 100,
        roi_percent: 18,
        duration_months: 12,
        crop_type: form.crop,
        area_acres: Number(form.area),
      });
      setSavedId(res.id || res._id);
      toast.success("Draft saved!");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const publish = async () => {
    if (!savedId) return;
    setPublishing(true);
    try {
      await proposalsAPI.publish(savedId);
      setShowPublished(true);
    } catch { toast.error("Publish failed"); }
    finally { setPublishing(false); }
  };

  const sendChat = async () => {
    if (!chat.trim()) return;
    const userMsg = { role:"user" as const, text: chat };
    setMsgs(p => [...p, userMsg]);
    setChat(""); setChatLoading(true);
    try {
      const res = await groqAPI.chat([...msgs.map(m=>({ role:m.role, content:m.text })), { role:"user", content:chat }], user?.language || "hindi");
      setMsgs(p => [...p, { role:"assistant", text: stripMarkdown(res.reply || res.content || "...") }]);
    } catch { toast.error("Chat failed"); }
    finally { setChatLoading(false); }
  };

  return (
    <div className="min-h-screen pb-24 page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="display text-2xl font-bold mb-1" style={{ color:"var(--text-1)" }}>AI Coach</h1>
        <p className="text-sm mb-6" style={{ color:"var(--text-3)" }}>Generate investor pitches & get negotiation help</p>

        {/* Pitch generator */}
        <div className="glass rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" style={{ color:"var(--green-dark)" }} />
            <h3 className="font-semibold text-sm" style={{ color:"var(--text-1)" }}>Generate Pitch</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="field"><label className="field-label">Crop</label>
              <select value={form.crop} onChange={f("crop")}>
                {CROPS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select></div>
            <div className="field"><label className="field-label">Language</label>
              <select value={form.language} onChange={f("language")}>
                {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select></div>
            <div className="field"><label className="field-label">Area (acres)</label>
              <input type="number" value={form.area} onChange={f("area")} /></div>
            <div className="field"><label className="field-label">Asking Price ₹/qtl</label>
              <input type="number" value={form.asking_price} onChange={f("asking_price")} /></div>
          </div>
          <button className="btn btn-green w-full mt-1" onClick={generate} disabled={generating}>
            {generating ? "Generating…" : <><Sparkles className="w-4 h-4" /> Generate Pitch</>}
          </button>
        </div>

        {/* Pitch output */}
        {pitch && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="glass rounded-2xl p-5 mb-4">
            <h3 className="font-semibold text-sm mb-3" style={{ color:"var(--text-1)" }}>Your Pitch</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color:"var(--text-2)", whiteSpace:"pre-line" }}>{pitch}</p>
            <div className="flex gap-2">
              <button className="btn btn-ghost flex-1 text-xs" onClick={save} disabled={saving || !!savedId}>
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving…" : savedId ? "Saved ✓" : "Save Draft"}
              </button>
              <button className="btn btn-green flex-1 text-xs" onClick={publish} disabled={!savedId || publishing}>
                <Share2 className="w-3.5 h-3.5" />
                {publishing ? "Publishing…" : "Publish to Investors"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Chat */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4" style={{ color:"var(--blue)" }} />
            <h3 className="font-semibold text-sm" style={{ color:"var(--text-1)" }}>Negotiation Coach</h3>
          </div>
          {msgs.length === 0 && (
            <p className="text-xs text-center py-4" style={{ color:"var(--text-3)" }}>
              Ask anything — negotiation tips, pricing strategy, contract advice
            </p>
          )}
          <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role==="user"?"justify-end":""}`}>
                <div className="max-w-xs rounded-2xl px-4 py-2.5 text-xs leading-relaxed"
                  style={m.role==="user"
                    ? { background:"var(--green-dark)", color:"white" }
                    : { background:"var(--glass2)", border:"1px solid var(--glass-border)", color:"var(--text-2)" }}>
                  {m.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex">
                <div className="rounded-2xl px-4 py-2.5 text-xs"
                  style={{ background:"var(--glass2)", border:"1px solid var(--glass-border)", color:"var(--text-3)" }}>
                  Thinking…
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{ background:"var(--glass2)", border:"1px solid var(--glass-border)", color:"var(--text-1)" }}
              placeholder="Ask your coach…" value={chat}
              onChange={e => setChat(e.target.value)}
              onKeyDown={e => e.key==="Enter" && sendChat()} />
            <button className="btn btn-green !px-4" onClick={sendChat} disabled={chatLoading || !chat.trim()}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Published success modal */}
      <AnimatePresence>
        {showPublished && (
          <div className="modal-overlay" onClick={() => setShowPublished(false)}>
            <motion.div className="modal-sheet glass"
              initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0, scale:0.9 }}
              transition={{ type:"spring", stiffness:400, damping:28 }}
              onClick={e => e.stopPropagation()}>
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background:"var(--green-pale)" }}>
                  <CheckCircle className="w-8 h-8" style={{ color:"var(--green-dark)" }} />
                </div>
                <h2 className="display text-2xl font-bold mb-2" style={{ color:"var(--text-1)" }}>Published!</h2>
                <p className="text-sm mb-6" style={{ color:"var(--text-2)" }}>
                  Your proposal is now live. Investors can see and fund it.
                </p>
                <div className="flex gap-3">
                  <button className="btn btn-ghost flex-1" onClick={() => setShowPublished(false)}>Stay here</button>
                  <button className="btn btn-green flex-1" onClick={() => router.push("/farmer/proposals")}>
                    View Proposals
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
