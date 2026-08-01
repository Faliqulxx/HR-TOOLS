import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Users, Briefcase } from "lucide-react";
import { getJobById } from "@/lib/actions/job.actions";
import { getCandidateRanking } from "@/lib/actions/matching.actions";
import { RankingTable } from "@/components/candidates/RankingTable";
import type { SortField } from "@/lib/actions/matching.actions";

export const metadata = {
  title: "Candidate Matching — HR Tools",
};

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
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href={`/jobs/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to {job.title}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-600/30">
            <Users className="h-5 w-5 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Candidate Ranking</h1>
        </div>

        {/* Job context */}
        <div className="flex items-center gap-2 ml-12 text-sm text-slate-400">
          <Briefcase className="h-4 w-4 text-slate-600" />
          <span>
            {job.title} · {job.department} · {job.location}
          </span>
        </div>
      </div>

      {/* Requirements summary */}
      {job.requirements.length > 0 && (
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Job Requirements ({job.requirements.length} skills)
          </p>
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req) => (
              <span
                key={req.id}
                className={`text-xs px-2.5 py-1 rounded-full border ${
                  req.isMandatory
                    ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {req.skillName}
                {req.isMandatory && " ★"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ranking table */}
      <RankingTable
        jobId={id}
        jobTitle={job.title}
        initialData={ranking}
      />
    </div>
  );
}
