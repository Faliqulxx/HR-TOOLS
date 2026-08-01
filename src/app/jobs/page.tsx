import Link from "next/link";
import { Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobTable } from "@/components/jobs/JobTable";
import { getJobs } from "@/lib/actions/job.actions";

export const metadata = {
  title: "Job Requisitions — Signal HR",
  description: "Manage job requisitions and candidate match criteria.",
};

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#182238] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
              Job Requisitions
            </h1>
          </div>
          <p className="text-slate-400 text-xs font-mono ml-12">
            Active position postings &bull; {jobs.length} Total Requisition{jobs.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Link href="/jobs/new">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold shadow-md shadow-blue-900/30 gap-2">
            <Plus className="h-4 w-4" />
            Create Job Requisition
          </Button>
        </Link>
      </div>

      {/* Table */}
      <JobTable jobs={jobs} />
    </div>
  );
}
