"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { JobRequirementFormData } from "@/lib/validations/job.schema";

interface RequirementInputProps {
  requirements: JobRequirementFormData[];
  onChange: (requirements: JobRequirementFormData[]) => void;
  error?: string;
}

export function RequirementInput({
  requirements,
  onChange,
  error,
}: RequirementInputProps) {
  const addRequirement = () => {
    onChange([
      ...requirements,
      { skillName: "", isMandatory: true, weight: 2 },
    ]);
  };

  const removeRequirement = (index: number) => {
    onChange(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (
    index: number,
    field: keyof JobRequirementFormData,
    value: string | boolean | number
  ) => {
    const updated = requirements.map((req, i) => {
      if (i !== index) return req;
      if (field === "isMandatory") {
        const isMandatory = value as boolean;
        return { ...req, isMandatory, weight: isMandatory ? 2 : 1 };
      }
      return { ...req, [field]: value };
    });
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {requirements.length === 0 && (
        <div className="p-4 rounded-lg border border-dashed border-[#182238] bg-[#090D16] text-center">
          <p className="text-xs font-mono text-slate-400">
            No skill criteria added yet. Click &quot;Add Requirement Criteria&quot; below to add target skills.
          </p>
        </div>
      )}

      {requirements.map((req, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg border border-[#182238] bg-[#0E131F] p-3 shadow-sm"
        >
          {/* Skill Name Input */}
          <Input
            placeholder="Skill name (e.g. Python, PostgreSQL, React)"
            value={req.skillName}
            onChange={(e) => updateRequirement(index, "skillName", e.target.value)}
            className="flex-1 border-[#1E2D4A] bg-[#090D16] text-slate-100 font-mono text-xs placeholder:text-slate-500 focus-visible:ring-blue-500"
          />

          {/* Mandatory/Optional Toggle */}
          <button
            type="button"
            onClick={() => updateRequirement(index, "isMandatory", !req.isMandatory)}
            className="shrink-0"
          >
            {req.isMandatory ? (
              <Badge className="cursor-pointer bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 font-mono text-[10px] font-bold">
                MANDATORY (2x)
              </Badge>
            ) : (
              <Badge className="cursor-pointer bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 font-mono text-[10px]">
                NICE-TO-HAVE (1x)
              </Badge>
            )}
          </button>

          {/* Remove Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeRequirement(index)}
            className="shrink-0 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {error && <p className="text-xs font-mono text-rose-400">{error}</p>}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addRequirement}
        className="border-dashed border-[#1E2D4A] bg-[#090D16] text-slate-300 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/10 font-mono text-xs gap-2"
      >
        <Plus className="h-4 w-4 text-blue-400" />
        Add Requirement Criteria
      </Button>
    </div>
  );
}
