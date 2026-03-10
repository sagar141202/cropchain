"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, RefreshCw, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

const SEASON_INFO: Record<number, { name: string; emoji: string; crops: string[]; activity: string }> = {
  0:  { name: "Rabi",   emoji: "🌾", crops: ["Wheat","Mustard","Gram","Barley","Pea"],     activity: "sowing & irrigation"   },
  1:  { name: "Rabi",   emoji: "🌾", crops: ["Wheat","Mustard","Gram","Barley","Pea"],     activity: "growth & fertilising"  },
  2:  { name: "Rabi",   emoji: "🌾", crops: ["Wheat","Mustard","Gram","Barley","Pea"],     activity: "harvesting"            },
  3:  { name: "Zaid",   emoji: "☀️", crops: ["Watermelon","Cucumber","Moong","Sunflower"], activity: "sowing"                },
  4:  { name: "Zaid",   emoji: "☀️", crops: ["Watermelon","Cucumber","Moong","Sunflower"], activity: "growth"                },
  5:  { name: "Kharif", emoji: "🌧️", crops: ["Rice","Cotton","Maize","Soybean","Groundnut"], activity: "land prep & sowing" },
  6:  { name: "Kharif", emoji: "🌧️", crops: ["Rice","Cotton","Maize","Soybean","Groundnut"], activity: "growth & weeding"   },
  7:  { name: "Kharif", emoji: "🌧️", crops: ["Rice","Cotton","Maize","Soybean","Groundnut"], activity: "growth & pesticide" },
  8:  { name: "Kharif", emoji: "🌧️", crops: ["Rice","Cotton","Maize","Soybean","Groundnut"], activity: "harvesting"         },
  9:  { name: "Rabi",   emoji: "🌾", crops: ["Wheat","Mustard","Gram","Barley","Pea"],     activity: "land prep & sowing"   },
  10: { name: "Rabi",   emoji: "��", crops: ["Wheat","Mustard","Gram","Barley","Pea"],     activity: "sowing"               },
  11: { name: "Rabi",   emoji: "🌾", crops: ["Wheat","Mustard","Gram","Barley","Pea"],     activity: "sowing & irrigation"  },
};

const GRADIENT: Record<string, string> = {
  Rabi:   "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
  Zaid:   "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  Kharif: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
};

