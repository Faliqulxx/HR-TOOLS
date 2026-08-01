import {
  Users,
  UserPlus,
  CheckCircle2,
  XCircle,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { getDashboardStats, getChartData } from "@/lib/actions/dashboard.actions";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ApplicantsChart, ApplicantsPerJobChart } from "@/components/dashboard/ApplicantsChart";
import { SkillsChart } from "@/components/dashboard/SkillsChart";
import { FunnelChart } from "@/components/dashboard/FunnelChart";

export const metadata = {
  title: "Dashboard — HR Tools",
  description: "HR recruitment overview with KPIs and charts",
};

// Revalidate every 60 seconds so charts stay fresh
export const revalidate = 60;

export default async function DashboardPage() {
  const [stats, charts] = await Promise.all([
    getDashboardStats(),
    getChartData(),
  ]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Recruitment pipeline overview — data updates every minute.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <KpiCard
          label="Total Applicants"
          value={stats.totalApplicants}
          icon={Users}
          color="violet"
          description="All uploaded candidates"
        />
        <KpiCard
          label="New Today"
          value={stats.newResumesToday}
          icon={UserPlus}
          color="blue"
          description="Resumes uploaded today"
        />
        <KpiCard
          label="Passed Screening"
          value={stats.passedScreening}
          icon={CheckCircle2}
          color="emerald"
          description="Match score ≥ 70%"
        />
        <KpiCard
          label="Rejected"
          value={stats.rejected}
          icon={XCircle}
          color="rose"
          description="Applications marked rejected"
        />
        <KpiCard
          label="Active Jobs"
          value={stats.activeJobs}
          icon={Briefcase}
          color="amber"
          description="Open job postings"
        />
        <KpiCard
          label="Avg Match Score"
          value={stats.avgMatchScore}
          icon={TrendingUp}
          color="slate"
          suffix="%"
          description="Average across all applications"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <ApplicantsChart data={charts.applicantsPerDay} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <ApplicantsPerJobChart data={charts.applicantsPerJob} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <SkillsChart data={charts.topSkills} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <FunnelChart data={charts.statusFunnel} />
        </div>
      </div>
    </div>
  );
}
