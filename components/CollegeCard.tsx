"use client";

import Link from "next/link";
import Image from "next/image";
import { HiOutlineMapPin, HiOutlineCurrencyRupee, HiOutlineStar, HiOutlineBookmark, HiBookmark } from "react-icons/hi2";
import { HiOutlineScale } from "react-icons/hi";
import type { College } from "@/types";

interface CollegeCardProps {
  college: College;
  isSaved?: boolean;
  isCompared?: boolean;
  onSave?: (id: string) => void;
  onCompare?: (id: string) => void;
  showCompare?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  IIT: "bg-orange-100 text-orange-700",
  NIT: "bg-blue-100 text-blue-700",
  Private: "bg-purple-100 text-purple-700",
  Deemed: "bg-green-100 text-green-700",
  State: "bg-slate-100 text-slate-700",
};

export default function CollegeCard({
  college,
  isSaved = false,
  isCompared = false,
  onSave,
  onCompare,
  showCompare = true,
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
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              TYPE_COLORS[college.type] || TYPE_COLORS.State
            }`}
          >
            {college.type}
          </span>
        </div>
        {/* Save button */}
        {onSave && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onSave(college.id);
            }}
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
          <h3 className="font-semibold text-slate-900 text-base leading-snug mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {college.name}
          </h3>
          <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
            <HiOutlineMapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{college.location}, {college.state}</span>
          </div>
          <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
            {college.description}
          </p>
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
              <HiOutlineCurrencyRupee className="w-3.5 h-3.5" />
              <span>Annual Fees</span>
            </div>
            <p className="font-semibold text-slate-900 text-sm">
              ₹{(college.fees / 100000).toFixed(1)}L
            </p>
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
                  <span
                    key={star}
                    className={`text-xs ${
                      star <= Math.round(college.rating)
                        ? "text-amber-400"
                        : "text-slate-200"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {college.courses.slice(0, 3).map((course) => (
            <span
              key={course}
              className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-medium"
            >
              {course}
            </span>
          ))}
          {college.courses.length > 3 && (
            <span className="text-xs text-slate-400 px-2 py-0.5">
              +{college.courses.length - 3} more
            </span>
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
              {isCompared ? "Added" : "Compare"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
