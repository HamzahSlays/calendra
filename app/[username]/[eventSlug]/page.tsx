import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import BookingCalendar from "@/components/BookingCalendar";
import ThemeToggle from "@/components/ThemeToggle";

// Prevent Next.js from caching stale booking records
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    username: string;
    eventSlug: string;
  }>;
}

export default async function PublicEventBookingPage({ params }: Props) {
  const { username, eventSlug } = await params;

  const user = await db.user.findUnique({
    where: { username },
    include: {
      availability: true,
      eventTypes: {
        where: { slug: eventSlug, isActive: true },
      },
      bookings: {
        select: {
          id: true,
          startTime: true,
          endTime: true,
        },
      },
    },
  });

  if (!user || user.eventTypes.length === 0) {
    notFound();
  }

  const eventType = user.eventTypes[0];

  return (
    <div className="min-h-screen bg-[#fbfcfe] text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* Header with Theme Toggle */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href={`/${username}`} className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0069ff] text-base font-black text-white shadow-md shadow-blue-500/25">
              C
            </span>
            <span className="text-lg font-extrabold tracking-tight text-[#0b3558] dark:text-white">
              Calendra
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Calendar View Wrapper */}
      <div className="flex items-center justify-center p-4 sm:p-8">
        <BookingCalendar
          eventType={eventType}
          host={{ name: user.name }}
          availability={user.availability}
          bookings={user.bookings.map((b) => ({
            id: b.id,
            startTime: b.startTime.toISOString(),
            endTime: b.endTime.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}