"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface SkillsChartProps {
  data: { skill: string; count: number }[];
}

// Gradient palette for bars
const BAR_COLORS = [
  "#8b5cf6", "#7c3aed", "#6d28d9",
  "#4f46e5", "#4338ca", "#3730a3",
  "#2563eb", "#1d4ed8", "#1e40af",
  "#1e3a8a",
];

export function SkillsChart({ data }: SkillsChartProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-200 mb-4">
        Top Skills Across Candidates
      </h3>

      {data.length === 0 ? (
        <div className="flex h-[260px] items-center justify-center">
          <p className="text-sm text-slate-600 italic">No skills data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 40 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="skill"
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: 12,
              }}
              cursor={{ fill: "rgba(139, 92, 246, 0.08)" }}
            />
            <Bar dataKey="count" name="Candidates" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
