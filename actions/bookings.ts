"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendBookingEmails } from "@/lib/mail";
import { createGoogleCalendarEvent } from "@/lib/googleCalendar";

interface CreateBookingInput {
  eventTypeId: string;
  customerName: string;
  customerEmail: string;
  customerNotes?: string;
  startTime: string;
  endTime: string;
}

export async function createBooking(data: CreateBookingInput) {
  try {
    const eventType = await db.eventType.findUnique({
      where: { id: data.eventTypeId },
      include: { user: true },
    });

    if (!eventType || !eventType.isActive) {
      return { success: false, error: "Event type not found or inactive." };
    }

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    // Prevent double booking (ignoring cancelled ones)
    const overlapping = await db.booking.findFirst({
      where: {
        userId: eventType.userId,
        status: { not: "CANCELLED" },
        OR: [
          {
            startTime: { lte: start },
            endTime: { gt: start },
          },
          {
            startTime: { lt: end },
            endTime: { gte: end },
          },
        ],
      },
    });

    if (overlapping) {
      return { success: false, error: "This slot has already been reserved." };
    }

    // 1. Create Google Calendar Event & generate Meet link + eventId
    const calResult = await createGoogleCalendarEvent({
      summary: `${eventType.title} - ${data.customerName}`,
      description: data.customerNotes || `Calendra booking with ${data.customerName}`,
      startTime: start,
      endTime: end,
      attendeeEmail: data.customerEmail,
      attendeeName: data.customerName,
    });

    const meetLink = calResult.meetLink || null;
    const eventId = calResult.eventId || null;

    // 2. Persist booking to PostgreSQL with eventId and status
    const booking = await db.booking.create({
      data: {
        eventTypeId: eventType.id,
        userId: eventType.userId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerNotes: data.customerNotes,
        meetLink: meetLink,
        eventId: eventId,
        status: "CONFIRMED",
        startTime: start,
        endTime: end,
      },
    });

    // 3. Build public cancellation URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const cancelUrl = `${appUrl}/cancel/${booking.cancellationToken}`;

    // 4. Send email notifications with Meet link and Cancel URL
    await sendBookingEmails({
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      hostEmail: eventType.user.email,
      hostName: eventType.user.name || "Host",
      eventTitle: eventType.title,
      startTime: start,
      duration: eventType.duration,
      meetLink: meetLink || undefined,
      cancelUrl: cancelUrl,
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      bookingId: booking.id,
      meetLink,
      cancelUrl,
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: "Failed to schedule booking." };
  }
}