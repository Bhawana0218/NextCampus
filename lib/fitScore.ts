import type { College, CollegeWithScore, RecommendInput } from "@/types";

/**
 * Fit Score Engine — computes a 0–100 suitability score for a college
 * based on user preferences. This is the intelligence layer that transforms
 * NextCampus from a listing app into a decision engine.
 */
export function computeFitScore(
  college: College,
  input: RecommendInput
): CollegeWithScore {
  const breakdown = { fees: 0, placement: 0, rating: 0, location: 0 };

  // ── Fees score (30 pts) ──────────────────────────────────────────────────
  // Lower fees relative to budget = higher score
  if (input.budget && input.budget > 0) {
    const ratio = college.fees / input.budget;
    if (ratio <= 0.5) breakdown.fees = 30;
    else if (ratio <= 0.75) breakdown.fees = 25;
    else if (ratio <= 1.0) breakdown.fees = 18;
    else if (ratio <= 1.25) breakdown.fees = 10;
    else breakdown.fees = 3;
  } else {
    // No budget specified — score based on absolute affordability
    if (college.fees <= 150000) breakdown.fees = 28;
    else if (college.fees <= 250000) breakdown.fees = 22;
    else if (college.fees <= 400000) breakdown.fees = 15;
    else breakdown.fees = 8;
  }

  // ── Placement score (35 pts) ─────────────────────────────────────────────
  const placementPct = parseInt(college.placements.replace("%", "")) || 0;
  if (placementPct >= 95) breakdown.placement = 35;
  else if (placementPct >= 90) breakdown.placement = 30;
  else if (placementPct >= 85) breakdown.placement = 24;
  else if (placementPct >= 80) breakdown.placement = 17;
  else breakdown.placement = 10;

  // ── Rating score (20 pts) ────────────────────────────────────────────────
  breakdown.rating = Math.round(((college.rating - 3.5) / 1.5) * 20);
  breakdown.rating = Math.max(0, Math.min(20, breakdown.rating));

  // ── Location score (15 pts) ──────────────────────────────────────────────
  if (input.location) {
    const preferred = input.location.toLowerCase();
    const colState = college.state.toLowerCase();
    const colCity = college.location.toLowerCase();
    if (colState === preferred || colCity === preferred) {
      breakdown.location = 15;
    } else if (
      // Nearby state bonus
      (preferred === "delhi" && colState === "uttar pradesh") ||
      (preferred === "maharashtra" && colState === "karnataka") ||
      (preferred === "tamil nadu" && colState === "karnataka")
    ) {
      breakdown.location = 8;
    } else {
      breakdown.location = 3;
    }
  } else {
    breakdown.location = 10; // neutral if no preference
  }

  const fitScore = Math.min(
    100,
    breakdown.fees + breakdown.placement + breakdown.rating + breakdown.location
  );

  return { ...college, fitScore, fitBreakdown: breakdown };
}

export function rankColleges(
  colleges: College[],
  input: RecommendInput
): CollegeWithScore[] {
  return colleges
    .map((c) => computeFitScore(c, input))
    .sort((a, b) => b.fitScore - a.fitScore);
}

export function getFitLabel(score: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (score >= 80) return { label: "Excellent Fit", color: "text-green-700", bg: "bg-green-100" };
  if (score >= 65) return { label: "Good Fit", color: "text-blue-700", bg: "bg-blue-100" };
  if (score >= 50) return { label: "Moderate Fit", color: "text-amber-700", bg: "bg-amber-100" };
  return { label: "Low Fit", color: "text-red-700", bg: "bg-red-100" };
}
