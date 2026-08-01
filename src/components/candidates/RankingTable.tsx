"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Zap,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MatchScoreBar, SkillBreakdownList, getSignalConfig } from "./MatchScoreBar";
import { matchAllCandidatesToJob } from "@/lib/actions/matching.actions";
import type { SortField } from "@/lib/actions/matching.actions";

type MatchDetailItem = {
  skill: string;
  isMandatory: boolean;
  weight: number;
  matched: boolean;
  ratio: number;
};

type RankEntry = {
  rank: number;
  applicationId: string;
  candidateId: string;
  fullName: string;
  email: string | null;
  matchScore: number;
  matchDetail: MatchDetailItem[];
  status: string;
  experienceCount: number;
  latestPosition: string | null;
  latestCompany: string | null;
  education: {
    institution: string;
    degree: string | null;
    gpa: number | null;
  } | null;
  skillCount: number;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-slate-800 text-slate-300 border-[#1E2D4A]" },
  screening: { label: "Screening", className: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" },
  interview: { label: "Interview", className: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
  offered: { label: "Offered", className: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
  hired: { label: "Hired", className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" },
  rejected: { label: "Rejected", className: "bg-rose-500/10 text-rose-300 border-rose-500/30" },
};

interface RankingTableProps {
  jobId: string;
  jobTitle: string;
  initialData: RankEntry[];
}

export function RankingTable({ jobId, jobTitle, initialData }: RankingTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sort, setSort] = useState<SortField>("matchScore");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<{
    matched: number;
    total: number;
  } | null>(null);

  const handleRunMatching = () => {
    startTransition(async () => {
      const result = await matchAllCandidatesToJob(jobId);
      setRunResult({ matched: result.matched, total: result.total });
      router.refresh();
    });
  };

  const handleSortChange = (value: string) => {
    setSort(value as SortField);
    router.push(`/jobs/${jobId}/candidates?sort=${value}`);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-[#182238] bg-[#0E131F]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Ranked Pool
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {initialData.length} Candidates
            </span>
          </div>

          {runResult && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
              ✓ Scored {runResult.matched}/{runResult.total} candidates
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Sort:</span>
            <Select value={sort} onValueChange={(value) => handleSortChange(value ?? "matchScore")}>
              <SelectTrigger className="w-[180px] border-[#1E2D4A] bg-[#090D16] text-slate-200 text-xs font-mono focus:ring-blue-500">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent className="border-[#1E2D4A] bg-[#0E131F] text-slate-100 font-mono text-xs">
                <SelectItem value="matchScore">Match Score (Desc)</SelectItem>
                <SelectItem value="experience">Experience Years</SelectItem>
                <SelectItem value="gpa">GPA Rating</SelectItem>
                <SelectItem value="education">Degree Tier</SelectItem>
                <SelectItem value="uploadDate">Upload Recency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Run Matching CTA */}
          <Button
            onClick={handleRunMatching}
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold gap-2 shadow-md shadow-blue-900/30 px-4"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Zap className="h-4 w-4 text-blue-200" />
            )}
            {isPending ? "Executing AI Engine..." : "Run AI Matching"}
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {initialData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-dashed border-[#182238] bg-[#0E131F]/50">
          <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Zap className="h-6 w-6" />
          </div>
          <div className="max-w-md">
            <p className="text-slate-200 font-semibold">No Candidate Matches Evaluated</p>
            <p className="text-slate-400 text-xs mt-1">
              Click <span className="text-blue-400 font-mono font-bold">&quot;Run AI Matching&quot;</span> above to execute criteria analysis against all active candidate resumes.
            </p>
          </div>
        </div>
      )}

      {/* Candidate Ranking List */}
      {initialData.length > 0 && (
        <div className="space-y-2">
          {initialData.map((entry) => {
            const isExpanded = expandedId === entry.candidateId;
            const statusCfg = statusConfig[entry.status] ?? statusConfig.new;
            const signalCfg = getSignalConfig(entry.matchScore);

            return (
              <div
                key={entry.candidateId}
                className="rounded-xl border border-[#182238] bg-[#0E131F]/80 overflow-hidden transition-all duration-200 hover:border-slate-700/60"
              >
                {/* Main Row */}
                <div
                  className="flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-[#121A2C]/60 transition-colors"
                  onClick={() => toggleExpand(entry.candidateId)}
                >
                  {/* Rank Badge */}
                  <div
                    className={`shrink-0 flex h-8 w-11 items-center justify-center rounded-md font-mono text-xs font-bold ${
                      entry.rank === 1
                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                        : entry.rank === 2
                          ? "bg-slate-400/10 text-slate-200 border border-slate-400/30"
                          : entry.rank === 3
                            ? "bg-orange-600/10 text-orange-300 border border-orange-600/30"
                            : "bg-[#090D16] text-slate-400 border border-[#182238]"
                    }`}
                  >
                    #{entry.rank < 10 ? `0${entry.rank}` : entry.rank}
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-100 truncate">
                        {entry.fullName}
                      </p>
                      <Badge className={`${statusCfg.className} text-[10px] font-mono`}>
                        {statusCfg.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                      {entry.latestPosition && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3 text-slate-400" />
                          {entry.latestPosition}
                          {entry.latestCompany && ` @ ${entry.latestCompany}`}
                        </span>
                      )}
                      {entry.education && (
                        <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                          <GraduationCap className="h-3 w-3 text-slate-400" />
                          {entry.education.degree ?? ""}
                          {entry.education.gpa
                            ? ` · GPA ${entry.education.gpa}`
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Signal Matrix Score Bar */}
                  <div className="w-48 shrink-0 hidden sm:block">
                    <MatchScoreBar score={entry.matchScore} size="sm" />
                  </div>

                  {/* Signal Pill Badge */}
                  <div className="shrink-0 text-right">
                    <span
                      className={`font-mono text-xs font-extrabold px-2.5 py-1 rounded-md border ${signalCfg.badgeBg} ${signalCfg.badgeText} ${signalCfg.badgeBorder}`}
                    >
                      {signalCfg.tierName}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/candidates/${entry.candidateId}?jobId=${jobId}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                        title="View Full Candidate Dossier"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Skill Breakdown Drawer */}
                {isExpanded && (
                  <div className="border-t border-[#182238] px-5 py-4 bg-[#070A12]/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                        Criteria Skill Evaluation Breakdown — {jobTitle}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400">
                        Evaluated {entry.matchDetail.length} Job Requirements
                      </span>
                    </div>

                    {entry.matchDetail.length > 0 ? (
                      <SkillBreakdownList detail={entry.matchDetail} />
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No detailed skill breakdown available. Re-run AI matching to generate.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
