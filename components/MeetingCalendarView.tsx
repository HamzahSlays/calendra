"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";

interface Props {
  bookings: any[];
}

export default function MeetingCalendarView({ bookings = [] }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="text-lg font-bold text-[#0b3558]">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-[#0069ff]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-[#0069ff]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="mt-4 grid grid-cols-7 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
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
            <div key={dayNumber} className="relative group flex items-center justify-center h-12">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  hasBookings
                    ? "bg-[#0069ff] text-white shadow-md shadow-blue-500/20"
                    : isToday
                    ? "text-[#0069ff] ring-4 ring-[#0069ff]/20 border border-[#0069ff] shadow-sm backdrop-blur-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {dayNumber}
              </div>

              {/* Hover Tooltip */}
              {hasBookings && (
                <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 hidden group-hover:flex flex-col rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-white shadow-xl min-w-[190px]">
                  <p className="font-bold text-blue-300">
                    {dayBookings.length} {dayBookings.length === 1 ? "Meeting" : "Meetings"}
                  </p>
                  <div className="mt-1 space-y-1.5 divide-y divide-slate-800">
                    {dayBookings.map((b) => (
                      <div key={b.id} className="pt-1.5 first:pt-0">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <User className="h-3 w-3 text-blue-400" />
                          <span className="font-medium text-white">
                            {b.customerName || b.guestName || "Guest"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>
                            {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}