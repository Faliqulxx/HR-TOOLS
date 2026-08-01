"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteJob, updateJobStatus } from "@/lib/actions/job.actions";
import { Eye, Pencil, Trash2, Users, PlusCircle } from "lucide-react";

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  status: string;
  createdAt: Date;
  _count: { applications: number };
};

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className:
      "bg-slate-800 text-slate-300 border border-slate-700 font-mono",
  },
  active: {
    label: "Active Requisition",
    className:
      "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono",
  },
  closed: {
    label: "Closed",
    className:
      "bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono",
  },
};

const employmentTypeLabel: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

interface JobTableProps {
  jobs: Job[];
}

export function JobTable({ jobs }: JobTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = (jobId: string, newStatus: string) => {
    setLoadingId(jobId);
    startTransition(async () => {
      await updateJobStatus(jobId, newStatus);
      setLoadingId(null);
      router.refresh();
    });
  };

  const handleDelete = (jobId: string) => {
    startTransition(async () => {
      await deleteJob(jobId);
      router.refresh();
    });
  };

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-dashed border-[#182238] bg-[#0E131F]/50">
        <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <PlusCircle className="h-6 w-6" />
        </div>
        <div className="max-w-md">
          <p className="text-slate-200 font-bold font-sans">No Job Requisitions Posted</p>
          <p className="text-slate-400 text-xs mt-1 font-sans">
            Create your first job posting to start evaluating and matching candidates.
          </p>
        </div>
        <Link href="/jobs/new">
          <Button
            size="sm"
            className="mt-1 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold shadow-md shadow-blue-900/30"
          >
            Create Job Requisition
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#182238] bg-[#0E131F] overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-[#182238] hover:bg-transparent bg-[#090D16]">
            <TableHead className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Job Position Title
            </TableHead>
            <TableHead className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Department
            </TableHead>
            <TableHead className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">
              Location
            </TableHead>
            <TableHead className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">
              Type
            </TableHead>
            <TableHead className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Status
            </TableHead>
            <TableHead className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 text-center hidden md:table-cell">
              Applicants
            </TableHead>
            <TableHead className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => {
            const statusCfg = statusConfig[job.status] ?? statusConfig.draft;
            const isLoading = isPending && loadingId === job.id;

            return (
              <TableRow
                key={job.id}
                className="border-[#182238] hover:bg-[#121A2C]/60 transition-colors"
              >
                {/* Title */}
                <TableCell className="font-bold text-slate-100 text-sm">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {job.title}
                  </Link>
                </TableCell>

                {/* Department */}
                <TableCell className="text-slate-300 text-xs font-sans">
                  {job.department}
                </TableCell>

                {/* Location */}
                <TableCell className="text-slate-400 text-xs hidden md:table-cell font-sans">
                  {job.location}
                </TableCell>

                {/* Type */}
                <TableCell className="hidden lg:table-cell">
                  <span className="text-xs font-mono text-slate-400">
                    {employmentTypeLabel[job.employmentType] ?? job.employmentType}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Select
                    value={job.status}
                    onValueChange={(v) => handleStatusChange(job.id, v as string)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[140px] h-7 border-0 p-0 bg-transparent shadow-none focus:ring-0">
                      <Badge className={`${statusCfg.className} cursor-pointer text-[10px]`}>
                        {isLoading ? "Updating..." : statusCfg.label}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent className="border-[#1E2D4A] bg-[#0E131F] text-slate-100 font-mono text-xs">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active Requisition</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>

                {/* Applicants Count */}
                <TableCell className="text-center hidden md:table-cell">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200 bg-[#090D16] px-2.5 py-1 rounded-md border border-[#182238]">
                    <Users className="h-3.5 w-3.5 text-blue-400" />
                    {job._count.applications}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/jobs/${job.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                        title="View Requisition & Candidates"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/jobs/${job.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                        title="Edit Posting"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                            title="Delete Requisition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <AlertDialogContent className="border-[#1E2D4A] bg-[#0E131F]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-slate-100 font-sans font-bold">
                            Delete Job Requisition?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400 text-xs font-sans">
                            This will permanently delete &quot;{job.title}&quot;
                            and all associated skill requirements. This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-[#1E2D4A] bg-[#090D16] text-slate-300 hover:bg-[#141B2D] font-mono text-xs">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(job.id)}
                            className="bg-rose-600 text-white hover:bg-rose-500 font-mono text-xs font-semibold"
                          >
                            Delete Requisition
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
