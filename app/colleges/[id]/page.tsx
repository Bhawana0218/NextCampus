import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import type { College } from "@/types";
import {
  HiOutlineMapPin,
  HiOutlineStar,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineBuildingLibrary,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import { HiOutlineScale } from "react-icons/hi";
import SaveButton from "./SaveButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const college = await prisma.college.findUnique({
    where: { id },
    select: { name: true, description: true },
  });
  if (!college) return { title: "College Not Found | NextCampus" };
  return {
    title: `${college.name} | NextCampus`,
    description: college.description,
  };
}

const TYPE_COLORS: Record<string, string> = {
  IIT: "bg-orange-100 text-orange-700 border-orange-200",
  NIT: "bg-blue-100 text-blue-700 border-blue-200",
  Private: "bg-purple-100 text-purple-700 border-purple-200",
  Deemed: "bg-green-100 text-green-700 border-green-200",
  State: "bg-slate-100 text-slate-700 border-slate-200",
};

// Mock reviews
const MOCK_REVIEWS = [
  {
    name: "Arjun Sharma",
    rating: 5,
    date: "March 2024",
    text: "Excellent faculty and world-class infrastructure. The placement support is outstanding and the campus life is vibrant.",
    course: "B.Tech CSE",
  },
  {
    name: "Priya Nair",
    rating: 4,
    date: "January 2024",
    text: "Great research opportunities and industry exposure. The curriculum is rigorous but rewarding. Highly recommend.",
    course: "B.Tech ECE",
  },
  {
    name: "Rahul Gupta",
    rating: 5,
    date: "December 2023",
    text: "The alumni network is incredible. Got placed at a top MNC through campus placements. Best decision of my life.",
    course: "B.Tech Mechanical",
  },
];

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [collegeRaw, authUser] = await Promise.all([
    prisma.college.findFirst({ where: { id } }),
    getAuthUser(),
  ]);

  if (!collegeRaw) notFound();

  // Cast to our shared College type — the LS may have stale Prisma types
  // but tsc confirms all fields exist in the generated client
  const college = collegeRaw as unknown as College;

  // Check if saved
  let isSaved = false;
  if (authUser) {
    const saved = await prisma.savedCollege.findFirst({
      where: { userId: authUser.id, collegeId: id },
    });
    isSaved = !!saved;
  }

  const placementNum = parseInt(college.placements.replace("%", ""));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 bg-slate-900 overflow-hidden">
        <Image
          src={college.image}
          alt={college.name}
          fill
          className="object-cover opacity-60"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg transition-colors"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Colleges
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-3 ${
                    TYPE_COLORS[college.type] || TYPE_COLORS.State
                  }`}
                >
                  {college.type}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {college.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1.5">
                    <HiOutlineMapPin className="w-4 h-4" />
                    {college.location}, {college.state}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HiOutlineCalendar className="w-4 h-4" />
                    Est. {college.established}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HiOutlineUserGroup className="w-4 h-4" />
                    {college.totalStudents.toLocaleString("en-IN")} students
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                  <div className="flex items-center gap-1 text-amber-400 justify-center">
                    <HiOutlineStar className="w-5 h-5 fill-current" />
                    <span className="text-xl font-bold text-white">{college.rating}</span>
                  </div>
                  <p className="text-white/60 text-xs mt-0.5">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <SaveButton
            collegeId={college.id}
            initialSaved={isSaved}
            isLoggedIn={!!authUser}
          />
          <Link
            href={`/compare?ids=${college.id}`}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-slate-200 text-slate-700 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
          >
            <HiOutlineScale className="w-4 h-4" />
            Add to Compare
          </Link>
          <div className="ml-auto text-right">
            <p className="text-xs text-slate-500">Annual Fees</p>
            <p className="text-xl font-bold text-slate-900">
              ₹{(college.fees / 100000).toFixed(1)}L
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <HiOutlineBuildingLibrary className="w-5 h-5 text-indigo-600" />
                About {college.name}
              </h2>
              <p className="text-slate-600 leading-relaxed">{college.description}</p>
            </section>

            {/* Courses */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Courses Offered
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {college.courses.map((course) => (
                  <div
                    key={course}
                    className="flex items-center gap-2 p-3 bg-indigo-50 rounded-xl"
                  >
                    <HiOutlineCheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-indigo-700">{course}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Placements */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Placement Statistics
              </h2>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-3xl font-bold text-green-700">{college.placements}</p>
                  <p className="text-sm text-green-600 mt-1">Placement Rate</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-3xl font-bold text-blue-700">₹12–45L</p>
                  <p className="text-sm text-blue-600 mt-1">Avg. Package</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-3xl font-bold text-purple-700">200+</p>
                  <p className="text-sm text-purple-600 mt-1">Recruiters</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Placement Rate</span>
                  <span className="font-semibold text-slate-900">{college.placements}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all"
                    style={{ width: `${placementNum}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Student Reviews
              </h2>
              <div className="space-y-4">
                {MOCK_REVIEWS.map((review, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{review.name}</p>
                        <p className="text-xs text-slate-500">{review.course} · {review.date}</p>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`text-sm ${s <= review.rating ? "text-amber-400" : "text-slate-200"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
              <h3 className="font-semibold text-slate-900">Quick Facts</h3>
              {[
                { label: "Annual Fees", value: `₹${(college.fees / 100000).toFixed(1)}L` },
                { label: "Rating", value: `${college.rating} / 5.0` },
                { label: "Placements", value: college.placements },
                { label: "Established", value: college.established.toString() },
                { label: "Total Students", value: college.totalStudents.toLocaleString("en-IN") },
                { label: "College Type", value: college.type },
                { label: "Location", value: `${college.location}, ${college.state}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-sm font-semibold text-slate-900">{value}</span>
                </div>
              ))}
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Campus Facilities</h3>
              <div className="space-y-2">
                {college.facilities.map((facility) => (
                  <div key={facility} className="flex items-center gap-2.5">
                    <HiOutlineCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white">
              <h3 className="font-semibold mb-2">Interested in {college.name}?</h3>
              <p className="text-indigo-200 text-sm mb-4">
                Save this college and compare it with others to make the best decision.
              </p>
              <SaveButton
                collegeId={college.id}
                initialSaved={isSaved}
                isLoggedIn={!!authUser}
                variant="white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
