import Link from "next/link";
import { HiOutlineAcademicCap } from "react-icons/hi2";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <HiOutlineAcademicCap className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-3">Page not found</h2>
        <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
