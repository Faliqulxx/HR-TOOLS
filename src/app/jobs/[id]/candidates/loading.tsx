export default function CandidatesRankingLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-pulse">
      <div className="h-4 w-32 bg-slate-800/80 rounded" />
      <div className="border-b border-[#182238] pb-6 space-y-2">
        <div className="h-8 w-72 bg-slate-800/80 rounded-lg" />
        <div className="h-4 w-48 bg-slate-800/60 rounded" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 w-full bg-[#0E131F] border border-[#182238] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
