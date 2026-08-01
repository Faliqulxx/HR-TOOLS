type MatchScoreBarProps = {
  score: number; // 0–100
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
};

export type SignalTier = {
  tierName: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  barColor: string;
  activeSegmentColor: string;
  activeCount: number;
};

export function getSignalConfig(score: number): SignalTier {
  if (score >= 80) {
    return {
      tierName: "High Match",
      badgeBg: "bg-emerald-500/10",
      badgeText: "text-emerald-400",
      badgeBorder: "border-emerald-500/30",
      barColor: "bg-emerald-500",
      activeSegmentColor: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
      activeCount: 5,
    };
  }
  if (score >= 60) {
    return {
      tierName: "Good Fit",
      badgeBg: "bg-cyan-500/10",
      badgeText: "text-cyan-400",
      badgeBorder: "border-cyan-500/30",
      barColor: "bg-cyan-500",
      activeSegmentColor: "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]",
      activeCount: 4,
    };
  }
  if (score >= 40) {
    return {
      tierName: "Moderate",
      badgeBg: "bg-amber-500/10",
      badgeText: "text-amber-400",
      badgeBorder: "border-amber-500/30",
      barColor: "bg-amber-500",
      activeSegmentColor: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
      activeCount: 3,
    };
  }
  return {
    tierName: "Low Match",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-400",
    badgeBorder: "border-rose-500/30",
    barColor: "bg-rose-500",
    activeSegmentColor: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]",
    activeCount: Math.max(1, Math.ceil((score / 40) * 2)),
  };
}

export function MatchScoreBar({
  score,
  showLabel = true,
  size = "md",
}: MatchScoreBarProps) {
  const config = getSignalConfig(score);
  const clampedScore = Math.max(0, Math.min(100, score));

  // Segments for micro-matrix meter (5 segments)
  const segments = Array.from({ length: 5 }, (_, i) => i < config.activeCount);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between gap-2">
        {/* Micro 5-block matrix indicator */}
        <div className="flex items-center gap-1 shrink-0" title={`Signal Matrix: ${config.tierName}`}>
          {segments.map((active, idx) => (
            <div
              key={idx}
              className={`rounded-xs transition-all duration-300 ${
                size === "sm"
                  ? "h-2 w-1.5"
                  : size === "lg"
                    ? "h-3.5 w-2.5"
                    : "h-2.5 w-2"
              } ${
                active
                  ? config.activeSegmentColor
                  : "bg-slate-800/80 border border-slate-800"
              }`}
            />
          ))}
        </div>

        {/* Monospace score percentage */}
        {showLabel && (
          <div className="flex items-center gap-1.5 shrink-0 font-mono">
            <span
              className={`tabular-nums font-bold ${
                size === "sm"
                  ? "text-xs"
                  : size === "lg"
                    ? "text-lg"
                    : "text-sm"
              } ${config.badgeText}`}
            >
              {clampedScore.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Hairline track meter */}
      <div className="w-full h-1 rounded-full bg-[#121A2C] overflow-hidden border border-[#1E2D4A]/50">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${config.barColor}`}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
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
      badgeClass =
        "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30";
      label = "100% Match";
    } else if (item.ratio === 0.5) {
      badgeClass =
        "bg-amber-500/10 text-amber-300 border border-amber-500/30";
      label = "50% Synonym";
    } else {
      badgeClass =
        "bg-slate-800/60 text-slate-500 border border-slate-700/50";
      label = "0% Missing";
    }

    return (
      <div
        key={i}
        className="flex items-center justify-between py-2 border-b border-[#182238] last:border-0"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-200">{item.skill}</span>
          {item.isMandatory ? (
            <span className="text-[9px] font-mono uppercase font-bold px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              MANDATORY
            </span>
          ) : (
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-500 border border-slate-700/50">
              OPTIONAL
            </span>
          )}
        </div>
        <span
          className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${badgeClass}`}
        >
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="text-sm space-y-3">
      {mandatory.length > 0 && (
        <div>
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Mandatory Skill Matrix ({mandatory.length})
          </p>
          <div className="rounded-lg border border-[#182238] bg-[#090D16]/60 px-3">
            {mandatory.map(renderItem)}
          </div>
        </div>
      )}
      {optional.length > 0 && (
        <div>
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Nice-to-Have Skills ({optional.length})
          </p>
          <div className="rounded-lg border border-[#182238] bg-[#090D16]/60 px-3">
            {optional.map(renderItem)}
          </div>
        </div>
      )}
    </div>
  );
}
