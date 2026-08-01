import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import { getCandidateById } from "@/lib/actions/candidate.actions";
import { ParsingReviewForm } from "@/components/candidates/ParsingReviewForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getCandidateById(id);
  return {
    title: candidate
      ? `Review Data for ${candidate.fullName} — Signal HR`
      : "Review Parsing — Signal HR",
  };
}

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
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <Link
        href="/candidates/upload"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Return to Ingestion Console
      </Link>

      {/* Header Banner */}
      <div className="border-b border-[#182238] pb-6">
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Entity Parsing Audit Console
        </h1>
        <p className="text-slate-400 text-xs font-mono mt-0.5">
          Verify and audit AI-extracted candidate metadata before indexing.
        </p>
      </div>

      {/* Status Alert Banner */}
      {isAlreadyParsed ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-mono font-bold text-emerald-300 uppercase">
              Parsed &amp; Verified Entity Data
            </p>
            <p className="text-xs font-sans text-emerald-400/80 mt-0.5">
              This candidate dossier has been verified. You may apply further manual corrections below.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3.5">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-xs font-mono font-bold text-amber-300 uppercase">
              Extraction Review Required
            </p>
            <p className="text-xs font-sans text-amber-400/80 mt-0.5">
              The automated entity parser requires HR verification for incomplete contact or experience fields.
            </p>
          </div>
        </div>
      )}

      {/* Source File Spec */}
      <div className="flex items-center gap-3 rounded-xl border border-[#182238] bg-[#0E131F] px-4 py-3">
        <FileText className="h-4 w-4 text-blue-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Original Document File</p>
          <p className="text-xs font-semibold text-slate-200 truncate">
            {candidate.resumeFileName}
          </p>
        </div>
        <a
          href={candidate.resumeFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline transition-colors shrink-0"
        >
          Open Document PDF
        </a>
      </div>

      <ParsingReviewForm candidate={candidate} />
    </div>
  );
}
