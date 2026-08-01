"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  UserPlus,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: "Job Postings",
    href: "/jobs",
    icon: Briefcase,
    badge: null,
  },
  {
    label: "Upload Candidates",
    href: "/candidates/upload",
    icon: UserPlus,
    badge: "AI Parse",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[#182238] bg-[#090D16] shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#182238]">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/30 ring-1 ring-blue-500/30">
          <Zap className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-100 tracking-tight font-sans">
              SIGNAL <span className="text-blue-400 font-extrabold">HR</span>
            </span>
            <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              v1.0
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            AI Screening Engine
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        <div className="px-3 pt-3 pb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          <span>Main Console</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
        </div>

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(
                item.href.split("/")[1] ? `/${item.href.split("/")[1]}` : item.href
              ));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-blue-600/10 text-blue-300 font-semibold border border-blue-500/20 shadow-sm"
                  : "text-slate-400 hover:bg-[#121A2C] hover:text-slate-200"
              )}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}

              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive
                    ? "text-blue-400"
                    : "text-slate-400 group-hover:text-slate-200"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#162238] text-slate-400 border border-[#233556]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Status */}
      <div className="p-4 border-t border-[#182238] bg-[#070A12]">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">Precision Engine Active</span>
        </div>
      </div>
    </aside>
  );
}
