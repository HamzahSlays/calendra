"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Calendar } from "lucide-react";

export function Header() {
  return (
    <header className="w-full bg-[#fbfbfb] border-b border-gray-100">
      {/* Top Banner */}
      <div className="bg-[#e8f1fd] px-4 py-2 text-center text-sm text-[#004cd4] flex items-center justify-center gap-2">
        <span>📢 Introducing the new Calendra, built to handle all of the work around meetings.</span>
        <Link href="#features" className="underline font-medium hover:text-[#0b388b] transition">
          Learn more &rarr;
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo & Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0069ff] flex items-center justify-center text-white font-bold text-xl shadow-sm">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-[#0b3558]">Calendra</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <button className="hover:text-black transition flex items-center gap-1">
              Product <span className="text-xs">▾</span>
            </button>
            <button className="hover:text-black transition flex items-center gap-1">
              Solutions <span className="text-xs">▾</span>
            </button>
            <button className="hover:text-black transition flex items-center gap-1">
              Resources <span className="text-xs">▾</span>
            </button>
            <Link href="#pricing" className="hover:text-black transition">
              Pricing
            </Link>
          </div>
        </div>

        {/* Right CTA / Auth */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-semibold text-gray-800 hover:text-black px-4 py-2.5 rounded-full transition border border-gray-300 hover:border-gray-400 bg-white">
                Log In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="text-sm font-semibold text-white bg-[#0069ff] hover:bg-[#0055d4] px-5 py-2.5 rounded-full transition shadow-sm">
                Get started for free
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-gray-700 hover:text-black px-4 py-2 rounded-full border border-gray-200 transition"
            >
              Go to Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}