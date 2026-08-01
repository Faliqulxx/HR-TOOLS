"use client";

import { useState } from "react";
import { FileText, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeViewerProps {
  fileUrl: string;
  fileName: string;
}

export function ResumeViewer({ fileUrl, fileName }: ResumeViewerProps) {
  const [loadError, setLoadError] = useState(false);
  const isPdf = fileName.toLowerCase().endsWith(".pdf");

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex items-center justify-between rounded-xl border border-[#182238] bg-[#0E131F] px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-blue-400 shrink-0" />
          <span className="text-xs font-mono text-slate-300 truncate max-w-sm">
            {fileName}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182238] text-slate-400">
            {isPdf ? "PDF Document" : "Word Document"}
          </span>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors shrink-0"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open Fullscreen
        </a>
      </div>

      {/* Viewer Container */}
      {isPdf && !loadError ? (
        <div className="rounded-xl border border-[#182238] overflow-hidden bg-[#07090E] shadow-sm">
          <iframe
            src={fileUrl}
            title={`Resume Document — ${fileName}`}
            className="w-full"
            style={{ height: "80vh", minHeight: "650px" }}
            onError={() => setLoadError(true)}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#182238] bg-[#0E131F]/50 py-20 gap-4 text-center">
          {loadError ? (
            <>
              <AlertTriangle className="h-10 w-10 text-amber-400" />
              <div>
                <p className="text-slate-200 font-mono font-bold text-sm">
                  Document Preview Unavailable
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  The browser embedded viewer cannot render this PDF inline.
                </p>
              </div>
            </>
          ) : (
            <>
              <FileText className="h-10 w-10 text-slate-500" />
              <div>
                <p className="text-slate-200 font-mono font-bold text-sm">DOCX Document Format</p>
                <p className="text-slate-400 text-xs mt-1">
                  Word files must be opened directly in an external viewer or tab.
                </p>
              </div>
            </>
          )}
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="border-[#1E2D4A] bg-[#090D16] text-slate-200 hover:bg-[#141B2D] font-mono text-xs gap-2"
            >
              <ExternalLink className="h-4 w-4 text-blue-400" />
              Download / Open File
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
