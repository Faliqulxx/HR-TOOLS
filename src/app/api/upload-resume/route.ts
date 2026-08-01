import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { extractText } from "@/lib/ai/extract-text";
import { parseResume } from "@/lib/ai/parser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExts = [".pdf", ".docx"];
    const ext = path.extname(file.name).toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX are allowed." },
        { status: 400 }
      );
    }

    // 1. Save file to disk
    const uuid = randomUUID();
    const safeFilename = `${uuid}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");

    await mkdir(uploadsDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadsDir, safeFilename);
    await writeFile(filePath, buffer);

    const resumeFileUrl = `/uploads/resumes/${safeFilename}`;

    // 2. Extract text
    let rawText = "";
    let parseError: string | undefined;

    try {
      const extractResult = await extractText(buffer, file.name);
      rawText = extractResult.rawText;
      parseError = extractResult.error;
    } catch {
      parseError = "Text extraction failed";
    }

    // 3. Parse resume
    let parsed;
    let parsingStatus: "parsed" | "needs_review" | "failed" = "needs_review";

    if (rawText && rawText.trim().length > 20) {
      try {
        parsed = parseResume(rawText);

        // Determine status based on what was extracted
        if (parsed.fullName || parsed.email) {
          parsingStatus = "parsed";
        } else {
          parsingStatus = "needs_review";
        }
      } catch {
        parsingStatus = "needs_review";
      }
    } else {
      // File saved but text couldn't be extracted (scanned PDF, protected, etc.)
      // Still save as needs_review so HR can fill manually
      parsingStatus = "needs_review";
      if (parseError) {
        console.warn(`[upload-resume] Text extraction issue for ${file.name}: ${parseError}`);
      }
    }

    // 4. Save to database
    const candidate = await prisma.candidate.create({
      data: {
        fullName: parsed?.fullName ?? file.name.replace(/\.[^.]+$/, ""),
        email: parsed?.email ?? null,
        phone: parsed?.phone ?? null,
        linkedinUrl: parsed?.linkedinUrl ?? null,
        githubUrl: parsed?.githubUrl ?? null,
        portfolioUrl: parsed?.portfolioUrl ?? null,
        resumeFileUrl,
        resumeFileName: file.name,
        rawText,
        parsingStatus,
        educations: parsed?.educations?.length
          ? {
              create: parsed.educations.map((edu) => ({
                institution: edu.institution,
                degree: edu.degree ?? null,
                major: edu.major ?? null,
                gpa: edu.gpa ?? null,
                startYear: edu.startYear ?? null,
                endYear: edu.endYear ?? null,
              })),
            }
          : undefined,
        experiences: parsed?.experiences?.length
          ? {
              create: parsed.experiences.map((exp) => ({
                company: exp.company,
                position: exp.position,
                startDate: exp.startDate ?? null,
                endDate: exp.endDate ?? null,
                isCurrent: exp.isCurrent ?? false,
                description: exp.description ?? null,
              })),
            }
          : undefined,
        skills: parsed?.skills?.length
          ? {
              create: parsed.skills.map((skill) => ({ skillName: skill })),
            }
          : undefined,
        certifications: parsed?.certifications?.length
          ? {
              create: parsed.certifications.map((cert) => ({
                name: cert.name,
                issuer: cert.issuer ?? null,
                year: cert.year ?? null,
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      candidateId: candidate.id,
      parsingStatus: candidate.parsingStatus,
      fullName: candidate.fullName,
      email: candidate.email,
      skillsCount: parsed?.skills?.length ?? 0,
    });
  } catch (err) {
    console.error("[upload-resume] Error:", err);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
