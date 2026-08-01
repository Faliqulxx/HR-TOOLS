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
  new: "#64748b",
  screening: "#3b82f6",
  interview: "#8b5cf6",
  offered: "#f59e0b",
  hired: "#10b981",
  rejected: "#ef4444",
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
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  );
}

export function FunnelChart({ data }: FunnelChartProps) {
  const labeled = data.map((d) => ({
    ...d,
    label: STATUS_LABELS[d.status] ?? d.status,
    color: STATUS_COLORS[d.status] ?? "#64748b",
  }));

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-200 mb-4">
        Application Status Funnel
      </h3>

      {data.length === 0 ? (
        <div className="flex h-[260px] items-center justify-center">
          <p className="text-sm text-slate-600 italic">No applications yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={labeled}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="count"
              nameKey="label"
              labelLine={false}
              label={renderCustomLabel}
            >
              {labeled.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: 12,
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: "#94a3b8", fontSize: 11 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
