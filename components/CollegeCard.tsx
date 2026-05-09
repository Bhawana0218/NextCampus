"use client";

import Link from "next/link";
import Image from "next/image";
import {
  HiOutlineMapPin,
  HiOutlineCurrencyRupee,
  HiOutlineStar,
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";
import { HiOutlineScale } from "react-icons/hi";
import type { College } from "@/types";

interface CollegeCardProps {
  college: College;
  isSaved?: boolean;
  isCompared?: boolean;
  onSave?: (id: string) => void;
  onCompare?: (id: string) => void;
  showCompare?: boolean;
  fitScore?: number;
}

const TYPE_COLORS: Record<string, string> = {
  IIT: "bg-orange-100 text-orange-700",
  NIT: "bg-blue-100 text-blue-700",
  Private: "bg-purple-100 text-purple-700",
  Deemed: "bg-green-100 text-green-700",
  State: "bg-slate-100 text-slate-700",
};

function FitBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-green-500" :
    score >= 65 ? "bg-blue-500" :
    score >= 50 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="13" fill="none" stroke="#e2e8f0" strokeWidth="3" />
          <circle
            cx="16" cy="16" r="13" fill="none"
            stroke={score >= 80 ? "#22c55e" : score >= 65 ? "#3b82f6" : score >= 50 ? "#f59e0b" : "#f87171"}
            strokeWidth="3"
            strokeDasharray={`${(score / 100) * 81.7} 81.7`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-700">
          {score}
        </span>
      </div>
      <div>
        <p className="text-[10px] text-slate-400 leading-none">Fit</p>
        <p className={`text-[10px] font-semibold leading-none mt-0.5 ${
          score >= 80 ? "text-green-600" : score >= 65 ? "text-blue-600" : score >= 50 ? "text-amber-600" : "text-red-500"
        }`}>
          {score >= 80 ? "Excellent" : score >= 65 ? "Good" : score >= 50 ? "Moderate" : "Low"}
        </p>
      </div>
    </div>
  );
}

export default function CollegeCard({
  college,
  isSaved = false,
  isCompared = false,
  onSave,
  onCompare,
  showCompare = true,
  fitScore,
}: CollegeCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <Image
          src={college.image}
          alt={college.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        {/* Trending badge */}
        {college.trending && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            🔥 Trending
          </div>
        )}
        {/* Type badge (when not trending) */}
        {!college.trending && (
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[college.type] || TYPE_COLORS.State}`}>
              {college.type}
            </span>
          </div>
        )}
        {/* Save button */}
        {onSave && (
          <button
            onClick={(e) => { e.preventDefault(); onSave(college.id); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            aria-label={isSaved ? "Remove from saved" : "Save college"}
          >
            {isSaved ? (
              <HiBookmark className="w-4 h-4 text-indigo-600" />
            ) : (
              <HiOutlineBookmark className="w-4 h-4 text-slate-600" />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/colleges/${college.id}`} className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 flex-1">
              {college.name}
            </h3>
            {fitScore !== undefined && <FitBadge score={fitScore} />}
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
            <HiOutlineMapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{college.location}, {college.state}</span>
          </div>

          {/* AI Summary snippet */}
          {college.aiSummary && (
            <p className="text-slate-500 text-xs line-clamp-2 mb-3 leading-relaxed italic border-l-2 border-indigo-200 pl-2">
              {college.aiSummary}
            </p>
          )}
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
              <HiOutlineCurrencyRupee className="w-3.5 h-3.5" />
              <span>Annual Fees</span>
            </div>
            <p className="font-semibold text-slate-900 text-sm">₹{(college.fees / 100000).toFixed(1)}L</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
              <HiOutlineStar className="w-3.5 h-3.5" />
              <span>Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-slate-900 text-sm">{college.rating}</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-xs ${star <= Math.round(college.rating) ? "text-amber-400" : "text-slate-200"}`}>★</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Avg Package */}
        {college.avgPackage > 0 && (
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3 bg-green-50 rounded-lg px-3 py-2">
            <span>Avg. Package</span>
            <span className="font-semibold text-green-700">₹{college.avgPackage} LPA</span>
          </div>
        )}

        {/* Courses */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {college.courses.slice(0, 3).map((course) => (
            <span key={course} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-medium">
              {course}
            </span>
          ))}
          {college.courses.length > 3 && (
            <span className="text-xs text-slate-400 px-2 py-0.5">+{college.courses.length - 3} more</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-colors"
          >
            View Details
          </Link>
          {college.applyLink && (
            <a
              href={college.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-xl border border-green-200 text-green-700 hover:bg-green-50 transition-colors"
              aria-label="Apply"
            >
              <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
            </a>
          )}
          {showCompare && onCompare && (
            <button
              onClick={() => onCompare(college.id)}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border transition-colors ${
                isCompared
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                  : "border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
              aria-label={isCompared ? "Remove from compare" : "Add to compare"}
            >
              <HiOutlineScale className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
