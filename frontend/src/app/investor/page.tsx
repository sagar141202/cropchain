"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { investorAPI } from "@/api/investor";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Badge from "@/components/ui/Badge";
import { formatINR } from "@/utils/formatCurrency";
import { TrendingUp, Users, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function InvestorHome() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    investorAPI.browseProposals()
      .then(setProposals)
      .catch(() => toast.error("Failed to load proposals"));
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-cream pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-forest-600 rounded-2xl p-6 text-white mb-6">
          <h2 className="font-display font-bold text-xl mb-1">Welcome, {user?.name}</h2>
          <p className="text-forest-100 text-sm">Browse ML-verified farm investment opportunities</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Open Deals", value: proposals.length, icon: Users, color: "text-blue-600" },
            { label: "Avg ROI", value: "18%", icon: TrendingUp, color: "text-green-600" },
            { label: "Min Invest", value: "₹10K", icon: DollarSign, color: "text-amber-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
              <p className="font-bold text-forest-600">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-forest-600">Open Proposals</h3>
          <Link href="/investor/browse" className="text-sm text-forest-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No open proposals yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.slice(0, 3).map((p) => (
              <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-forest-600">{p.title}</h4>
                  <Badge label={p.status} variant="green" />
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Asking</p>
                    <p className="font-bold text-forest-600">{formatINR(p.amount_requested)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">ROI</p>
                    <p className="font-bold text-green-600">{p.roi_percent}%</p>
                  </div>
                  <Link href={`/investor/browse`}
                    className="bg-forest-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-700 transition-all">
                    View
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
