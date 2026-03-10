"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { authAPI } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/layout/Navbar";
import Onboarding from "@/components/Onboarding";
import { Leaf, Sprout, TrendingUp, ArrowRight } from "lucide-react";
import { INDIAN_STATES, LANGUAGES } from "@/utils/cropConstants";
import toast from "react-hot-toast";

export default function Register() {
  const [role, setRole] = useState<"farmer" | "investor">("farmer");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", state: "maharashtra", language: "hindi" });
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [pendingRole, setPendingRole] = useState<"farmer" | "investor">("farmer");
  const { login } = useAuthStore();
  const router = useRouter();

  const submit = async () => {
    if (!form.name || !form.email || !form.password) return toast.error("Fill all required fields");
    setLoading(true);
    try {
      const res = await authAPI.register({ ...form, role });
      login(res.user, res.access_token, res.refresh_token);
      toast.success("Account created!");
      // Show onboarding only on first register
      const key = `onboarding_done_${res.user.id}`;
      if (!localStorage.getItem(key)) {
        setPendingRole(role);
        setShowOnboarding(true);
      } else {
        router.push(role === "investor" ? "/investor" : "/farmer");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Registration failed");
    } finally { setLoading(false); }
  };

  const finishOnboarding = (data: any) => {
    // Save onboarding prefs to localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      localStorage.setItem(`onboarding_done_${user.id}`, "true");
      localStorage.setItem(`onboarding_prefs_${user.id}`, JSON.stringify(data));
    }
    setShowOnboarding(false);
    router.push(pendingRole === "investor" ? "/investor" : "/farmer");
  };

  const skipOnboarding = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) localStorage.setItem(`onboarding_done_${user.id}`, "true");
    setShowOnboarding(false);
    router.push(pendingRole === "investor" ? "/investor" : "/farmer");
  };

  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <div className="min-h-screen page">
        <Navbar />
        <div className="max-w-sm mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg,#22c55e,#15803d)" }}>
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="display text-3xl font-bold mb-1" style={{ color: "var(--text-1)" }}>Join CropChain</h1>
              <p className="text-sm" style={{ color: "var(--text-3)" }}>Free forever. No credit card needed.</p>
            </div>

            {/* Role toggle */}
            <div className="flex gap-2 mb-6 p-1 rounded-2xl"
              style={{ background: "var(--glass2)", border: "1px solid var(--glass-border)" }}>
              {(["farmer", "investor"] as const).map(r => (
                <button key={r} onClick={() => setRole(r)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={role === r
                    ? { background: "var(--surface,white)", color: "var(--text-1)", boxShadow: "var(--shadow)" }
                    : { background: "transparent", color: "var(--text-3)" }}>
                  {r === "farmer" ? <Sprout className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            <div className="field"><label className="field-label">Full Name *</label>
              <input placeholder="Arjun Kumar" value={form.name} onChange={f("name")} /></div>
            <div className="field"><label className="field-label">Email *</label>
              <input type="email" placeholder="arjun@example.com" value={form.email} onChange={f("email")} /></div>
            <div className="field"><label className="field-label">Password *</label>
              <input type="password" placeholder="Min 8 characters" value={form.password} onChange={f("password")} /></div>
            <div className="field"><label className="field-label">Phone</label>
              <input placeholder="+91 98765 43210" value={form.phone} onChange={f("phone")} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="field"><label className="field-label">State</label>
                <select value={form.state} onChange={f("state")}>
                  {INDIAN_STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select></div>
              <div className="field"><label className="field-label">Language</label>
                <select value={form.language} onChange={f("language")}>
                  {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select></div>
            </div>

            <button className="btn btn-green w-full mt-2" onClick={submit} disabled={loading}>
              {loading ? "Creating account…" : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
            <p className="text-center text-xs mt-4" style={{ color: "var(--text-3)" }}>
              Already have one?{" "}
              <Link href="/login" style={{ color: "var(--green-dark)", fontWeight: 600 }}>Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Onboarding overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding
            role={pendingRole}
            onComplete={finishOnboarding}
            onSkip={skipOnboarding}
          />
        )}
      </AnimatePresence>
    </>
  );
}
