import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { JobForm } from "@/components/jobs/JobForm";
import { getJobById } from "@/lib/actions/job.actions";
import type { JobFormData } from "@/lib/validations/job.schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  return {
    title: job ? `Edit ${job.title} — Signal HR` : "Edit Job Requisition — Signal HR",
  };
}

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  const initialData: JobFormData & { id: string } = {
    id: job.id,
    title: job.title,
    department: job.department,
    location: job.location,
    employmentType: job.employmentType as JobFormData["employmentType"],
    salaryMin: job.salaryMin ?? null,
    salaryMax: job.salaryMax ?? null,
    deadline: job.deadline
      ? new Date(job.deadline).toISOString().split("T")[0]
      : null,
    description: job.description,
    requirements: job.requirements.map((r) => ({
      skillName: r.skillName,
      isMandatory: r.isMandatory,
      weight: r.weight,
    })),
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <Link
          href="/jobs"
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          Requisitions
        </Link>
        <ChevronLeft className="h-3.5 w-3.5 text-slate-400 rotate-180" />
        <Link
          href={`/jobs/${job.id}`}
          className="text-slate-400 hover:text-slate-200 transition-colors truncate max-w-[200px]"
        >
          {job.title}
        </Link>
        <ChevronLeft className="h-3.5 w-3.5 text-slate-400 rotate-180" />
        <span className="text-slate-300 font-semibold">Edit Specs</span>
      </div>

      {/* Header Banner */}
      <div className="border-b border-[#182238] pb-6">
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Edit Requisition Specifications
        </h1>
        <p className="text-slate-400 text-xs font-mono mt-0.5">
          Update criteria evaluation matrix and requisition parameters for &quot;{job.title}&quot;.
        </p>
      </div>

      <JobForm mode="edit" initialData={initialData} />
    </div>
  );
}
