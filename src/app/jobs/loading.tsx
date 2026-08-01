export default function JobsLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="flex justify-between items-center border-b border-[#182238] pb-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-800/80 rounded-lg" />
          <div className="h-4 w-32 bg-slate-800/60 rounded" />
        </div>
        <div className="h-9 w-40 bg-slate-800/80 rounded-lg" />
      </div>

      <div className="rounded-xl border border-[#182238] bg-[#0E131F] p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full bg-slate-800/40 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
