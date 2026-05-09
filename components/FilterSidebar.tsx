"use client";

import { HiOutlineAdjustmentsHorizontal, HiXMark } from "react-icons/hi2";

interface Filters {
  type: string;
  location: string;
  minFees: string;
  maxFees: string;
  course: string;
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

const COLLEGE_TYPES = ["IIT", "NIT", "Private", "Deemed", "State"];
const STATES = [
  "Delhi", "Maharashtra", "Tamil Nadu", "Karnataka", "Telangana",
  "Rajasthan", "West Bengal", "Uttar Pradesh", "Punjab", "Odisha",
];
const COURSES = [
  "CSE", "ECE", "Mechanical", "Civil", "Chemical",
  "Aerospace", "Biotechnology", "MBA", "Architecture",
];
const FEE_RANGES = [
  { label: "Under ₹1L", min: "0", max: "100000" },
  { label: "₹1L – ₹2L", min: "100000", max: "200000" },
  { label: "₹2L – ₹3L", min: "200000", max: "300000" },
  { label: "₹3L – ₹5L", min: "300000", max: "500000" },
  { label: "Above ₹5L", min: "500000", max: "" },
];

export default function FilterSidebar({ filters, onChange, onReset }: FilterSidebarProps) {
  const hasActiveFilters =
    filters.type || filters.location || filters.minFees || filters.maxFees || filters.course;

  const setFeeRange = (min: string, max: string) => {
    const isActive = filters.minFees === min && filters.maxFees === max;
    onChange({
      ...filters,
      minFees: isActive ? "" : min,
      maxFees: isActive ? "" : max,
    });
  };

  return (
    <aside className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiOutlineAdjustmentsHorizontal className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-slate-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            <HiXMark className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      {/* College Type */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          College Type
        </h3>
        <div className="space-y-1.5">
          {COLLEGE_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="type"
                value={type}
                checked={filters.type === type}
                onChange={() =>
                  onChange({ ...filters, type: filters.type === type ? "" : type })
                }
                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* State / Location */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          State
        </h3>
        <select
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">All States</option>
          {STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Fee Range */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Annual Fees
        </h3>
        <div className="space-y-1.5">
          {FEE_RANGES.map((range) => {
            const isActive = filters.minFees === range.min && filters.maxFees === range.max;
            return (
              <button
                key={range.label}
                onClick={() => setFeeRange(range.min, range.max)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Course */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Course
        </h3>
        <div className="flex flex-wrap gap-2">
          {COURSES.map((course) => (
            <button
              key={course}
              onClick={() =>
                onChange({ ...filters, course: filters.course === course ? "" : course })
              }
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filters.course === course
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {course}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
