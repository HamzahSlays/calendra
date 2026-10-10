"use server";

import { db } from "@/lib/prisma";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { createEvent, DateArray } from "ics";
import { clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";

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

  const eventType = await db.eventType.findUnique({
    where: { id: eventTypeId },
    include: { user: true },
  });

  if (!eventType) throw new Error("Event type not found in database.");

  // Parse start time and end time
  const [timePart, meridiem] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const [year, month, day] = date.split("-").map(Number);
  const startTime = new Date(year, month - 1, day, hours, minutes);
  const endTime = new Date(startTime.getTime() + eventType.duration * 60000);

  // 1. Declare meetLink here so it can be assigned inside try block and returned at the end
  let meetLink: string | null = null;

  // 2. Direct Google Calendar API integration
  try {
    const client = await clerkClient();
    const tokenResponse = await client.users.getUserOauthAccessToken(
      eventType.user.clerkUserId,
      "oauth_google"
    );

    const accessToken = tokenResponse?.data?.[0]?.token;

    if (accessToken) {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const gcalEvent = await calendar.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        requestBody: {
          summary: `${eventType.title}: ${guestName}`,
          description: eventType.description || "Scheduled via Calendra",
          start: { dateTime: startTime.toISOString() },
          end: { dateTime: endTime.toISOString() },
          attendees: [{ email: guestEmail, displayName: guestName }],
          conferenceData: {
            createRequest: {
              requestId: `meet-${Date.now()}`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        },
      });

      // Assign the generated Google Meet link
      meetLink = gcalEvent.data.hangoutLink || null;
      console.log("Successfully created Google Calendar event with Meet:", meetLink);
    } else {
      console.warn("No Google OAuth token found for host in Clerk. Skipping direct GCal sync.");
    }
  } catch (gcalErr) {
    console.error("Google Calendar insertion failed:", gcalErr);
  }

  // 3. Save booking to database
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

  // 4. Generate .ics file attachment
  const icsStartDate: DateArray = [
    startTime.getFullYear(),
    startTime.getMonth() + 1,
    startTime.getDate(),
    startTime.getHours(),
    startTime.getMinutes(),
  ];

  const icsEvent = await new Promise<string>((resolve, reject) => {
    createEvent(
      {
        title: `${eventType.title} with ${eventType.user.name || "Host"}`,
        description: `${eventType.description || ""}${meetLink ? `\n\nGoogle Meet: ${meetLink}` : ""}`,
        url: meetLink || undefined,
        start: icsStartDate,
        duration: { minutes: eventType.duration },
        status: "CONFIRMED",
        busyStatus: "BUSY",
        organizer: {
          name: eventType.user.name || "Calendra Host",
          email: eventType.user.email || "noreply@calendra.com",
        },
        attendees: [
          {
            name: guestName,
            email: guestEmail,
            rsvp: true,
            partstat: "ACCEPTED",
            role: "REQ-PARTICIPANT",
          },
        ],
      },
      (error, value) => {
        if (error) reject(error);
        resolve(value);
      }
    );
  });

  const icsBuffer = Buffer.from(icsEvent, "utf-8");

  // 5. Send confirmation email
  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: "Calendra <onboarding@resend.dev>",
        to: [guestEmail],
        subject: `Confirmed: ${eventType.title} with ${eventType.user.name || "Host"}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #0069ff; margin-top: 0;">Meeting Confirmed!</h2>
            <p>You have scheduled <strong>${eventType.title}</strong> with <strong>${eventType.user.name || "Host"}</strong>.</p>
            
            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Date & Time:</strong> ${startTime.toLocaleString()}</p>
              <p style="margin: 0 0 8px 0;"><strong>Duration:</strong> ${eventType.duration} minutes</p>
              ${
                meetLink
                  ? `<p style="margin: 0;"><strong>Video Call:</strong> <a href="${meetLink}" style="color: #0069ff; font-weight: bold;">Join Google Meet</a></p>`
                  : ""
              }
            </div>

            <p style="color: #475569; font-size: 14px;">An <code>invite.ics</code> file is attached to sync with external calendar apps.</p>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px;">Sent via Calendra Scheduling</p>
          </div>
        `,
        attachments: [
          {
            filename: "invite.ics",
            content: icsBuffer,
          },
        ],
      });
    } catch (emailErr) {
      console.error("Resend error:", emailErr);
    }
  }

  revalidatePath("/dashboard");

  // 6. Return meetLink in the payload
  return { success: true, bookingId: booking.id, meetLink };
}