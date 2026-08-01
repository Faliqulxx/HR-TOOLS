import { Sparkles } from "lucide-react";
import { MatchScoreBar, SkillBreakdownList, getSignalConfig } from "./MatchScoreBar";

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
  const signalCfg = matchScore != null ? getSignalConfig(matchScore) : null;

  return (
    <div className="space-y-6">
      {/* AI Synthesis Executive Brief */}
      <div className="rounded-xl border border-blue-500/20 bg-[#0E1526] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider">
              AI Executive Synthesis
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Automated Profile Evaluation
          </span>
        </div>
        <p className="text-slate-200 text-sm leading-relaxed font-sans">{summary}</p>
      </div>

      {/* Match Score Matrix (when jobId context present) */}
      {matchScore != null && signalCfg && (
        <div className="rounded-xl border border-[#182238] bg-[#0E131F] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Requisition Match Index
              </h3>
              {jobTitle && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Evaluated position: <span className="text-slate-200 font-semibold">{jobTitle}</span>
                </p>
              )}
            </div>

            <div className="text-right">
              <span
                className={`text-2xl font-extrabold font-mono tabular-nums ${signalCfg.badgeText}`}
              >
                {matchScore.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Signature Micro Matrix Meter */}
          <MatchScoreBar score={matchScore} showLabel={false} size="lg" />

          {/* Signal Legend */}
          <div className="flex gap-4 flex-wrap text-[11px] font-mono text-slate-400 border-t border-[#182238] pt-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-xs bg-emerald-400" />
              High Fit (≥80%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-xs bg-cyan-400" />
              Good Fit (≥60%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-xs bg-amber-400" />
              Moderate (≥40%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-xs bg-rose-400" />
              Low Match (&lt;40%)
            </span>
          </div>

          {/* Skill Breakdown */}
          {matchDetail && matchDetail.length > 0 && (
            <div className="border-t border-[#182238] pt-4">
              <p className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
                Job Criteria Alignment Breakdown
              </p>
              <SkillBreakdownList detail={matchDetail} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
