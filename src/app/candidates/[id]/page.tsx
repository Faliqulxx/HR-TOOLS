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
      ? `${candidate.fullName} — Candidate Dossier | Signal HR`
      : "Candidate Dossier — Signal HR",
  };
}

const parsingStatusConfig: Record<string, { label: string; className: string }> = {
  parsed: {
    label: "Parsed & Verified",
    className: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono",
  },
  needs_review: {
    label: "Needs Review",
    className: "bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono",
  },
  failed: {
    label: "Parsing Failed",
    className: "bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono",
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

  let application = null;
  let jobTitle: string | null = null;

  if (jobId) {
    application = await prisma.application.findUnique({
      where: { candidateId_jobId: { candidateId: id, jobId } },
      include: { job: { select: { title: true } } },
    });
    jobTitle = application?.job?.title ?? null;
  }

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

  const initials = candidate.fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono">
        {jobId ? (
          <>
            <Link
              href={`/jobs/${jobId}/candidates`}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Candidate Leaderboard
            </Link>
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-300 font-semibold">{candidate.fullName}</span>
          </>
        ) : (
          <Link
            href="/candidates/upload"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Return to Upload Console
          </Link>
        )}
      </div>

      {/* Candidate Dossier Header */}
      <div className="rounded-xl border border-[#182238] bg-[#0E131F] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {/* Avatar Pill */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-xl font-mono font-extrabold shadow-md shadow-blue-900/30 ring-1 ring-blue-500/30">
            {initials || <User className="h-7 w-7" />}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
                {candidate.fullName}
              </h1>
              <Badge className={`${statusCfg.className} text-[10px]`}>
                {statusCfg.label}
              </Badge>
            </div>

            {/* Contact Details */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-slate-400 pt-1">
              {candidate.email && (
                <a
                  href={`mailto:${candidate.email}`}
                  className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {candidate.email}
                </a>
              )}
              {candidate.phone && (
                <a
                  href={`tel:${candidate.phone}`}
                  className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
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
                  className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                >
                  <Link2 className="h-3.5 w-3.5 text-slate-400" />
                  LinkedIn Profile
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
                  className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                >
                  <GitBranch className="h-3.5 w-3.5 text-slate-400" />
                  GitHub Code
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
                  className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                >
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  Portfolio Web
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <Link href={`/candidates/${candidate.id}/review-parsing`}>
            <Button
              variant="outline"
              size="sm"
              className="border-[#1E2D4A] bg-[#090D16] text-slate-300 hover:bg-[#141B2D] font-mono text-xs gap-2"
            >
              <FileEdit className="h-3.5 w-3.5 text-blue-400" />
              Review Parsed Data
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Skills Inventory"
          value={candidate.skills.length}
          color="cyan"
        />
        <StatCard
          label="Recorded Roles"
          value={`${candidate.experiences.length} Positions`}
          color="blue"
        />
        <StatCard
          label="Degree Tier"
          value={candidate.educations[0]?.degree ?? "N/A"}
          color="emerald"
        />
        <StatCard
          label="Certifications"
          value={candidate.certifications.length}
          color="amber"
        />
      </div>

      {/* Candidate Dossier Tabs */}
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

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "cyan" | "blue" | "emerald" | "amber";
}) {
  const colorMap = {
    cyan: "border-cyan-500/20 bg-cyan-500/5 text-cyan-400",
    blue: "border-blue-500/20 bg-blue-500/5 text-blue-400",
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-400",
  };

  return (
    <div
      className={`rounded-xl border ${colorMap[color]} p-3.5 text-center shadow-sm`}
    >
      <p className="text-base font-extrabold font-mono truncate">
        {value}
      </p>
      <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}
