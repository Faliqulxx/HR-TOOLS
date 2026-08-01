"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ApplicantsChartProps {
  data: { date: string; count: number }[];
}

export function ApplicantsChart({ data }: ApplicantsChartProps) {
  const isEmpty = data.every((d) => d.count === 0);

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-200 mb-4">
        Applicants — Last 7 Days
      </h3>

      {isEmpty ? (
        <EmptyChartState label="No applicants in the last 7 days" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
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
            <Bar
              dataKey="count"
              name="Applicants"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ── Applicants per Job ────────────────────────────────────────────────────────

interface ApplicantsPerJobChartProps {
  data: { jobTitle: string; count: number }[];
}

export function ApplicantsPerJobChart({ data }: ApplicantsPerJobChartProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-200 mb-4">
        Applicants per Job (Top 5)
      </h3>

      {data.length === 0 ? (
        <EmptyChartState label="No applications yet" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              horizontal={false}
            />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="jobTitle"
              width={110}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: string) =>
                v.length > 16 ? `${v.slice(0, 14)}…` : v
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: 12,
              }}
              cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
            />
            <Bar
              dataKey="count"
              name="Applicants"
              fill="#6366f1"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ── Shared empty state ────────────────────────────────────────────────────────

function EmptyChartState({ label }: { label: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center">
      <p className="text-sm text-slate-600 italic">{label}</p>
    </div>
  );
}
