import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingCalendar from "@/components/BookingCalendar";

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
    <main className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 sm:p-8 bg-[#fbfcfe] dark:bg-slate-950 transition-colors duration-300">
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
    </main>
  );
}