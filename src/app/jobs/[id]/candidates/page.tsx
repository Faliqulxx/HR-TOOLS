import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Users, Briefcase, Target } from "lucide-react";
import { getJobById } from "@/lib/actions/job.actions";
import { getCandidateRanking } from "@/lib/actions/matching.actions";
import { RankingTable } from "@/components/candidates/RankingTable";
import type { SortField } from "@/lib/actions/matching.actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  return {
    title: job ? `Candidates for ${job.title} — Signal HR` : "Candidate Ranking — Signal HR",
  };
}

export default async function JobCandidatesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { id } = await params;
  const { sort } = await searchParams;

  const job = await getJobById(id);
  if (!job) notFound();

  const validSorts: SortField[] = [
    "matchScore",
    "experience",
    "gpa",
    "education",
    "uploadDate",
  ];
  const sortField: SortField = validSorts.includes(sort as SortField)
    ? (sort as SortField)
    : "matchScore";

  const ranking = await getCandidateRanking(id, sortField);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <Link
        href={`/jobs/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Return to Job Requisition &bull; {job.title}
      </Link>

      {/* Header Banner */}
      <div className="border-b border-[#182238] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100">
              Candidate Match Leaderboard
            </h1>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {job.title} &bull; {job.department} &bull; {job.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements Matrix Summary */}
      {job.requirements.length > 0 && (
        <div className="rounded-xl border border-[#182238] bg-[#0E131F] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Target Requisition Criteria ({job.requirements.length} Skills)
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Weighted Match Target
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req) => (
              <span
                key={req.id}
                className={`text-xs font-mono px-2.5 py-1 rounded-md border ${
                  req.isMandatory
                    ? "bg-rose-500/10 text-rose-300 border-rose-500/30 font-semibold"
                    : "bg-slate-800/80 text-slate-300 border-slate-700/60"
                }`}
              >
                {req.skillName}
                {req.isMandatory && (
                  <span className="ml-1.5 text-[10px] text-rose-400 uppercase font-bold">
                    [REQ]
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ranking Table */}
      <RankingTable
        jobId={id}
        jobTitle={job.title}
        initialData={ranking}
      />
    </div>
  );
}
