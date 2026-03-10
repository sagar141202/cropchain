"use client";
import { motion } from "framer-motion";

const FarmerEmptyIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 180, height: 144 }}>
    {/* Sky */}
    <rect width="200" height="160" rx="16" fill="var(--green-pale, #f0fdf4)" />

    {/* Sun */}
    <circle cx="160" cy="35" r="18" fill="#fef9c3" />
    <circle cx="160" cy="35" r="12" fill="#fde047" />
    {[0,45,90,135,180,225,270,315].map((angle, i) => (
      <line key={i}
        x1={160 + 15 * Math.cos(angle * Math.PI / 180)}
        y1={35  + 15 * Math.sin(angle * Math.PI / 180)}
        x2={160 + 22 * Math.cos(angle * Math.PI / 180)}
        y2={35  + 22 * Math.sin(angle * Math.PI / 180)}
        stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
    ))}

    {/* Clouds */}
    <ellipse cx="40"  cy="28" rx="18" ry="10" fill="white" opacity="0.9" />
    <ellipse cx="55"  cy="23" rx="14" ry="10" fill="white" opacity="0.9" />
    <ellipse cx="28"  cy="25" rx="12" ry="8"  fill="white" opacity="0.9" />
    <ellipse cx="100" cy="20" rx="14" ry="8"  fill="white" opacity="0.7" />
    <ellipse cx="113" cy="16" rx="10" ry="8"  fill="white" opacity="0.7" />

    {/* Ground */}
    <ellipse cx="100" cy="148" rx="95" ry="18" fill="#bbf7d0" />
    <rect x="5" y="136" width="190" height="24" rx="8" fill="#86efac" />

    {/* Empty field rows — dashed furrows */}
    {[118, 126, 134].map((y, i) => (
      <line key={i} x1="30" y1={y} x2="170" y2={y}
        stroke="#4ade80" strokeWidth="1.5" strokeDasharray="6 5" strokeLinecap="round" opacity="0.6" />
    ))}

    {/* Farmer body */}
    {/* Legs */}
    <rect x="91" y="112" width="8"  height="24" rx="4" fill="#6366f1" />
    <rect x="102" y="112" width="8" height="24" rx="4" fill="#6366f1" />
    {/* Boots */}
    <ellipse cx="95"  cy="136" rx="7" ry="4" fill="#3730a3" />
    <ellipse cx="106" cy="136" rx="7" ry="4" fill="#3730a3" />
    {/* Torso */}
    <rect x="86" y="85" width="28" height="30" rx="8" fill="#22c55e" />
    {/* Shirt pocket */}
    <rect x="90" y="90" width="8" height="6" rx="2" fill="#16a34a" />
    {/* Left arm — raised up scratching head */}
    <path d="M86 92 Q70 82 68 72" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" fill="none" />
    {/* Right arm — down, leaning on hoe */}
    <path d="M114 92 Q124 100 126 114" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" fill="none" />
    {/* Hoe */}
    <line x1="126" y1="114" x2="138" y2="138" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
    <rect x="130" y="134" width="14" height="5" rx="2" fill="#78350f" transform="rotate(-30 130 134)" />
    {/* Head */}
    <circle cx="100" cy="76" r="16" fill="#fbbf24" />
    {/* Hat brim */}
    <ellipse cx="100" cy="63" rx="20" ry="5" fill="#92400e" />
    {/* Hat top */}
    <rect x="88" y="44" width="24" height="20" rx="6" fill="#a16207" />
    {/* Hat band */}
    <rect x="88" y="58" width="24" height="5" rx="2" fill="#78350f" />
    {/* Eyes — looking sideways confused */}
    <ellipse cx="95"  cy="78" rx="2.5" ry="2.5" fill="#1e293b" />
    <ellipse cx="105" cy="78" rx="2.5" ry="2.5" fill="#1e293b" />
    <circle cx="96"  cy="77" r="1" fill="white" />
    <circle cx="106" cy="77" r="1" fill="white" />
    {/* Mouth — puzzled */}
    <path d="M95 84 Q100 82 105 84" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Sweat drop */}
    <ellipse cx="116" cy="70" rx="3" ry="4" fill="#93c5fd" opacity="0.8" />
    <path d="M116 66 L113 70 Q116 75 119 70 Z" fill="#93c5fd" opacity="0.8" />

    {/* Question mark above head */}
    <text x="72" y="55" fontSize="18" fill="#6366f1" fontWeight="bold" opacity="0.8">?</text>

    {/* Small wilted seedlings */}
    <path d="M55 118 Q55 108 55 102" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
    <path d="M55 108 Q48 104 44 100" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
    <ellipse cx="44" cy="100" rx="5" ry="3" fill="#86efac" opacity="0.6" />

    <path d="M145 120 Q145 110 145 104" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
    <path d="M145 110 Q152 106 156 102" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
    <ellipse cx="156" cy="102" rx="5" ry="3" fill="#86efac" opacity="0.6" />
  </svg>
);

const InvestorEmptyIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 180, height: 144 }}>
    {/* Background */}
    <rect width="200" height="160" rx="16" fill="#eef2ff" />

    {/* Desk surface */}
    <rect x="20" y="118" width="160" height="12" rx="6" fill="#c7d2fe" />
    <rect x="35" y="128" width="8"   height="20" rx="4" fill="#a5b4fc" />
    <rect x="157" y="128" width="8"  height="20" rx="4" fill="#a5b4fc" />

    {/* Documents on desk — empty */}
    <rect x="30" y="90" width="36" height="28" rx="4" fill="white" opacity="0.9" />
    <line x1="34" y1="98"  x2="62" y2="98"  stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="34" y1="103" x2="56" y2="103" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="34" y1="108" x2="58" y2="108" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="34" y1="113" x2="52" y2="113" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />

    <rect x="134" y="94" width="36" height="24" rx="4" fill="white" opacity="0.9" />
    <line x1="138" y1="101" x2="166" y2="101" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="138" y1="106" x2="160" y2="106" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="138" y1="111" x2="163" y2="111" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />

    {/* Magnifying glass — big */}
    <circle cx="105" cy="72" r="28" fill="white"   opacity="0.25" />
    <circle cx="105" cy="72" r="28" stroke="#6366f1" strokeWidth="5" />
    <circle cx="105" cy="72" r="22" fill="white"   opacity="0.15" />
    {/* Glass shine */}
    <path d="M96 62 Q100 58 108 60" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    {/* Handle */}
    <line x1="126" y1="93" x2="148" y2="115" stroke="#6366f1" strokeWidth="7" strokeLinecap="round" />
    <line x1="126" y1="93" x2="148" y2="115" stroke="#818cf8" strokeWidth="4" strokeLinecap="round" />

    {/* Inside magnifier — empty chart */}
    <path d="M90 80 L96 72 L102 76 L108 68 L114 72"
      stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Question mark inside */}
    <text x="99" y="80" fontSize="20" fill="#6366f1" fontWeight="bold" opacity="0.5">?</text>

    {/* Investor — sitting figure */}
    {/* Chair */}
    <rect x="72" y="112" width="36" height="6" rx="3" fill="#a5b4fc" />
    <rect x="76" y="117" width="4"  height="14" rx="2" fill="#818cf8" />
    <rect x="100" y="117" width="4" height="14" rx="2" fill="#818cf8" />
    {/* Body */}
    <rect x="76" y="88" width="28" height="26" rx="8" fill="#4f46e5" />
    {/* Tie */}
    <path d="M90 90 L93 102 L90 106 L87 102 Z" fill="#f59e0b" />
    {/* Arms — both reaching toward magnifier */}
    <path d="M76 96 Q60 88 58 80" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" fill="none" />
    <path d="M104 94 Q116 84 122 78" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" fill="none" />
    {/* Head */}
    <circle cx="90" cy="78" r="14" fill="#fbbf24" />
    {/* Hair */}
    <path d="M78 72 Q82 62 90 64 Q98 62 102 72" fill="#1e293b" />
    {/* Eyes — looking into magnifier */}
    <ellipse cx="86"  cy="79" rx="2" ry="2.5" fill="#1e293b" />
    <ellipse cx="94"  cy="79" rx="2" ry="2.5" fill="#1e293b" />
    <circle cx="87"  cy="78" r="0.8" fill="white" />
    <circle cx="95"  cy="78" r="0.8" fill="white" />
    {/* Mouth — focused */}
    <path d="M86 85 Q90 87 94 85" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Glasses */}
    <circle cx="86" cy="79" r="4.5" stroke="#1e293b" strokeWidth="1.5" fill="none" />
    <circle cx="94" cy="79" r="4.5" stroke="#1e293b" strokeWidth="1.5" fill="none" />
    <line x1="90" y1="79" x2="91" y2="79" stroke="#1e293b" strokeWidth="1.5" />
    <line x1="82" y1="79" x2="79" y2="77" stroke="#1e293b" strokeWidth="1.5" />
    <line x1="98" y1="79" x2="101" y2="77" stroke="#1e293b" strokeWidth="1.5" />

    {/* Floating coins */}
    <circle cx="32" cy="50" r="8" fill="#fde047" opacity="0.6" />
    <text x="28" y="54" fontSize="10" fill="#92400e" opacity="0.8">₹</text>
    <circle cx="168" cy="44" r="6" fill="#fde047" opacity="0.5" />
    <text x="165" y="48" fontSize="8" fill="#92400e" opacity="0.7">₹</text>
    <circle cx="22"  cy="80" r="5" fill="#fde047" opacity="0.4" />
    <circle cx="178" cy="72" r="7" fill="#fde047" opacity="0.45" />
    <text x="174" y="76" fontSize="9" fill="#92400e" opacity="0.7">₹</text>
  </svg>
);

