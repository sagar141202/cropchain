"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { authAPI } from "@/api/auth";
import toast from "react-hot-toast";
import { Sprout } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { INDIAN_STATES, LANGUAGES } from "@/utils/cropConstants";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "farmer", language: "en", phone: "", state: "haryana" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const d = await authAPI.register(form);
      setAuth(d.user, d.access_token, d.refresh_token);
      toast.success(`Welcome, ${d.user.name}!`);
      router.push(d.user.role === "farmer" ? "/farmer" : "/investor");
    } catch (err: any) { toast.error(err.response?.data?.detail || "Registration failed"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }}>
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--green-light)" }}>
              <Sprout className="w-6 h-6" style={{ color: "var(--green)" }} />
            </div>
            <h1 className="font-display text-3xl mb-1" style={{ color: "var(--text-1)", letterSpacing: "-0.03em" }}>
              Create account
            </h1>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>Free forever. No credit card needed.</p>
          </div>

          <div className="card p-7">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="field-label">Full name</label>
                <input className="field" placeholder="Rajesh Kumar" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input type="email" className="field" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="field-label">Password</label>
                <input type="password" className="field" placeholder="Min 8 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
              <div>
                <label className="field-label">I am a</label>
                <div className="grid grid-cols-2 gap-2">
                  {["farmer", "investor"].map(role => (
                    <button key={role} type="button" onClick={() => setForm({ ...form, role })}
                      className="py-2.5 rounded-lg text-sm font-semibold capitalize transition-all"
                      style={{
                        background: form.role === role ? "var(--green)" : "var(--surface-2)",
                        color: form.role === role ? "white" : "var(--text-2)",
                        border: `1.5px solid ${form.role === role ? "var(--green)" : "var(--border)"}`,
                      }}>
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">State</label>
                  <select className="field" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Language</label>
                  <select className="field" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full !py-2.5">
                {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating...</> : "Create account"}
              </button>
            </form>
            <div className="divider" />
            <p className="text-center text-sm" style={{ color: "var(--text-2)" }}>
              Have an account? <Link href="/login" className="font-semibold hover:underline" style={{ color: "var(--green)" }}>Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
