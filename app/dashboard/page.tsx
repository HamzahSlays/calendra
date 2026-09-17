import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { db } from "@/lib/prisma";
import Link from "next/link";
import BookingUrlCard from "@/components/BookingUrlCard";
import CreateEventModal from "@/components/CreateEventModal";
import UpcomingMeetingsList from "@/components/UpcomingMeetingsList";

export default async function DashboardPage() {
  const user = await checkUser();

  if (!user) {
    redirect("/");
  }

  // Fetch event types and upcoming non-cancelled bookings
  const [eventTypes, upcomingBookings] = await Promise.all([
    db.eventType.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    db.booking.findMany({
      where: {
        userId: user.id,
        status: { not: "CANCELLED" },
        startTime: { gte: new Date() },
      },
      include: {
        eventType: {
          select: { title: true, duration: true },
        },
      },
      orderBy: { startTime: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Top Header */}
      <header className="flex justify-between items-center pb-8 border-b border-gray-800 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back, {user.name}!</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/availability"
            className="text-xs px-3.5 py-2 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white rounded-lg transition font-medium"
          >
            ⚙ Availability Settings
          </Link>
          <UserButton />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto mt-8 space-y-8">
        {/* Custom Slug & Public URL Card */}
        <BookingUrlCard initialUsername={user.username || ""} />

        {/* Dynamic Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium">Upcoming Meetings</h3>
            <p className="text-3xl font-bold mt-2">{upcomingBookings.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium">Event Types</h3>
            <p className="text-3xl font-bold mt-2">{eventTypes.length}</p>
          </div>
        </div>

        {/* Upcoming Meetings Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">Upcoming Schedule</h2>
          <UpcomingMeetingsList bookings={upcomingBookings} />
        </section>

        {/* Event Types Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Event Types</h2>
            <CreateEventModal />
          </div>

          {eventTypes.length === 0 ? (
            <div className="bg-gray-900/40 border border-dashed border-gray-800 rounded-xl p-12 text-center">
              <p className="text-gray-400 text-sm mb-4">
                You haven't created any event types yet.
              </p>
              <CreateEventModal />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventTypes.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <span className="text-xs px-2.5 py-1 bg-purple-950 text-purple-400 rounded-full border border-purple-800">
                        {event.duration} mins
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-400 mt-2">{event.description}</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-800 text-xs text-gray-400">
                    <span>
                      /{user.username}/{event.slug}
                    </span>
                    <span className={event.isActive ? "text-green-400" : "text-gray-500"}>
                      {event.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}