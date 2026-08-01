import { UploadCloud } from "lucide-react";
import { UploadDropzone } from "@/components/candidates/UploadDropzone";

export const metadata = {
  title: "Candidate Resume Ingestion — Signal HR",
  description: "Automated PDF/DOCX resume ingestion and AI entity parsing engine.",
};

export default function CandidateUploadPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="border-b border-[#182238] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Resume Ingestion Console
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-0.5">
              Upload PDF or DOCX candidate resumes for automated entity extraction &amp; indexing.
            </p>
          </div>
        </div>
      </div>

      <UploadDropzone />
    </div>
  );
}
