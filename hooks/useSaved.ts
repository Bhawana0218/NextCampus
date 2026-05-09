"use client";

import { useState, useEffect, useCallback } from "react";

export function useSaved() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchSaved = useCallback(async () => {
    try {
      const res = await fetch("/api/saved");
      if (res.ok) {
        const data = await res.json();
        const ids = new Set<string>(
          (data.saved || []).map((s: { collegeId: string }) => s.collegeId)
        );
        setSavedIds(ids);
      }
    } catch {
      // Not authenticated — ignore
    }
  }, []);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const toggleSave = useCallback(
    async (collegeId: string): Promise<boolean> => {
      setLoading(true);
      try {
        if (savedIds.has(collegeId)) {
          const res = await fetch(`/api/saved/${collegeId}`, { method: "DELETE" });
          if (res.ok) {
            setSavedIds((prev) => {
              const next = new Set(prev);
              next.delete(collegeId);
              return next;
            });
            return false;
          }
        } else {
          const res = await fetch("/api/saved", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ collegeId }),
          });
          if (res.ok) {
            setSavedIds((prev) => new Set([...prev, collegeId]));
            return true;
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
      return savedIds.has(collegeId);
    },
    [savedIds]
  );

  return { savedIds, toggleSave, loading, refresh: fetchSaved };
}
