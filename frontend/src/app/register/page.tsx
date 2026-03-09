"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { authAPI } from "@/api/auth";
import toast from "react-hot-toast";
import { Leaf } from "lucide-react";
import { INDIAN_STATES, LANGUAGES } from "@/utils/cropConstants";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "farmer", language: "en", phone: "", state: "haryana" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authAPI.register(form);
      setAuth(data.user, data.access_token, data.refresh_token);
      toast.success(`Welcome, ${data.user.name}!`);
      router.push(data.user.role === "farmer" ? "/farmer" : "/investor");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(0,255,136,0.04) 0%, transparent 60%)" }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] flex items-center justify-center">
            <Leaf className="w-6 h-6 text-[#00ff88]" />
          </div>
          <h1 className="font-display text-3xl text-[#e8f5e8] mb-1">Join CropChain</h1>
          <p className="font-mono text-xs text-[#5a7a5a] tracking-wider uppercase">Create your free account</p>
        </div>

        <div className="glass p-8 scanlines">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-dark">Full Name</label>
              <input className="input-dark" placeholder="Rajesh Kumar" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label-dark">Email</label>
              <input type="email" className="input-dark" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label-dark">Password</label>
              <input type="password" className="input-dark" placeholder="Min 8 characters" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>

            <div>
              <label className="label-dark">I am a</label>
              <div className="grid grid-cols-2 gap-2">
                {["farmer", "investor"].map((role) => (
                  <button key={role} type="button" onClick={() => setForm({ ...form, role })}
                    className={`py-2.5 rounded-xl text-sm font-mono font-bold uppercase tracking-wider transition-all ${
                      form.role === role
                        ? "bg-[rgba(0,255,136,0.15)] border border-[#00ff88] text-[#00ff88]"
                        : "border border-[rgba(255,255,255,0.06)] text-[#5a7a5a] hover:border-[rgba(0,255,136,0.3)]"
                    }`}>
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-dark">State</label>
                <select className="input-dark" value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-dark">Language</label>
                <select className="input-dark" value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}>
                  {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-glow w-full py-3 mt-2">
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#080c08] border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </span>
                : "Create Account →"
              }
            </button>
          </form>

          <div className="divider" />
          <p className="text-center font-mono text-xs text-[#5a7a5a]">
            Have an account?{" "}
            <Link href="/login" className="text-[#00ff88] hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
