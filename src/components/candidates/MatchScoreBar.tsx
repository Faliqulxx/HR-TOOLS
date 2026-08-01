type MatchScoreBarProps = {
  score: number; // 0–100
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
};

function getScoreColor(score: number): string {
  if (score >= 80) return "from-emerald-500 to-emerald-400";
  if (score >= 60) return "from-violet-500 to-violet-400";
  if (score >= 40) return "from-amber-500 to-amber-400";
  return "from-rose-500 to-rose-400";
}

function getScoreTextColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-violet-400";
  if (score >= 40) return "text-amber-400";
  return "text-rose-400";
}

export function MatchScoreBar({
  score,
  showLabel = true,
  size = "md",
}: MatchScoreBarProps) {
  const barHeight =
    size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";
  const textSize =
    size === "sm" ? "text-xs" : size === "lg" ? "text-base font-bold" : "text-sm font-medium";

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Bar */}
      <div className={`flex-1 rounded-full bg-slate-800 overflow-hidden ${barHeight}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <span className={`shrink-0 tabular-nums ${textSize} ${getScoreTextColor(score)}`}>
          {score.toFixed(1)}%
        </span>
      )}
    </div>
  );
}

// ── Skill breakdown row ────────────────────────────────────────────────────────

type MatchDetailItem = {
  skill: string;
  isMandatory: boolean;
  weight: number;
  matched: boolean;
  ratio: number;
};

export function SkillBreakdownList({
  detail,
}: {
  detail: MatchDetailItem[];
}) {
  const mandatory = detail.filter((d) => d.isMandatory);
  const optional = detail.filter((d) => !d.isMandatory);

  const renderItem = (item: MatchDetailItem, i: number) => {
    let badgeClass = "";
    let label = "";

    if (item.ratio === 1.0) {
      badgeClass = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
      label = "100%";
    } else if (item.ratio === 0.5) {
      badgeClass = "bg-amber-500/20 text-amber-300 border border-amber-500/30";
      label = "50%";
    } else {
      badgeClass = "bg-slate-800 text-slate-600 border border-slate-700";
      label = "0%";
    }

    return (
      <div
        key={i}
        className="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-0"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-300">{item.skill}</span>
          {item.isMandatory && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              mandatory
            </span>
          )}
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${badgeClass} font-mono`}
        >
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="text-sm">
      {mandatory.length > 0 && (
        <div className="mb-2">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            Mandatory Skills
          </p>
          {mandatory.map(renderItem)}
        </div>
      )}
      {optional.length > 0 && (
        <div>
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5 mt-2">
            Nice-to-have
          </p>
          {optional.map(renderItem)}
        </div>
      )}
    </div>
  );
}
