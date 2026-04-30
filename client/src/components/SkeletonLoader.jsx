export function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-slate-200 rounded" />
          <div className="h-8 w-16 bg-slate-200 rounded" />
        </div>
        <div className="w-10 h-10 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-slate-200 rounded" />
              <div className="h-3 w-24 bg-slate-200 rounded" />
            </div>
            <div className="h-6 w-16 bg-slate-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
