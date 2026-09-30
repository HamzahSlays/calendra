import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Clock, Copy, ExternalLink, Plus, Settings } from "lucide-react";
import CopyButton from "@/components/CopyButton"; // Or inline copy handler

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
    include: {
      eventTypes: true,
      bookings: {
        orderBy: { startTime: "asc" },
      },
    },
  });

  if (!dbUser) redirect("/sign-in");

  const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://calendra-phi.vercel.app"}/${dbUser.username}`;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fbfcfe] py-10 px-6 sm:px-10 text-[#0b3558]">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0b3558]">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Welcome back, <span className="font-semibold text-slate-700">{dbUser.name || "User"}</span>! Manage your availability and meetings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/availability"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Settings className="h-4 w-4 text-slate-500" />
              Availability
            </Link>
          </div>
        </div>

        {/* Shareable Link Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-[#0b3558]">
                Your Public Booking Link
              </h2>
              <p className="text-sm text-slate-500">
                Share this link with clients to let them book meetings directly.
              </p>
            </div>
            <Link
              href={`/${dbUser.username}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0069ff] hover:underline"
            >
              View live page <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 flex max-w-xl items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
            <input
              type="text"
              readOnly
              value={bookingUrl}
              className="w-full bg-transparent text-sm font-medium text-slate-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Upcoming Meetings
            </span>
            <p className="mt-2 text-4xl font-extrabold text-[#0b3558]">
              {dbUser.bookings?.length || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Event Types
            </span>
            <p className="mt-2 text-4xl font-extrabold text-[#0069ff]">
              {dbUser.eventTypes?.length || 0}
            </p>
          </div>
        </div>

        {/* Upcoming Meetings List */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#0b3558]">Upcoming Schedule</h3>

          {(!dbUser.bookings || dbUser.bookings.length === 0) ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 text-center">
              <Calendar className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-600">
                No meetings scheduled yet
              </p>
              <p className="text-xs text-slate-400">
                Share your public booking link to start accepting appointments.
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {dbUser.bookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-semibold text-slate-800">{booking.guestName || "Guest"}</h4>
                    <p className="text-sm text-slate-500">{booking.guestEmail}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    <Clock className="h-3.5 w-3.5 text-[#0069ff]" />
                    {new Date(booking.startTime).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}