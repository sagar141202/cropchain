// Pure frontend risk scoring — no API call
// Inputs available on every proposal object from the backend

export type RiskLevel = "Low" | "Medium" | "High";

export interface RiskResult {
  level:      RiskLevel;
  score:      number;        // 0–100 (higher = riskier)
  color:      string;
  bg:         string;
  border:     string;
  factors:    { label: string; detail: string; impact: "good" | "neutral" | "bad" }[];
}

export function computeRisk(proposal: any): RiskResult {
  let score = 0;
  const factors: RiskResult["factors"] = [];

  // 1. ROI — unusually high ROI = higher risk
  const roi = Number(proposal.roi_percent) || 0;
  if (roi > 35) {
    score += 30;
    factors.push({ label: "Very high ROI", detail: `${roi}% ROI is aggressive — verify projections`, impact: "bad" });
  } else if (roi > 22) {
    score += 15;
    factors.push({ label: "High ROI", detail: `${roi}% ROI is above average — moderate risk`, impact: "neutral" });
  } else if (roi >= 10) {
    score += 5;
    factors.push({ label: "Healthy ROI", detail: `${roi}% ROI is realistic and sustainable`, impact: "good" });
  } else {
    score += 20;
    factors.push({ label: "Low ROI", detail: `${roi}% ROI is below market average`, impact: "bad" });
  }

  // 2. Farm area — very small or unverifiably large = riskier
  const area = Number(proposal.area_acres) || 0;
  if (area < 1) {
    score += 20;
    factors.push({ label: "Tiny farm", detail: `${area} acres — very small scale, limited yield buffer`, impact: "bad" });
  } else if (area <= 5) {
    score += 10;
    factors.push({ label: "Small farm", detail: `${area} acres — small scale, lower diversification`, impact: "neutral" });
  } else if (area <= 25) {
    score += 0;
    factors.push({ label: "Good farm size", detail: `${area} acres — solid scale for reliable yield`, impact: "good" });
  } else if (area <= 100) {
    score += 5;
    factors.push({ label: "Large farm", detail: `${area} acres — strong scale, verify water access`, impact: "neutral" });
  } else {
    score += 15;
    factors.push({ label: "Very large farm", detail: `${area} acres — high capital, verify management capacity`, impact: "bad" });
  }

  // 3. Ask amount relative to area — price/acre sanity check
  const ask    = Number(proposal.amount_requested) || 0;
  const perAcre = area > 0 ? ask / area : 999999;
  if (perAcre > 80000) {
    score += 20;
    factors.push({ label: "High ask/acre", detail: `₹${Math.round(perAcre / 1000)}K/acre is above typical range`, impact: "bad" });
  } else if (perAcre > 40000) {
    score += 8;
    factors.push({ label: "Moderate ask", detail: `₹${Math.round(perAcre / 1000)}K/acre — reasonable but verify`, impact: "neutral" });
  } else {
    score += 0;
    factors.push({ label: "Fair ask/acre", detail: `₹${Math.round(perAcre / 1000)}K/acre is competitive`, impact: "good" });
  }

  // 4. Expected yield vs area — sanity check (typical: 15–40 qtl/acre for wheat/rice)
  const yieldTotal  = Number(proposal.expected_yield) || 0;
  const yieldPerAcre = area > 0 ? yieldTotal / area : 0;
  if (yieldPerAcre > 60) {
    score += 15;
    factors.push({ label: "Optimistic yield", detail: `${yieldPerAcre.toFixed(0)} qtl/acre is very high — verify crop type`, impact: "bad" });
  } else if (yieldPerAcre >= 15 && yieldPerAcre <= 45) {
    score += 0;
    factors.push({ label: "Realistic yield", detail: `${yieldPerAcre.toFixed(0)} qtl/acre is within normal range`, impact: "good" });
  } else if (yieldPerAcre > 0) {
    score += 8;
    factors.push({ label: "Low yield estimate", detail: `${yieldPerAcre.toFixed(0)} qtl/acre — below average, check crop`, impact: "neutral" });
  }

  // 5. Has AI-generated pitch — signals completeness
  if (proposal.generated_pitch && proposal.generated_pitch.length > 100) {
    score -= 5;
    factors.push({ label: "AI-verified pitch", detail: "Proposal has a structured AI-generated pitch", impact: "good" });
  } else {
    score += 10;
    factors.push({ label: "No pitch", detail: "Proposal lacks a detailed pitch — less transparency", impact: "bad" });
  }

  const clamped = Math.max(0, Math.min(100, score));

  let level: RiskLevel;
  let color: string, bg: string, border: string;

  if (clamped <= 28) {
    level = "Low";    color = "#15803d"; bg = "#dcfce7"; border = "#86efac";
  } else if (clamped <= 55) {
    level = "Medium"; color = "#b45309"; bg = "#fef3c7"; border = "#fde68a";
  } else {
    level = "High";   color = "#b91c1c"; bg = "#fee2e2"; border = "#fecaca";
  }

  return { level, score: clamped, color, bg, border, factors };
}
