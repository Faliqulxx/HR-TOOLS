"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Save, X } from "lucide-react";
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
    "border-[#1E2D4A] bg-[#090D16] text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500 font-sans text-xs";
  const labelClass = "text-xs font-mono font-bold text-slate-300 uppercase tracking-wider";

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <Card className="border-[#182238] bg-[#0E131F] shadow-sm">
        <CardHeader className="pb-4 border-b border-[#182238]">
          <CardTitle className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Candidate Contact &amp; Digital Profiles
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Full Candidate Name *</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`mt-1.5 ${fieldClass}`}
              placeholder="Candidate full legal name"
            />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1.5 ${fieldClass} font-mono`}
              placeholder="email@domain.com"
            />
          </div>
          <div>
            <label className={labelClass}>Phone Contact</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`mt-1.5 ${fieldClass} font-mono`}
              placeholder="+62 812 3456 7890"
            />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <Input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className={`mt-1.5 ${fieldClass} font-mono`}
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div>
            <label className={labelClass}>GitHub Profile</label>
            <Input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className={`mt-1.5 ${fieldClass} font-mono`}
              placeholder="github.com/username"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Portfolio Website</label>
            <Input
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              className={`mt-1.5 ${fieldClass} font-mono`}
              placeholder="https://portfolio-url.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills Inventory */}
      <Card className="border-[#182238] bg-[#0E131F] shadow-sm">
        <CardHeader className="pb-4 border-b border-[#182238]">
          <CardTitle className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Parsed Skills Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-5">
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              className={`flex-1 ${fieldClass}`}
              placeholder="Type a skill name and press Enter"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addSkill}
              className="border-[#1E2D4A] bg-[#090D16] text-slate-300 hover:border-blue-500 hover:text-blue-400 font-mono text-xs gap-1"
            >
              <Plus className="h-4 w-4" /> Add Skill
            </Button>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  className="bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono text-xs gap-1 pr-1.5"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-rose-400 transition-colors ml-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-slate-500 italic">No skills extracted yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="border-[#182238] bg-[#0E131F] shadow-sm">
        <CardHeader className="pb-4 border-b border-[#182238]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Academic Education History
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addEducation}
              className="text-slate-400 hover:text-blue-400 font-mono text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add Record
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {educations.length === 0 && (
            <p className="text-xs font-mono text-slate-500 italic">No education history recorded.</p>
          )}
          {educations.map((edu, i) => (
            <div
              key={i}
              className="rounded-lg border border-[#182238] bg-[#090D16] p-4 space-y-3 relative"
            >
              <button
                onClick={() => removeEducation(i)}
                className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelClass}>Institution Name *</label>
                  <Input
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(i, "institution", e.target.value)
                    }
                    className={`mt-1.5 ${fieldClass}`}
                    placeholder="University or Institution name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Degree / Qualification</label>
                  <Input
                    value={edu.degree ?? ""}
                    onChange={(e) =>
                      updateEducation(i, "degree", e.target.value || null)
                    }
                    className={`mt-1.5 ${fieldClass}`}
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>
                <div>
                  <label className={labelClass}>Major / Specialization</label>
                  <Input
                    value={edu.major ?? ""}
                    onChange={(e) =>
                      updateEducation(i, "major", e.target.value || null)
                    }
                    className={`mt-1.5 ${fieldClass}`}
                    placeholder="e.g. Informatics Engineering"
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
                    className={`mt-1.5 ${fieldClass} font-mono`}
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
                    className={`mt-1.5 ${fieldClass} font-mono`}
                    placeholder="2022"
                  />
                </div>
                <div>
                  <label className={labelClass}>GPA Score</label>
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
                    className={`mt-1.5 ${fieldClass} font-mono`}
                    placeholder="3.85"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="border-[#182238] bg-[#0E131F] shadow-sm">
        <CardHeader className="pb-4 border-b border-[#182238]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Employment &amp; Project Experience
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addExperience}
              className="text-slate-400 hover:text-blue-400 font-mono text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add Position
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {experiences.length === 0 && (
            <p className="text-xs font-mono text-slate-500 italic">No experience records found.</p>
          )}
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="rounded-lg border border-[#182238] bg-[#090D16] p-4 space-y-3 relative"
            >
              <button
                onClick={() => removeExperience(i)}
                className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Company / Organization *</label>
                  <Input
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(i, "company", e.target.value)
                    }
                    className={`mt-1.5 ${fieldClass}`}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Role Position *</label>
                  <Input
                    value={exp.position}
                    onChange={(e) =>
                      updateExperience(i, "position", e.target.value)
                    }
                    className={`mt-1.5 ${fieldClass}`}
                    placeholder="Role title"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Key Responsibilities</label>
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
                    className={`mt-1.5 ${fieldClass} resize-none`}
                    placeholder="Summary of responsibilities and achievements..."
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`current-${i}`}
                    checked={exp.isCurrent}
                    onChange={(e) =>
                      updateExperience(i, "isCurrent", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-[#1E2D4A] bg-[#090D16] accent-blue-500"
                  />
                  <label
                    htmlFor={`current-${i}`}
                    className="text-xs font-mono text-slate-300"
                  >
                    Active Employment Role
                  </label>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator className="bg-[#182238]" />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isPending || !fullName.trim()}
          className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold shadow-md shadow-blue-900/30 gap-2 min-w-[180px]"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? "Updating Candidate..." : "Verify & Save Candidate"}
        </Button>
      </div>
    </div>
  );
}
