import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Users } from "lucide-react";
import { getJobById } from "@/lib/actions/job.actions";

export default async function JobCandidatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <Link
        href={`/jobs/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to {job.title}
      </Link>

      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 border border-violet-600/30">
          <Users className="h-8 w-8 text-violet-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">
          Candidates for {job.title}
        </h1>
        <p className="text-slate-400 max-w-sm text-sm">
          AI matching and candidate ranking will be available here in Phase 3.
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400">
          Coming in Phase 3
        </span>
      </div>
    </div>
  );
}
