import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Clock, Settings, ExternalLink } from "lucide-react";
import CreateEventModal from "@/components/CreateEventModal";
import EventCard from "@/components/EventCard";
import CancelBookingButton from "@/components/CancelBookingButton";
import MeetingCalendarView from "@/components/MeetingCalendarView";

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

  const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://calendra-phi.vercel.app"}/${dbUser.username || ""}`;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fbfcfe] dark:bg-slate-900 py-10 px-6 sm:px-10 text-[#0b3558] dark:text-slate-100 transition-colors">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header row with Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0b3558] dark:text-white">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Welcome back, <span className="font-semibold text-slate-700 dark:text-slate-200">{dbUser.name || "User"}</span>! Manage your availability and meetings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/availability"
              className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-base font-bold text-slate-700 dark:text-slate-200 shadow-sm transition hover:border-[#0069ff] hover:text-[#0069ff] dark:hover:border-[#0069ff] dark:hover:text-[#0069ff]"
            >
              <Settings className="h-5 w-5 text-[#0069ff]" />
              Availability Settings
            </Link>
            <CreateEventModal />
          </div>
        </div>

        {/* Shareable Link Card */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-[#0b3558] dark:text-white">
                Your Public Booking Link
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Share this link with clients to let them book meetings directly.
              </p>
            </div>
            {dbUser.username && (
              <Link
                href={`/${dbUser.username}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0069ff] hover:underline"
              >
                View live page <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          <div className="mt-4 flex max-w-xl items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-2.5">
            <input
              type="text"
              readOnly
              value={bookingUrl}
              className="w-full bg-transparent text-sm font-medium text-slate-600 dark:text-slate-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Upcoming Meetings
            </span>
            <p className="mt-2 text-4xl font-extrabold text-[#0b3558] dark:text-white">
              {dbUser.bookings?.length || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Event Types
            </span>
            <p className="mt-2 text-4xl font-extrabold text-[#0069ff]">
              {dbUser.eventTypes?.length || 0}
            </p>
          </div>
        </div>

        {/* Event Types Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0b3558] dark:text-white">Your Event Types</h3>
          </div>

          {dbUser.eventTypes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center text-slate-400">
              No event types found. Click <strong>New Event Type</strong> above to create one.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dbUser.eventTypes.map((event: any) => (
                <EventCard
                  key={event.id}
                  event={event}
                  username={dbUser.username}
                />
              ))}
            </div>
          )}
        </div>

        {/* Meeting Calendar with Hover Details */}
        <MeetingCalendarView bookings={dbUser.bookings || []} />

        {/* Upcoming Meetings List */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#0b3558] dark:text-white">Upcoming Schedule</h3>

          {!dbUser.bookings || dbUser.bookings.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 py-12 text-center">
              <Calendar className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                No meetings scheduled yet
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Share your public booking link to start accepting appointments.
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-700/60">
              {dbUser.bookings.map((booking: any) => {
                const displayName = booking.customerName || booking.guestName || "Guest";
                const displayEmail = booking.customerEmail || booking.guestEmail || "";

                return (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                        {displayName}
                      </h4>
                      {displayEmail && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">{displayEmail}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Clock className="h-3.5 w-3.5 text-[#0069ff]" />
                        {new Date(booking.startTime).toLocaleString()}
                      </div>
                      <CancelBookingButton
                        bookingId={booking.id}
                        guestName={displayName}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}