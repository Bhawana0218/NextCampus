"use client";

import Image from "next/image";
import Link from "next/link";
import { HiXMark, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineTrophy } from "react-icons/hi2";
import type { College } from "@/types";

interface CompareTableProps {
  colleges: College[];
  onRemove: (id: string) => void;
}

function getBestId(colleges: College[], key: keyof College, higher = true): string {
  if (colleges.length === 0) return "";
  const values = colleges.map((c) => c[key] as number);
  const best = higher ? Math.max(...values) : Math.min(...values);
  return colleges.find((c) => (c[key] as number) === best)?.id || "";
}

function VisualBar({ value, max, color = "bg-indigo-500" }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
      <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function CompareTable({ colleges, onRemove }: CompareTableProps) {
  if (colleges.length === 0) return null;

  const bestRatingId = getBestId(colleges, "rating", true);
  const bestFeesId = getBestId(colleges, "fees", false);
  const bestPackageId = getBestId(colleges, "avgPackage", true);

  // Determine recommended college (highest composite score)
  const scores = colleges.map((c) => {
    const placementPct = parseInt(c.placements.replace("%", "")) || 0;
    const feesScore = 1 - c.fees / 600000;
    const score = c.rating * 20 + placementPct * 0.3 + feesScore * 10 + (c.avgPackage || 0) * 0.5;
    return { id: c.id, score };
  });
  const recommendedId = scores.sort((a, b) => b.score - a.score)[0]?.id;

  const maxFees = Math.max(...colleges.map((c) => c.fees));
  const maxPackage = Math.max(...colleges.map((c) => c.avgPackage || 0));

  const rows = [
    {
      label: "Location",
      render: (c: College) => `${c.location}, ${c.state}`,
    },
    {
      label: "Type",
      render: (c: College) => (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          c.type === "IIT" ? "bg-orange-100 text-orange-700" :
          c.type === "NIT" ? "bg-blue-100 text-blue-700" :
          c.type === "Deemed" ? "bg-green-100 text-green-700" :
          "bg-slate-100 text-slate-700"
        }`}>{c.type}</span>
      ),
    },
    {
      label: "Established",
      render: (c: College) => c.established.toString(),
    },
    {
      label: "Annual Fees",
      render: (c: College) => (
        <div>
          <span className="font-semibold">₹{(c.fees / 100000).toFixed(1)}L</span>
          <VisualBar value={maxFees - c.fees} max={maxFees} color="bg-green-500" />
        </div>
      ),
      highlight: (c: College) => c.id === bestFeesId,
      highlightLabel: "Most Affordable",
      highlightColor: "bg-green-100 text-green-700",
    },
    {
      label: "Rating",
      render: (c: College) => (
        <div>
          <div className="flex items-center gap-1.5 justify-center">
            <span className="font-semibold text-lg">{c.rating}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`text-sm ${s <= Math.round(c.rating) ? "text-amber-400" : "text-slate-200"}`}>★</span>
              ))}
            </div>
          </div>
          <VisualBar value={c.rating} max={5} color="bg-amber-400" />
        </div>
      ),
      highlight: (c: College) => c.id === bestRatingId,
      highlightLabel: "Highest Rated",
      highlightColor: "bg-amber-100 text-amber-700",
    },
    {
      label: "Placements",
      render: (c: College) => {
        const pct = parseInt(c.placements.replace("%", "")) || 0;
        return (
          <div>
            <span className="font-semibold text-green-700">{c.placements}</span>
            <VisualBar value={pct} max={100} color="bg-green-500" />
          </div>
        );
      },
    },
    {
      label: "Avg Package",
      render: (c: College) => (
        <div>
          <span className="font-semibold">{c.avgPackage ? `₹${c.avgPackage} LPA` : "N/A"}</span>
          {c.avgPackage > 0 && <VisualBar value={c.avgPackage} max={maxPackage || 1} color="bg-blue-500" />}
        </div>
      ),
      highlight: (c: College) => c.id === bestPackageId && c.avgPackage > 0,
      highlightLabel: "Best Package",
      highlightColor: "bg-blue-100 text-blue-700",
    },
    {
      label: "Courses",
      render: (c: College) => (
        <div className="flex flex-wrap gap-1 justify-center">
          {c.courses.slice(0, 4).map((course) => (
            <span key={course} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">{course}</span>
          ))}
          {c.courses.length > 4 && <span className="text-xs text-slate-400">+{c.courses.length - 4}</span>}
        </div>
      ),
    },
    {
      label: "Facilities",
      render: (c: College) => (
        <div className="space-y-1">
          {c.facilities.slice(0, 4).map((f) => (
            <div key={f} className="flex items-center gap-1.5 text-xs text-slate-600">
              <HiOutlineCheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "AI Insight",
      render: (c: College) => c.aiSummary ? (
        <p className="text-xs text-slate-600 leading-relaxed text-left italic">{c.aiSummary}</p>
      ) : <span className="text-xs text-slate-400">—</span>,
    },
    {
      label: "Apply",
      render: (c: College) => c.applyLink ? (
        <a
          href={c.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          Apply Now ↗
        </a>
      ) : <span className="text-xs text-slate-400">—</span>,
    },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">
              Feature
            </th>
            {colleges.map((college) => (
              <th key={college.id} className="p-4 text-center min-w-[220px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100">
                    <Image src={college.image} alt={college.name} fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <Link
                      href={`/colleges/${college.id}`}
                      className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2"
                    >
                      {college.name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{college.location}</p>
                  </div>
                  {/* Recommended badge */}
                  {college.id === recommendedId && colleges.length >= 2 && (
                    <div className="flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      <HiOutlineTrophy className="w-3 h-3" />
                      Recommended
                    </div>
                  )}
                  <button
                    onClick={() => onRemove(college.id)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    <HiXMark className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </th>
            ))}
            {colleges.length < 3 && (
              <th className="p-4 min-w-[200px]">
                <div className="flex flex-col items-center gap-2 opacity-40">
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center">
                    <HiOutlineXCircle className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-400">Add a college</p>
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={`border-b border-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
              <td className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider align-top">
                {row.label}
              </td>
              {colleges.map((college) => {
                const isHighlighted = row.highlight?.(college);
                return (
                  <td key={college.id} className={`p-4 text-center align-top ${
                    college.id === recommendedId && colleges.length >= 2 ? "bg-indigo-50/30" : ""
                  }`}>
                    <div className="flex flex-col items-center gap-1">
                      {isHighlighted && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.highlightColor || "bg-green-100 text-green-700"}`}>
                          🏆 {row.highlightLabel}
                        </span>
                      )}
                      <div className={`text-sm text-slate-700 w-full ${isHighlighted ? "font-semibold" : ""}`}>
                        {row.render(college)}
                      </div>
                    </div>
                  </td>
                );
              })}
              {colleges.length < 3 && <td className="p-4" />}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
