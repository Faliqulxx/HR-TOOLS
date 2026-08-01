import { SKILL_SYNONYMS } from "./skill-dictionary";

// ── Types ─────────────────────────────────────────────────────────────────────

export type JobRequirement = {
  skillName: string;
  isMandatory: boolean;
  weight: number;
};

export type MatchDetailItem = {
  skill: string;
  isMandatory: boolean;
  weight: number;
  matched: boolean;
  ratio: number; // 0, 0.5, or 1.0
};

export type MatchResult = {
  score: number; // 0–100, rounded to 1 decimal
  detail: MatchDetailItem[];
};

// ── Synonym map — flatten to lowercase lookup ──────────────────────────────────

const SYNONYM_LOOKUP: Record<string, string> = {};
for (const [canonical, aliases] of Object.entries(SKILL_SYNONYMS)) {
  for (const alias of aliases) {
    SYNONYM_LOOKUP[alias.toLowerCase()] = canonical.toLowerCase();
  }
}

// ── Core matching logic ────────────────────────────────────────────────────────

function getRatio(requirementSkill: string, candidateSkills: string[]): number {
  const reqLower = requirementSkill.toLowerCase();

  // Normalise candidate skills to lowercase once
  const candidateLower = candidateSkills.map((s) => s.toLowerCase());

  // 1. Exact / partial match (case-insensitive)
  const exactMatch = candidateLower.some(
    (cs) => cs === reqLower || cs.includes(reqLower) || reqLower.includes(cs)
  );
  if (exactMatch) return 1.0;

  // 2. Synonym match — check if any candidate skill is a synonym of the requirement
  //    OR if the requirement is a synonym of any candidate skill
  const reqCanonical = SYNONYM_LOOKUP[reqLower] ?? reqLower;
  for (const cs of candidateLower) {
    const csCanonical = SYNONYM_LOOKUP[cs] ?? cs;
    if (csCanonical === reqCanonical) return 0.5;
    // Also check if candidate skill's canonical maps to the requirement
    if (cs === reqCanonical || reqLower === csCanonical) return 0.5;
  }

  return 0;
}

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Calculates a 0–100 weighted match score for a candidate against job requirements.
 *
 * Formula:
 *   score = ( Σ (weight × ratio) / Σ weight ) × 100, rounded to 1 decimal
 *
 * ratio values:
 *   1.0  = exact or partial match
 *   0.5  = synonym match
 *   0    = no match
 */
export function calculateMatchScore(
  requirements: JobRequirement[],
  candidateSkills: string[]
): MatchResult {
  if (!requirements.length) {
    return { score: 0, detail: [] };
  }

  let totalWeight = 0;
  let weightedScore = 0;

  const detail: MatchDetailItem[] = requirements.map((req) => {
    const ratio = getRatio(req.skillName, candidateSkills);
    const weight = req.weight ?? (req.isMandatory ? 2 : 1);

    totalWeight += weight;
    weightedScore += weight * ratio;

    return {
      skill: req.skillName,
      isMandatory: req.isMandatory,
      weight,
      matched: ratio > 0,
      ratio,
    };
  });

  const score =
    totalWeight > 0
      ? Math.round((weightedScore / totalWeight) * 100 * 10) / 10
      : 0;

  return { score, detail };
}
