export function CollegeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="h-16 bg-slate-100 rounded-xl" />
          <div className="h-16 bg-slate-100 rounded-xl" />
        </div>
        <div className="flex gap-2 mt-2">
          <div className="h-9 bg-slate-100 rounded-xl flex-1" />
          <div className="h-9 w-24 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-6 h-6 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}
