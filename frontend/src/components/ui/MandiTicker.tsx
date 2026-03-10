"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Minus } from "lucide-react";

// Static mandi prices by state — realistic MSP-based INR/quintal data
const STATE_PRICES: Record<string, { crop: string; price: number; prev: number }[]> = {
  default: [
    { crop: "Wheat",     price: 2275, prev: 2225 },
    { crop: "Rice",      price: 2183, prev: 2150 },
    { crop: "Maize",     price: 1962, prev: 2010 },
    { crop: "Soybean",   price: 4600, prev: 4480 },
    { crop: "Cotton",    price: 6620, prev: 6500 },
    { crop: "Onion",     price: 1540, prev: 1600 },
    { crop: "Tomato",    price: 2200, prev: 1950 },
    { crop: "Potato",    price: 1100, prev: 1080 },
  ],
  punjab: [
    { crop: "Wheat",     price: 2310, prev: 2260 },
    { crop: "Rice",      price: 2183, prev: 2140 },
    { crop: "Maize",     price: 1980, prev: 1920 },
    { crop: "Sunflower", price: 6760, prev: 6600 },
    { crop: "Cotton",    price: 6680, prev: 6550 },
    { crop: "Sugarcane", price:  391, prev:  380 },
    { crop: "Potato",    price: 1050, prev: 1100 },
    { crop: "Mustard",   price: 5650, prev: 5500 },
  ],
  haryana: [
    { crop: "Wheat",     price: 2290, prev: 2240 },
    { crop: "Rice",      price: 2183, prev: 2160 },
    { crop: "Mustard",   price: 5700, prev: 5580 },
    { crop: "Cotton",    price: 6650, prev: 6520 },
    { crop: "Sugarcane", price:  386, prev:  375 },
    { crop: "Maize",     price: 1960, prev: 1930 },
    { crop: "Sunflower", price: 6750, prev: 6610 },
    { crop: "Barley",    price: 1735, prev: 1690 },
  ],
  maharashtra: [
    { crop: "Cotton",    price: 6700, prev: 6540 },
    { crop: "Soybean",   price: 4650, prev: 4500 },
    { crop: "Onion",     price: 1620, prev: 1700 },
    { crop: "Tomato",    price: 2350, prev: 2100 },
    { crop: "Sugarcane", price:  395, prev:  382 },
    { crop: "Wheat",     price: 2250, prev: 2210 },
    { crop: "Rice",      price: 2190, prev: 2155 },
    { crop: "Turmeric",  price: 9800, prev: 9400 },
  ],
  karnataka: [
    { crop: "Rice",      price: 2200, prev: 2170 },
    { crop: "Ragi",      price: 3846, prev: 3700 },
    { crop: "Maize",     price: 2000, prev: 1980 },
    { crop: "Tomato",    price: 2100, prev: 1880 },
    { crop: "Onion",     price: 1480, prev: 1560 },
    { crop: "Cotton",    price: 6600, prev: 6480 },
    { crop: "Sunflower", price: 6760, prev: 6640 },
    { crop: "Sugarcane", price:  392, prev:  380 },
  ],
  gujarat: [
    { crop: "Cotton",    price: 6750, prev: 6600 },
    { crop: "Groundnut", price: 6377, prev: 6200 },
    { crop: "Wheat",     price: 2260, prev: 2215 },
    { crop: "Castor",    price: 6310, prev: 6150 },
    { crop: "Cumin",     price:21000, prev:20200 },
    { crop: "Mustard",   price: 5680, prev: 5540 },
    { crop: "Sesame",    price: 8635, prev: 8400 },
    { crop: "Maize",     price: 1940, prev: 1910 },
  ],
  rajasthan: [
    { crop: "Mustard",   price: 5720, prev: 5580 },
    { crop: "Wheat",     price: 2280, prev: 2235 },
    { crop: "Cumin",     price:20500, prev:19800 },
    { crop: "Coriander", price: 7200, prev: 6950 },
    { crop: "Bajra",     price: 2500, prev: 2420 },
    { crop: "Maize",     price: 1950, prev: 1920 },
    { crop: "Groundnut", price: 6300, prev: 6150 },
    { crop: "Barley",    price: 1740, prev: 1700 },
  ],
  uttar_pradesh: [
    { crop: "Wheat",     price: 2300, prev: 2255 },
    { crop: "Rice",      price: 2183, prev: 2145 },
    { crop: "Sugarcane", price:  390, prev:  378 },
    { crop: "Potato",    price: 1080, prev: 1120 },
    { crop: "Mustard",   price: 5660, prev: 5520 },
    { crop: "Maize",     price: 1955, prev: 1925 },
    { crop: "Onion",     price: 1500, prev: 1580 },
    { crop: "Pea",       price: 3400, prev: 3280 },
  ],
  madhya_pradesh: [
    { crop: "Soybean",   price: 4620, prev: 4490 },
    { crop: "Wheat",     price: 2270, prev: 2225 },
    { crop: "Maize",     price: 1975, prev: 1945 },
    { crop: "Cotton",    price: 6630, prev: 6500 },
    { crop: "Mustard",   price: 5640, prev: 5500 },
    { crop: "Gram",      price: 5440, prev: 5300 },
    { crop: "Onion",     price: 1510, prev: 1590 },
    { crop: "Garlic",    price: 4800, prev: 4600 },
  ],
  andhra_pradesh: [
    { crop: "Rice",      price: 2183, prev: 2150 },
    { crop: "Cotton",    price: 6680, prev: 6540 },
    { crop: "Chilli",    price:12000, prev:11500 },
    { crop: "Maize",     price: 2010, prev: 1980 },
    { crop: "Groundnut", price: 6400, prev: 6250 },
    { crop: "Tomato",    price: 2400, prev: 2150 },
    { crop: "Onion",     price: 1550, prev: 1630 },
    { crop: "Turmeric",  price: 9600, prev: 9200 },
  ],
  tamil_nadu: [
    { crop: "Rice",      price: 2200, prev: 2165 },
    { crop: "Banana",    price: 2800, prev: 2650 },
    { crop: "Tomato",    price: 2500, prev: 2280 },
    { crop: "Cotton",    price: 6600, prev: 6460 },
    { crop: "Groundnut", price: 6350, prev: 6200 },
    { crop: "Sugarcane", price:  398, prev:  385 },
    { crop: "Coconut",   price: 3200, prev: 3050 },
    { crop: "Turmeric",  price: 9500, prev: 9100 },
  ],
  west_bengal: [
    { crop: "Rice",      price: 2183, prev: 2155 },
    { crop: "Potato",    price: 1020, prev: 1060 },
    { crop: "Jute",      price: 5050, prev: 4900 },
    { crop: "Mustard",   price: 5600, prev: 5470 },
    { crop: "Maize",     price: 1940, prev: 1910 },
    { crop: "Tomato",    price: 2300, prev: 2080 },
    { crop: "Onion",     price: 1490, prev: 1570 },
    { crop: "Ginger",    price: 8500, prev: 8100 },
  ],
};

