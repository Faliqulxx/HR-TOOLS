"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/ai/matching";
import type { MatchDetailItem } from "@/lib/ai/matching";

// ── Single candidate → single job ─────────────────────────────────────────────

export async function matchCandidateToJob(candidateId: string, jobId: string) {
  // 1. Fetch requirements
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { requirements: true },
  });
  if (!job) throw new Error(`Job ${jobId} not found`);

  // 2. Fetch candidate skills
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: { skills: true },
  });
  if (!candidate) throw new Error(`Candidate ${candidateId} not found`);

  const candidateSkills = candidate.skills.map((s) => s.skillName);

  // 3. Calculate match score
  const { score, detail } = calculateMatchScore(
    job.requirements.map((r) => ({
      skillName: r.skillName,
      isMandatory: r.isMandatory,
      weight: r.weight,
    })),
    candidateSkills
  );

  // 4. Upsert Application — unique on (candidateId, jobId)
  await prisma.application.upsert({
    where: { candidateId_jobId: { candidateId, jobId } },
    create: {
      candidateId,
      jobId,
      matchScore: score,
      matchDetail: detail as unknown as import("@prisma/client").Prisma.InputJsonValue,
      status: "new",
    },
    update: {
      matchScore: score,
      matchDetail: detail as unknown as import("@prisma/client").Prisma.InputJsonValue,
    },
  });

  return { candidateId, score, detail };
}

// ── All candidates → single job ───────────────────────────────────────────────

export async function matchAllCandidatesToJob(jobId: string) {
  // Fetch all candidates (parsed only — skip failed)
  const candidates = await prisma.candidate.findMany({
    where: { parsingStatus: { in: ["parsed", "needs_review"] } },
    select: { id: true },
  });

  let matched = 0;
  let failed = 0;

  for (const { id: candidateId } of candidates) {
    try {
      await matchCandidateToJob(candidateId, jobId);
      matched++;
    } catch {
      failed++;
    }
  }

  revalidatePath(`/jobs/${jobId}/candidates`);
  return { matched, failed, total: candidates.length };
}

// ── Read ranking for a job ────────────────────────────────────────────────────

export type SortField =
  | "matchScore"
  | "experience"
  | "gpa"
  | "education"
  | "uploadDate";

export async function getCandidateRanking(
  jobId: string,
  sort: SortField = "matchScore"
) {
  const applications = await prisma.application.findMany({
    where: { jobId },
    include: {
      candidate: {
        include: {
          educations: { orderBy: { endYear: "desc" }, take: 1 },
          experiences: { orderBy: { startDate: "desc" } },
          skills: true,
        },
      },
    },
  });

  // Sort client-side to support derived fields (experience years, GPA)
  const sorted = applications.sort((a, b) => {
    switch (sort) {
      case "matchScore":
        return (b.matchScore ?? 0) - (a.matchScore ?? 0);

      case "experience": {
        const expA = a.candidate.experiences.length;
        const expB = b.candidate.experiences.length;
        return expB - expA;
      }

      case "gpa": {
        const gpaA = a.candidate.educations[0]?.gpa ?? 0;
        const gpaB = b.candidate.educations[0]?.gpa ?? 0;
        return gpaB - gpaA;
      }

      case "education": {
        const degreeOrder: Record<string, number> = {
          phd: 4, doctorate: 4,
          master: 3, msc: 3, mba: 3, "m.sc": 3, "m.a": 3,
          bachelor: 2, bsc: 2, "b.sc": 2, s1: 2,
          diploma: 1, d3: 1, d4: 1,
        };
        const getDegreeScore = (app: typeof a) => {
          const deg = app.candidate.educations[0]?.degree?.toLowerCase() ?? "";
          return Object.entries(degreeOrder).find(([k]) => deg.includes(k))?.[1] ?? 0;
        };
        return getDegreeScore(b) - getDegreeScore(a);
      }

      case "uploadDate":
        return (
          new Date(b.candidate.createdAt).getTime() -
          new Date(a.candidate.createdAt).getTime()
        );

      default:
        return (b.matchScore ?? 0) - (a.matchScore ?? 0);
    }
  });

  return sorted.map((app, index) => ({
    rank: index + 1,
    applicationId: app.id,
    candidateId: app.candidate.id,
    fullName: app.candidate.fullName,
    email: app.candidate.email,
    matchScore: app.matchScore ?? 0,
    matchDetail: (app.matchDetail ?? []) as MatchDetailItem[],
    status: app.status,
    experienceCount: app.candidate.experiences.length,
    latestPosition: app.candidate.experiences[0]?.position ?? null,
    latestCompany: app.candidate.experiences[0]?.company ?? null,
    education: app.candidate.educations[0] ?? null,
    skillCount: app.candidate.skills.length,
    createdAt: app.candidate.createdAt,
  }));
}
