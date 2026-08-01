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
import { Loader2, Save, Sparkles } from "lucide-react";

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
        setServerError("An unexpected error occurred. Please verify form inputs and try again.");
      }
    });
  };

  const fieldClass =
    "border-[#1E2D4A] bg-[#090D16] text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500 font-sans text-xs";
  const labelClass = "text-xs font-mono font-bold text-slate-300 uppercase tracking-wider";
  const errorClass = "text-xs font-mono text-rose-400 mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-mono text-rose-400">
          {serverError}
        </div>
      )}

      {/* Basic Requisition Specs */}
      <Card className="border-[#182238] bg-[#0E131F] shadow-sm">
        <CardHeader className="pb-4 border-b border-[#182238]">
          <CardTitle className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            1. Requisition Specification
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-2 pt-5">
          {/* Title */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Requisition Title <span className="text-rose-400">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Senior Backend Engineer (Node.js/PostgreSQL)"
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
              placeholder="e.g. Core Engineering"
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
              placeholder="e.g. Jakarta, ID / Remote"
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
              <SelectContent className="border-[#1E2D4A] bg-[#0E131F] text-slate-100 font-mono text-xs">
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
            <label className={labelClass}>Requisition Deadline</label>
            <Input
              type="date"
              value={formData.deadline ?? ""}
              onChange={(e) => updateField("deadline", e.target.value || null)}
              className={`mt-1.5 ${fieldClass} [color-scheme:dark]`}
            />
          </div>

          {/* Salary Min */}
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
              placeholder="e.g. 12000000"
              className={`mt-1.5 ${fieldClass} font-mono`}
            />
          </div>

          {/* Salary Max */}
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
              placeholder="e.g. 20000000"
              className={`mt-1.5 ${fieldClass} font-mono`}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Role Description & Context <span className="text-rose-400">*</span>
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Provide job scope, key responsibilities, and team context..."
              rows={5}
              className={`mt-1.5 ${fieldClass} resize-none`}
            />
            {errors.description && (
              <p className={errorClass}>{errors.description[0]}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Target Criteria */}
      <Card className="border-[#182238] bg-[#0E131F] shadow-sm">
        <CardHeader className="pb-4 border-b border-[#182238]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              2. Criteria Evaluation Target Matrix
            </CardTitle>
            <span className="text-[10px] font-mono text-slate-400">
              Mandatory = Weight 2x | Nice-to-have = Weight 1x
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <RequirementInput
            requirements={formData.requirements as JobRequirementFormData[]}
            onChange={(reqs) => updateField("requirements", reqs)}
            error={errors.requirements?.[0]}
          />
        </CardContent>
      </Card>

      <Separator className="bg-[#182238]" />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-400 hover:text-slate-200 font-mono text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white hover:bg-blue-500 font-mono text-xs font-semibold shadow-md shadow-blue-900/30 min-w-[160px]"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isPending
            ? "Executing..."
            : mode === "create"
              ? "Create Job Requisition"
              : "Save Requisition Changes"}
        </Button>
      </div>
    </form>
  );
}
