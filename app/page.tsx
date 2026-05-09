"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CollegeCard from "@/components/CollegeCard";
import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";
import EmptyState from "@/components/EmptyState";
import { CollegeCardSkeleton } from "@/components/Loader";
import {
  HiOutlineAcademicCap,
  HiOutlineAdjustmentsHorizontal,
  HiXMark,
} from "react-icons/hi2";
import { HiOutlineScale } from "react-icons/hi";
import type { College, CollegesResponse } from "@/types";
import { useSaved } from "@/hooks/useSaved";
import Link from "next/link";

interface Filters {
  type: string;
  location: string;
  minFees: string;
  maxFees: string;
  course: string;
}

const DEFAULT_FILTERS: Filters = {
  type: "",
  location: "",
  minFees: "",
  maxFees: "",
  course: "",
};

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    type: searchParams.get("type") || "",
    location: searchParams.get("location") || "",
    minFees: "",
    maxFees: "",
    course: "",
  });
  const [compareList, setCompareList] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { savedIds, toggleSave } = useSaved();
  const abortRef = useRef<AbortController | null>(null);

  const fetchColleges = useCallback(
    async (currentPage: number, currentSearch: string, currentFilters: Filters) => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (currentSearch) params.set("search", currentSearch);
        if (currentFilters.type) params.set("type", currentFilters.type);
        if (currentFilters.location) params.set("location", currentFilters.location);
        if (currentFilters.minFees) params.set("minFees", currentFilters.minFees);
        if (currentFilters.maxFees) params.set("maxFees", currentFilters.maxFees);
        if (currentFilters.course) params.set("course", currentFilters.course);
        params.set("page", currentPage.toString());
        params.set("pageSize", "9");

        const res = await fetch(`/api/colleges?${params}`, {
          signal: abortRef.current.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data: CollegesResponse = await res.json();
        setColleges(data.colleges);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Failed to load colleges. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchColleges(page, search, filters);
  }, [page, search, filters, fetchColleges]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    router.replace(`/?${params}`, { scroll: false });
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleFilterReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, id];
    });
  };

  const handleSave = async (id: string) => {
    const res = await fetch("/api/auth/me");
    if (!res.ok) {
      router.push("/auth/login");
      return;
    }
    await toggleSave(id);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <HiOutlineAcademicCap className="w-4 h-4" />
            <span>25+ Top Colleges Listed</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Find Your Perfect
            <span className="text-indigo-300"> College</span>
          </h1>
          <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
            Discover, compare, and decide on the right college for your future.
            Explore IITs, NITs, and top private universities.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={search}
              onChange={handleSearch}
              placeholder="Search by college name, location, or course..."
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
            {["IIT", "NIT", "Private", "Deemed"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  handleFilterChange({
                    ...DEFAULT_FILTERS,
                    type: filters.type === type ? "" : type,
                  });
                }}
                className={`px-4 py-1.5 rounded-full border transition-colors ${
                  filters.type === type
                    ? "bg-white text-indigo-700 border-white font-semibold"
                    : "border-white/30 text-white/80 hover:border-white hover:text-white"
                }`}
              >
                {type}s
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="sticky top-16 z-40 bg-indigo-600 text-white px-4 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <HiOutlineScale className="w-4 h-4" />
              <span className="font-medium">
                {compareList.length} college{compareList.length > 1 ? "s" : ""} selected for comparison
              </span>
              {compareList.length < 2 && (
                <span className="text-indigo-200">(select at least 2)</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {compareList.length >= 2 && (
                <Link
                  href={`/compare?ids=${compareList.join(",")}`}
                  className="px-4 py-1.5 bg-white text-indigo-700 font-semibold text-sm rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Compare Now
                </Link>
              )}
              <button
                onClick={() => setCompareList([])}
                className="p-1.5 hover:bg-indigo-500 rounded-lg transition-colors"
                aria-label="Clear compare list"
              >
                <HiXMark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleFilterReset}
              />
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div>
                {!loading && (
                  <p className="text-sm text-slate-500">
                    {total > 0 ? (
                      <>
                        Showing{" "}
                        <span className="font-semibold text-slate-900">
                          {(page - 1) * 9 + 1}–{Math.min(page * 9, total)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-900">{total}</span>{" "}
                        colleges
                      </>
                    ) : (
                      "No colleges found"
                    )}
                  </p>
                )}
              </div>
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors"
              >
                <HiOutlineAdjustmentsHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 mb-6 text-sm">
                {error}
                <button
                  onClick={() => fetchColleges(page, search, filters)}
                  className="ml-2 underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <CollegeCardSkeleton key={i} />
                ))}
              </div>
            ) : colleges.length === 0 ? (
              <EmptyState
                icon={<HiOutlineAcademicCap className="w-8 h-8" />}
                title="No colleges found"
                description="Try adjusting your search or filters to find what you're looking for."
                action={{ label: "Clear filters", onClick: () => { handleFilterReset(); handleSearch(""); } }}
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {colleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    isSaved={savedIds.has(college.id)}
                    isCompared={compareList.includes(college.id)}
                    onSave={handleSave}
                    onCompare={handleCompare}
                    showCompare
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | "...")[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-3 py-2 text-sm text-slate-400">
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className={`w-9 h-9 text-sm font-medium rounded-xl transition-colors ${
                            page === p
                              ? "bg-indigo-600 text-white"
                              : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                onChange={(f) => { handleFilterChange(f); }}
                onReset={() => { handleFilterReset(); setMobileFiltersOpen(false); }}
              />
            </div>
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <HomeContent />
    </Suspense>
  );
}
