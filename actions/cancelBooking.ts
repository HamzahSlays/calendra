"use server";

import { db } from "@/lib/prisma";
import { deleteGoogleCalendarEvent } from "@/lib/googleCalendar";
import { revalidatePath } from "next/cache";

export async function cancelBooking(cancellationToken: string) {
  try {
    const booking = await db.booking.findUnique({
      where: { cancellationToken },
    });

    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    if (booking.status === "CANCELLED") {
      return { success: false, error: "Booking has already been cancelled." };
    }

    // Remove from Google Calendar
    if (booking.eventId) {
      await deleteGoogleCalendarEvent(booking.eventId);
    }

    // Mark as Cancelled in database
    await db.booking.update({
      where: { cancellationToken },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Cancellation error:", error);
    return { success: false, error: "Failed to cancel booking." };
  }
}

export async function cancelBookingById(bookingId: string) {
  try {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) return { success: false, error: "Booking not found." };
    if (booking.status === "CANCELLED") return { success: false, error: "Already cancelled." };

    // If it has a Google Calendar event attached, remove it
    if (booking.eventId) {
      await deleteGoogleCalendarEvent(booking.eventId);
    }

    // Mark as CANCELLED in DB
    await db.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Host cancellation error:", error);
    return { success: false, error: "Failed to cancel booking." };
  }
}