// Generate fake 7-day sparkline history from current + prev price
function generateHistory(current: number, prev: number): number[] {
  const history: number[] = [];
  let val = prev * 0.97;
  for (let i = 0; i < 6; i++) {
    val = val + (Math.random() - 0.46) * (Math.abs(current - prev) * 0.4 + 60);
    history.push(Math.round(val));
  }
  history.push(current);
  return history;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 200; const H = 60;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 8) - 4;
    return `${x},${y}`;
  }).join(" ");
  const areaPath = `M0,${H} L${pts.split(" ").map(p => p).join(" L")} L${W},${H} Z`
    .replace("M0,", `M${pts.split(" ")[0].split(",")[0]},`)
    .replace(/^M[^,]+,/, `M0,${H} L`);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <polyline points={pts}
        fill={`url(#grad-${color.replace("#","")})`}
        stroke="none" />
      {/* Line */}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last dot */}
      <circle
        cx={data.length > 0 ? ((data.length - 1) / (data.length - 1)) * W : W}
        cy={H - ((data[data.length - 1] - min) / range) * (H - 8) - 4}
        r="4" fill={color} stroke="white" strokeWidth="2" />
    </svg>
  );
}

interface CropDetail {
  crop: string; price: number; prev: number;
  change: number; changePct: number; history: number[];
}

