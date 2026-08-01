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
        <p className="text-sm text-slate-500 italic">
          No requirements added yet. Click &quot;Add Skill&quot; to start.
        </p>
      )}

      {requirements.map((req, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3"
        >
          {/* Skill Name */}
          <Input
            placeholder="Skill name (e.g. Python, Figma)"
            value={req.skillName}
            onChange={(e) => updateRequirement(index, "skillName", e.target.value)}
            className="flex-1 border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-600 focus-visible:ring-violet-500"
          />

          {/* Mandatory/Nice-to-have toggle */}
          <button
            type="button"
            onClick={() => updateRequirement(index, "isMandatory", !req.isMandatory)}
            className="shrink-0"
          >
            {req.isMandatory ? (
              <Badge className="cursor-pointer bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors">
                Mandatory
              </Badge>
            ) : (
              <Badge className="cursor-pointer bg-slate-700/50 text-slate-400 border border-slate-700 hover:bg-slate-700 transition-colors">
                Nice-to-have
              </Badge>
            )}
          </button>

          {/* Weight indicator */}
          <span className="text-xs text-slate-600 w-14 text-center shrink-0">
            weight: {req.weight}
          </span>

          {/* Remove */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeRequirement(index)}
            className="shrink-0 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addRequirement}
        className="border-dashed border-slate-700 text-slate-400 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/5"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Skill Requirement
      </Button>
    </div>
  );
}
