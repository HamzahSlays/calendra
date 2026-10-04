"use server";

import { db } from "@/lib/prisma";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingPayload {
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  date: string;
  time: string;
}

export async function createBooking(payload: BookingPayload) {
  const { eventTypeId, guestName, guestEmail, date, time } = payload;

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined in environment variables.");
  }

  const eventType = await db.eventType.findUnique({
    where: { id: eventTypeId },
    include: { user: true },
  });

  if (!eventType) throw new Error("Event type not found in database.");

  // Parse start time and calculate end time
  const [timePart, meridiem] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const [year, month, day] = date.split("-").map(Number);
  const startTime = new Date(year, month - 1, day, hours, minutes);
  const endTime = new Date(startTime.getTime() + eventType.duration * 60000);

  // 1. Save booking in PostgreSQL via Prisma
  const booking = await db.booking.create({
    data: {
      userId: eventType.userId,
      eventTypeId: eventType.id,
      customerName: guestName,
      customerEmail: guestEmail,
      startTime,
      endTime,
    },
  });

  // 2. Dispatch Confirmation Email via Resend
  console.log("Dispatching Resend confirmation to:", guestEmail);
  const emailResult = await resend.emails.send({
    from: "Calendra <onboarding@resend.dev>",
    to: [guestEmail],
    subject: `Confirmed: ${eventType.title} with ${eventType.user.name || "Host"}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #0069ff; margin-top: 0;">Meeting Confirmed!</h2>
        <p>You have scheduled <strong>${eventType.title}</strong> with <strong>${eventType.user.name || "Host"}</strong>.</p>
        <div style="background: #f8fafc; padding: 16px; border-radius: 12px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Date & Time:</strong> ${startTime.toLocaleString()}</p>
          <p style="margin: 0;"><strong>Duration:</strong> ${eventType.duration} minutes</p>
        </div>
        <p style="color: #64748b; font-size: 13px;">Sent via Calendra Scheduling</p>
      </div>
    `,
  });

  if (emailResult.error) {
    console.error("Resend API Error:", emailResult.error);
    throw new Error(`Resend Error: ${emailResult.error.message}`);
  }

  revalidatePath("/dashboard");
  return { success: true, bookingId: booking.id };
}