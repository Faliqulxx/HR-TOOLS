"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { updateCandidateParsing } from "@/lib/actions/candidate.actions";

type Education = {
  institution: string;
  degree: string | null;
  major: string | null;
  gpa: number | null;
  startYear: number | null;
  endYear: number | null;
};

type Experience = {
  company: string;
  position: string;
  isCurrent: boolean;
  description: string | null;
};

type Props = {
  candidate: {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    portfolioUrl: string | null;
    parsingStatus: string;
    skills: { skillName: string }[];
    educations: Education[];
    experiences: Experience[];
  };
};

export function ParsingReviewForm({ candidate }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState(candidate.fullName ?? "");
  const [email, setEmail] = useState(candidate.email ?? "");
  const [phone, setPhone] = useState(candidate.phone ?? "");
  const [linkedin, setLinkedin] = useState(candidate.linkedinUrl ?? "");
  const [github, setGithub] = useState(candidate.githubUrl ?? "");
  const [portfolio, setPortfolio] = useState(candidate.portfolioUrl ?? "");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(
    candidate.skills.map((s) => s.skillName)
  );
  const [educations, setEducations] = useState<Education[]>(
    candidate.educations
  );
  const [experiences, setExperiences] = useState<Experience[]>(
    candidate.experiences
  );

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) =>
    setSkills(skills.filter((s) => s !== skill));

  const addEducation = () =>
    setEducations([
      ...educations,
      {
        institution: "",
        degree: null,
        major: null,
        gpa: null,
        startYear: null,
        endYear: null,
      },
    ]);

  const removeEducation = (i: number) =>
    setEducations(educations.filter((_, idx) => idx !== i));

  const updateEducation = <K extends keyof Education>(
    index: number,
    key: K,
    value: Education[K]
  ) =>
    setEducations(
      educations.map((e, i) => (i === index ? { ...e, [key]: value } : e))
    );

  const addExperience = () =>
    setExperiences([
      ...experiences,
      { company: "", position: "", isCurrent: false, description: null },
    ]);

  const removeExperience = (i: number) =>
    setExperiences(experiences.filter((_, idx) => idx !== i));

  const updateExperience = <K extends keyof Experience>(
    index: number,
    key: K,
    value: Experience[K]
  ) =>
    setExperiences(
      experiences.map((e, i) => (i === index ? { ...e, [key]: value } : e))
    );

  const handleSave = () => {
    startTransition(async () => {
      await updateCandidateParsing(candidate.id, {
        fullName,
        email: email || null,
        phone: phone || null,
        linkedinUrl: linkedin || null,
        githubUrl: github || null,
        portfolioUrl: portfolio || null,
        skills,
        educations,
        experiences: experiences.map((exp) => ({
          ...exp,
          startDate: null,
          endDate: null,
        })),
      });
      router.push(`/candidates/${candidate.id}`);
    });
  };

  const fieldClass =
    "border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-600 focus-visible:ring-violet-500";
  const labelClass = "text-xs font-medium text-slate-400";

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-slate-200">
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Full Name *</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`mt-1 ${fieldClass}`}
              placeholder="Candidate full name"
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 ${fieldClass}`}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`mt-1 ${fieldClass}`}
              placeholder="+62 812 ..."
            />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <Input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className={`mt-1 ${fieldClass}`}
              placeholder="linkedin.com/in/..."
            />
          </div>
          <div>
            <label className={labelClass}>GitHub URL</label>
            <Input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className={`mt-1 ${fieldClass}`}
              placeholder="github.com/..."
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Portfolio URL</label>
            <Input
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              className={`mt-1 ${fieldClass}`}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-slate-200">Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              className={`flex-1 ${fieldClass}`}
              placeholder="Type a skill and press Enter"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addSkill}
              className="border-slate-700 text-slate-400 hover:border-violet-500 hover:text-violet-400"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  className="bg-violet-500/20 text-violet-300 border border-violet-500/30 gap-1 pr-1"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-rose-300 transition-colors ml-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 italic">No skills added.</p>
          )}
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-slate-200">
              Education
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addEducation}
              className="text-slate-500 hover:text-violet-400 text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {educations.length === 0 && (
            <p className="text-sm text-slate-600 italic">No education entries.</p>
          )}
          {educations.map((edu, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-800 p-4 space-y-3 relative"
            >
              <button
                onClick={() => removeEducation(i)}
                className="absolute top-3 right-3 text-slate-700 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelClass}>Institution *</label>
                  <Input
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(i, "institution", e.target.value)
                    }
                    className={`mt-1 ${fieldClass}`}
                    placeholder="University name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Degree</label>
                  <Input
                    value={edu.degree ?? ""}
                    onChange={(e) =>
                      updateEducation(i, "degree", e.target.value || null)
                    }
                    className={`mt-1 ${fieldClass}`}
                    placeholder="e.g. Bachelor"
                  />
                </div>
                <div>
                  <label className={labelClass}>Major</label>
                  <Input
                    value={edu.major ?? ""}
                    onChange={(e) =>
                      updateEducation(i, "major", e.target.value || null)
                    }
                    className={`mt-1 ${fieldClass}`}
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div>
                  <label className={labelClass}>Start Year</label>
                  <Input
                    type="number"
                    value={edu.startYear ?? ""}
                    onChange={(e) =>
                      updateEducation(
                        i,
                        "startYear",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className={`mt-1 ${fieldClass}`}
                    placeholder="2018"
                  />
                </div>
                <div>
                  <label className={labelClass}>End Year</label>
                  <Input
                    type="number"
                    value={edu.endYear ?? ""}
                    onChange={(e) =>
                      updateEducation(
                        i,
                        "endYear",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className={`mt-1 ${fieldClass}`}
                    placeholder="2022"
                  />
                </div>
                <div>
                  <label className={labelClass}>GPA</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={edu.gpa ?? ""}
                    onChange={(e) =>
                      updateEducation(
                        i,
                        "gpa",
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    className={`mt-1 ${fieldClass}`}
                    placeholder="3.75"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-slate-200">
              Work Experience
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addExperience}
              className="text-slate-500 hover:text-violet-400 text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {experiences.length === 0 && (
            <p className="text-sm text-slate-600 italic">
              No experience entries.
            </p>
          )}
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-800 p-4 space-y-3 relative"
            >
              <button
                onClick={() => removeExperience(i)}
                className="absolute top-3 right-3 text-slate-700 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Company *</label>
                  <Input
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(i, "company", e.target.value)
                    }
                    className={`mt-1 ${fieldClass}`}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Position *</label>
                  <Input
                    value={exp.position}
                    onChange={(e) =>
                      updateExperience(i, "position", e.target.value)
                    }
                    className={`mt-1 ${fieldClass}`}
                    placeholder="Job title"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Description</label>
                  <Textarea
                    value={exp.description ?? ""}
                    onChange={(e) =>
                      updateExperience(
                        i,
                        "description",
                        e.target.value || null
                      )
                    }
                    rows={2}
                    className={`mt-1 ${fieldClass} resize-none`}
                    placeholder="Brief description of responsibilities..."
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`current-${i}`}
                    checked={exp.isCurrent}
                    onChange={(e) =>
                      updateExperience(i, "isCurrent", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 accent-violet-500"
                  />
                  <label
                    htmlFor={`current-${i}`}
                    className="text-xs text-slate-400"
                  >
                    Currently working here
                  </label>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator className="bg-slate-800" />

      {/* Save */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isPending || !fullName.trim()}
          className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-900/30 gap-2 min-w-[160px]"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? "Saving..." : "Confirm & Save"}
        </Button>
      </div>
    </div>
  );
}

// Missing import
function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
