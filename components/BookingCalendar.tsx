"use client";

import { useState } from "react";
import { createBooking } from "@/actions/bookings";

interface AvailabilityItem {
  day: string;
  startTime: string;
  endTime: string;
}

interface BookingCalendarProps {
  eventType: {
    id: string;
    title: string;
    duration: number;
    description: string | null;
  };
  host: {
    name: string | null;
  };
  availability: AvailabilityItem[];
}

export default function BookingCalendar({
  eventType,
  host,
  availability,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const daysMap = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  // Derive available time slots for the chosen date based on host schedule
  const getAvailableSlots = () => {
    if (!selectedDate) return [];
    const dateObj = new Date(`${selectedDate}T00:00:00`);
    const dayName = daysMap[dateObj.getDay()];
    const dayConfig = availability.find((a) => a.day === dayName);

    if (!dayConfig) return [];

    const slots: string[] = [];
    const [startH, startM] = dayConfig.startTime.split(":").map(Number);
    const [endH, endM] = dayConfig.endTime.split(":").map(Number);

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes + eventType.duration <= endMinutes) {
      const hh = String(Math.floor(currentMinutes / 60)).padStart(2, "0");
      const mm = String(currentMinutes % 60).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
      currentMinutes += eventType.duration;
    }

    return slots;
  };

  const slots = getAvailableSlots();

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedDate) return;

    setLoading(true);
    setError("");

    const startTime = new Date(`${selectedDate}T${selectedSlot}:00`);
    const endTime = new Date(startTime.getTime() + eventType.duration * 60000);

    const res = await createBooking({
      eventTypeId: eventType.id,
      customerName: name,
      customerEmail: email,
      customerNotes: notes,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });

    if (!res.success) {
      setError(res.error || "Failed to reserve slot");
    } else {
      setConfirmed(true);
    }
    setLoading(false);
  };

  if (confirmed) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-300 text-sm">
          You are scheduled with {host.name} for <strong>{eventType.title}</strong> on{" "}
          <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-4xl mx-auto">
      {/* Event Details */}
      <div className="border-b md:border-b-0 md:border-r border-gray-800 pb-6 md:pb-0 md:pr-6">
        <p className="text-purple-400 text-sm font-medium">{host.name}</p>
        <h1 className="text-2xl font-bold mt-1 mb-2">{eventType.title}</h1>
        <p className="text-gray-400 text-sm mb-4">⏱ {eventType.duration} minutes</p>
        {eventType.description && (
          <p className="text-gray-300 text-sm leading-relaxed">{eventType.description}</p>
        )}
      </div>

      {/* Date, Slot Selection & Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            Select a Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot(null);
            }}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-white focus:outline-none"
          />
        </div>

        {selectedDate && (
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">
              Select a Time Slot
            </label>
            {slots.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No available times on this date.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 text-xs rounded-lg border transition ${
                      selectedSlot === slot
                        ? "bg-purple-600 border-purple-500 text-white font-semibold"
                        : "bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-700"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedSlot && (
          <form onSubmit={handleBooking} className="space-y-3 pt-3 border-t border-gray-800">
            <div>
              <input
                type="text"
                required
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <input
                type="email"
                required
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <textarea
                rows={2}
                placeholder="Notes or meeting topic (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-xs text-white focus:outline-none"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition"
            >
              {loading ? "Confirming..." : "Confirm Booking"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}