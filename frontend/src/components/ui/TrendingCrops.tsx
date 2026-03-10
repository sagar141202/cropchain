"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Flame } from "lucide-react";

const CROP_EMOJIS: Record<string, string> = {
  wheat: "🌾", rice: "🍚", cotton: "🌸", maize: "🌽",
  sugarcane: "🎋", onion: "🧅", soybean: "🫘", tomato: "🍅",
  groundnut: "🥜", mustard: "🌼", potato: "🥔", gram: "🫘",
  turmeric: "🟡", chilli: "🌶️", banana: "🍌", coconut: "🥥",
  ragi: "🌾", sunflower: "🌻", barley: "🌾", garlic: "🧄",
};

interface TrendingCropsProps {
  proposals: any[];
  onCropSelect: (crop: string) => void;
  activeCrop?: string;
}

export default function TrendingCrops({ proposals, onCropSelect, activeCrop }: TrendingCropsProps) {
  const trending = useMemo(() => {
    if (!proposals.length) return [];
    const map: Record<string, { count: number; totalRoi: number; totalAsk: number }> = {};
    proposals.forEach(p => {
      const c = (p.crop_name || "").toLowerCase();
      if (!c) return;
      if (!map[c]) map[c] = { count: 0, totalRoi: 0, totalAsk: 0 };
      map[c].count++;
      map[c].totalRoi  += Number(p.roi_percent)       || 0;
      map[c].totalAsk  += Number(p.amount_requested)  || 0;
    });
    return Object.entries(map)
      .map(([crop, d]) => ({
        crop,
        count:   d.count,
        avgRoi:  +(d.totalRoi  / d.count).toFixed(1),
        avgAsk:  Math.round(d.totalAsk / d.count),
        label:   crop.charAt(0).toUpperCase() + crop.slice(1),
        emoji:   CROP_EMOJIS[crop] || "🌱",
        // Trending score — weighted by count + ROI
        score:   d.count * 10 + (d.totalRoi / d.count),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [proposals]);

  if (!trending.length) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
        <p className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>
          Trending This Week
        </p>
        <span className="text-xs" style={{ color: "var(--text-3)" }}>· tap to filter</span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {trending.map((t, i) => {
          const active = activeCrop === t.crop;
          return (
            <motion.button
              key={t.crop}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCropSelect(active ? "all" : t.crop)}
              className="flex-shrink-0 rounded-2xl p-3 text-left transition-all"
              style={{
                minWidth: 110,
                background: active
                  ? "linear-gradient(135deg, #22c55e, #15803d)"
                  : "var(--glass2)",
                border: `1.5px solid ${active ? "transparent" : "var(--glass-border)"}`,
                boxShadow: active ? "0 4px 16px rgba(34,197,94,0.3)" : "none",
              }}>
              {/* Emoji + hot badge */}
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 22 }}>{t.emoji}</span>
                {i === 0 && (
                  <span className="flex items-center gap-0.5 rounded-lg px-1.5 py-0.5"
                    style={{ background: active ? "rgba(255,255,255,0.2)" : "#fef3c7", fontSize: 8, fontWeight: 800 }}>
                    <Flame style={{ width: 8, height: 8, color: active ? "white" : "#f59e0b" }} />
                    <span style={{ color: active ? "white" : "#d97706" }}>HOT</span>
                  </span>
                )}
              </div>
              {/* Crop name */}
              <p className="font-bold text-xs mb-1"
                style={{ color: active ? "white" : "var(--text-1)" }}>
                {t.label}
              </p>
              {/* Stats */}
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp style={{ width: 9, height: 9, color: active ? "rgba(255,255,255,0.8)" : "var(--green-dark)" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: active ? "rgba(255,255,255,0.9)" : "var(--green-dark)" }}>
                  {t.avgRoi}% ROI
                </span>
              </div>
              <p style={{ fontSize: 9, color: active ? "rgba(255,255,255,0.65)" : "var(--text-3)" }}>
                {t.count} proposal{t.count !== 1 ? "s" : ""}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
