"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// ── READ ──────────────────────────────────────────────────────────────────────

export async function getCandidates() {
  return prisma.candidate.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      skills: true,
      _count: { select: { applications: true } },
    },
  });
}

export async function getCandidateById(id: string) {
  return prisma.candidate.findUnique({
    where: { id },
    include: {
      educations: true,
      experiences: { orderBy: { startDate: "desc" } },
      skills: true,
      certifications: true,
      applications: {
        include: { job: true },
        orderBy: { matchScore: "desc" },
      },
    },
  });
}

// ── UPDATE (for review-parsing page) ─────────────────────────────────────────

type UpdateCandidateData = {
  fullName?: string;
  email?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  skills?: string[];
  educations?: {
    institution: string;
    degree?: string | null;
    major?: string | null;
    gpa?: number | null;
    startYear?: number | null;
    endYear?: number | null;
  }[];
  experiences?: {
    company: string;
    position: string;
    startDate?: Date | null;
    endDate?: Date | null;
    isCurrent?: boolean;
    description?: string | null;
  }[];
};

export async function updateCandidateParsing(
  id: string,
  data: UpdateCandidateData
) {
  await prisma.$transaction(async (tx) => {
    // Update basic fields
    await tx.candidate.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
        parsingStatus: "parsed",
      },
    });

    // Replace skills
    if (data.skills !== undefined) {
      await tx.candidateSkill.deleteMany({ where: { candidateId: id } });
      if (data.skills.length > 0) {
        await tx.candidateSkill.createMany({
          data: data.skills.map((skillName) => ({ candidateId: id, skillName })),
        });
      }
    }

    // Replace educations
    if (data.educations !== undefined) {
      await tx.candidateEducation.deleteMany({ where: { candidateId: id } });
      if (data.educations.length > 0) {
        await tx.candidateEducation.createMany({
          data: data.educations.map((edu) => ({
            candidateId: id,
            institution: edu.institution,
            degree: edu.degree ?? null,
            major: edu.major ?? null,
            gpa: edu.gpa ?? null,
            startYear: edu.startYear ?? null,
            endYear: edu.endYear ?? null,
          })),
        });
      }
    }

    // Replace experiences
    if (data.experiences !== undefined) {
      await tx.candidateExperience.deleteMany({ where: { candidateId: id } });
      if (data.experiences.length > 0) {
        await tx.candidateExperience.createMany({
          data: data.experiences.map((exp) => ({
            candidateId: id,
            company: exp.company,
            position: exp.position,
            startDate: exp.startDate ?? null,
            endDate: exp.endDate ?? null,
            isCurrent: exp.isCurrent ?? false,
            description: exp.description ?? null,
          })),
        });
      }
    }
  });

  revalidatePath(`/candidates/${id}`);
  revalidatePath(`/candidates/${id}/review-parsing`);
  return { success: true };
}
