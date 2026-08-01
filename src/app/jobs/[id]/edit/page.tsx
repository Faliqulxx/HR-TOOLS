import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { JobForm } from "@/components/jobs/JobForm";
import { getJobById } from "@/lib/actions/job.actions";
import type { JobFormData } from "@/lib/validations/job.schema";

export const metadata = {
  title: "Edit Job — HR Tools",
};

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  // Map Prisma model to JobFormData shape
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
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/jobs"
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          Jobs
        </Link>
        <ChevronLeft className="h-3 w-3 text-slate-700 rotate-180" />
        <Link
          href={`/jobs/${job.id}`}
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          {job.title}
        </Link>
        <ChevronLeft className="h-3 w-3 text-slate-700 rotate-180" />
        <span className="text-sm text-slate-400">Edit</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Job</h1>
        <p className="text-slate-400 text-sm mt-1">
          Update the job details below. Changes will be saved immediately.
        </p>
      </div>

      <JobForm mode="edit" initialData={initialData} />
    </div>
  );
}
