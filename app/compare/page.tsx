"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CompareTable from "@/components/CompareTable";
import EmptyState from "@/components/EmptyState";
import { PageLoader } from "@/components/Loader";
import { HiOutlineScale, HiOutlinePlusCircle, HiXMark } from "react-icons/hi2";
import type { College } from "@/types";
import Image from "next/image";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [compareColleges, setCompareColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const idsParam = searchParams.get("ids") || "";
  const initialIds = idsParam ? idsParam.split(",").filter(Boolean) : [];

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch("/api/colleges?pageSize=20");
      if (res.ok) {
        const data = await res.json();
        setAllColleges(data.colleges || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (allColleges.length > 0 && initialIds.length > 0) {
      const selected = allColleges.filter((c) => initialIds.includes(c.id));
      setCompareColleges(selected);
    }
  }, [allColleges]); // eslint-disable-line react-hooks/exhaustive-deps

  const addCollege = (college: College) => {
    if (compareColleges.length >= 3) return;
    if (compareColleges.find((c) => c.id === college.id)) return;
    const updated = [...compareColleges, college];
    setCompareColleges(updated);
    router.replace(`/compare?ids=${updated.map((c) => c.id).join(",")}`, { scroll: false });
    setDropdownOpen(false);
    setSearch("");
  };

  const removeCollege = (id: string) => {
    const updated = compareColleges.filter((c) => c.id !== id);
    setCompareColleges(updated);
    if (updated.length > 0) {
      router.replace(`/compare?ids=${updated.map((c) => c.id).join(",")}`, { scroll: false });
    } else {
      router.replace("/compare", { scroll: false });
    }
  };

  const availableColleges = allColleges.filter(
    (c) =>
      !compareColleges.find((cc) => cc.id === c.id) &&
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineScale className="w-6 h-6 text-indigo-600" />
                <h1 className="text-2xl font-bold text-slate-900">Compare Colleges</h1>
              </div>
              <p className="text-slate-500 text-sm">
                Select up to 3 colleges to compare side-by-side across fees, placements, ratings, and more.
              </p>
            </div>
          </div>

          {/* College selector */}
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            {compareColleges.map((college) => (
              <div
                key={college.id}
                className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2"
              >
                <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  <Image
                    src={college.image}
                    alt={college.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="text-sm font-medium text-indigo-700 max-w-[140px] truncate">
                  {college.name}
                </span>
                <button
                  onClick={() => removeCollege(college.id)}
                  className="text-indigo-400 hover:text-indigo-700 transition-colors ml-1"
                  aria-label={`Remove ${college.name}`}
                >
                  <HiXMark className="w-4 h-4" />
                </button>
              </div>
            ))}

            {compareColleges.length < 3 && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-dashed border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 rounded-xl transition-colors"
                >
                  <HiOutlinePlusCircle className="w-4 h-4" />
                  Add College
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl border border-slate-100 shadow-xl z-50">
                    <div className="p-3 border-b border-slate-50">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search colleges..."
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {availableColleges.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-6">No colleges found</p>
                      ) : (
                        availableColleges.map((college) => (
                          <button
                            key={college.id}
                            onClick={() => addCollege(college)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                          >
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                              <Image
                                src={college.image}
                                alt={college.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {college.name}
                              </p>
                              <p className="text-xs text-slate-500">{college.location} · {college.type}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {compareColleges.length > 0 && (
              <button
                onClick={() => {
                  setCompareColleges([]);
                  router.replace("/compare", { scroll: false });
                }}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors ml-2"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {compareColleges.length === 0 ? (
          <EmptyState
            icon={<HiOutlineScale className="w-8 h-8" />}
            title="No colleges selected"
            description="Add 2 or 3 colleges using the selector above to start comparing them side-by-side."
            action={{ label: "Browse Colleges", href: "/" }}
          />
        ) : compareColleges.length === 1 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 px-4 py-3 rounded-xl text-sm font-medium mb-4">
              <HiOutlinePlusCircle className="w-4 h-4" />
              Add at least one more college to compare
            </div>
            <CompareTable colleges={compareColleges} onRemove={removeCollege} />
          </div>
        ) : (
          <CompareTable colleges={compareColleges} onRemove={removeCollege} />
        )}
      </div>

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CompareContent />
    </Suspense>
  );
}
