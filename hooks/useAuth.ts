"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setState({ user: data.user, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch {
      setState({ user: null, loading: false });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setState({ user: null, loading: false });
    window.location.href = "/";
  }, []);

  const refresh = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }));
    fetchUser();
  }, [fetchUser]);

  return { ...state, logout, refresh };
}
