"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type PieLabelRenderProps,
} from "recharts";

interface FunnelChartProps {
  data: { status: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  new: "#475569",
  screening: "#06B6D4",
  interview: "#2563EB",
  offered: "#F59E0B",
  hired: "#10B981",
  rejected: "#F43F5E",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  screening: "Screening",
  interview: "Interview",
  offered: "Offered",
  hired: "Hired",
  rejected: "Rejected",
};

function renderCustomLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if ((percent ?? 0) < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const ir = Number(innerRadius ?? 0);
  const or = Number(outerRadius ?? 0);
  const radius = ir + (or - ir) * 0.5;
  const x = Number(cx ?? 0) + radius * Math.cos(-Number(midAngle ?? 0) * RADIAN);
  const y = Number(cy ?? 0) + radius * Math.sin(-Number(midAngle ?? 0) * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#FFFFFF"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
      fontFamily="monospace"
    >
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  );
}

export function FunnelChart({ data }: FunnelChartProps) {
  const labeled = data.map((d) => ({
    ...d,
    label: STATUS_LABELS[d.status] ?? d.status,
    color: STATUS_COLORS[d.status] ?? "#475569",
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Candidate Pipeline Stage
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Status Funnel
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-[#182238] bg-[#07090E]/50">
          <p className="text-xs font-mono text-slate-500">No application funnel data</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={labeled}
              cx="50%"
              cy="50%"
              outerRadius={85}
              innerRadius={35}
              paddingAngle={3}
              dataKey="count"
              nameKey="label"
              labelLine={false}
              label={renderCustomLabel}
            >
              {labeled.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="#07090E" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#090D16",
                border: "1px solid #1E2D4A",
                borderRadius: "8px",
                color: "#F8FAFC",
                fontSize: "12px",
                fontFamily: "monospace",
              }}
            />
            <Legend
              iconType="circle"
              iconSize={7}
              formatter={(value) => (
                <span style={{ color: "#94A3B8", fontSize: "11px", fontFamily: "monospace" }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
