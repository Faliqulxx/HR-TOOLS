"use client";

import { useState } from "react";
import { FileText, ExternalLink, AlertCircle } from "lucide-react";
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
      {/* Toolbar */}
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-400 truncate max-w-xs">
            {fileName}
          </span>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open in new tab
        </a>
      </div>

      {/* Viewer */}
      {isPdf && !loadError ? (
        <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
          <iframe
            src={fileUrl}
            title={`Resume — ${fileName}`}
            className="w-full"
            style={{ height: "80vh", minHeight: "600px" }}
            onError={() => setLoadError(true)}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 py-20 gap-4 text-center">
          {loadError ? (
            <>
              <AlertCircle className="h-10 w-10 text-amber-400" />
              <div>
                <p className="text-slate-300 font-medium">
                  Preview not available
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  Unable to render the file inline.
                </p>
              </div>
            </>
          ) : (
            <>
              <FileText className="h-10 w-10 text-slate-600" />
              <div>
                <p className="text-slate-300 font-medium">DOCX file</p>
                <p className="text-slate-500 text-sm mt-1">
                  DOCX files cannot be previewed directly.
                </p>
              </div>
            </>
          )}
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open File
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
