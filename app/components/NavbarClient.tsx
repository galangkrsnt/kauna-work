"use client";

import Link from "next/link";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";

export default function NavbarClient({ isSignedIn }: { isSignedIn: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-bold text-emerald-600 text-base tracking-tight">Kauna</span>
          <span className="font-bold text-blue-600 text-base tracking-tight">Work</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/gaji/slip" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors">
            Slip Gaji
          </Link>
          <Link href="/faktur" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1.5">
            Faktur
            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">Soon</span>
          </Link>
          <Link href="/perusahaan" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1.5">
            Untuk Perusahaan
            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">Soon</span>
          </Link>
          <Link href="/panduan" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors">
            Panduan
          </Link>
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-2 space-y-1">
          <Link
            href="/gaji/slip"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            Slip Gaji
          </Link>
          <Link
            href="/faktur"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 transition-colors"
          >
            Faktur
            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">Soon</span>
          </Link>
          <Link
            href="/perusahaan"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 transition-colors"
          >
            Untuk Perusahaan
            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">Soon</span>
          </Link>
          <Link
            href="/panduan"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            Panduan
          </Link>
          {isSignedIn ? (
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Masuk
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
