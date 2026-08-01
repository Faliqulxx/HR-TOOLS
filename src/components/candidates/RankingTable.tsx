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
import { MatchScoreBar, SkillBreakdownList } from "./MatchScoreBar";
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
  new: { label: "New", className: "bg-slate-700/50 text-slate-400 border border-slate-700" },
  screening: { label: "Screening", className: "bg-blue-500/20 text-blue-300 border border-blue-500/30" },
  interview: { label: "Interview", className: "bg-violet-500/20 text-violet-300 border border-violet-500/30" },
  offered: { label: "Offered", className: "bg-amber-500/20 text-amber-300 border border-amber-500/30" },
  hired: { label: "Hired", className: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" },
  rejected: { label: "Rejected", className: "bg-rose-500/20 text-rose-300 border border-rose-500/30" },
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
    // Re-fetch with new sort via URL param
    router.push(`/jobs/${jobId}/candidates?sort=${value}`);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-400">
            {initialData.length} candidate{initialData.length !== 1 ? "s" : ""} matched
          </p>
          {runResult && (
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              ✓ {runResult.matched}/{runResult.total} scored
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <Select value={sort} onValueChange={(value) => handleSortChange(value ?? "matchScore")}>
            <SelectTrigger className="w-[180px] border-slate-700 bg-slate-900 text-slate-300 text-sm focus:ring-violet-500">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="border-slate-700 bg-slate-900 text-slate-100">
              <SelectItem value="matchScore">Match Score</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="gpa">GPA</SelectItem>
              <SelectItem value="education">Education Level</SelectItem>
              <SelectItem value="uploadDate">Upload Date</SelectItem>
            </SelectContent>
          </Select>

          {/* Run matching */}
          <Button
            onClick={handleRunMatching}
            disabled={isPending}
            className="bg-violet-600 hover:bg-violet-700 text-white gap-2 shadow-lg shadow-violet-900/30"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {isPending ? "Running..." : "Run Matching"}
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {initialData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="h-14 w-14 rounded-2xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
            <Zap className="h-7 w-7 text-violet-400" />
          </div>
          <div>
            <p className="text-slate-300 font-medium">No matches yet</p>
            <p className="text-slate-500 text-sm mt-1">
              Click &quot;Run Matching&quot; to score all candidates against this job&apos;s requirements.
            </p>
          </div>
        </div>
      )}

      {/* Ranking list */}
      {initialData.length > 0 && (
        <div className="space-y-2">
          {initialData.map((entry) => {
            const isExpanded = expandedId === entry.candidateId;
            const statusCfg = statusConfig[entry.status] ?? statusConfig.new;

            return (
              <div
                key={entry.candidateId}
                className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all duration-200"
              >
                {/* Main row */}
                <div
                  className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-slate-800/40 transition-colors"
                  onClick={() => toggleExpand(entry.candidateId)}
                >
                  {/* Rank */}
                  <div
                    className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      entry.rank === 1
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : entry.rank === 2
                          ? "bg-slate-600/40 text-slate-300 border border-slate-600"
                          : entry.rank === 3
                            ? "bg-orange-700/20 text-orange-400 border border-orange-700/30"
                            : "bg-slate-800 text-slate-500 border border-slate-700"
                    }`}
                  >
                    {entry.rank}
                  </div>

                  {/* Name & info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {entry.fullName}
                      </p>
                      <Badge className={`${statusCfg.className} text-[10px]`}>
                        {statusCfg.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500 flex-wrap">
                      {entry.latestPosition && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {entry.latestPosition}
                          {entry.latestCompany && ` @ ${entry.latestCompany}`}
                        </span>
                      )}
                      {entry.education && (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {entry.education.degree ?? ""}
                          {entry.education.gpa
                            ? ` · GPA ${entry.education.gpa}`
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="w-40 shrink-0 hidden sm:block">
                    <MatchScoreBar score={entry.matchScore} size="sm" />
                  </div>

                  {/* Score number */}
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-lg font-bold tabular-nums ${
                        entry.matchScore >= 80
                          ? "text-emerald-400"
                          : entry.matchScore >= 60
                            ? "text-violet-400"
                            : entry.matchScore >= 40
                              ? "text-amber-400"
                              : "text-rose-400"
                      }`}
                    >
                      {entry.matchScore.toFixed(1)}%
                    </p>
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
                        className="h-7 w-7 text-slate-600 hover:text-violet-400 hover:bg-violet-500/10"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-600" />
                    )}
                  </div>
                </div>

                {/* Expanded: skill breakdown */}
                {isExpanded && entry.matchDetail.length > 0 && (
                  <div className="border-t border-slate-800 px-4 py-3 bg-slate-950/40">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                      Skill Breakdown — {jobTitle}
                    </p>
                    <SkillBreakdownList detail={entry.matchDetail} />
                  </div>
                )}

                {isExpanded && entry.matchDetail.length === 0 && (
                  <div className="border-t border-slate-800 px-4 py-3 bg-slate-950/40">
                    <p className="text-sm text-slate-600 italic">
                      No skill breakdown available. Re-run matching to generate details.
                    </p>
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
