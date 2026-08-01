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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Daily Applicant Velocity
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          7-Day Window
        </span>
      </div>

      {isEmpty ? (
        <EmptyChartState label="No candidate activity recorded in past 7 days" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#182238"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748B", fontSize: 11, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
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
              cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
            />
            <Bar
              dataKey="count"
              name="Candidates"
              fill="#2563EB"
              radius={[3, 3, 0, 0]}
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Candidates per Job Posting
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          Top 5 Positions
        </span>
      </div>

      {data.length === 0 ? (
        <EmptyChartState label="No job postings with applications" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#182238"
              horizontal={false}
            />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: "#64748B", fontSize: 11, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="jobTitle"
              width={120}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: string) =>
                v.length > 15 ? `${v.slice(0, 13)}…` : v
              }
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
              cursor={{ fill: "rgba(6, 182, 212, 0.1)" }}
            />
            <Bar
              dataKey="count"
              name="Candidates"
              fill="#06B6D4"
              radius={[0, 3, 3, 0]}
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
    <div className="flex h-[220px] items-center justify-center rounded-lg border border-dashed border-[#182238] bg-[#07090E]/50">
      <p className="text-xs font-mono text-slate-500">{label}</p>
    </div>
  );
}
