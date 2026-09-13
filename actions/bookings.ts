"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateBookingInput {
  eventTypeId: string;
  customerName: string;
  customerEmail: string;
  customerNotes?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
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

    // Prevent double booking for the host
    const overlapping = await db.booking.findFirst({
      where: {
        userId: eventType.userId,
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

    const booking = await db.booking.create({
      data: {
        eventTypeId: eventType.id,
        userId: eventType.userId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerNotes: data.customerNotes,
        startTime: start,
        endTime: end,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: "Failed to schedule booking." };
  }
}