"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Calendar, Clock, Settings } from "lucide-react";

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-200">
            Calendra
          </span>
        </Link>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-zinc-800/60 transition-all duration-200 flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-zinc-400" />
                Bookings
              </Link>
              <Link
                href="/availability"
                className="text-sm font-medium text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-zinc-800/60 transition-all duration-200 flex items-center gap-1.5"
              >
                <Settings className="w-4 h-4 text-zinc-400" />
                Availability
              </Link>
              <div className="pl-2 border-l border-zinc-800">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/20 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}