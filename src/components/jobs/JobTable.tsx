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
  SelectValue,
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
import { Eye, Pencil, Trash2, Users } from "lucide-react";

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
      "bg-slate-700/50 text-slate-400 border border-slate-700 hover:bg-slate-700/70",
  },
  active: {
    label: "Active",
    className:
      "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30",
  },
  closed: {
    label: "Closed",
    className:
      "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30",
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
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center">
          <Users className="h-6 w-6 text-slate-600" />
        </div>
        <p className="text-slate-400 font-medium">No jobs yet</p>
        <p className="text-slate-600 text-sm">
          Create your first job posting to get started.
        </p>
        <Link href="/jobs/new">
          <Button
            size="sm"
            className="mt-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            Create Job
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="text-slate-500 font-medium">
              Job Title
            </TableHead>
            <TableHead className="text-slate-500 font-medium">
              Department
            </TableHead>
            <TableHead className="text-slate-500 font-medium hidden md:table-cell">
              Location
            </TableHead>
            <TableHead className="text-slate-500 font-medium hidden lg:table-cell">
              Type
            </TableHead>
            <TableHead className="text-slate-500 font-medium">Status</TableHead>
            <TableHead className="text-slate-500 font-medium text-center hidden md:table-cell">
              Applicants
            </TableHead>
            <TableHead className="text-slate-500 font-medium text-right">
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
                className="border-slate-800 hover:bg-slate-800/40 transition-colors"
              >
                {/* Title */}
                <TableCell className="font-medium text-slate-200">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="hover:text-violet-400 transition-colors"
                  >
                    {job.title}
                  </Link>
                </TableCell>

                {/* Department */}
                <TableCell className="text-slate-400 text-sm">
                  {job.department}
                </TableCell>

                {/* Location */}
                <TableCell className="text-slate-400 text-sm hidden md:table-cell">
                  {job.location}
                </TableCell>

                {/* Type */}
                <TableCell className="hidden lg:table-cell">
                  <span className="text-xs text-slate-500">
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
                    <SelectTrigger className="w-[120px] h-7 border-0 p-0 bg-transparent shadow-none focus:ring-0">
                      <Badge className={`${statusCfg.className} cursor-pointer`}>
                        {isLoading ? "Updating..." : statusCfg.label}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent className="border-slate-700 bg-slate-900 text-slate-100">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>

                {/* Applicants */}
                <TableCell className="text-center hidden md:table-cell">
                  <span className="inline-flex items-center gap-1 text-sm text-slate-400">
                    <Users className="h-3.5 w-3.5 text-slate-600" />
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
                        className="h-8 w-8 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/jobs/${job.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10"
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
                            className="h-8 w-8 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <AlertDialogContent className="border-slate-700 bg-slate-900">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-slate-100">
                            Delete Job Posting?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            This will permanently delete &quot;{job.title}&quot;
                            and all associated skill requirements. This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(job.id)}
                            className="bg-rose-600 text-white hover:bg-rose-700"
                          >
                            Delete
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
