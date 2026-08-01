import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { JobForm } from "@/components/jobs/JobForm";

export const metadata = {
  title: "Create Job — HR Tools",
  description: "Create a new job posting with skill requirements",
};

export default function NewJobPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Create New Job</h1>
        <p className="text-slate-400 text-sm mt-1">
          Fill in the details below. Fields marked with{" "}
          <span className="text-rose-400">*</span> are required.
        </p>
      </div>

      <JobForm mode="create" />
    </div>
  );
}
