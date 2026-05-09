"use client";

import Image from "next/image";
import Link from "next/link";
import { HiXMark, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import type { College } from "@/types";

interface CompareTableProps {
  colleges: College[];
  onRemove: (id: string) => void;
}

function getBest(colleges: College[], key: keyof College, higher = true): string {
  if (colleges.length === 0) return "";
  const values = colleges.map((c) => c[key] as number);
  const best = higher ? Math.max(...values) : Math.min(...values);
  return colleges.find((c) => (c[key] as number) === best)?.id || "";
}

export default function CompareTable({ colleges, onRemove }: CompareTableProps) {
  if (colleges.length === 0) return null;

  const bestRating = getBest(colleges, "rating", true);
  const bestFees = getBest(colleges, "fees", false); // lower is better
  const bestStudents = getBest(colleges, "totalStudents", true);

  const rows = [
    {
      label: "Location",
      render: (c: College) => `${c.location}, ${c.state}`,
    },
    {
      label: "Type",
      render: (c: College) => c.type,
    },
    {
      label: "Established",
      render: (c: College) => c.established.toString(),
    },
    {
      label: "Annual Fees",
      render: (c: College) => `₹${(c.fees / 100000).toFixed(1)}L`,
      highlight: (c: College) => c.id === bestFees,
      highlightLabel: "Lowest",
    },
    {
      label: "Rating",
      render: (c: College) => (
        <div className="flex items-center gap-1.5">
          <span className="font-semibold">{c.rating}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`text-sm ${s <= Math.round(c.rating) ? "text-amber-400" : "text-slate-200"}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      ),
      highlight: (c: College) => c.id === bestRating,
      highlightLabel: "Highest",
    },
    {
      label: "Placements",
      render: (c: College) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-100 rounded-full h-2 max-w-[80px]">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: c.placements }}
            />
          </div>
          <span className="font-medium text-green-700">{c.placements}</span>
        </div>
      ),
    },
    {
      label: "Total Students",
      render: (c: College) => c.totalStudents.toLocaleString("en-IN"),
      highlight: (c: College) => c.id === bestStudents,
      highlightLabel: "Largest",
    },
    {
      label: "Courses",
      render: (c: College) => (
        <div className="flex flex-wrap gap-1">
          {c.courses.slice(0, 4).map((course) => (
            <span
              key={course}
              className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md"
            >
              {course}
            </span>
          ))}
          {c.courses.length > 4 && (
            <span className="text-xs text-slate-400">+{c.courses.length - 4}</span>
          )}
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
              <th key={college.id} className="p-4 text-center min-w-[200px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100">
                    <Image
                      src={college.image}
                      alt={college.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
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
            {/* Empty columns if less than 3 */}
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
            <tr
              key={row.label}
              className={`border-b border-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
            >
              <td className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider align-top">
                {row.label}
              </td>
              {colleges.map((college) => {
                const isHighlighted = row.highlight?.(college);
                return (
                  <td key={college.id} className="p-4 text-center align-top">
                    <div className="flex flex-col items-center gap-1">
                      {isHighlighted && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          {row.highlightLabel}
                        </span>
                      )}
                      <div className={`text-sm text-slate-700 ${isHighlighted ? "font-semibold" : ""}`}>
                        {typeof row.render(college) === "string" ? (
                          row.render(college)
                        ) : (
                          row.render(college)
                        )}
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
