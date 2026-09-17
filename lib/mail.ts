import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingEmailProps {
  customerEmail: string;
  customerName: string;
  hostEmail: string;
  hostName: string;
  eventTitle: string;
  startTime: Date;
  duration: number;
  meetLink?: string;
  cancelUrl?: string;
}

export async function sendBookingEmails({
  customerEmail,
  customerName,
  hostEmail,
  hostName,
  eventTitle,
  startTime,
  duration,
  meetLink,
  cancelUrl,
}: BookingEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is missing from environment variables.");
    return;
  }

  const formattedDate = startTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = startTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const meetSection = meetLink
    ? `<div style="margin-top: 16px;">
        <a href="${meetLink}" style="background-color: #0284c7; color: white; padding: 10px 18px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 500;">
          Join Google Meet
        </a>
        <p style="font-size: 12px; color: #6b7280; margin-top: 6px;">Link: <a href="${meetLink}">${meetLink}</a></p>
      </div>`
    : "";

  const cancelSection = cancelUrl
    ? `<div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 13px; color: #6b7280; margin-bottom: 8px;">Need to make changes or cancel this meeting?</p>
        <a href="${cancelUrl}" style="background-color: #ef4444; color: white; padding: 8px 14px; border-radius: 6px; text-decoration: none; display: inline-block; font-size: 12px; font-weight: 500;">
          Cancel Booking
        </a>
      </div>`
    : "";

  // 1. Send confirmation to Attendee
  const attendeeRes = await resend.emails.send({
    from: "Calendra <onboarding@resend.dev>",
    to: customerEmail,
    subject: `Confirmed: ${eventTitle} with ${hostName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #6d28d9; margin-bottom: 8px;">Booking Confirmed!</h2>
        <p>Hi <strong>${customerName}</strong>,</p>
        <p>Your appointment has been successfully scheduled:</p>
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Event:</strong> ${eventTitle}</p>
          <p style="margin: 4px 0;"><strong>With:</strong> ${hostName}</p>
          <p style="margin: 4px 0;"><strong>When:</strong> ${formattedDate} at ${formattedTime}</p>
          <p style="margin: 4px 0;"><strong>Duration:</strong> ${duration} mins</p>
          ${meetSection}
        </div>
        ${cancelSection}
        <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">Looking forward to connecting with you!</p>
      </div>
    `,
  });

  if (attendeeRes.error) {
    console.error("❌ Resend Attendee Error:", attendeeRes.error);
  } else {
    console.log("✅ Attendee email delivered ID:", attendeeRes.data?.id);
  }

  // 2. Send notification to Host
  if (hostEmail && hostEmail !== customerEmail) {
    const hostRes = await resend.emails.send({
      from: "Calendra <onboarding@resend.dev>",
      to: hostEmail,
      subject: `New Meeting: ${customerName} scheduled ${eventTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #10b981; margin-bottom: 8px;">New Reservation</h2>
          <p><strong>${customerName}</strong> (${customerEmail}) booked a time slot on your calendar.</p>
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Event:</strong> ${eventTitle}</p>
            <p style="margin: 4px 0;"><strong>When:</strong> ${formattedDate} at ${formattedTime}</p>
            ${meetSection}
          </div>
          ${cancelSection}
        </div>
      `,
    });

    if (hostRes.error) {
      console.error("❌ Resend Host Error:", hostRes.error);
    } else {
      console.log("✅ Host email delivered ID:", hostRes.data?.id);
    }
  }
}