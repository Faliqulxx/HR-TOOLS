import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { JobForm } from "@/components/jobs/JobForm";

export const metadata = {
  title: "New Job Requisition — Signal HR",
  description: "Create a new job posting with criteria evaluation target matrix.",
};

export default function NewJobPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Return to Requisitions List
      </Link>

      {/* Header Banner */}
      <div className="border-b border-[#182238] pb-6">
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Create Job Requisition
        </h1>
        <p className="text-slate-400 text-xs font-mono mt-0.5">
          Configure position specifications and required skill target matrix. Fields marked with{" "}
          <span className="text-rose-400 font-bold">*</span> are required.
        </p>
      </div>

      <JobForm mode="create" />
    </div>
  );
}
