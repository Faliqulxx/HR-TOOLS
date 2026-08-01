import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Pencil,
  Users,
  MapPin,
  Building2,
  Clock,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getJobById } from "@/lib/actions/job.actions";

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: "bg-slate-700/50 text-slate-400 border border-slate-700",
  active: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  closed: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
} as never;

const employmentTypeLabel: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

function formatSalary(n: number | null) {
  if (!n) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  const statusClass =
    (statusConfig[job.status] as unknown as string) ??
    (statusConfig.draft as unknown as string);

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
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{job.title}</h1>
            <Badge className={statusClass}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-slate-600" />
              {job.department}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-600" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-600" />
              {employmentTypeLabel[job.employmentType] ?? job.employmentType}
            </span>
            {job.deadline && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-600" />
                Deadline:{" "}
                {new Date(job.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {(job.salaryMin || job.salaryMax) && (
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-slate-600" />
                {formatSalary(job.salaryMin)} – {formatSalary(job.salaryMax)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          <Link href={`/jobs/${job.id}/candidates`}>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2"
            >
              <Users className="h-4 w-4" />
              View Candidates ({job._count.applications})
            </Button>
          </Link>
          <Link href={`/jobs/${job.id}/edit`}>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-base text-slate-200">
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Requirements */}
        <div>
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-base text-slate-200">
                Skill Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {job.requirements.length === 0 ? (
                <p className="text-sm text-slate-500 italic">
                  No requirements defined.
                </p>
              ) : (
                <>
                  {job.requirements
                    .filter((r) => r.isMandatory)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-slate-300">
                          {req.skillName}
                        </span>
                        <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px]">
                          Mandatory
                        </Badge>
                      </div>
                    ))}
                  {job.requirements.filter((r) => r.isMandatory).length > 0 &&
                    job.requirements.filter((r) => !r.isMandatory).length >
                      0 && <Separator className="bg-slate-800 my-3" />}
                  {job.requirements
                    .filter((r) => !r.isMandatory)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-slate-400">
                          {req.skillName}
                        </span>
                        <Badge className="bg-slate-700/50 text-slate-500 border border-slate-700 text-[10px]">
                          Nice-to-have
                        </Badge>
                      </div>
                    ))}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
