"use client";

import { useState } from "react";
import { XCircle, Loader2 } from "lucide-react";
import { cancelBooking } from "@/actions/bookings";

interface CancelBookingButtonProps {
  bookingId: string;
  guestName: string;
}

export default function CancelBookingButton({
  bookingId,
  guestName,
}: CancelBookingButtonProps) {
  const [isCanceling, setIsCanceling] = useState(false);

  const handleCancel = async () => {
    if (
      !confirm(
        `Are you sure you want to cancel the meeting with ${guestName || "this guest"}?`
      )
    ) {
      return;
    }

    setIsCanceling(true);
    try {
      await cancelBooking(bookingId);
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
      setIsCanceling(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={isCanceling}
      title="Cancel Meeting"
      className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
    >
      {isCanceling ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      <span>{isCanceling ? "Canceling..." : "Cancel"}</span>
    </button>
  );
}