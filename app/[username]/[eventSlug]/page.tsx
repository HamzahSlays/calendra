import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingCalendar from "@/components/BookingCalendar";

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
    },
  });

  if (!user || user.eventTypes.length === 0) {
    notFound();
  }

  const eventType = user.eventTypes[0];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <BookingCalendar
        eventType={eventType}
        host={{ name: user.name }}
        availability={user.availability}
      />
    </div>
  );
}