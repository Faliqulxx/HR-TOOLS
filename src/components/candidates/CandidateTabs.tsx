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
} from "lucide-react";
import { AISummaryCard } from "./AISummaryCard";
import { ResumeViewer } from "./ResumeViewer";

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

export function CandidateTabs({
  candidate,
  aiSummary,
  matchScore,
  matchDetail,
  jobTitle,
}: CandidateTabsProps) {
  const tabClass =
    "text-slate-400 font-mono text-xs data-[state=active]:text-white data-[state=active]:bg-blue-600/20 data-[state=active]:border-blue-500/30 border border-transparent rounded-lg px-3.5 py-2 transition-all duration-150";

  return (
    <Tabs defaultValue="experience" className="w-full space-y-4">
      {/* Precision Tab Strip */}
      <TabsList className="flex h-auto gap-1.5 bg-[#0E131F] border border-[#182238] rounded-xl p-1.5 w-full overflow-x-auto">
        <TabsTrigger value="experience" className={tabClass}>
          <Briefcase className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
          Experience
        </TabsTrigger>
        <TabsTrigger value="education" className={tabClass}>
          <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
          Education
        </TabsTrigger>
        <TabsTrigger value="skills" className={tabClass}>
          <Wrench className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
          Skills
          {candidate.skills.length > 0 && (
            <span className="ml-1.5 font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#182238] text-slate-300">
              {candidate.skills.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="certifications" className={tabClass}>
          <Award className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
          Certs
        </TabsTrigger>
        <TabsTrigger value="ai" className={tabClass}>
          <Sparkles className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
          AI Analysis
        </TabsTrigger>
        <TabsTrigger value="resume" className={tabClass}>
          <FileText className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
          Resume PDF
        </TabsTrigger>
      </TabsList>

      {/* ── Experience ── */}
      <TabsContent value="experience" className="mt-4">
        {candidate.experiences.length === 0 ? (
          <EmptyState icon={<Briefcase />} label="No employment history recorded in parsed resume" />
        ) : (
          <div className="space-y-3">
            {candidate.experiences.map((exp) => (
              <Card
                key={exp.id}
                className="border-[#182238] bg-[#0E131F]/90 shadow-sm"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-bold text-slate-100 text-sm">
                        {exp.position}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>{exp.company}</span>
                        {exp.isCurrent && (
                          <Badge className="ml-2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">
                            ACTIVE ROLE
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1 shrink-0">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed border-t border-[#182238] pt-2.5">
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
      <TabsContent value="education" className="mt-4">
        {candidate.educations.length === 0 ? (
          <EmptyState icon={<GraduationCap />} label="No education records found" />
        ) : (
          <div className="space-y-3">
            {candidate.educations.map((edu) => (
              <Card
                key={edu.id}
                className="border-[#182238] bg-[#0E131F]/90 shadow-sm"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-bold text-slate-100 text-sm">
                        {edu.institution}
                      </p>
                      {(edu.degree || edu.major) && (
                        <p className="text-xs text-slate-400 mt-1 font-sans">
                          {[edu.degree, edu.major].filter(Boolean).join(" &bull; ")}
                        </p>
                      )}
                      {edu.gpa && (
                        <p className="text-xs font-mono font-bold text-cyan-400 mt-1.5">
                          Cumulative GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                    {(edu.startYear || edu.endYear) && (
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1 shrink-0">
                        <Calendar className="h-3 w-3 text-slate-400" />
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
      <TabsContent value="skills" className="mt-4">
        {candidate.skills.length === 0 ? (
          <EmptyState icon={<Wrench />} label="No technical or soft skills extracted" />
        ) : (
          <Card className="border-[#182238] bg-[#0E131F]/90 shadow-sm">
            <CardHeader className="pb-3 border-b border-[#182238]">
              <CardTitle className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Extracted Skills Inventory ({candidate.skills.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s) => (
                  <Badge
                    key={s.id}
                    className="bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-mono px-3 py-1"
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
      <TabsContent value="certifications" className="mt-4">
        {candidate.certifications.length === 0 ? (
          <EmptyState icon={<Award />} label="No certifications or credentials found" />
        ) : (
          <div className="space-y-3">
            {candidate.certifications.map((cert) => (
              <Card
                key={cert.id}
                className="border-[#182238] bg-[#0E131F]/90 shadow-sm"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-100 text-sm">{cert.name}</p>
                      {cert.issuer && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          Issuer: {cert.issuer}
                        </p>
                      )}
                    </div>
                    {cert.year && (
                      <span className="text-xs font-mono text-amber-400 shrink-0">
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
      <TabsContent value="ai" className="mt-4">
        <AISummaryCard
          summary={aiSummary}
          matchScore={matchScore}
          matchDetail={matchDetail}
          jobTitle={jobTitle}
        />
      </TabsContent>

      {/* ── Resume Viewer ── */}
      <TabsContent value="resume" className="mt-4">
        <ResumeViewer
          fileUrl={candidate.resumeFileUrl}
          fileName={candidate.resumeFileName}
        />
      </TabsContent>
    </Tabs>
  );
}

function EmptyState({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl border border-dashed border-[#182238] bg-[#0E131F]/50 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#141B2D] text-slate-400 [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
      <p className="text-slate-400 text-xs font-mono">{label}</p>
    </div>
  );
}
