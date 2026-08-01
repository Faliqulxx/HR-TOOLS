import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Mail,
  Phone,
  Link2,
  GitBranch,
  Globe,
  FileEdit,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCandidateById } from "@/lib/actions/candidate.actions";
import { generateSummary } from "@/lib/ai/summary";
import { prisma } from "@/lib/prisma";
import { CandidateTabs } from "@/components/candidates/CandidateTabs";
import type { MatchDetailItem } from "@/lib/ai/matching";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getCandidateById(id);
  return {
    title: candidate
      ? `${candidate.fullName} — HR Tools`
      : "Candidate — HR Tools",
  };
}

const parsingStatusConfig: Record<string, { label: string; className: string }> = {
  parsed: {
    label: "Parsed",
    className: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  },
  needs_review: {
    label: "Needs Review",
    className: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  },
  failed: {
    label: "Failed",
    className: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
  },
};

export default async function CandidateDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ jobId?: string }>;
}) {
  const { id } = await params;
  const { jobId } = await searchParams;

  const candidate = await getCandidateById(id);
  if (!candidate) notFound();

  // Fetch application context if jobId param is present
  let application = null;
  let jobTitle: string | null = null;

  if (jobId) {
    application = await prisma.application.findUnique({
      where: { candidateId_jobId: { candidateId: id, jobId } },
      include: { job: { select: { title: true } } },
    });
    jobTitle = application?.job?.title ?? null;
  }

  // Generate AI summary (template-based)
  const aiSummary = generateSummary(
    {
      fullName: candidate.fullName,
      experiences: candidate.experiences.map((e) => ({
        company: e.company,
        position: e.position,
        startDate: e.startDate,
        endDate: e.endDate,
        isCurrent: e.isCurrent,
      })),
      skills: candidate.skills,
      educations: candidate.educations.map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        major: edu.major,
        gpa: edu.gpa,
        endYear: edu.endYear,
      })),
      certifications: candidate.certifications,
    },
    application
      ? {
          matchScore: application.matchScore,
          job: application.job,
        }
      : null
  );

  // Optionally persist aiSummary to Application if changed
  if (application && application.aiSummary !== aiSummary) {
    await prisma.application.update({
      where: { candidateId_jobId: { candidateId: id, jobId: jobId! } },
      data: { aiSummary },
    });
  }

  const matchDetail = application?.matchDetail as unknown as
    | MatchDetailItem[]
    | null;

  const statusCfg =
    parsingStatusConfig[candidate.parsingStatus] ??
    parsingStatusConfig.needs_review;

  // Initials for avatar
  const initials = candidate.fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        {jobId ? (
          <>
            <Link
              href={`/jobs/${jobId}/candidates`}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              Candidates
            </Link>
            <ChevronLeft className="h-3 w-3 text-slate-700 rotate-180" />
            <span className="text-slate-400">{candidate.fullName}</span>
          </>
        ) : (
          <Link
            href="/candidates/upload"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Upload
          </Link>
        )}
      </div>

      {/* Profile header */}
      <div className="mb-8 flex items-start gap-5 flex-wrap">
        {/* Avatar */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xl font-bold shadow-lg shadow-violet-900/30">
          {initials || <User className="h-7 w-7" />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-2xl font-bold text-white">
              {candidate.fullName}
            </h1>
            <Badge className={statusCfg.className}>{statusCfg.label}</Badge>
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-400">
            {candidate.email && (
              <a
                href={`mailto:${candidate.email}`}
                className="flex items-center gap-1.5 hover:text-violet-400 transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-slate-600" />
                {candidate.email}
              </a>
            )}
            {candidate.phone && (
              <a
                href={`tel:${candidate.phone}`}
                className="flex items-center gap-1.5 hover:text-violet-400 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-slate-600" />
                {candidate.phone}
              </a>
            )}
            {candidate.linkedinUrl && (
              <a
                href={
                  candidate.linkedinUrl.startsWith("http")
                    ? candidate.linkedinUrl
                    : `https://${candidate.linkedinUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-violet-400 transition-colors"
              >
                <Link2 className="h-3.5 w-3.5 text-slate-600" />
                LinkedIn
              </a>
            )}
            {candidate.githubUrl && (
              <a
                href={
                  candidate.githubUrl.startsWith("http")
                    ? candidate.githubUrl
                    : `https://${candidate.githubUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-violet-400 transition-colors"
              >
                <GitBranch className="h-3.5 w-3.5 text-slate-600" />
                GitHub
              </a>
            )}
            {candidate.portfolioUrl && (
              <a
                href={
                  candidate.portfolioUrl.startsWith("http")
                    ? candidate.portfolioUrl
                    : `https://${candidate.portfolioUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-violet-400 transition-colors"
              >
                <Globe className="h-3.5 w-3.5 text-slate-600" />
                Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Edit button */}
        <Link href={`/candidates/${candidate.id}/review-parsing`}>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-400 hover:bg-slate-800 gap-2 shrink-0"
          >
            <FileEdit className="h-3.5 w-3.5" />
            Edit Data
          </Button>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Skills"
          value={candidate.skills.length}
          color="violet"
        />
        <StatCard
          label="Experience"
          value={`${candidate.experiences.length} roles`}
          color="blue"
        />
        <StatCard
          label="Education"
          value={candidate.educations[0]?.degree ?? "–"}
          color="emerald"
        />
        <StatCard
          label="Certifications"
          value={candidate.certifications.length}
          color="amber"
        />
      </div>

      {/* Tabs */}
      <CandidateTabs
        candidate={candidate}
        aiSummary={aiSummary}
        matchScore={application?.matchScore ?? null}
        matchDetail={matchDetail ?? undefined}
        jobTitle={jobTitle}
      />
    </div>
  );
}

// ── Stat card helper ──────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "violet" | "blue" | "emerald" | "amber";
}) {
  const colorMap = {
    violet: "border-violet-500/20 bg-violet-500/5",
    blue: "border-blue-500/20 bg-blue-500/5",
    emerald: "border-emerald-500/20 bg-emerald-500/5",
    amber: "border-amber-500/20 bg-amber-500/5",
  };

  const textMap = {
    violet: "text-violet-400",
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
  };

  return (
    <div
      className={`rounded-xl border ${colorMap[color]} p-3 text-center`}
    >
      <p className={`text-lg font-bold truncate ${textMap[color]}`}>
        {value}
      </p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
