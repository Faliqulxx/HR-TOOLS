import { SKILL_DICTIONARY } from "./skill-dictionary";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ParsedEducation = {
  institution: string;
  degree?: string;
  major?: string;
  gpa?: number;
  startYear?: number;
  endYear?: number;
};

export type ParsedExperience = {
  company: string;
  position: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent?: boolean;
  description?: string;
};

export type ParsedCertification = {
  name: string;
  issuer?: string;
  year?: number;
};

export type ParsedResumeData = {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  educations: ParsedEducation[];
  experiences: ParsedExperience[];
  skills: string[];
  certifications: ParsedCertification[];
};

// ── Regex Patterns ────────────────────────────────────────────────────────────

const EMAIL_REGEX = /[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX =
  /(?:\+62|62|08)\d{7,13}|(?:\+1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i;
const PORTFOLIO_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?!linkedin|github)[\w-]+\.(?:com|io|dev|me|id|net|co)(?:\/[\w-]*)?/i;
const YEAR_REGEX = /\b(19|20)\d{2}\b/g;

// Section heading patterns
const SECTION_PATTERNS: Record<string, RegExp> = {
  education: /^(?:education|academic|riwayat pendidikan|pendidikan)/im,
  experience:
    /^(?:experience|work experience|employment|pengalaman|pengalaman kerja)/im,
  skills:
    /^(?:skills|technical skills|core competencies|keahlian|kemampuan)/im,
  certification:
    /^(?:certifications?|licenses?|achievements?|sertifikasi|penghargaan)/im,
  summary: /^(?:summary|objective|profile|about me|ringkasan)/im,
};

// ── Section Splitter ──────────────────────────────────────────────────────────

type Sections = {
  header: string;
  education: string;
  experience: string;
  skills: string;
  certification: string;
};

function splitSections(text: string): Sections {
  // Normalize line endings
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized.split("\n");

  const sectionBoundaries: { name: string; lineIndex: number }[] = [];
  const sectionKeys = Object.keys(SECTION_PATTERNS) as (keyof typeof SECTION_PATTERNS)[];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.length < 2 || trimmed.length > 60) return;
    for (const key of sectionKeys) {
      if (SECTION_PATTERNS[key].test(trimmed)) {
        sectionBoundaries.push({ name: key, lineIndex: index });
        break;
      }
    }
  });

  // Build sections
  const sections: Record<string, string> = {
    header: "",
    education: "",
    experience: "",
    skills: "",
    certification: "",
  };

  // Header = everything before first recognized section
  const firstBoundary = sectionBoundaries[0];
  sections.header = firstBoundary
    ? lines.slice(0, firstBoundary.lineIndex).join("\n")
    : normalized;

  sectionBoundaries.forEach((boundary, i) => {
    const nextBoundary = sectionBoundaries[i + 1];
    const content = lines
      .slice(boundary.lineIndex + 1, nextBoundary?.lineIndex)
      .join("\n");
    sections[boundary.name] = (sections[boundary.name] || "") + "\n" + content;
  });

  return sections as Sections;
}

// ── Contact Info Extraction ───────────────────────────────────────────────────

function extractEmail(text: string): string | null {
  return text.match(EMAIL_REGEX)?.[0] ?? null;
}

function extractPhone(text: string): string | null {
  return text.match(PHONE_REGEX)?.[0] ?? null;
}

function extractLinkedin(text: string): string | null {
  return text.match(LINKEDIN_REGEX)?.[0] ?? null;
}

function extractGithub(text: string): string | null {
  return text.match(GITHUB_REGEX)?.[0] ?? null;
}

function extractPortfolio(text: string): string | null {
  // Find URLs that are NOT linkedin or github
  const urls = text.match(
    /(?:https?:\/\/)?(?:www\.)?[\w-]+\.(?:com|io|dev|me|id|net|co\.id)(?:\/[\w/-]*)?/gi
  );
  if (!urls) return null;
  const portfolio = urls.find(
    (u) => !u.includes("linkedin.com") && !u.includes("github.com")
  );
  return portfolio ?? null;
}

