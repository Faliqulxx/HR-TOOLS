"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RequirementInput } from "@/components/jobs/RequirementInput";
import { createJob, updateJob } from "@/lib/actions/job.actions";
import {
  jobSchema,
  type JobFormData,
  type JobRequirementFormData,
} from "@/lib/validations/job.schema";
import { Loader2, Save } from "lucide-react";

interface JobFormProps {
  initialData?: JobFormData & { id?: string };
  mode: "create" | "edit";
}

const defaultValues: JobFormData = {
  title: "",
  department: "",
  location: "",
  employmentType: "full-time",
  salaryMin: null,
  salaryMax: null,
  deadline: null,
  description: "",
  requirements: [],
};

export function JobForm({ initialData, mode }: JobFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<JobFormData>(
    initialData ?? defaultValues
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const updateField = <K extends keyof JobFormData>(
    key: K,
    value: JobFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: [] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const parsed = jobSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >;
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      try {
        if (mode === "create") {
          const result = await createJob(parsed.data);
          if (!result.success) {
            setErrors(result.error as Record<string, string[]>);
            return;
          }
        } else if (mode === "edit" && initialData?.id) {
          const result = await updateJob(initialData.id, parsed.data);
          if (!result.success) {
            setErrors(result.error as Record<string, string[]>);
            return;
          }
        }
        router.push("/jobs");
        router.refresh();
      } catch {
        setServerError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const fieldClass =
    "border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-600 focus-visible:ring-violet-500";
  const labelClass = "text-sm font-medium text-slate-300";
  const errorClass = "text-xs text-rose-400 mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          {serverError}
        </div>
      )}

      {/* Basic Info */}
      <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-slate-200">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Title */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Job Title <span className="text-rose-400">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className={`mt-1.5 ${fieldClass}`}
            />
            {errors.title && <p className={errorClass}>{errors.title[0]}</p>}
          </div>

          {/* Department */}
          <div>
            <label className={labelClass}>
              Department <span className="text-rose-400">*</span>
            </label>
            <Input
              value={formData.department}
              onChange={(e) => updateField("department", e.target.value)}
              placeholder="e.g. Engineering"
              className={`mt-1.5 ${fieldClass}`}
            />
            {errors.department && (
              <p className={errorClass}>{errors.department[0]}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className={labelClass}>
              Location <span className="text-rose-400">*</span>
            </label>
            <Input
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="e.g. Jakarta / Remote"
              className={`mt-1.5 ${fieldClass}`}
            />
            {errors.location && (
              <p className={errorClass}>{errors.location[0]}</p>
            )}
          </div>

          {/* Employment Type */}
          <div>
            <label className={labelClass}>
              Employment Type <span className="text-rose-400">*</span>
            </label>
            <Select
              value={formData.employmentType}
              onValueChange={(v) =>
                updateField(
                  "employmentType",
                  v as JobFormData["employmentType"]
                )
              }
            >
              <SelectTrigger className={`mt-1.5 ${fieldClass}`}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-900 text-slate-100">
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            {errors.employmentType && (
              <p className={errorClass}>{errors.employmentType[0]}</p>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label className={labelClass}>Application Deadline</label>
            <Input
              type="date"
              value={formData.deadline ?? ""}
              onChange={(e) => updateField("deadline", e.target.value || null)}
              className={`mt-1.5 ${fieldClass} [color-scheme:dark]`}
            />
          </div>

          {/* Salary */}
          <div>
            <label className={labelClass}>Salary Min (IDR)</label>
            <Input
              type="number"
              value={formData.salaryMin ?? ""}
              onChange={(e) =>
                updateField(
                  "salaryMin",
                  e.target.value ? Number(e.target.value) : null
                )
              }
              placeholder="e.g. 8000000"
              className={`mt-1.5 ${fieldClass}`}
            />
          </div>

          <div>
            <label className={labelClass}>Salary Max (IDR)</label>
            <Input
              type="number"
              value={formData.salaryMax ?? ""}
              onChange={(e) =>
                updateField(
                  "salaryMax",
                  e.target.value ? Number(e.target.value) : null
                )
              }
              placeholder="e.g. 15000000"
              className={`mt-1.5 ${fieldClass}`}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Job Description <span className="text-rose-400">*</span>
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              rows={6}
              className={`mt-1.5 ${fieldClass} resize-none`}
            />
            {errors.description && (
              <p className={errorClass}>{errors.description[0]}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
        <CardHeader className="pb-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-200">
              Skill Requirements
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Click a badge to toggle between Mandatory (weight 2) and
              Nice-to-have (weight 1).
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <RequirementInput
            requirements={formData.requirements as JobRequirementFormData[]}
            onChange={(reqs) => updateField("requirements", reqs)}
            error={errors.requirements?.[0]}
          />
        </CardContent>
      </Card>

      <Separator className="bg-slate-800" />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-400 hover:text-slate-200"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-900/30 min-w-[140px]"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isPending
            ? "Saving..."
            : mode === "create"
              ? "Create Job"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
