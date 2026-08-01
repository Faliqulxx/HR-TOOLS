"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  FileText,
  Wrench,
  Calendar,
  Building2,
  MapPin,
} from "lucide-react";
import { AISummaryCard } from "./AISummaryCard";
import { ResumeViewer } from "./ResumeViewer";

// ── Types ─────────────────────────────────────────────────────────────────────

type Experience = {
  id: string;
  company: string;
  position: string;
  startDate: Date | null;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
};

type Education = {
  id: string;
  institution: string;
  degree: string | null;
  major: string | null;
  gpa: number | null;
  startYear: number | null;
  endYear: number | null;
};

type Skill = { id: string; skillName: string };
type Certification = {
  id: string;
  name: string;
  issuer: string | null;
  year: number | null;
};

type MatchDetailItem = {
  skill: string;
  isMandatory: boolean;
  weight: number;
  matched: boolean;
  ratio: number;
};

interface CandidateTabsProps {
  candidate: {
    id: string;
    fullName: string;
    resumeFileUrl: string;
    resumeFileName: string;
    experiences: Experience[];
    educations: Education[];
    skills: Skill[];
    certifications: Certification[];
  };
  aiSummary: string;
  matchScore?: number | null;
  matchDetail?: MatchDetailItem[];
  jobTitle?: string | null;
}

// ── Helper ─────────────────────────────────────────────────────────────────────

function formatDateRange(
  start: Date | null,
  end: Date | null,
  isCurrent: boolean
): string {
  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  const s = start ? fmt(start) : "?";
  const e = isCurrent ? "Present" : end ? fmt(end) : "?";
  return `${s} – ${e}`;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function CandidateTabs({
  candidate,
  aiSummary,
  matchScore,
  matchDetail,
  jobTitle,
}: CandidateTabsProps) {
  const tabClass =
    "text-slate-500 data-[state=active]:text-white data-[state=active]:bg-slate-800 rounded-lg px-3 py-1.5 text-sm transition-colors";

  return (
    <Tabs defaultValue="experience" className="w-full">
      {/* Tab list */}
      <TabsList className="flex h-auto gap-1 bg-slate-900/80 border border-slate-800 rounded-xl p-1 w-full overflow-x-auto">
        <TabsTrigger value="experience" className={tabClass}>
          <Briefcase className="h-3.5 w-3.5 mr-1.5" />
          Experience
        </TabsTrigger>
        <TabsTrigger value="education" className={tabClass}>
          <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
          Education
        </TabsTrigger>
        <TabsTrigger value="skills" className={tabClass}>
          <Wrench className="h-3.5 w-3.5 mr-1.5" />
          Skills
          {candidate.skills.length > 0 && (
            <span className="ml-1.5 rounded-full bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400">
              {candidate.skills.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="certifications" className={tabClass}>
          <Award className="h-3.5 w-3.5 mr-1.5" />
          Certs
        </TabsTrigger>
        <TabsTrigger value="ai" className={tabClass}>
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          AI Analysis
        </TabsTrigger>
        <TabsTrigger value="resume" className={tabClass}>
          <FileText className="h-3.5 w-3.5 mr-1.5" />
          Resume
        </TabsTrigger>
      </TabsList>

      {/* ── Experience ── */}
      <TabsContent value="experience" className="mt-5">
        {candidate.experiences.length === 0 ? (
          <EmptyState icon={<Briefcase />} label="No work experience recorded" />
        ) : (
          <div className="space-y-4">
            {candidate.experiences.map((exp) => (
              <Card
                key={exp.id}
                className="border-slate-800 bg-slate-900/60"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold text-slate-200">
                        {exp.position}
                      </p>
                      <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-0.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-600" />
                        {exp.company}
                        {exp.isCurrent && (
                          <Badge className="ml-2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                      <Calendar className="h-3 w-3" />
                      {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      {/* ── Education ── */}
      <TabsContent value="education" className="mt-5">
        {candidate.educations.length === 0 ? (
          <EmptyState icon={<GraduationCap />} label="No education history recorded" />
        ) : (
          <div className="space-y-4">
            {candidate.educations.map((edu) => (
              <Card
                key={edu.id}
                className="border-slate-800 bg-slate-900/60"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold text-slate-200">
                        {edu.institution}
                      </p>
                      {(edu.degree || edu.major) && (
                        <p className="text-sm text-slate-400 mt-0.5">
                          {[edu.degree, edu.major].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {edu.gpa && (
                        <p className="text-xs text-violet-400 mt-1">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                    {(edu.startYear || edu.endYear) && (
                      <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                        <Calendar className="h-3 w-3" />
                        {edu.startYear ?? "?"}
                        {" – "}
                        {edu.endYear ?? "Present"}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      {/* ── Skills ── */}
      <TabsContent value="skills" className="mt-5">
        {candidate.skills.length === 0 ? (
          <EmptyState icon={<Wrench />} label="No skills detected" />
        ) : (
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-200">
                Detected Skills ({candidate.skills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s) => (
                  <Badge
                    key={s.id}
                    className="bg-violet-500/10 text-violet-300 border border-violet-500/20 text-sm px-3 py-1"
                  >
                    {s.skillName}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* ── Certifications ── */}
      <TabsContent value="certifications" className="mt-5">
        {candidate.certifications.length === 0 ? (
          <EmptyState icon={<Award />} label="No certifications recorded" />
        ) : (
          <div className="space-y-3">
            {candidate.certifications.map((cert) => (
              <Card
                key={cert.id}
                className="border-slate-800 bg-slate-900/60"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-200">{cert.name}</p>
                      {cert.issuer && (
                        <p className="text-sm text-slate-400 mt-0.5">
                          {cert.issuer}
                        </p>
                      )}
                    </div>
                    {cert.year && (
                      <span className="text-xs text-slate-500 shrink-0">
                        {cert.year}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      {/* ── AI Analysis ── */}
      <TabsContent value="ai" className="mt-5">
        <AISummaryCard
          summary={aiSummary}
          matchScore={matchScore}
          matchDetail={matchDetail}
          jobTitle={jobTitle}
        />
      </TabsContent>

      {/* ── Resume ── */}
      <TabsContent value="resume" className="mt-5">
        <ResumeViewer
          fileUrl={candidate.resumeFileUrl}
          fileName={candidate.resumeFileName}
        />
      </TabsContent>
    </Tabs>
  );
}

// ── Empty state helper ────────────────────────────────────────────────────────

function EmptyState({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl border border-slate-800 bg-slate-900/40 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-600 [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </div>
      <p className="text-slate-500 text-sm">{label}</p>
    </div>
  );
}
