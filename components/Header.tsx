"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition opacity-90 hover:opacity-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0069ff] text-white shadow-sm">
            <Calendar className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0b3558]">
            Calendra
          </span>
        </Link>

        {/* Right Authentication & Lantern Theme Controls */}
        <div className="flex items-center gap-3">
          {/* Top Right Lantern Toggle Button */}
          <ThemeToggle />

          <SignedIn>
            <Link
              href="/dashboard"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#0b3558] shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#0b3558] transition hover:bg-slate-100"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-[#0069ff] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0057d6]"
            >
              Get started
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

export default Header;