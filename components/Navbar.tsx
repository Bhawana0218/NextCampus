"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { HiOutlineAcademicCap, HiOutlineMenu, HiX } from "react-icons/hi";
import { HiOutlineBookmark, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
              {/* <HiOutlineAcademicCap className="w-5 h-5 text-white" /> */}
              <img src="https://thfvnext.bing.com/th/id/OIP.Qk99hXbq7ejvAmg6wGHLigHaHa?w=183&h=183&c=7&r=0&o=7&cb=thfvnext&dpr=1.4&pid=1.7&rm=3" alt="Logo"/>
            </div>
            <span className="font-bold text-xl text-slate-900">
              Next<span className="text-indigo-600">Campus</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Colleges
            </Link>
            <Link
              href="/compare"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Compare
            </Link>
            {user && (
              <Link
                href="/saved"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <HiOutlineBookmark className="w-4 h-4" />
                Saved
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-8 bg-slate-100 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">
                  Hi, <span className="font-medium text-slate-900">{user.name.split(" ")[0]}</span>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
          >
            Colleges
          </Link>
          <Link
            href="/compare"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
          >
            Compare
          </Link>
          {user && (
            <Link
              href="/saved"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
            >
              Saved Colleges
            </Link>
          )}
          <div className="pt-2 border-t border-slate-100 mt-2">
            {user ? (
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
