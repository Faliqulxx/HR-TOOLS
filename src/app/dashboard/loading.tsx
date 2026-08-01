export default function DashboardLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-[#182238] pb-6 space-y-2">
        <div className="h-4 w-36 bg-slate-800/80 rounded" />
        <div className="h-8 w-64 bg-slate-800/80 rounded-lg" />
        <div className="h-4 w-80 bg-slate-800/60 rounded" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#182238] bg-[#0E131F] p-5 h-28 space-y-3"
          >
            <div className="h-3 w-24 bg-slate-800/80 rounded" />
            <div className="h-8 w-16 bg-slate-800/80 rounded-lg" />
            <div className="h-3 w-32 bg-slate-800/50 rounded" />
          </div>
        ))}
      </div>

      {/* Chart Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#182238] bg-[#0E131F] p-5 h-72" />
        <div className="rounded-xl border border-[#182238] bg-[#0E131F] p-5 h-72" />
      </div>
    </div>
  );
}
