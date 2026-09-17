"use client";

import { useState } from "react";
import { cancelBookingById } from "@/actions/cancelBooking";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface BookingItem {
  id: string;
  customerName: string;
  customerEmail: string;
  customerNotes: string | null;
  startTime: Date;
  endTime: Date;
  eventType: {
    title: string;
    duration: number;
  };
}

interface UpcomingMeetingsListProps {
  bookings: BookingItem[];
}

export default function UpcomingMeetingsList({ bookings }: UpcomingMeetingsListProps) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);
    try {
      const res = await cancelBookingById(bookingId);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Failed to cancel booking.");
      }
    } catch {
      alert("An unexpected error occurred.");
    } finally {
      setCancellingId(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-gray-900/40 border border-dashed border-gray-800 rounded-xl p-8 text-center">
        <p className="text-gray-400 text-sm">No meetings scheduled yet.</p>
        <p className="text-xs text-gray-500 mt-1">
          Share your public booking link to start accepting appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const start = new Date(booking.startTime);
        const dateFormatted = start.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        const timeFormatted = start.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        const isCancelling = cancellingId === booking.id;

        return (
          <div
            key={booking.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800/60 rounded-md font-medium">
                  {booking.eventType.title}
                </span>
                <span className="text-xs text-gray-500">{booking.eventType.duration} mins</span>
              </div>
              <h3 className="font-semibold text-white mt-1">{booking.customerName}</h3>
              <p className="text-xs text-gray-400">{booking.customerEmail}</p>
              {booking.customerNotes && (
                <p className="text-xs text-gray-500 mt-2 italic bg-gray-950/60 p-2 rounded border border-gray-800/80">
                  "{booking.customerNotes}"
                </p>
              )}
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center sm:border-l sm:border-gray-800 sm:pl-6 shrink-0 gap-3">
              <div className="text-left sm:text-right">
                <p className="text-sm font-semibold text-purple-400">{timeFormatted}</p>
                <p className="text-xs text-gray-400">{dateFormatted}</p>
              </div>

              <button
                onClick={() => handleCancel(booking.id)}
                disabled={isCancelling}
                className="px-3 py-1 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-md transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isCancelling && <Loader2 className="w-3 h-3 animate-spin" />}
                {isCancelling ? "Cancelling..." : "Cancel"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}