export default function MandiTicker({ state }: { state: string }) {
  const prices = STATE_PRICES[state] || STATE_PRICES["default"];
  const tickerRef  = useRef<HTMLDivElement>(null);
  const animRef    = useRef<number>(0);
  const posRef     = useRef<number>(0);
  const pausedRef  = useRef<boolean>(false);
  const [selected, setSelected] = useState<CropDetail | null>(null);

  const items: CropDetail[] = prices.map(p => ({
    ...p,
    change:    p.price - p.prev,
    changePct: +((( p.price - p.prev) / p.prev) * 100).toFixed(2),
    history:   generateHistory(p.price, p.prev),
  }));

  // Auto-scroll ticker
  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;
    const speed = 0.55; // px per frame

    const tick = () => {
      if (!pausedRef.current && el) {
        posRef.current += speed;
        const half = el.scrollWidth / 2;
        if (posRef.current >= half) posRef.current = 0;
        el.scrollLeft = posRef.current;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const open = (item: CropDetail) => {
    pausedRef.current = true;
    setSelected(item);
  };
  const close = () => {
    setSelected(null);
    setTimeout(() => { pausedRef.current = false; }, 400);
  };

  return (
    <>
      {/* Ticker strip */}
      <div className="glass rounded-2xl mb-4 overflow-hidden"
        style={{ border: "1px solid var(--glass-border)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-semibold" style={{ color: "var(--text-1)" }}>
              Today's Mandi Prices
            </p>
          </div>
          <p className="text-xs" style={{ color: "var(--text-3)" }}>₹/quintal · Tap any crop</p>
        </div>

        {/* Scrolling ticker — doubled items for seamless loop */}
        <div
          ref={tickerRef}
          onMouseEnter={() => { pausedRef.current = true;  }}
          onMouseLeave={() => { pausedRef.current = false; }}
          onTouchStart={() => { pausedRef.current = true;  }}
          style={{
            display: "flex",
            overflowX: "hidden",
            paddingBottom: 12,
            paddingLeft: 16,
            gap: 10,
            cursor: "pointer",
            userSelect: "none",
            WebkitOverflowScrolling: "touch",
          }}>
          {/* Render twice for seamless infinite loop */}
          {[...items, ...items].map((item, i) => {
            const up      = item.changePct > 0;
            const neutral = item.changePct === 0;
            const color   = neutral ? "var(--text-3)" : up ? "#16a34a" : "#dc2626";
            const bg      = neutral ? "var(--glass2)" : up ? "#dcfce7" : "#fee2e2";
            return (
              <motion.div
                key={`${item.crop}-${i}`}
                whileTap={{ scale: 0.96 }}
                onClick={() => open(item)}
                className="flex-shrink-0 rounded-xl px-3 py-2"
                style={{
                  background: bg,
                  border: `1px solid ${neutral ? "var(--glass-border)" : up ? "#bbf7d0" : "#fecaca"}`,
                  minWidth: 100,
                }}>
                <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--text-1)" }}>
                  {item.crop}
                </p>
                <p className="font-bold text-sm" style={{ color: "var(--text-1)" }}>
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {up      && <TrendingUp   className="w-2.5 h-2.5" style={{ color }} />}
                  {!up && !neutral && <TrendingDown className="w-2.5 h-2.5" style={{ color }} />}
                  {neutral && <Minus        className="w-2.5 h-2.5" style={{ color }} />}
                  <p style={{ fontSize: 10, color, fontWeight: 700 }}>
                    {up ? "+" : ""}{item.changePct}%
                  </p>
                </div>
              </motion.div>
            );
          })}
          {/* Spacer so last item isn't flush */}
          <div style={{ minWidth: 16 }} />
        </div>
      </div>

      {/* Crop detail modal with sparkline */}
      <AnimatePresence>
        {selected && (
          <div className="modal-overlay" onClick={close}>
            <motion.div
              className="modal-sheet glass"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 40,  scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={e => e.stopPropagation()}>
              <div className="p-6">

                {/* Modal header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="display text-2xl font-bold" style={{ color: "var(--text-1)" }}>
                      {selected.crop}
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                      Mandi price · ₹/quintal
                    </p>
                  </div>
                  <button onClick={close}
                    className="btn-ghost w-8 h-8 !p-0 rounded-xl flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Price hero */}
                <div className="rounded-2xl p-5 mb-4"
                  style={{
                    background: selected.changePct >= 0
                      ? "linear-gradient(135deg,#16a34a,#15803d)"
                      : "linear-gradient(135deg,#dc2626,#b91c1c)",
                  }}>
                  <p className="text-white opacity-70 text-xs mb-1">Current Price</p>
                  <p className="display text-4xl font-bold text-white mb-2">
                    ₹{selected.price.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-2">
                    {selected.changePct >= 0
                      ? <TrendingUp className="w-4 h-4 text-green-200" />
                      : <TrendingDown className="w-4 h-4 text-red-200" />}
                    <p className="text-sm font-semibold text-white opacity-90">
                      {selected.changePct >= 0 ? "+" : ""}
                      ₹{Math.abs(selected.change).toLocaleString("en-IN")} ({selected.changePct >= 0 ? "+" : ""}
                      {selected.changePct}%) vs yesterday
                    </p>
                  </div>
                </div>

                {/* Sparkline chart */}
                <div className="rounded-2xl p-4 mb-4"
                  style={{ background: "var(--glass2)", border: "1px solid var(--glass-border)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>
                      7-Day Price Trend
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>
                      ₹{Math.min(...selected.history).toLocaleString("en-IN")} –
                      ₹{Math.max(...selected.history).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <Sparkline
                      data={selected.history}
                      color={selected.changePct >= 0 ? "#22c55e" : "#ef4444"}
                    />
                  </div>
                  {/* Day labels */}
                  <div className="flex justify-between mt-1">
                    {["7d","6d","5d","4d","3d","2d","Today"].map(d => (
                      <p key={d} style={{ fontSize: 9, color: "var(--text-3)" }}>{d}</p>
                    ))}
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Yesterday", value: `₹${selected.prev.toLocaleString("en-IN")}` },
                    { label: "7d High",   value: `₹${Math.max(...selected.history).toLocaleString("en-IN")}` },
                    { label: "7d Low",    value: `₹${Math.min(...selected.history).toLocaleString("en-IN")}` },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-3 text-center"
                      style={{ background: "var(--glass2)", border: "1px solid var(--glass-border)" }}>
                      <p className="text-xs font-bold mb-0.5" style={{ color: "var(--text-1)" }}>{s.value}</p>
                      <p style={{ fontSize: 10, color: "var(--text-3)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Advice */}
                <div className="rounded-xl px-4 py-3"
                  style={{
                    background: selected.changePct > 2 ? "#dcfce7"
                      : selected.changePct < -2 ? "#fee2e2" : "#fef3c7",
                    border: `1px solid ${selected.changePct > 2 ? "#86efac"
                      : selected.changePct < -2 ? "#fecaca" : "#fde68a"}`,
                  }}>
                  <p className="text-xs font-semibold mb-0.5"
                    style={{ color: selected.changePct > 2 ? "#15803d"
                      : selected.changePct < -2 ? "#b91c1c" : "#92400e" }}>
                    {selected.changePct > 2  ? "📈 Good time to sell"
                    : selected.changePct < -2 ? "📉 Hold if possible — prices dipping"
                    :                           "📊 Stable — watch for next 2 days"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>
                    {selected.changePct > 2
                      ? `${selected.crop} is up ${selected.changePct}% — consider selling soon before prices correct.`
                      : selected.changePct < -2
                      ? `${selected.crop} dropped ${Math.abs(selected.changePct)}% — holding for 3–5 days may recover value.`
                      : `${selected.crop} prices are steady. Keep monitoring before making a sell decision.`}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
