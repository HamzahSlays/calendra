import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

interface CreateGoogleMeetingProps {
  summary: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendeeEmail: string;
  attendeeName: string;
}

export async function createGoogleCalendarEvent({
  summary,
  description,
  startTime,
  endTime,
  attendeeEmail,
  attendeeName,
}: CreateGoogleMeetingProps) {
  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary,
        description,
        start: {
          dateTime: startTime.toISOString(),
        },
        end: {
          dateTime: endTime.toISOString(),
        },
        attendees: [{ email: attendeeEmail, displayName: attendeeName }],
        conferenceData: {
          createRequest: {
            requestId: `calendra-${Date.now()}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
    });

    const meetLink = response.data.hangoutLink || null;
    return { success: true, meetLink, eventId: response.data.id };
  } catch (error: any) {
    const errorDetails = error?.response?.data || error?.message || error;
    console.error("❌ Google Calendar API Error Details:", JSON.stringify(errorDetails, null, 2));
    return { success: false, meetLink: null, error: errorDetails };
  }
}

export async function deleteGoogleCalendarEvent(calendarEventId: string) {
  try {
    await calendar.events.delete({
      calendarId: "primary",
      eventId: calendarEventId,
      sendUpdates: "all",
    });
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to delete Google Calendar event:", error);
    return { success: false, error };
  }
}