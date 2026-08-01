import Link from "next/link";
import { Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobTable } from "@/components/jobs/JobTable";
import { getJobs } from "@/lib/actions/job.actions";

export const metadata = {
  title: "Jobs — HR Tools",
  description: "Manage job postings and view applicants",
};

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-600/30">
              <Briefcase className="h-5 w-5 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Job Postings</h1>
          </div>
          <p className="text-slate-400 text-sm ml-12">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} total
          </p>
        </div>

        <Link href="/jobs/new">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-900/30 gap-2">
            <Plus className="h-4 w-4" />
            Create New Job
          </Button>
        </Link>
      </div>

      {/* Table */}
      <JobTable jobs={jobs} />
    </div>
  );
}
