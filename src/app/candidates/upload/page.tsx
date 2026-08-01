import { Upload } from "lucide-react";

export default function CandidateUploadPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-0px)] gap-4 text-center px-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600/20 border border-emerald-600/30">
        <Upload className="h-8 w-8 text-emerald-400" />
      </div>
      <h1 className="text-2xl font-bold text-white">Upload Candidates</h1>
      <p className="text-slate-400 max-w-sm text-sm">
        Bulk upload PDF/DOCX resumes and let AI parse them automatically. Full upload &amp; parsing coming in Phase 2.
      </p>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400">
        Coming in Phase 2
      </span>
    </div>
  );
}