const FALLBACK: Record<string, Record<string, string>> = {
  "0":  { karnataka: "Soil moisture is optimal for Rabi sowing. Wheat and mustard are thriving in northern Karnataka. Start irrigation planning now.", maharashtra: "Cool nights in Vidarbha are perfect for gram and chickpea. Mustard sowing window is open.", punjab: "Peak Rabi season — wheat fields need first irrigation within 20 days of sowing. Check seed germination.", default: "Rabi season is in full swing. Focus on timely irrigation and balanced fertiliser application for wheat and mustard." },
  "1":  { karnataka: "Rabi crops are in the vegetative stage. Apply nitrogenous fertiliser to wheat fields now for better tillering.", maharashtra: "Monitor gram crops for pod borer infestation. Mustard flowering has begun in Nashik region.", punjab: "Wheat tillering stage — apply second dose of urea. Avoid waterlogging in poorly drained fields.", default: "Monitor Rabi crops closely. Apply second fertiliser dose and watch for early pest activity in gram and mustard." },
  "2":  { karnataka: "Rabi harvest is approaching. Ensure timely harvesting to prevent lodging losses. Drying facilities should be ready.", maharashtra: "Wheat and gram harvest season. Arrange for storage and check MSP procurement centres nearby.", punjab: "Wheat harvest season begins. Ensure combines are serviced. Stubble burning alternatives are encouraged.", default: "Rabi harvesting month. Timely harvest prevents grain shattering losses. Arrange storage and market linkage." },
  "3":  { karnataka: "Zaid season begins. Summer vegetables like cucumber, watermelon, and moong are ideal for light soils.", maharashtra: "Short-duration Zaid crops can generate extra income. Watermelon and bottle gourd respond well to drip irrigation.", punjab: "Zaid moong cultivation after wheat harvest is excellent for soil nitrogen replenishment and extra income.", default: "Zaid season offers an opportunity for short-duration crops. Moong and vegetables give good returns in summer." },
  "4":  { karnataka: "Summer vegetables need regular irrigation. Mulching helps retain soil moisture and reduce water usage by 30%.", maharashtra: "Watch for whitefly and leaf curl virus in summer vegetables. Sticky traps help with early detection.", punjab: "Moong crops are in the flowering stage. Light irrigation every 5–7 days improves pod setting significantly.", default: "Zaid crops need regular irrigation in peak summer. Monitor for heat stress and apply mulching where possible." },
  "5":  { karnataka: "Pre-monsoon showers signal Kharif sowing time. Prepare fields for rice transplanting and cotton sowing.", maharashtra: "Southwest monsoon onset expected. Cotton and soybean sowing should begin with the first good rain.", punjab: "Paddy nursery preparation time. Use certified seeds and treat with fungicide before sowing.", default: "Kharif season begins with monsoon onset. Land preparation and seed selection for rice, maize, and cotton are priorities." },
  "6":  { karnataka: "Kharif crops are in active growth. Apply potassic fertiliser to rice and weed control is critical now.", maharashtra: "Soybean and cotton are in the vegetative stage. Spray micronutrients if yellowing is observed.", punjab: "Paddy transplanting is complete. Monitor for stem borer and brown plant hopper infestations.", default: "Kharif crops are growing rapidly. Weed management and timely fertiliser application are essential now." },
  "7":  { karnataka: "Cotton bollworm risk is high. Use pheromone traps and Bt sprays for integrated pest management.", maharashtra: "Soybean pods are developing. Protect from girdle beetle with timely spraying. Avoid excess nitrogen now.", punjab: "Paddy is at panicle initiation stage. Ensure proper water management and watch for neck blast disease.", default: "Critical growth stage for Kharif crops. Pest and disease surveillance must be intensified this month." },
  "8":  { karnataka: "Kharif harvest season. Rice and maize are ready. Arrange proper drying to prevent post-harvest losses.", maharashtra: "Cotton picking season begins. Early picking improves fibre quality. Soybean harvesting underway.", punjab: "Paddy harvest with combines. Straw management is important — consider happy seeder for wheat sowing.", default: "Kharif harvest season. Timely harvesting and proper storage are critical to protect crop quality and value." },
  "9":  { karnataka: "Post-Kharif field preparation. Apply lime to acidic soils before Rabi sowing for better wheat germination.", maharashtra: "Rabi sowing window opens. Chickpea and rabi jowar perform well in residual moisture conditions.", punjab: "Wheat sowing preparation. Deep ploughing and levelling improve water distribution and germination.", default: "Post-Kharif land preparation for Rabi. Deep ploughing, soil testing, and seed procurement are priorities." },
  "10": { karnataka: "Rabi sowing in full swing. Use certified wheat and mustard seeds. Timely sowing improves yield by up to 15%.", maharashtra: "Wheat and gram sowing continues. Seed treatment with fungicide prevents soil-borne diseases.", punjab: "Prime wheat sowing time is November 1–25. Later sowing reduces yield — prioritise this window.", default: "Optimal Rabi sowing month. Timely planting of wheat and mustard gives best yield. Use treated certified seeds." },
  "11": { karnataka: "Rabi crops are emerging. First irrigation for wheat is critical 20–25 days after sowing for proper tillering.", maharashtra: "Monitor wheat and gram emergence. Apply pre-emergence herbicide for effective weed control.", punjab: "Wheat emergence stage. Apply first irrigation at crown root initiation stage for strong root development.", default: "Rabi crops emerging. First irrigation timing is critical for wheat. Monitor for cutworm damage in young plants." },
};

function getStateGroup(state: string): string {
  const map: Record<string, string> = {
    karnataka: "karnataka", andhra_pradesh: "karnataka", telangana: "karnataka",
    tamil_nadu: "karnataka", kerala: "karnataka",
    maharashtra: "maharashtra", goa: "maharashtra",
    madhya_pradesh: "maharashtra", chhattisgarh: "maharashtra",
    punjab: "punjab", haryana: "punjab", himachal_pradesh: "punjab",
    uttarakhand: "punjab", uttar_pradesh: "punjab",
  };
  return map[state] || "default";
}