function extractFullName(headerText: string): string | null {
  // Strategy: first non-empty line that looks like a name
  // Name heuristic: 2-5 words, mostly letters, no @/:/ patterns
  const lines = headerText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  for (const line of lines.slice(0, 8)) {
    // Skip lines that look like contact info
    if (EMAIL_REGEX.test(line)) continue;
    if (PHONE_REGEX.test(line)) continue;
    if (/https?:|linkedin|github|@/.test(line)) continue;
    // A name: 2-5 words, each starting with uppercase letter, no digits
    const words = line.split(/\s+/);
    if (
      words.length >= 2 &&
      words.length <= 5 &&
      words.every((w) => /^[A-ZÀ-Ú][a-zA-ZÀ-ú'-]*$/.test(w))
    ) {
      return line;
    }
  }
  return null;
}

// ── Education Parser ──────────────────────────────────────────────────────────

const DEGREE_PATTERNS =
  /\b(Bachelor|B\.?Sc?|B\.?A|Master|M\.?Sc?|M\.?A|MBA|Ph\.?D|Doctorate|Diploma|D3|D4|S1|S2|S3|Associate|Engineer)\b/i;
const GPA_REGEX = /(?:GPA|IPK)\s*[:\s]?\s*(\d+[.,]\d+)/i;

function parseEducations(text: string): ParsedEducation[] {
  if (!text.trim()) return [];

  const educations: ParsedEducation[] = [];
  // Split by blank lines or lines that contain a year
  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    if (!block) continue;
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const years = [...block.matchAll(YEAR_REGEX)].map((m) => parseInt(m[0]));
    const gpaMatch = block.match(GPA_REGEX);
    const degreeMatch = block.match(DEGREE_PATTERNS);

    // Institution: first line that doesn't look like a degree or date
    const institution =
      lines.find(
        (l) =>
          !DEGREE_PATTERNS.test(l) &&
          !YEAR_REGEX.test(l) &&
          l.length > 4 &&
          !GPA_REGEX.test(l)
      ) ?? lines[0];

    educations.push({
      institution,
      degree: degreeMatch?.[0],
      major: undefined, // hard to determine without LLM
      gpa: gpaMatch ? parseFloat(gpaMatch[1].replace(",", ".")) : undefined,
      startYear: years.length >= 2 ? Math.min(...years) : undefined,
      endYear: years.length >= 1 ? Math.max(...years) : undefined,
    });
  }

  return educations.slice(0, 5); // Limit to 5 entries
}

// ── Experience Parser ─────────────────────────────────────────────────────────

const MONTH_MAP: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
  january: 1, february: 2, march: 3, april: 4, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

function parseDate(text: string): Date | undefined {
  // Try "Month Year" format
  const match = text.match(/([a-zA-Z]+)\s+((?:19|20)\d{2})/);
  if (match) {
    const month = MONTH_MAP[match[1].toLowerCase()];
    const year = parseInt(match[2]);
    if (month && year) return new Date(year, month - 1, 1);
  }
  // Try just a year
  const yearMatch = text.match(/\b((?:19|20)\d{2})\b/);
  if (yearMatch) return new Date(parseInt(yearMatch[1]), 0, 1);
  return undefined;
}

function parseExperiences(text: string): ParsedExperience[] {
  if (!text.trim()) return [];

  const experiences: ParsedExperience[] = [];
  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    // Look for date range patterns: "Jan 2020 – Dec 2022" or "2020 - Present"
    const dateRangeLine = lines.find((l) =>
      /(?:present|current|sekarang|\d{4})\s*[-–—]\s*(?:present|current|sekarang|\d{4})/i.test(l)
    );

    const isCurrent =
      dateRangeLine
        ? /present|current|sekarang/i.test(dateRangeLine)
        : false;

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (dateRangeLine) {
      const parts = dateRangeLine.split(/[-–—]/);
      startDate = parseDate(parts[0]);
      endDate = isCurrent ? undefined : parseDate(parts[1] ?? "");
    }

    // Company & position: first 2 meaningful lines
    const infoLines = lines.filter(
      (l) => !dateRangeLine || l !== dateRangeLine
    );
    const company = infoLines[0] ?? "Unknown Company";
    const position = infoLines[1] ?? infoLines[0] ?? "Unknown Position";

    // Description: remaining lines
    const description = infoLines.slice(2).join(" ").trim() || undefined;

    if (company) {
      experiences.push({
        company,
        position,
        startDate,
        endDate,
        isCurrent,
        description,
      });
    }
  }

  return experiences.slice(0, 10);
}

// ── Skills Extraction ─────────────────────────────────────────────────────────

function extractSkills(fullText: string, skillsSection: string): string[] {
  const searchText = (skillsSection || fullText).toLowerCase();
  const found: Set<string> = new Set();

  for (const skill of SKILL_DICTIONARY) {
    if (searchText.includes(skill.toLowerCase())) {
      found.add(skill);
    }
  }

  return Array.from(found);
}

// ── Certification Parser ──────────────────────────────────────────────────────

function parseCertifications(text: string): ParsedCertification[] {
  if (!text.trim()) return [];

  const certs: ParsedCertification[] = [];
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 3);

  for (const line of lines) {
    const yearMatch = line.match(/\b((?:19|20)\d{2})\b/);
    const year = yearMatch ? parseInt(yearMatch[0]) : undefined;

    // Remove year from name
    const name = line.replace(/\b((?:19|20)\d{2})\b/, "").trim();
    if (name.length > 3) {
      certs.push({ name, year });
    }
  }

  return certs.slice(0, 10);
}

// ── Main Parser ───────────────────────────────────────────────────────────────

export function parseResume(rawText: string): ParsedResumeData {
  if (!rawText || rawText.trim().length === 0) {
    return {
      fullName: null,
      email: null,
      phone: null,
      linkedinUrl: null,
      githubUrl: null,
      portfolioUrl: null,
      educations: [],
      experiences: [],
      skills: [],
      certifications: [],
    };
  }

  const sections = splitSections(rawText);

  // Contacts come from header first, then entire text as fallback
  const contactSearchText = sections.header || rawText;

  return {
    fullName: extractFullName(sections.header || rawText),
    email: extractEmail(rawText),
    phone: extractPhone(rawText),
    linkedinUrl: extractLinkedin(rawText),
    githubUrl: extractGithub(rawText),
    portfolioUrl: extractPortfolio(contactSearchText),
    educations: parseEducations(sections.education),
    experiences: parseExperiences(sections.experience),
    skills: extractSkills(rawText, sections.skills),
    certifications: parseCertifications(sections.certification),
  };
}
