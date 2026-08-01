// Template-based AI summary generator (no LLM — pure string interpolation)
// PRD 4.4 contract

type SummaryCandidate = {
  fullName: string;
  experiences: {
    company: string;
    position: string;
    startDate: Date | null;
    endDate: Date | null;
    isCurrent: boolean;
  }[];
  skills: { skillName: string }[];
  educations: {
    institution: string;
    degree: string | null;
    major: string | null;
    gpa: number | null;
    endYear: number | null;
  }[];
  certifications: { name: string }[];
};

type SummaryApplication = {
  matchScore: number | null;
  job?: { title: string } | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcYearsOfExperience(
  experiences: SummaryCandidate["experiences"]
): number {
  if (!experiences.length) return 0;

  // Sum months across all experiences
  let totalMonths = 0;
  const now = new Date();

  for (const exp of experiences) {
    const start = exp.startDate ? new Date(exp.startDate) : null;
    const end = exp.isCurrent || !exp.endDate ? now : new Date(exp.endDate);
    if (!start) continue;
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    totalMonths += Math.max(0, months);
  }

  return Math.round(totalMonths / 12);
}

function getLastExperience(experiences: SummaryCandidate["experiences"]) {
  // Sort by startDate desc, pick first
  const sorted = [...experiences].sort((a, b) => {
    const aDate = a.startDate ? new Date(a.startDate).getTime() : 0;
    const bDate = b.startDate ? new Date(b.startDate).getTime() : 0;
    return bDate - aDate;
  });
  return sorted[0] ?? null;
}

function getTopSkills(
  skills: { skillName: string }[],
  n: number
): string {
  return skills
    .slice(0, n)
    .map((s) => s.skillName)
    .join(", ");
}

function certificationNote(certifications: { name: string }[]): string {
  if (!certifications.length) return "";
  if (certifications.length === 1)
    return `Holds 1 certification: ${certifications[0].name}.`;
  return `Holds ${certifications.length} certifications including ${certifications[0].name}.`;
}

function educationNote(
  educations: SummaryCandidate["educations"]
): string {
  if (!educations.length) return "";
  const edu = educations[0];
  const parts: string[] = [];
  if (edu.degree) parts.push(edu.degree);
  if (edu.major) parts.push(`in ${edu.major}`);
  parts.push(`from ${edu.institution}`);
  if (edu.gpa) parts.push(`(GPA: ${edu.gpa})`);
  return parts.join(" ");
}

// ── Main function ─────────────────────────────────────────────────────────────

export function generateSummary(
  candidate: SummaryCandidate,
  application?: SummaryApplication | null
): string {
  const name = candidate.fullName || "This candidate";
  const years = calcYearsOfExperience(candidate.experiences);
  const lastExp = getLastExperience(candidate.experiences);
  const topSkills = getTopSkills(candidate.skills, 3);
  const certNote = certificationNote(candidate.certifications);
  const eduNote = educationNote(candidate.educations);

  // Experience sentence
  let expSentence: string;
  if (years === 0 && !lastExp) {
    expSentence = `${name} is a fresh candidate with no recorded work experience.`;
  } else if (years === 0 && lastExp) {
    expSentence = `${name} has experience as ${lastExp.position} at ${lastExp.company}.`;
  } else {
    const yearLabel = years === 1 ? "year" : "years";
    expSentence = lastExp
      ? `${name} has ${years} ${yearLabel} of experience, most recently as ${lastExp.position} at ${lastExp.company}.`
      : `${name} has approximately ${years} ${yearLabel} of work experience.`;
  }

  // Skills sentence
  const skillsSentence = topSkills
    ? `Core skills include ${topSkills}.`
    : "No specific skills were detected.";

  // Education sentence
  const eduSentence = eduNote ? `Education: ${eduNote}.` : "";

  // Match score sentence
  let matchSentence = "";
  if (application?.matchScore != null && application.job?.title) {
    const score = application.matchScore.toFixed(1);
    const qualifier =
      application.matchScore >= 80
        ? "an excellent"
        : application.matchScore >= 60
          ? "a good"
          : application.matchScore >= 40
            ? "a moderate"
            : "a low";
    matchSentence = `Overall match: ${score}% — ${qualifier} fit for the ${application.job.title} position.`;
  }

  return [expSentence, skillsSentence, certNote, eduSentence, matchSentence]
    .filter(Boolean)
    .join(" ");
}
