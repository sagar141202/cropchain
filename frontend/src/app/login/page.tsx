"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { authAPI } from "@/api/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff, Sprout } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const d = await authAPI.login(form.email, form.password);
      setAuth(d.user, d.access_token, d.refresh_token);
      toast.success(`Welcome back, ${d.user.name}!`);
      router.push(d.user.role === "farmer" ? "/farmer" : "/investor");
    } catch (err: any) { toast.error(err.response?.data?.detail || "Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }}>
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--green-light)" }}>
              <Sprout className="w-6 h-6" style={{ color: "var(--green)" }} />
            </div>
            <h1 className="font-display text-3xl mb-1" style={{ color: "var(--text-1)", letterSpacing: "-0.03em" }}>
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>Sign in to your CropChain account</p>
          </div>

          <div className="card p-7">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="field-label">Email address</label>
                <input type="email" className="field" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="field-label">Password</label>
                <div className="relative">
                  <input type={show ? "text" : "password"} className="field !pr-10" placeholder="••••••••"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-3)" }}>
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full !py-2.5">
                {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</> : "Sign in"}
              </button>
            </form>
            <div className="divider" />
            <p className="text-center text-sm" style={{ color: "var(--text-2)" }}>
              No account? <Link href="/register" className="font-semibold hover:underline" style={{ color: "var(--green)" }}>Create one</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
