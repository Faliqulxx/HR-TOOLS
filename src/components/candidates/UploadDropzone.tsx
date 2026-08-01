"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Loader2,
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

    // Sequential upload — not parallel, to avoid server overload
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "pending") continue;

      // Mark as uploading
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
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-violet-500 bg-violet-500/10 scale-[1.01]"
            : "border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20 border border-violet-600/30 mb-4">
          <Upload
            className={cn(
              "h-7 w-7 text-violet-400 transition-transform duration-200",
              isDragActive && "scale-110"
            )}
          />
        </div>

        {isDragActive ? (
          <p className="text-base font-semibold text-violet-300">
            Drop your resumes here!
          </p>
        ) : (
          <>
            <p className="text-base font-semibold text-slate-200 mb-1">
              Drag &amp; drop resumes here
            </p>
            <p className="text-sm text-slate-500">
              or{" "}
              <span className="text-violet-400 underline-offset-2 hover:underline">
                click to browse
              </span>
            </p>
          </>
        )}

        <p className="text-xs text-slate-600 mt-3">
          Supports PDF and DOCX files &mdash; multiple files allowed
        </p>
      </div>

      {/* File list */}
      {hasFiles && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </p>
            {!isUploading && (
              <button
                onClick={clearAll}
                className="text-xs text-slate-600 hover:text-rose-400 transition-colors"
              >
                Clear all
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

      {/* Summary */}
      {summary && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <p className="text-sm font-semibold text-slate-200 mb-3">
            Upload Complete — {summary.total} file{summary.total !== 1 ? "s" : ""} processed
          </p>
          <div className="grid grid-cols-3 gap-3">
            <SummaryCard
              count={summary.success}
              label="Parsed"
              color="emerald"
            />
            <SummaryCard
              count={summary.needsReview}
              label="Need Review"
              color="amber"
            />
            <SummaryCard count={summary.failed} label="Failed" color="rose" />
          </div>
        </div>
      )}

      {/* Actions */}
      {hasFiles && (
        <div className="flex justify-end gap-3">
          {!isUploading && pendingCount > 0 && (
            <Button
              onClick={uploadAll}
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-900/30 gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload {pendingCount} Resume{pendingCount !== 1 ? "s" : ""}
            </Button>
          )}
          {isUploading && (
            <Button disabled className="bg-violet-600/50 text-white gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

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
      icon: <Clock className="h-4 w-4 text-slate-500" />,
      color: "text-slate-500",
      label: "Pending",
    },
    uploading: {
      icon: <Loader2 className="h-4 w-4 text-violet-400 animate-spin" />,
      color: "text-violet-400",
      label: "Uploading...",
    },
    success: {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
      color: "text-emerald-400",
      label: result?.fullName ? `${result.fullName} · ${result.skillsCount ?? 0} skills` : "Parsed",
    },
    needs_review: {
      icon: <AlertCircle className="h-4 w-4 text-amber-400" />,
      color: "text-amber-400",
      label: "Needs review",
    },
    error: {
      icon: <AlertCircle className="h-4 w-4 text-rose-400" />,
      color: "text-rose-400",
      label: result?.error ?? "Failed",
    },
  };

  const cfg = statusConfig[status];

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2.5">
      <FileText className="h-4 w-4 text-slate-600 shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300 truncate">{file.name}</p>
        <p className={`text-xs ${cfg.color} truncate`}>{cfg.label}</p>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <span className="text-xs text-slate-600">
          {(file.size / 1024).toFixed(0)} KB
        </span>
        {cfg.icon}
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-slate-700 hover:text-rose-400 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {status === "needs_review" && result?.candidateId && (
          <a
            href={`/candidates/${result.candidateId}/review-parsing`}
            className="text-xs text-amber-400 hover:text-amber-300 underline-offset-2 hover:underline transition-colors"
          >
            Review
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
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs opacity-80 mt-0.5">{label}</p>
    </div>
  );
}
