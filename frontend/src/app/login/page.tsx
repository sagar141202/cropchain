"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { authAPI } from "@/api/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff, Leaf } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authAPI.login(form.email, form.password);
      setAuth(data.user, data.access_token, data.refresh_token);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push(data.user.role === "farmer" ? "/farmer" : "/investor");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,255,136,0.04) 0%, transparent 60%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] flex items-center justify-center">
            <Leaf className="w-6 h-6 text-[#00ff88]" />
          </div>
          <h1 className="font-display text-3xl text-[#e8f5e8] mb-1">Welcome back</h1>
          <p className="font-mono text-xs text-[#5a7a5a] tracking-wider uppercase">Sign in to CropChain</p>
        </div>

        <div className="glass p-8 scanlines">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-dark">Email Address</label>
              <input type="email" className="input-dark" placeholder="farmer@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label-dark">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} className="input-dark pr-12"
                  placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a7a5a] hover:text-[#00ff88] transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-glow w-full py-3">
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#080c08] border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </span>
                : "Sign In →"
              }
            </button>
          </form>

          <div className="divider" />
          <p className="text-center font-mono text-xs text-[#5a7a5a]">
            No account?{" "}
            <Link href="/register" className="text-[#00ff88] hover:underline">Register here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
