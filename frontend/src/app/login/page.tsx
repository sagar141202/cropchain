"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { authAPI } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/layout/Navbar";
import { Eye, EyeOff, Leaf, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const submit = async () => {
    if (!form.email || !form.password) return toast.error("Fill all fields");
    setLoading(true);
    try {
      const res = await authAPI.login(form.email, form.password);
      login(res.user, res.access_token, res.refresh_token);
      toast.success("Welcome back!");
      router.push(res.user.role === "investor" ? "/investor" : "/farmer");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen page">
      <Navbar />
      <div className="max-w-sm mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg,#22c55e,#15803d)" }}>
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="display text-3xl font-bold mb-1" style={{ color: "var(--text-1)" }}>Welcome back</h1>
            <p className="text-sm" style={{ color: "var(--text-3)" }}>Sign in to your CropChain account</p>
          </div>
          <div className="field">
            <label className="field-label">Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="field" style={{ marginBottom: 24 }}>
            <label className="field-label">Password</label>
            <div style={{ position: "relative" }}>
              <input type={show ? "text" : "password"} placeholder="••••••••" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && submit()}
                style={{ paddingRight: 44 }} />
              <button onClick={() => setShow(!show)} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "var(--text-3)"
              }}>
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button className="btn btn-green w-full" onClick={submit} disabled={loading}>
            {loading ? "Signing in…" : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
          </button>
          <p className="text-center text-xs mt-5" style={{ color: "var(--text-3)" }}>
            No account?{" "}
            <Link href="/register" style={{ color: "var(--green-dark)", fontWeight: 600 }}>Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
