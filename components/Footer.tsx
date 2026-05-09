import Link from "next/link";
import { HiOutlineAcademicCap } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                {/* <HiOutlineAcademicCap className="w-5 h-5 text-white" /> */}
                <img src="https://thfvnext.bing.com/th/id/OIP.Qk99hXbq7ejvAmg6wGHLigHaHa?w=183&h=183&c=7&r=0&o=7&cb=thfvnext&dpr=1.4&pid=1.7&rm=3" alt="Logo"/>
              </div>
              <span className="font-bold text-xl text-white">
                Next<span className="text-indigo-400">Campus</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Discover. Compare. Decide. Your trusted platform for finding the
              right college and making informed decisions about your future.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  All Colleges
                </Link>
              </li>
              <li>
                <Link href="/?type=IIT" className="hover:text-white transition-colors">
                  IITs
                </Link>
              </li>
              <li>
                <Link href="/?type=NIT" className="hover:text-white transition-colors">
                  NITs
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Compare Colleges
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Account
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition-colors">
                  Saved Colleges
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs">
            © {new Date().getFullYear()} NextCampus. All rights reserved.
          </p>
          <p className="text-xs">
            Built with Next.js · Prisma · PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
