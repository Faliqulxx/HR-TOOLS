"use server";

import { prisma } from "@/lib/prisma";

// ── KPI Stats ─────────────────────────────────────────────────────────────────

export type DashboardStats = {
  totalApplicants: number;
  newResumesToday: number;
  passedScreening: number;
  rejected: number;
  activeJobs: number;
  avgMatchScore: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalApplicants,
    newResumesToday,
    passedScreening,
    rejected,
    activeJobs,
    avgScoreResult,
  ] = await Promise.all([
    // Total candidates uploaded
    prisma.candidate.count(),

    // New uploads today
    prisma.candidate.count({
      where: { createdAt: { gte: startOfToday } },
    }),

    // Passed screening: matchScore >= 70
    prisma.application.count({
      where: { matchScore: { gte: 70 } },
    }),

    // Rejected applications
    prisma.application.count({
      where: { status: "rejected" },
    }),

    // Active job postings
    prisma.job.count({
      where: { status: "active" },
    }),

    // Average match score
    prisma.application.aggregate({
      _avg: { matchScore: true },
    }),
  ]);

  return {
    totalApplicants,
    newResumesToday,
    passedScreening,
    rejected,
    activeJobs,
    avgMatchScore: Math.round((avgScoreResult._avg.matchScore ?? 0) * 10) / 10,
  };
}

// ── Chart Data ────────────────────────────────────────────────────────────────

export type ChartData = {
  applicantsPerDay: { date: string; count: number }[];
  applicantsPerJob: { jobTitle: string; count: number }[];
  topSkills: { skill: string; count: number }[];
  statusFunnel: { status: string; count: number }[];
};

export async function getChartData(): Promise<ChartData> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // ── Applicants per day (last 7 days) ──────────────────────────────────────
  const candidatesLast7 = await prisma.candidate.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true },
  });

  // Build 7-day map
  const dayMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dayMap[key] = 0;
  }
  for (const c of candidatesLast7) {
    const key = new Date(c.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (key in dayMap) dayMap[key]++;
  }
  const applicantsPerDay = Object.entries(dayMap).map(([date, count]) => ({
    date,
    count,
  }));

  // ── Applicants per Job (top 5) ─────────────────────────────────────────────
  const appPerJob = await prisma.application.groupBy({
    by: ["jobId"],
    _count: { candidateId: true },
    orderBy: { _count: { candidateId: "desc" } },
    take: 5,
  });

  // Fetch job titles
  const jobIds = appPerJob.map((a) => a.jobId);
  const jobs = await prisma.job.findMany({
    where: { id: { in: jobIds } },
    select: { id: true, title: true },
  });
  const jobMap = Object.fromEntries(jobs.map((j) => [j.id, j.title]));

  const applicantsPerJob = appPerJob.map((a) => ({
    jobTitle: jobMap[a.jobId] ?? "Unknown",
    count: a._count.candidateId,
  }));

  // ── Top Skills (top 10 by frequency) ─────────────────────────────────────
  const skillGroups = await prisma.candidateSkill.groupBy({
    by: ["skillName"],
    _count: { skillName: true },
    orderBy: { _count: { skillName: "desc" } },
    take: 10,
  });

  const topSkills = skillGroups.map((s) => ({
    skill: s.skillName,
    count: s._count.skillName,
  }));

  // ── Status Funnel ─────────────────────────────────────────────────────────
  const statusGroups = await prisma.application.groupBy({
    by: ["status"],
    _count: { status: true },
    orderBy: { _count: { status: "desc" } },
  });

  const statusFunnel = statusGroups.map((s) => ({
    status: s.status,
    count: s._count.status,
  }));

  return {
    applicantsPerDay,
    applicantsPerJob,
    topSkills,
    statusFunnel,
  };
}
