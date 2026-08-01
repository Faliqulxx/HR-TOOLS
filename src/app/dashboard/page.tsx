import {
  Users,
  UserPlus,
  ShieldCheck,
  XCircle,
  Briefcase,
  Activity,
  Sparkles,
} from "lucide-react";
import { getDashboardStats, getChartData } from "@/lib/actions/dashboard.actions";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ApplicantsChart, ApplicantsPerJobChart } from "@/components/dashboard/ApplicantsChart";
import { SkillsChart } from "@/components/dashboard/SkillsChart";
import { FunnelChart } from "@/components/dashboard/FunnelChart";

export const metadata = {
  title: "Recruitment Console — Signal HR",
  description: "Executive HR analytics console with real-time candidate match telemetry.",
};

export const revalidate = 60;

export default async function DashboardPage() {
  const [stats, charts] = await Promise.all([
    getDashboardStats(),
    getChartData(),
  ]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#182238] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
              Recruitment Operations
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
            Intelligence Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time candidate evaluation telemetry and matching pipeline metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1E2D4A] bg-[#0E131F] text-xs font-mono text-slate-300">
            <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>Auto-Refresh 60s</span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <KpiCard
          label="Total Candidates"
          value={stats.totalApplicants}
          icon={Users}
          color="blue"
          description="Processed resume database"
        />
        <KpiCard
          label="Uploaded Today"
          value={stats.newResumesToday}
          icon={UserPlus}
          color="cyan"
          description="New candidate files"
        />
        <KpiCard
          label="High Fit Candidates"
          value={stats.passedScreening}
          icon={ShieldCheck}
          color="emerald"
          description="Match score ≥ 70%"
        />
        <KpiCard
          label="Rejected Pipeline"
          value={stats.rejected}
          icon={XCircle}
          color="rose"
          description="Unmatched/Archived"
        />
        <KpiCard
          label="Active Positions"
          value={stats.activeJobs}
          icon={Briefcase}
          color="amber"
          description="Open job requisitions"
        />
        <KpiCard
          label="Mean Match Index"
          value={stats.avgMatchScore}
          icon={Sparkles}
          color="slate"
          suffix="%"
          description="System-wide match average"
        />
      </div>

      {/* Analytics Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#182238] bg-[#0E131F]/90 p-5 shadow-sm">
          <ApplicantsChart data={charts.applicantsPerDay} />
        </div>
        <div className="rounded-xl border border-[#182238] bg-[#0E131F]/90 p-5 shadow-sm">
          <ApplicantsPerJobChart data={charts.applicantsPerJob} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#182238] bg-[#0E131F]/90 p-5 shadow-sm">
          <SkillsChart data={charts.topSkills} />
        </div>
        <div className="rounded-xl border border-[#182238] bg-[#0E131F]/90 p-5 shadow-sm">
          <FunnelChart data={charts.statusFunnel} />
        </div>
      </div>
    </div>
  );
}
