import { Sparkles } from "lucide-react";
import { MatchScoreBar, SkillBreakdownList } from "./MatchScoreBar";

type MatchDetailItem = {
  skill: string;
  isMandatory: boolean;
  weight: number;
  matched: boolean;
  ratio: number;
};

interface AISummaryCardProps {
  summary: string;
  matchScore?: number | null;
  matchDetail?: MatchDetailItem[];
  jobTitle?: string | null;
}

export function AISummaryCard({
  summary,
  matchScore,
  matchDetail,
  jobTitle,
}: AISummaryCardProps) {
  return (
    <div className="space-y-6">
      {/* AI Summary */}
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600/20 border border-violet-600/30">
            <Sparkles className="h-4 w-4 text-violet-400" />
          </div>
          <h3 className="text-sm font-semibold text-violet-300">AI Summary</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{summary}</p>
      </div>

      {/* Match Score (only if jobId context) */}
      {matchScore != null && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Match Score
              {jobTitle && (
                <span className="font-normal text-slate-500 ml-1.5">
                  for {jobTitle}
                </span>
              )}
            </h3>
            <span
              className={`text-2xl font-bold tabular-nums ${
                matchScore >= 80
                  ? "text-emerald-400"
                  : matchScore >= 60
                    ? "text-violet-400"
                    : matchScore >= 40
                      ? "text-amber-400"
                      : "text-rose-400"
              }`}
            >
              {matchScore.toFixed(1)}%
            </span>
          </div>

          <MatchScoreBar score={matchScore} showLabel={false} size="lg" />

          {/* Legend */}
          <div className="flex gap-3 flex-wrap text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Excellent ≥80
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-400" />
              Good ≥60
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Moderate ≥40
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              Low &lt;40
            </span>
          </div>

          {/* Skill breakdown */}
          {matchDetail && matchDetail.length > 0 && (
            <>
              <div className="border-t border-slate-800 pt-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                  Skill Breakdown
                </p>
                <SkillBreakdownList detail={matchDetail} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
