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

// Precision palette: Teal -> Cyan -> Blue -> Slate
const BAR_COLORS = [
  "#10B981", "#059669", "#06B6D4", "#0284C7",
  "#2563EB", "#1D4ED8", "#3B82F6", "#475569",
  "#334155", "#1E293B",
];

export function SkillsChart({ data }: SkillsChartProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Top Extracted Candidate Skills
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Top 10 Frequency
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-[#182238] bg-[#07090E]/50">
          <p className="text-xs font-mono text-slate-500">No skill data extracted yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 40 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#182238"
              vertical={false}
            />
            <XAxis
              dataKey="skill"
              tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "sans-serif" }}
              axisLine={false}
              tickLine={false}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#64748B", fontSize: 11, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#090D16",
                border: "1px solid #1E2D4A",
                borderRadius: "8px",
                color: "#F8FAFC",
                fontSize: "12px",
                fontFamily: "monospace",
              }}
              cursor={{ fill: "rgba(16, 185, 129, 0.08)" }}
            />
            <Bar dataKey="count" name="Candidates" radius={[3, 3, 0, 0]}>
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