async function fetchGroqAdvisory(
  state: string, season: string, month: number, crops: string[], activity: string
): Promise<string> {
  const stateLabel = state.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const monthName  = new Date(2024, month).toLocaleString("en", { month: "long" });

  const prompt = `You are an expert Indian agricultural advisor. Write a single short advisory message (2–3 sentences, max 60 words) for farmers in ${stateLabel} for ${monthName}.

Context:
- Current season: ${season}
- Key crops this season: ${crops.slice(0, 3).join(", ")}
- Current farming activity: ${activity}
- State: ${stateLabel}

Write a practical, specific, actionable tip. Mention the state name, season name, and at least one specific crop. Be warm and encouraging. No bullet points, no headers, plain paragraph only.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 120,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return data.content?.[0]?.text?.trim() || "";
}

export default function SeasonalAdvisory({ state }: { state: string }) {
  const [advisory, setAdvisory] = useState("");
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [isAI, setIsAI]         = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const month  = new Date().getMonth();
  const season = SEASON_INFO[month];
  const grad   = GRADIENT[season.name];

  const load = async (force = false) => {
    const cacheKey = `advisory_${state}_${month}`;
    if (!force) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { text, ts, ai } = JSON.parse(cached);
        // Cache for 7 days
        if (Date.now() - ts < 7 * 24 * 60 * 60 * 1000) {
          setAdvisory(text); setIsAI(ai); setLoading(false); return;
        }
      }
    }

    setLoading(true);
    try {
      const text = await fetchGroqAdvisory(state, season.name, month, season.crops, season.activity);
      if (text) {
        setAdvisory(text); setIsAI(true);
        localStorage.setItem(cacheKey, JSON.stringify({ text, ts: Date.now(), ai: true }));
      } else throw new Error("empty");
    } catch {
      // Graceful fallback to static tips
      const group  = getStateGroup(state);
      const tips   = FALLBACK[String(month)];
      const text   = tips?.[group] || tips?.["default"] || "Stay updated on local mandi prices and seasonal crop advisories.";
      setAdvisory(text); setIsAI(false);
      localStorage.setItem(cacheKey, JSON.stringify({ text, ts: Date.now(), ai: false }));
    } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, [state]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const cacheKey = `advisory_${state}_${month}`;
    localStorage.removeItem(cacheKey);
    await load(true);
  };

  const preview = advisory.length > 100 ? advisory.slice(0, 100) + "…" : advisory;

  if (loading) return (
    <div className="rounded-2xl p-4 mb-4 animate-pulse"
      style={{ background: grad, opacity: 0.7, height: 88 }} />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="rounded-2xl mb-4 overflow-hidden"
      style={{ background: grad }}>

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">{season.emoji}</span>
            <div>
              <p className="text-xs font-bold text-white opacity-90">
                {season.name} Season Advisory
              </p>
              <p className="text-white opacity-60" style={{ fontSize: 10 }}>
                {season.crops.slice(0, 3).join(" · ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isAI && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-white"
                style={{ background: "rgba(255,255,255,0.15)", fontSize: 9, fontWeight: 700 }}>
                <Sparkles style={{ width: 8, height: 8 }} /> AI
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-7 h-7 rounded-xl flex items-center justify-center transition-all"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <RefreshCw
                className={`w-3 h-3 text-white ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Advisory text */}
        <p className="text-white text-xs leading-relaxed mb-2" style={{ opacity: 0.92 }}>
          {expanded ? advisory : preview}
        </p>

        {/* Expand toggle */}
        {advisory.length > 100 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-white"
            style={{ opacity: 0.75, fontSize: 10, fontWeight: 600 }}>
            {expanded
              ? <><ChevronUp  className="w-3 h-3" /> Show less</>
              : <><ChevronDown className="w-3 h-3" /> Read more</>}
          </button>
        )}

        {/* Season crop pills */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3">
              <p className="text-white text-xs font-semibold mb-2" style={{ opacity: 0.7 }}>
                Key crops this season
              </p>
              <div className="flex flex-wrap gap-1.5">
                {season.crops.map(c => (
                  <span key={c}
                    className="text-white rounded-xl px-2 py-1"
                    style={{ background: "rgba(255,255,255,0.18)", fontSize: 10, fontWeight: 600 }}>
                    <Sprout className="w-2.5 h-2.5 inline mr-1" />
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-3 pt-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                <p className="text-white" style={{ fontSize: 10, opacity: 0.6 }}>
                  Activity: {season.activity} · Refreshed weekly
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
