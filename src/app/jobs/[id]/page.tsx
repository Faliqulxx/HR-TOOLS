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
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getJobById } from "@/lib/actions/job.actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  return {
    title: job ? `${job.title} — Signal HR` : "Requisition Detail — Signal HR",
  };
}

const statusConfig: Record<string, string> = {
  draft: "bg-slate-800 text-slate-300 border border-slate-700 font-mono",
  active: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono",
  closed: "bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono",
};

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

  const statusClass = statusConfig[job.status] ?? statusConfig.draft;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Return to Requisitions List
      </Link>

      {/* Header Requisition Spec */}
      <div className="rounded-xl border border-[#182238] bg-[#0E131F] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              {job.title}
            </h1>
            <Badge className={`${statusClass} text-[10px]`}>
              {job.status.toUpperCase()}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              {job.department}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {employmentTypeLabel[job.employmentType] ?? job.employmentType}
            </span>
            {job.deadline && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Deadline:{" "}
                {new Date(job.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {(job.salaryMin || job.salaryMax) && (
              <span className="flex items-center gap-1.5 font-mono">
                <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                {formatSalary(job.salaryMin)} – {formatSalary(job.salaryMax)}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2.5 shrink-0">
          <Link href={`/jobs/${job.id}/candidates`}>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold shadow-md shadow-blue-900/30 gap-2">
              <Users className="h-4 w-4" />
              Candidate Leaderboard ({job._count.applications})
            </Button>
          </Link>
          <Link href={`/jobs/${job.id}/edit`}>
            <Button
              variant="outline"
              className="border-[#1E2D4A] bg-[#090D16] text-slate-300 hover:bg-[#141B2D] font-mono text-xs gap-2"
            >
              <Pencil className="h-4 w-4 text-blue-400" />
              Edit Specs
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Requisition Scope */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#182238] bg-[#0E131F] shadow-sm">
            <CardHeader className="pb-4 border-b border-[#182238]">
              <CardTitle className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Position Overview &amp; Scope
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {job.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Target Matrix */}
        <div>
          <Card className="border-[#182238] bg-[#0E131F] shadow-sm">
            <CardHeader className="pb-4 border-b border-[#182238]">
              <CardTitle className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-400" />
                Target Criteria Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2.5">
              {job.requirements.length === 0 ? (
                <p className="text-xs font-mono text-slate-500 italic">
                  No criteria defined for this job.
                </p>
              ) : (
                <>
                  {job.requirements
                    .filter((r) => r.isMandatory)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between py-1.5 border-b border-[#182238] last:border-0"
                      >
                        <span className="text-xs font-mono font-semibold text-slate-200">
                          {req.skillName}
                        </span>
                        <Badge className="bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono text-[9px] font-bold">
                          MANDATORY (2x)
                        </Badge>
                      </div>
                    ))}
                  {job.requirements.filter((r) => r.isMandatory).length > 0 &&
                    job.requirements.filter((r) => !r.isMandatory).length >
                      0 && <Separator className="bg-[#182238] my-2" />}
                  {job.requirements
                    .filter((r) => !r.isMandatory)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between py-1.5 border-b border-[#182238] last:border-0"
                      >
                        <span className="text-xs font-mono text-slate-400">
                          {req.skillName}
                        </span>
                        <Badge className="bg-slate-800 text-slate-400 border border-slate-700 font-mono text-[9px]">
                          OPTIONAL (1x)
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
