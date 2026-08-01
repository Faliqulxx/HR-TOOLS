"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { jobSchema, type JobFormData } from "@/lib/validations/job.schema";

// ── CREATE ──────────────────────────────────────────────────────────────────

export async function createJob(data: JobFormData) {
  const parsed = jobSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { requirements, deadline, salaryMin, salaryMax, ...jobData } =
    parsed.data;

  const job = await prisma.job.create({
    data: {
      ...jobData,
      salaryMin: salaryMin ?? null,
      salaryMax: salaryMax ?? null,
      deadline: deadline ? new Date(deadline) : null,
      requirements: {
        create: requirements.map((req) => ({
          skillName: req.skillName,
          isMandatory: req.isMandatory,
          weight: req.isMandatory ? 2 : 1,
        })),
      },
    },
  });

  revalidatePath("/jobs");
  return { success: true, jobId: job.id };
}

// ── READ ─────────────────────────────────────────────────────────────────────

export async function getJobs() {
  return prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true } },
    },
  });
}

export async function getJobById(id: string) {
  return prisma.job.findUnique({
    where: { id },
    include: {
      requirements: { orderBy: { isMandatory: "desc" } },
      _count: { select: { applications: true } },
    },
  });
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

export async function updateJob(id: string, data: JobFormData) {
  const parsed = jobSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { requirements, deadline, salaryMin, salaryMax, ...jobData } =
    parsed.data;

  await prisma.$transaction([
    // Delete old requirements
    prisma.jobRequirement.deleteMany({ where: { jobId: id } }),
    // Update job + insert new requirements
    prisma.job.update({
      where: { id },
      data: {
        ...jobData,
        salaryMin: salaryMin ?? null,
        salaryMax: salaryMax ?? null,
        deadline: deadline ? new Date(deadline) : null,
        requirements: {
          create: requirements.map((req) => ({
            skillName: req.skillName,
            isMandatory: req.isMandatory,
            weight: req.isMandatory ? 2 : 1,
          })),
        },
      },
    }),
  ]);

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);
  return { success: true };
}

export async function updateJobStatus(id: string, status: string) {
  await prisma.job.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);
  return { success: true };
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function deleteJob(id: string) {
  await prisma.job.delete({ where: { id } });
  revalidatePath("/jobs");
  return { success: true };
}
