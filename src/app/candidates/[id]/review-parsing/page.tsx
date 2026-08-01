import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { getCandidateById } from "@/lib/actions/candidate.actions";
import { ParsingReviewForm } from "@/components/candidates/ParsingReviewForm";

export const metadata = {
  title: "Review Parsing — HR Tools",
};

export default async function ReviewParsingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getCandidateById(id);
  if (!candidate) notFound();

  const isAlreadyParsed = candidate.parsingStatus === "parsed";

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/candidates/upload"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Upload
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Review Parsed Resume
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Verify and correct the AI-extracted data below, then confirm to save.
        </p>
      </div>

      {/* Status Banner */}
      {isAlreadyParsed ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 mb-6">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-300">
              Already confirmed
            </p>
            <p className="text-xs text-emerald-400/70">
              This resume has been reviewed. You can still make further edits.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 mb-6">
          <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-300">
              Needs review
            </p>
            <p className="text-xs text-amber-400/70">
              The AI parser couldn&apos;t confidently extract all fields. Please
              review and correct the data below.
            </p>
          </div>
        </div>
      )}

      {/* File info */}
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500">Source file</p>
          <p className="text-sm text-slate-300 truncate">
            {candidate.resumeFileName}
          </p>
        </div>
        <a
          href={candidate.resumeFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-violet-400 hover:text-violet-300 underline-offset-2 hover:underline transition-colors shrink-0"
        >
          View File
        </a>
      </div>

      <ParsingReviewForm candidate={candidate} />
    </div>
  );
}
