import path from "path";

export type ExtractResult = {
  rawText: string;
  error?: string;
};

/**
 * Extracts plain text from a PDF or DOCX file buffer.
 * Returns { rawText } on success, { rawText: "", error } on failure.
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
    return { rawText: "", error: `Extraction failed: ${message}` };
  }
}

async function extractFromPDF(buffer: Buffer): Promise<ExtractResult> {
  // pdf-parse requires a CommonJS dynamic import
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);
  return { rawText: data.text ?? "" };
}

async function extractFromDOCX(buffer: Buffer): Promise<ExtractResult> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return { rawText: result.value ?? "" };
}
