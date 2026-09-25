import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";

import { BookingPreview } from "@/components/booking-preview";
import { HeroAuth } from "@/components/landing/HeroAuth";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/footer";

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

            {/* Client Hydrated Auth Buttons */}
            <HeroAuth />
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