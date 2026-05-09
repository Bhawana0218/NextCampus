"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineBookmark, HiBookmark } from "react-icons/hi2";

interface SaveButtonProps {
  collegeId: string;
  initialSaved: boolean;
  isLoggedIn: boolean;
  variant?: "default" | "white";
}

export default function SaveButton({
  collegeId,
  initialSaved,
  isLoggedIn,
  variant = "default",
}: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        const res = await fetch(`/api/saved/${collegeId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) setSaved(false);
      } else {
        const res = await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId }),
          credentials: "include",
        });
        if (res.ok) setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (variant === "white") {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-indigo-700 font-medium text-sm rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-60"
      >
        {saved ? (
          <HiBookmark className="w-4 h-4" />
        ) : (
          <HiOutlineBookmark className="w-4 h-4" />
        )}
        {saved ? "Saved" : "Save College"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors disabled:opacity-60 ${
        saved
          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
          : "border-slate-200 text-slate-700 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50"
      }`}
    >
      {saved ? (
        <HiBookmark className="w-4 h-4 text-indigo-600" />
      ) : (
        <HiOutlineBookmark className="w-4 h-4" />
      )}
      {saved ? "Saved" : "Save College"}
    </button>
  );
}
