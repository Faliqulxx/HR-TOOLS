import { z } from "zod";

export const jobRequirementSchema = z.object({
  skillName: z.string().min(1, "Skill name is required"),
  isMandatory: z.boolean().default(true),
  weight: z.number().int().min(1).max(2).default(1),
});

export const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"], {
    error: "Employment type is required",
  }),
  salaryMin: z.coerce.number().int().positive().optional().nullable(),
  salaryMax: z.coerce.number().int().positive().optional().nullable(),
  deadline: z.string().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  requirements: z
    .array(jobRequirementSchema)
    .min(1, "At least one skill requirement is needed"),
});

export type JobFormData = z.infer<typeof jobSchema>;
export type JobRequirementFormData = z.infer<typeof jobRequirementSchema>;
