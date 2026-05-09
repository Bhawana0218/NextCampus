"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HiOutlineLightBulb,
  HiOutlineCurrencyRupee,
  HiOutlineMapPin,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineTrophy,
} from "react-icons/hi2";
import type { CollegeWithScore } from "@/types";
import { getFitLabel } from "@/lib/fitScore";

const BRANCHES = ["CSE", "ECE", "Mechanical", "Civil", "Chemical", "Aerospace", "Biotechnology", "MBA"];
const STATES = ["Delhi", "Maharashtra", "Tamil Nadu", "Karnataka", "Telangana", "Rajasthan", "West Bengal", "Uttar Pradesh", "Punjab"];

interface FormState {
  rank: string;
  budget: string;
  location: string;
  branch: string;
}

function FitScoreBar({ score, label }: { score: number; label: string }) {
  const { color, bg } = getFitLabel(score);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-100 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ${
            score >= 80 ? "bg-green-500" : score >= 65 ? "bg-blue-500" : score >= 50 ? "bg-amber-500" : "bg-red-400"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bg} ${color} whitespace-nowrap`}>
        {label} · {score}
      </span>
    </div>
  );
}

function BreakdownBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 text-slate-500 shrink-0">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
        <div
          className="bg-indigo-400 h-1.5 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right text-slate-600 font-medium">{value}</span>
    </div>
  );
}

export default function RecommendPage() {
  const [form, setForm] = useState<FormState>({ rank: "", budget: "", location: "", branch: "" });
  const [results, setResults] = useState<CollegeWithScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(false);

    try {
      const params = new URLSearchParams();
      if (form.rank) params.set("rank", form.rank);
      if (form.budget) params.set("budget", form.budget);
      if (form.location) params.set("location", form.location);
      if (form.branch) params.set("branch", form.branch);

      const res = await fetch(`/api/recommend?${params}`);
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      const data = await res.json();
      setResults(data.recommendations || []);
      setSearched(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-900 via-indigo-800 to-indigo-700 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-5">
            <HiOutlineSparkles className="w-4 h-4 text-yellow-300" />
            <span>AI-Powered Decision Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Find Your Best
            <span className="text-yellow-300"> College Match</span>
          </h1>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto">
            Tell us your preferences. Our intelligence engine scores every college
            and surfaces your top 5 matches — ranked by suitability, not just popularity.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Input Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-10">
          <div className="flex items-center gap-2 mb-6">
            <HiOutlineLightBulb className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">Your Preferences</h2>
            <span className="text-xs text-slate-400 ml-1">(all fields optional)</span>
          </div>

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
            {/* Rank */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                JEE Rank / Percentile
              </label>
              <div className="relative">
                <HiOutlineTrophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  value={form.rank}
                  onChange={(e) => setForm({ ...form, rank: e.target.value })}
                  placeholder="e.g. 5000"
                  className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">JEE Main / Advanced rank</p>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Annual Budget (₹)
              </label>
              <div className="relative">
                <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder="e.g. 200000"
                  className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Total annual fees you can afford</p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Preferred State
              </label>
              <div className="relative">
                <HiOutlineMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
                >
                  <option value="">Any location</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Preferred Branch
              </label>
              <div className="relative">
                <HiOutlineAcademicCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
                >
                  <option value="">Any branch</option>
                  {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing colleges...
                  </>
                ) : (
                  <>
                    <HiOutlineSparkles className="w-4 h-4" />
                    Find My Best Colleges
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 mb-6 text-sm">{error}</div>
        )}

        {/* Results */}
        {searched && results.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <HiOutlineChartBar className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">Your Top {results.length} Matches</h2>
              <span className="text-sm text-slate-500 ml-1">ranked by suitability score</span>
            </div>

            <div className="space-y-4">
              {results.map((college, idx) => {
                const { label } = getFitLabel(college.fitScore);
                return (
                  <div
                    key={college.id}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                      idx === 0 ? "border-indigo-200 ring-1 ring-indigo-100" : "border-slate-100"
                    }`}
                  >
                    {idx === 0 && (
                      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center gap-1.5">
                        <HiOutlineTrophy className="w-3.5 h-3.5" />
                        Best Match for You
                      </div>
                    )}
                    <div className="p-5 sm:p-6">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 hidden sm:block">
                          <Image src={college.image} alt={college.name} fill className="object-cover" unoptimized />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">
                                  #{idx + 1}
                                </span>
                                <span className="text-xs text-slate-500">{college.type}</span>
                              </div>
                              <h3 className="font-bold text-slate-900 text-lg leading-tight">{college.name}</h3>
                              <p className="text-sm text-slate-500 mt-0.5">{college.location}, {college.state}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className={`text-2xl font-black ${
                                college.fitScore >= 80 ? "text-green-600" :
                                college.fitScore >= 65 ? "text-blue-600" :
                                college.fitScore >= 50 ? "text-amber-600" : "text-red-500"
                              }`}>
                                {college.fitScore}
                              </div>
                              <div className="text-xs text-slate-400">Fit Score</div>
                            </div>
                          </div>

                          {/* Fit bar */}
                          <div className="mb-3">
                            <FitScoreBar score={college.fitScore} label={label} />
                          </div>

                          {/* Score breakdown */}
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-4">
                            <BreakdownBar label="Fees" value={college.fitBreakdown.fees} max={30} />
                            <BreakdownBar label="Placement" value={college.fitBreakdown.placement} max={35} />
                            <BreakdownBar label="Rating" value={college.fitBreakdown.rating} max={20} />
                            <BreakdownBar label="Location" value={college.fitBreakdown.location} max={15} />
                          </div>

                          {/* Key stats */}
                          <div className="flex flex-wrap gap-3 text-xs text-slate-600 mb-4">
                            <span className="flex items-center gap-1">
                              <HiOutlineCurrencyRupee className="w-3.5 h-3.5 text-slate-400" />
                              ₹{(college.fees / 100000).toFixed(1)}L/yr
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="text-green-500">●</span>
                              {college.placements} placed
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="text-amber-400">★</span>
                              {college.rating}
                            </span>
                            {college.avgPackage > 0 && (
                              <span className="flex items-center gap-1">
                                <span className="text-blue-400">↑</span>
                                ₹{college.avgPackage}L avg pkg
                              </span>
                            )}
                          </div>

                          {/* AI Summary */}
                          {college.aiSummary && (
                            <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs text-slate-600 leading-relaxed border-l-2 border-indigo-300">
                              <span className="font-semibold text-indigo-600">AI Insight: </span>
                              {college.aiSummary}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Link
                              href={`/colleges/${college.id}`}
                              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                              View Details
                              <HiOutlineArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            {college.applyLink && (
                              <a
                                href={college.applyLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              >
                                Apply Now
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white text-center">
              <h3 className="font-bold text-lg mb-2">Want to compare your top picks?</h3>
              <p className="text-indigo-200 text-sm mb-4">
                Add your recommended colleges to the comparison tool for a detailed side-by-side analysis.
              </p>
              <Link
                href={`/compare?ids=${results.slice(0, 3).map((c) => c.id).join(",")}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-sm"
              >
                Compare Top 3 Colleges
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {searched && results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HiOutlineLightBulb className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No matches found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your preferences for better results.</p>
          </div>
        )}
      </div>
    </div>
  );
}
