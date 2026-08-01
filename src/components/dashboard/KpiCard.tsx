import { type LucideIcon } from "lucide-react";

type KpiColor = "violet" | "blue" | "emerald" | "amber" | "rose" | "slate";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: KpiColor;
  suffix?: string;
  description?: string;
}

const colorMap: Record<KpiColor, { icon: string; value: string; border: string; bg: string }> = {
  violet: {
    icon: "bg-violet-600/20 border-violet-600/30 text-violet-400",
    value: "text-violet-400",
    border: "border-violet-500/10",
    bg: "bg-violet-500/5",
  },
  blue: {
    icon: "bg-blue-600/20 border-blue-600/30 text-blue-400",
    value: "text-blue-400",
    border: "border-blue-500/10",
    bg: "bg-blue-500/5",
  },
  emerald: {
    icon: "bg-emerald-600/20 border-emerald-600/30 text-emerald-400",
    value: "text-emerald-400",
    border: "border-emerald-500/10",
    bg: "bg-emerald-500/5",
  },
  amber: {
    icon: "bg-amber-600/20 border-amber-600/30 text-amber-400",
    value: "text-amber-400",
    border: "border-amber-500/10",
    bg: "bg-amber-500/5",
  },
  rose: {
    icon: "bg-rose-600/20 border-rose-600/30 text-rose-400",
    value: "text-rose-400",
    border: "border-rose-500/10",
    bg: "bg-rose-500/5",
  },
  slate: {
    icon: "bg-slate-700 border-slate-600 text-slate-400",
    value: "text-slate-300",
    border: "border-slate-700/50",
    bg: "bg-slate-800/40",
  },
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  color = "violet",
  suffix,
  description,
}: KpiCardProps) {
  const c = colorMap[color];

  return (
    <div
      className={`rounded-xl border ${c.border} ${c.bg} p-5 flex items-start gap-4 hover:scale-[1.02] transition-transform duration-200`}
    >
      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${c.icon}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-3xl font-bold tabular-nums ${c.value}`}>
            {value}
          </span>
          {suffix && (
            <span className="text-sm text-slate-500">{suffix}</span>
          )}
        </div>
        {description && (
          <p className="text-xs text-slate-600 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
