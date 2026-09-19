"use client";

import { useState } from "react";
import { Bell, CalendarCheck, Check, Clock, Video } from "lucide-react";

// A static sample month (October 2026) so the demo never causes hydration mismatches.
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FIRST_DAY_OFFSET = 4; // Oct 1, 2026 falls on a Thursday
const DAYS_IN_MONTH = 31;
const BUSY_DAYS = new Set([14, 22]);
const TIMES = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];

const weekdayOf = (d: number) => (FIRST_DAY_OFFSET + d - 1) % 7;
const isOpen = (d: number) => {
  const w = weekdayOf(d);
  return d >= 5 && w !== 0 && w !== 6 && !BUSY_DAYS.has(d);
};
const isTaken = (d: number, i: number) => (d + i) % 4 === 0;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0069ff]/50";

export function BookingPreview() {
  const [day, setDay] = useState(8);
  const [time, setTime] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const label = `${WEEKDAYS[weekdayOf(day)]}, Oct ${day}`;
  const cells: (number | null)[] = [
    ...Array(FIRST_DAY_OFFSET).fill(null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];

  const pickDay = (d: number) => {
    setDay(d);
    setTime(null);
  };
  const reset = () => {
    setBooked(false);
    setTime(null);
  };

  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      {/* soft stacked card behind for depth */}
      <div
        aria-hidden
        className="absolute inset-x-6 -bottom-4 top-6 rounded-[32px] border border-white/70 bg-white/50"
      />

      <div className="relative rounded-[28px] border border-[#e3ebf7] bg-white p-6 shadow-[0_30px_80px_-30px_rgba(11,53,88,0.25)]">
        {/* Host */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#7cb4ff] to-[#0069ff] text-base font-semibold text-white">
            N
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#0b3558]">
              Intro call with Nora
            </p>
            <p className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> 30 min
              </span>
              <span className="inline-flex items-center gap-1">
                <Video className="h-3.5 w-3.5" /> Video call
              </span>
            </p>
          </div>
        </div>

        <div className="my-5 h-px bg-[#eef2f8]" />

        {booked ? (
          <div
            role="status"
            aria-live="polite"
            className="flex min-h-[380px] flex-col items-center justify-center text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e3f7ec] text-[#178a52]">
              <Check className="h-7 w-7" strokeWidth={2.5} />
            </div>
            <h3 className="font-display mt-5 text-2xl font-semibold text-[#0b3558]">
              You&apos;re booked
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {label} at {time}
            </p>

            <ul className="mt-6 w-full space-y-2 text-left text-sm text-slate-600">
              <li className="flex items-center gap-3 rounded-2xl bg-[#f3f7fd] px-4 py-3">
                <CalendarCheck className="h-4 w-4 shrink-0 text-[#0069ff]" />
                Added to both calendars
              </li>
              <li className="flex items-center gap-3 rounded-2xl bg-[#f3f7fd] px-4 py-3">
                <Bell className="h-4 w-4 shrink-0 text-[#0069ff]" />
                Reminder set for 24 hours before
              </li>
            </ul>

            <button
              onClick={reset}
              className={`mt-6 rounded-full px-4 py-2 text-sm font-semibold text-[#0069ff] transition hover:bg-[#eef5ff] ${focusRing}`}
            >
              Book another time
            </button>
          </div>
        ) : (
          <div className="min-h-[380px]">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-[#0b3558]">Pick a day</h3>
              <span className="text-sm text-slate-500">October 2026</span>
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
              {WEEKDAYS.map((w, i) => (
                <span key={i} className="pb-1 text-xs font-medium text-slate-400">
                  {w[0]}
                </span>
              ))}
              {cells.map((d, i) =>
                d === null ? (
                  <span key={`b${i}`} />
                ) : (
                  <button
                    key={d}
                    disabled={!isOpen(d)}
                    aria-pressed={d === day}
                    onClick={() => pickDay(d)}
                    className={`mx-auto h-9 w-9 rounded-full text-sm transition ${focusRing} ${
                      d === day
                        ? "bg-[#0069ff] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(0,105,255,0.7)]"
                        : isOpen(d)
                          ? "bg-[#eaf2ff] font-semibold text-[#0069ff] hover:bg-[#d8e8ff]"
                          : "cursor-default text-slate-300"
                    }`}
                  >
                    {d}
                  </button>
                ),
              )}
            </div>

            <h3 className="mb-3 mt-5 text-sm font-semibold text-[#0b3558]">
              Times for {label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {TIMES.map((t, i) => {
                const taken = isTaken(day, i);
                return (
                  <button
                    key={t}
                    disabled={taken}
                    aria-pressed={time === t}
                    onClick={() => setTime(t)}
                    className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition ${focusRing} ${
                      time === t
                        ? "border-[#0069ff] bg-[#0069ff] text-white"
                        : taken
                          ? "cursor-default border-transparent bg-[#f6f8fb] text-slate-300 line-through"
                          : "border-[#cfe0f8] text-[#0069ff] hover:border-[#0069ff] hover:bg-[#f2f8ff]"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <button
              disabled={!time}
              onClick={() => setBooked(true)}
              className={`mt-5 w-full rounded-full bg-[#0b3558] py-3 text-sm font-semibold text-white transition hover:bg-[#082238] disabled:bg-[#e6ecf4] disabled:text-slate-400 ${focusRing}`}
            >
              {time ? `Confirm ${time}` : "Choose a time"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}