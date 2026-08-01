"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileStatus = "pending" | "uploading" | "success" | "error" | "needs_review";

type FileEntry = {
  file: File;
  status: FileStatus;
  result?: {
    candidateId?: string;
    fullName?: string;
    email?: string | null;
    parsingStatus?: string;
    skillsCount?: number;
    error?: string;
  };
};

type UploadSummary = {
  total: number;
  success: number;
  needsReview: number;
  failed: number;
};

export function UploadDropzone() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [summary, setSummary] = useState<UploadSummary | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newEntries: FileEntry[] = acceptedFiles.map((file) => ({
      file,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...newEntries]);
    setSummary(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    multiple: true,
    disabled: isUploading,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setSummary(null);
  };

  const uploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    let success = 0;
    let needsReview = 0;
    let failed = 0;

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "pending") continue;

      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: "uploading" } : f
        )
      );

      try {
        const formData = new FormData();
        formData.append("file", files[i].file);

        const response = await fetch("/api/upload-resume", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const fileStatus: FileStatus =
            data.parsingStatus === "parsed"
              ? "success"
              : data.parsingStatus === "needs_review"
                ? "needs_review"
                : "error";

          if (fileStatus === "success") success++;
          else if (fileStatus === "needs_review") needsReview++;
          else failed++;

          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? { ...f, status: fileStatus, result: data }
                : f
            )
          );
        } else {
          failed++;
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? {
                    ...f,
                    status: "error",
                    result: { error: data.error ?? "Upload failed" },
                  }
                : f
            )
          );
        }
      } catch {
        failed++;
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: "error", result: { error: "Network error" } }
              : f
          )
        );
      }
    }

    setSummary({ total: pendingFiles.length, success, needsReview, failed });
    setIsUploading(false);
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const hasFiles = files.length > 0;

  return (
    <div className="space-y-6">
      {/* Dropzone Box */}
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
            : "border-[#1E2D4A] bg-[#0E131F] hover:border-blue-500/50 hover:bg-[#121A2C]/60",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 mb-3 text-blue-400">
          <Upload
            className={cn(
              "h-6 w-6 transition-transform duration-200",
              isDragActive && "scale-110"
            )}
          />
        </div>

        {isDragActive ? (
          <p className="text-sm font-mono font-bold text-blue-300">
            Release files to initiate ingestion...
          </p>
        ) : (
          <>
            <p className="text-sm font-bold text-slate-200 mb-1">
              Drag &amp; drop candidate resumes here
            </p>
            <p className="text-xs text-slate-400 font-mono">
              or{" "}
              <span className="text-blue-400 font-semibold underline-offset-2 hover:underline">
                click to select files
              </span>
            </p>
          </>
        )}

        <p className="text-[11px] font-mono text-slate-400 mt-3">
          Supported Formats: PDF, DOCX (Batch upload up to 20MB per file)
        </p>
      </div>

      {/* Selected File List */}
      {hasFiles && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Selected Ingestion Queue ({files.length})
            </p>
            {!isUploading && (
              <button
                onClick={clearAll}
                className="text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors"
              >
                Clear Queue
              </button>
            )}
          </div>

          {files.map((entry, i) => (
            <FileRow
              key={`${entry.file.name}-${i}`}
              entry={entry}
              onRemove={() => removeFile(i)}
              canRemove={!isUploading && entry.status === "pending"}
            />
          ))}
        </div>
      )}

      {/* Processing Summary */}
      {summary && (
        <div className="rounded-xl border border-[#182238] bg-[#0E131F] p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Ingestion Execution Completed — {summary.total} Files
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <SummaryCard
              count={summary.success}
              label="Parsed & Validated"
              color="emerald"
            />
            <SummaryCard
              count={summary.needsReview}
              label="Needs HR Review"
              color="amber"
            />
            <SummaryCard count={summary.failed} label="Ingestion Error" color="rose" />
          </div>
        </div>
      )}

      {/* Action Controls */}
      {hasFiles && (
        <div className="flex justify-end gap-3 pt-2">
          {!isUploading && pendingCount > 0 && (
            <Button
              onClick={uploadAll}
              className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold shadow-md shadow-blue-900/30 gap-2"
            >
              <Upload className="h-4 w-4" />
              Ingest &amp; Parse {pendingCount} Resume{pendingCount !== 1 ? "s" : ""}
            </Button>
          )}
          {isUploading && (
            <Button disabled className="bg-blue-600/50 text-white font-mono text-xs gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Parsing &amp; Extracting Entities...
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function FileRow({
  entry,
  onRemove,
  canRemove,
}: {
  entry: FileEntry;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const { file, status, result } = entry;

  const statusConfig: Record<
    FileStatus,
    { icon: React.ReactNode; color: string; label: string }
  > = {
    pending: {
      icon: <Clock className="h-4 w-4 text-slate-400" />,
      color: "text-slate-400 font-mono",
      label: "Queued",
    },
    uploading: {
      icon: <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />,
      color: "text-blue-400 font-mono",
      label: "Extracting...",
    },
    success: {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
      color: "text-emerald-400 font-mono",
      label: result?.fullName ? `${result.fullName} (${result.skillsCount ?? 0} skills)` : "Parsed Successfully",
    },
    needs_review: {
      icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
      color: "text-amber-400 font-mono",
      label: "Requires HR Review",
    },
    error: {
      icon: <AlertTriangle className="h-4 w-4 text-rose-400" />,
      color: "text-rose-400 font-mono",
      label: result?.error ?? "Ingestion error",
    },
  };

  const cfg = statusConfig[status];

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#182238] bg-[#0E131F] px-4 py-3">
      <FileText className="h-4 w-4 text-blue-400 shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-200 truncate">{file.name}</p>
        <p className={`text-[11px] ${cfg.color} truncate mt-0.5`}>{cfg.label}</p>
      </div>

      <div className="shrink-0 flex items-center gap-3">
        <span className="text-[11px] font-mono text-slate-400">
          {(file.size / 1024).toFixed(0)} KB
        </span>
        {cfg.icon}
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-slate-400 hover:text-rose-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {status === "needs_review" && result?.candidateId && (
          <a
            href={`/candidates/${result.candidateId}/review-parsing`}
            className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 underline-offset-2 hover:underline transition-colors ml-1"
          >
            <span>Review</span>
            <ArrowRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  count,
  label,
  color,
}: {
  count: number;
  label: string;
  color: "emerald" | "amber" | "rose";
}) {
  const colorMap = {
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-300",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-300",
  };

  return (
    <div
      className={`rounded-lg border p-3 text-center ${colorMap[color]}`}
    >
      <p className="text-2xl font-extrabold font-mono tabular-nums">{count}</p>
      <p className="text-[11px] font-mono opacity-90 mt-0.5">{label}</p>
    </div>
  );
}
