"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import CollegeCard from "@/components/CollegeCard";
import EmptyState from "@/components/EmptyState";
import { CollegeCardSkeleton } from "@/components/Loader";
import { HiOutlineBookmark, HiOutlineTrash } from "react-icons/hi2";
import type { College } from "@/types";

interface SavedItem {
  id: string;
  collegeId: string;
  college: College;
}

export default function SavedPage() {
  const router = useRouter();
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchSaved = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/saved");
      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSaved(data.saved || []);
    } catch {
      setError("Failed to load saved colleges.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const handleRemove = async (collegeId: string) => {
    setRemovingId(collegeId);
    try {
      const res = await fetch(`/api/saved/${collegeId}`, { method: "DELETE" });
      if (res.ok) {
        setSaved((prev) => prev.filter((s) => s.collegeId !== collegeId));
      }
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Remove all saved colleges?")) return;
    for (const item of saved) {
      await fetch(`/api/saved/${item.collegeId}`, { method: "DELETE" });
    }
    setSaved([]);
  };

  const savedIds = new Set(saved.map((s) => s.collegeId));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HiOutlineBookmark className="w-6 h-6 text-indigo-600" />
                <h1 className="text-2xl font-bold text-slate-900">Saved Colleges</h1>
              </div>
              <p className="text-slate-500 text-sm">
                {loading
                  ? "Loading..."
                  : `${saved.length} college${saved.length !== 1 ? "s" : ""} saved`}
              </p>
            </div>
            {saved.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 mb-6 text-sm">
            {error}
            <button onClick={fetchSaved} className="ml-2 underline hover:no-underline">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CollegeCardSkeleton key={i} />
            ))}
          </div>
        ) : saved.length === 0 ? (
          <EmptyState
            icon={<HiOutlineBookmark className="w-8 h-8" />}
            title="No saved colleges yet"
            description="Browse colleges and save the ones you're interested in. They'll appear here for easy access."
            action={{ label: "Browse Colleges", href: "/" }}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((item) => (
              <div key={item.id} className="relative">
                <CollegeCard
                  college={item.college}
                  isSaved={savedIds.has(item.collegeId)}
                  onSave={handleRemove}
                  showCompare={false}
                />
                {removingId === item.collegeId && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
