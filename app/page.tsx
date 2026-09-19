import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { Check } from "lucide-react";

import { BookingPreview } from "@/components/booking-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/footer";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0069ff]/50";

function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 21 21" aria-hidden>
      <path fill="#f25022" d="M1 1h9v9H1z" />
      <path fill="#00a4ef" d="M1 11h9v9H1z" />
      <path fill="#7fba00" d="M11 1h9v9h-9z" />
      <path fill="#ffb900" d="M11 11h9v9h-9z" />
    </svg>
  );
}

export default async function HomePage() {
  const user = await checkUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#fbfcfe] text-[#0b3558]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,#d6e6ff_0%,transparent_65%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,#ece8ff_0%,transparent_65%)]"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
          <div>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-[#082238] sm:text-6xl xl:text-7xl">
              Share a link. Get the meeting on your calendar.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Calendra checks your calendar, offers only the times you&apos;re
              free, and sends reminders so people actually show up.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <SignUpButton mode="modal">
                <button
                  className={`cursor-pointer rounded-full bg-[#0069ff] px-7 py-3.5 text-base font-semibold text-white shadow-[0_10px_28px_-10px_rgba(0,105,255,0.7)] transition hover:bg-[#0057d6] ${focusRing}`}
                >
                  Get started free
                </button>
              </SignUpButton>

              <span className="px-1 text-sm text-slate-400">or</span>

              <SignUpButton mode="modal">
                <button
                  aria-label="Sign up with Google"
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#dbe4f0] bg-white px-4 py-3 text-sm font-semibold text-[#0b3558] transition hover:bg-[#f4f8ff] ${focusRing}`}
                >
                  <GoogleMark /> Google
                </button>
              </SignUpButton>

              <SignUpButton mode="modal">
                <button
                  aria-label="Sign up with Microsoft"
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#dbe4f0] bg-white px-4 py-3 text-sm font-semibold text-[#0b3558] transition hover:bg-[#f4f8ff] ${focusRing}`}
                >
                  <MicrosoftMark /> Microsoft
                </button>
              </SignUpButton>
            </div>

            <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
              <Check className="h-4 w-4 text-[#178a52]" strokeWidth={2.5} />
              No credit card required
            </p>
          </div>

          <BookingPreview />
        </div>
      </section>

      <HowItWorks />
      <Features />
      <Pricing />
      <FinalCta />
      <Footer />
    </div>
  );
}