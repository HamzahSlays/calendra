"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Clock, Video, CheckCircle2, Calendar as CalendarIcon, ExternalLink, Loader2 } from "lucide-react";
import { createBooking } from "@/actions/createBooking";

interface Props {
  eventType: {
    id: string;
    title: string;
    description?: string | null;
    duration: number;
    slug: string;
  };
  host: {
    name: string | null;
  };
  availability?: any;
}

function BookingCalendarContent({ eventType, host }: Props) {
  const searchParams = useSearchParams();
  const dateFromQuery = searchParams.get("date");

  // Uses the date clicked from the dashboard calendar, or defaults to today
  const [selectedDate, setSelectedDate] = useState<string>(
    dateFromQuery || new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetUrl, setMeetUrl] = useState<string | null>(null);

  // Generate dynamic intervals based on duration
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const duration = eventType.duration || 30;
    const startHour = 9;
    const endHour = 17;

    let currentMinutes = startHour * 60;
    const totalEndMinutes = endHour * 60;

    while (currentMinutes + duration <= totalEndMinutes) {
      const hours24 = Math.floor(currentMinutes / 60);
      const mins = currentMinutes % 60;

      const period = hours24 >= 12 ? "PM" : "AM";
      const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
      const formattedTime = `${String(hours12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${period}`;

      slots.push(formattedTime);
      currentMinutes += duration;
    }

    return slots;
  }, [eventType.duration]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      alert("Please choose a time slot first.");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await createBooking({
        eventTypeId: eventType.id,
        guestName,
        guestEmail,
        date: selectedDate,
        time: selectedTime,
      });

      if (response?.success) {
        if (response.meetLink) {
          setMeetUrl(response.meetLink);
        }
        setIsConfirmed(true);
      }
    } catch (err: any) {
      console.error("Booking failed:", err);
      alert(`Booking could not be created: ${err?.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 shadow-sm dark:bg-emerald-950/40 dark:text-emerald-400">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#0b3558] dark:text-white">
          Booking Confirmed!
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          You are scheduled with <strong className="text-slate-800 dark:text-slate-200">{host.name}</strong> for{" "}
          <strong className="text-slate-800 dark:text-slate-200">{eventType.title}</strong>.
        </p>

        <div className="mt-6 flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 text-xs font-semibold text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
          <div className="flex items-center justify-center gap-2">
            <CalendarIcon className="h-3.5 w-3.5 text-[#0069ff]" />
            <span>{selectedDate}</span>
            <span>•</span>
            <span>{selectedTime}</span>
          </div>
          {meetUrl && (
            <a
              href={meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0069ff] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#0057d6]"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Join Google Meet</span>
              <ExternalLink className="h-3 w-3 opacity-75" />
            </a>
          )}
        </div>

        <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">
          A confirmation email with calendar invitation details has been sent to {guestEmail}.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 md:flex-row">
      {/* Left Column: Event Details */}
      <div className="border-b border-slate-100 p-8 dark:border-slate-800 md:w-5/12 md:border-b-0 md:border-r">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {host.name}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0b3558] dark:text-white">
          {eventType.title}
        </h1>

        <div className="mt-6 space-y-3 text-sm font-medium text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#0069ff] dark:bg-blue-950/40 dark:text-blue-400">
              <Clock className="h-4 w-4" />
            </span>
            <span>{eventType.duration} minutes</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#0069ff] dark:bg-blue-950/40 dark:text-blue-400">
              <Video className="h-4 w-4" />
            </span>
            <span>Web conferencing details provided upon confirmation</span>
          </div>
        </div>

        {eventType.description && (
          <p className="mt-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {eventType.description}
          </p>
        )}
      </div>

      {/* Right Column: Interactive Form */}
      <div className="flex flex-1 flex-col gap-6 p-8 sm:flex-row">
        <div className="flex-1">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Select Date
          </h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 transition focus:border-[#0069ff] focus:outline-none focus:ring-2 focus:ring-[#0069ff]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          {selectedTime && (
            <form onSubmit={handleBooking} className="mt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Your Details
              </h3>
              <input
                type="text"
                required
                placeholder="Your Name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-[#0069ff] focus:outline-none focus:ring-2 focus:ring-[#0069ff]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
              <input
                type="email"
                required
                placeholder="Your Email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-[#0069ff] focus:outline-none focus:ring-2 focus:ring-[#0069ff]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0069ff] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0057d6] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Confirming booking...</span>
                  </>
                ) : (
                  <span>Confirm Booking</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Dynamic Interval Slots */}
        <div className="flex flex-col sm:w-44">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Select Time
          </h2>
          <div className="max-h-[340px] flex-1 space-y-2 overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`w-full rounded-xl border py-2.5 text-xs font-semibold transition ${
                    isSelected
                      ? "border-[#0069ff] bg-[#0069ff] text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-[#0069ff] hover:text-[#0069ff] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[#0069ff]"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Next.js requires components accessing useSearchParams() to be wrapped in a Suspense boundary
export default function BookingCalendar(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex h-96 max-w-4xl items-center justify-center rounded-3xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-[#0069ff]" />
        </div>
      }
    >
      <BookingCalendarContent {...props} />
    </Suspense>
  );
}