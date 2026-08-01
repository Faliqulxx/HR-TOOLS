import path from "path";

export type ExtractResult = {
  rawText: string;
  error?: string;
};

/**
 * Extracts plain text from a PDF or DOCX file buffer.
 * Returns { rawText } on success, { rawText: "", error } on failure.
 * Uses pdf-parse v1 (CommonJS) and mammoth (ESM).
 */
export async function extractText(
  buffer: Buffer,
  filename: string
): Promise<ExtractResult> {
  const ext = path.extname(filename).toLowerCase();

  try {
    if (ext === ".pdf") {
      return await extractFromPDF(buffer);
    } else if (ext === ".docx") {
      return await extractFromDOCX(buffer);
    } else {
      return { rawText: "", error: `Unsupported file type: ${ext}` };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[extract-text] Failed for ${filename}:`, message);
    return { rawText: "", error: `Extraction failed: ${message}` };
  }
}

async function extractFromPDF(buffer: Buffer): Promise<ExtractResult> {
  try {
    // pdf-parse v1 is CJS — use require to avoid bundler issues
    // Listed in serverExternalPackages in next.config.ts
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    const text = (data?.text ?? "").trim();
    if (!text) {
      return {
        rawText: "",
        error: "PDF has no extractable text (may be image-based or password-protected)",
      };
    }
    return { rawText: text };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[extract-text] PDF error:", msg);
    return { rawText: "", error: `PDF extraction error: ${msg}` };
  }
}

async function extractFromDOCX(buffer: Buffer): Promise<ExtractResult> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    const text = (result?.value ?? "").trim();
    if (!text) {
      return { rawText: "", error: "DOCX appears to be empty" };
    }
    return { rawText: text };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { rawText: "", error: `DOCX extraction error: ${msg}` };
  }
}