const NoResultsIllustration = () => (
  <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 160, height: 112 }}>
    <rect width="200" height="140" rx="16" fill="#fef9c3" />
    {/* Search icon large */}
    <circle cx="88" cy="65" r="32" fill="white" opacity="0.4" />
    <circle cx="88" cy="65" r="32" stroke="#f59e0b" strokeWidth="5" />
    <line x1="111" y1="88" x2="132" y2="110" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
    <line x1="111" y1="88" x2="132" y2="110" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
    {/* X inside */}
    <line x1="76" y1="53" x2="100" y2="77" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
    <line x1="100" y1="53" x2="76"  y2="77" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
    {/* Shine */}
    <path d="M74 52 Q78 46 86 48" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    {/* Stars */}
    {[[155,30],[165,55],[148,60],[170,38]].map(([x,y], i) => (
      <text key={i} x={x} y={y} fontSize="14" fill="#fde047" opacity="0.7">✦</text>
    ))}
    {[[25,40],[18,65],[35,72]].map(([x,y], i) => (
      <text key={i} x={x} y={y} fontSize="10" fill="#fde047" opacity="0.5">✦</text>
    ))}
  </svg>
);

interface EmptyStateProps {
  type: "farmer-proposals" | "investor-proposals" | "no-results" | "portfolio";
  title: string;
  subtitle: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ type, title, subtitle, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass rounded-2xl p-8 text-center flex flex-col items-center">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 24 }}
        style={{ marginBottom: 20 }}>
        {type === "farmer-proposals"  && <FarmerEmptyIllustration />}
        {type === "investor-proposals" && <InvestorEmptyIllustration />}
        {type === "no-results"         && <NoResultsIllustration />}
        {type === "portfolio"          && <InvestorEmptyIllustration />}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}>
        <h3 className="font-bold text-base mb-1.5" style={{ color: "var(--text-1)" }}>{title}</h3>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-3)", maxWidth: 260 }}>{subtitle}</p>
        {action && (
          <button className="btn btn-green" onClick={action.onClick}>{action.label}</button>
        )}
      </motion.div>
    </motion.div>
  );
}
