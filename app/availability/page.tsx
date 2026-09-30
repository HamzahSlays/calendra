import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Globe, Save } from "lucide-react";

export default async function AvailabilityPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
    include: { availability: true },
  });

  if (!dbUser) redirect("/sign-in");

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fbfcfe] py-10 px-6 sm:px-10 text-[#0b3558]">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Navigation & Header */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-[#0069ff]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="mt-3 flex items-center justify-between border-b border-slate-200/80 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0b3558]">
                Availability Hours
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Set the days and hours when clients are allowed to book meetings with you.
              </p>
            </div>
          </div>
        </div>

        {/* Timezone Card */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0069ff]">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Timezone
              </p>
              <h3 className="text-sm font-bold text-slate-800">
                Asia/Kolkata (IST)
              </h3>
            </div>
          </div>
        </div>

        {/* Weekly Schedule Form */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-[#0b3558]">Weekly Working Hours</h2>

          <div className="divide-y divide-slate-100">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4"
              >
                <div className="flex items-center gap-3 w-36">
                  <input
                    type="checkbox"
                    defaultChecked={day !== "Sunday" && day !== "Saturday"}
                    className="h-4 w-4 rounded border-slate-300 text-[#0069ff] focus:ring-[#0069ff]"
                  />
                  <span className="text-sm font-semibold text-slate-800">{day}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      defaultValue="09:00"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-[#0069ff] focus:bg-white focus:outline-none"
                    />
                    <span className="text-xs text-slate-400">-</span>
                    <input
                      type="time"
                      defaultValue="17:00"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-[#0069ff] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-5 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0069ff] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0057d6]"
            >
              <Save className="h-4 w-4" />
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}