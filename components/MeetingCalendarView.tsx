"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  CalendarPlus,
  X,
  ExternalLink,
} from "lucide-react";

interface EventTypeOption {
  id: string;
  title: string;
  slug: string;
  duration: number;
}

interface Props {
  bookings?: any[];
  eventTypes?: EventTypeOption[];
  username?: string;
}

export default function MeetingCalendarView({
  bookings = [],
  eventTypes = [],
  username = "",
}: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateModal, setSelectedDateModal] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  // Map bookings to "YYYY-MM-DD"
  const bookingsByDate: { [key: string]: any[] } = {};
  bookings.forEach((b) => {
    if (!b.startTime) return;
    const d = new Date(b.startTime);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!bookingsByDate[key]) bookingsByDate[key] = [];
    bookingsByDate[key].push(b);
  });

  const selectedDateBookings = selectedDateModal
    ? bookingsByDate[selectedDateModal] || []
    : [];

  return (
    <div className="relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-[#0b3558] dark:text-white">
            {monthNames[month]} {year}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Click any date to view meetings or schedule a slot
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-[#0069ff] dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-[#0069ff] dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="mt-4 grid grid-cols-7 text-center text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Dates Grid */}
      <div className="mt-3 grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-12" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const dayNumber = index + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
          const isToday = isCurrentMonth && today.getDate() === dayNumber;
          const dayBookings = bookingsByDate[dateStr] || [];
          const hasBookings = dayBookings.length > 0;

          return (
            <div
              key={dayNumber}
              className="group relative flex h-12 items-center justify-center"
            >
              <button
                type="button"
                onClick={() => setSelectedDateModal(dateStr)}
                className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  hasBookings
                    ? "bg-[#0069ff] text-white shadow-md shadow-blue-500/25 hover:bg-[#0057d6]"
                    : isToday
                    ? "border border-[#0069ff] text-[#0069ff] ring-4 ring-[#0069ff]/15 dark:border-blue-400 dark:text-blue-400 dark:ring-blue-400/10"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {dayNumber}
              </button>

              {/* Hover Tooltip Preview */}
              {hasBookings && (
                <div className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 hidden min-w-[200px] -translate-x-1/2 flex-col rounded-2xl bg-slate-900/95 p-3 text-xs text-white shadow-2xl backdrop-blur-md group-hover:flex dark:bg-slate-950 dark:border dark:border-slate-800">
                  <p className="font-bold text-blue-300">
                    {dayBookings.length} {dayBookings.length === 1 ? "Meeting" : "Meetings"}
                  </p>
                  <div className="mt-1.5 space-y-2 divide-y divide-slate-800">
                    {dayBookings.map((b) => (
                      <div key={b.id} className="pt-1.5 first:pt-0">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-white">
                          <User className="h-3 w-3 text-blue-400" />
                          <span>{b.customerName || b.guestName || "Guest"}</span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>
                            {new Date(b.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Date Click Modal: View Active Meetings + Book a Meeting Action */}
      {selectedDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <h4 className="text-base font-bold text-[#0b3558] dark:text-white">
                  Schedule for {selectedDateModal}
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {selectedDateBookings.length} scheduled meeting
                  {selectedDateBookings.length === 1 ? "" : "s"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDateModal(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List Existing Meetings on this day if any */}
            {selectedDateBookings.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Active Meetings
                </p>
                <div className="mt-2 max-h-36 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
                  {selectedDateBookings.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-xs dark:border-slate-800/80 dark:bg-slate-800/50"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {b.customerName || b.guestName || "Guest"}
                        </p>
                        <p className="text-[10px] text-slate-400">{b.customerEmail}</p>
                      </div>
                      <span className="font-medium text-[#0069ff] dark:text-blue-400">
                        {new Date(b.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Book a Meeting Flow: Select Event Type */}
            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Book a Meeting on this date
              </p>

              {eventTypes.length === 0 ? (
                <div className="mt-2 rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  No event types created yet. Create one from the Events tab first.
                </div>
              ) : (
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1">
                  {eventTypes.map((et) => (
                    <Link
                      key={et.id}
                      href={`/${username}/${et.slug}?date=${selectedDateModal}`}
                      onClick={() => setSelectedDateModal(null)}
                      className="group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-3 text-xs transition-all hover:border-[#0069ff] hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-850 dark:hover:border-[#0069ff] dark:hover:bg-blue-950/20"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#0069ff] dark:bg-blue-950/40 dark:text-blue-400">
                          <CalendarPlus className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {et.title}
                          </p>
                          <p className="text-[10px] text-slate-400">{et.duration} minutes</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 font-semibold text-[#0069ff] group-hover:translate-x-0.5 transition-transform">
                        Select slot
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedDateModal(null)}
              className="mt-5 w-full rounded-2xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}