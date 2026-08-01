export default function CandidateDetailLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-pulse">
      <div className="h-4 w-40 bg-slate-800/80 rounded" />
      <div className="rounded-xl border border-[#182238] bg-[#0E131F] p-6 h-32" />
      <div className="grid grid-cols-4 gap-3 h-20">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#182238] bg-[#0E131F]" />
        ))}
      </div>
      <div className="h-96 rounded-xl border border-[#182238] bg-[#0E131F]" />
    </div>
  );
}
