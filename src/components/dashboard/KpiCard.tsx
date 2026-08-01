import { type LucideIcon } from "lucide-react";

type KpiColor = "emerald" | "cyan" | "amber" | "rose" | "blue" | "slate";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: KpiColor;
  suffix?: string;
  description?: string;
}

const colorMap: Record<
  KpiColor,
  { iconBg: string; iconText: string; valueText: string; cardBorder: string; cardBg: string }
> = {
  emerald: {
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconText: "text-emerald-400",
    valueText: "text-emerald-400",
    cardBorder: "border-[#1A382E]",
    cardBg: "bg-[#0A1612]",
  },
  cyan: {
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconText: "text-cyan-400",
    valueText: "text-cyan-400",
    cardBorder: "border-[#153448]",
    cardBg: "bg-[#091724]",
  },
  amber: {
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconText: "text-amber-400",
    valueText: "text-amber-400",
    cardBorder: "border-[#3A2B14]",
    cardBg: "bg-[#181108]",
  },
  rose: {
    iconBg: "bg-rose-500/10 border-rose-500/20",
    iconText: "text-rose-400",
    valueText: "text-rose-400",
    cardBorder: "border-[#3B1925]",
    cardBg: "bg-[#180A10]",
  },
  blue: {
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconText: "text-blue-400",
    valueText: "text-blue-400",
    cardBorder: "border-[#192E56]",
    cardBg: "bg-[#0B1428]",
  },
  slate: {
    iconBg: "bg-slate-800/60 border-slate-700/50",
    iconText: "text-slate-300",
    valueText: "text-slate-200",
    cardBorder: "border-[#1E2D4A]",
    cardBg: "bg-[#0E131F]",
  },
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  color = "blue",
  suffix,
  description,
}: KpiCardProps) {
  const c = colorMap[color];

  return (
    <div
      className={`rounded-xl border ${c.cardBorder} ${c.cardBg} p-5 flex items-start gap-4 transition-all duration-200 hover:border-slate-600/50 shadow-sm`}
    >
      {/* Icon Badge */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${c.iconBg} ${c.iconText}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-3xl font-extrabold font-mono tabular-nums tracking-tight ${c.valueText}`}>
            {value}
          </span>
          {suffix && (
            <span className="text-sm font-mono text-slate-400">{suffix}</span>
          )}
        </div>
        {description && (
          <p className="text-xs text-slate-400 mt-1 truncate">{description}</p>
        )}
      </div>
    </div>
  );
}
