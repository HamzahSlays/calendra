"use client";

import { useState, useMemo } from "react";
import { Clock, Video, CheckCircle2 } from "lucide-react";

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

export default function BookingCalendar({ eventType, host }: Props) {
  const [selectedDate, setSelectedDate] = useState<string>("2026-10-02");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamically generate time slots based on the actual duration (15m, 30m, 45m, 60m)
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const duration = eventType.duration || 30;
    const startHour = 9; // 9:00 AM
    const endHour = 17; // 5:00 PM

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
    if (!selectedTime) return;
    setIsSubmitting(true);

    try {
      // Plug into your booking action here if available
      setIsConfirmed(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-lg">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
        <h2 className="mt-4 text-2xl font-bold text-[#0b3558]">Booking Confirmed!</h2>
        <p className="mt-2 text-slate-500">
          You are scheduled with <strong className="text-slate-800">{host.name}</strong> for{" "}
          <strong className="text-slate-800">{eventType.title}</strong>.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700">
          <span>{selectedDate}</span>
          <span>•</span>
          <span>{selectedTime}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl md:flex-row">
      {/* Left Column: Event & Host Info */}
      <div className="border-b border-slate-100 p-8 md:w-5/12 md:border-b-0 md:border-r">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {host.name}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-[#0b3558]">
          {eventType.title}
        </h1>

        <div className="mt-6 space-y-3 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-[#0069ff]" />
            <span>{eventType.duration} minutes</span>
          </div>
          <div className="flex items-center gap-3">
            <Video className="h-4 w-4 text-[#0069ff]" />
            <span>Web conferencing details provided upon confirmation</span>
          </div>
        </div>

        {eventType.description && (
          <p className="mt-6 text-sm text-slate-500 leading-relaxed">
            {eventType.description}
          </p>
        )}
      </div>

      {/* Right Column: Date & Responsive Time Scroller */}
      <div className="flex flex-1 flex-col p-8 sm:flex-row gap-6">
        {/* Date & Guest Input Section */}
        <div className="flex-1">
          <h2 className="text-sm font-bold text-[#0b3558] mb-3">Select Date</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 transition focus:border-[#0069ff] focus:outline-none focus:ring-2 focus:ring-[#0069ff]/20"
          />

          {/* Guest Form (High-contrast inputs) */}
          {selectedTime && (
            <form onSubmit={handleBooking} className="mt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Details
              </h3>
              <input
                type="text"
                required
                placeholder="Your Name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0069ff] focus:outline-none focus:ring-2 focus:ring-[#0069ff]/20"
              />
              <input
                type="email"
                required
                placeholder="Your Email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0069ff] focus:outline-none focus:ring-2 focus:ring-[#0069ff]/20"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#0069ff] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0057d6] disabled:opacity-50"
              >
                {isSubmitting ? "Confirming..." : "Confirm Booking"}
              </button>
            </form>
          )}
        </div>

        {/* Dynamic Interval Time Scroller */}
        <div className="sm:w-44 flex flex-col">
          <h2 className="text-sm font-bold text-[#0b3558] mb-3">Select Time</h2>
          <div className="flex-1 max-h-[340px] overflow-y-auto pr-1 space-y-2 select-none scrollbar-thin scrollbar-thumb-slate-200">
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
                      : "border-slate-200 bg-white text-slate-700 hover:border-[#0069ff] hover:text-[#0069ff]"
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