"use client";

import { use, useState } from "react";
import { cancelBooking } from "@/actions/cancelBooking";
import { CheckCircle2, AlertCircle, CalendarX2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CancelBookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCancel = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await cancelBooking(token);
      if (res.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Failed to cancel the booking.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm text-center">
        {status === "idle" && (
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-full">
              <CalendarX2 className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-semibold">Cancel Booking</h1>
            <p className="text-sm text-slate-400">
              Are you sure you want to cancel this scheduled meeting? This action removes the event from Google Calendar and cannot be undone.
            </p>
            <div className="flex gap-3 w-full mt-4">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-semibold">Booking Cancelled</h1>
            <p className="text-sm text-slate-400">
              Your appointment has been successfully cancelled and removed from the calendar.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-full">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-semibold">Unable to Cancel</h1>
            <p className="text-sm text-slate-400">{errorMessage}</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-2 text-xs text-indigo-400 hover:underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}