import { Upload } from "lucide-react";
import { UploadDropzone } from "@/components/candidates/UploadDropzone";

export const metadata = {
  title: "Upload Candidates — HR Tools",
  description: "Drag and drop PDF/DOCX resumes for AI parsing",
};

export default function CandidateUploadPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/20 border border-emerald-600/30">
            <Upload className="h-5 w-5 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Upload Resumes</h1>
        </div>
        <p className="text-slate-400 text-sm ml-12">
          Drop PDF or DOCX files here. The AI parser will automatically extract
          candidate information.
        </p>
      </div>

      <UploadDropzone />
    </div>
  );
}
