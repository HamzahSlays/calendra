import { Bell, Check } from "lucide-react";

const week = [
  { day: "Mon", hours: "9:00 AM – 5:00 PM", on: true },
  { day: "Tue", hours: "9:00 AM – 5:00 PM", on: true },
  { day: "Wed", hours: "10:00 AM – 4:00 PM", on: true },
  { day: "Thu", hours: "9:00 AM – 5:00 PM", on: true },
  { day: "Fri", hours: "9:00 AM – 1:00 PM", on: true },
  { day: "Sat", hours: "Unavailable", on: false },
];

const calendars = ["Google Calendar", "Outlook", "iCloud"];

const reminders = [
  "Email reminder, 24 hours before",
  "Reminder, 1 hour before",
  "Thank-you note, after the call",
];

const team = [
  { i: "A", c: "bg-[#ffd9c7] text-[#9a3f16]" },
  { i: "M", c: "bg-[#cfe6ff] text-[#0b4fa8]" },
  { i: "S", c: "bg-[#d6f3e3] text-[#177046]" },
  { i: "R", c: "bg-[#e6dcff] text-[#5a3fb0]" },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display max-w-2xl text-3xl font-semibold tracking-tight text-[#082238] sm:text-4xl">
          Everything around the meeting, handled
        </h2>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          From the moment someone opens your link to the follow-up after the call.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {/* Availability */}
          <div className="rounded-[32px] bg-[#eaf3ff] p-8 lg:col-span-2">
            <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#0b3558]">
                  Availability that follows your week
                </h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Set different hours for each day, add buffers, and cap how many
                  meetings you take. Guests only see what works for you.
                </p>
              </div>
              <ul className="space-y-2 rounded-3xl bg-white/80 p-4">
                {week.map((w) => (
                  <li key={w.day} className="flex items-center gap-3 text-sm">
                    <span className="w-9 font-semibold text-[#0b3558]">{w.day}</span>
                    <span
                      className={`flex-1 rounded-full px-3 py-1.5 ${
                        w.on ? "bg-[#eaf3ff] text-[#0b3558]" : "bg-[#f3f5f8] text-slate-400"
                      }`}
                    >
                      {w.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Calendar sync */}
          <div className="rounded-[24px] border border-[#e3ebf7] bg-white p-8">
            <h3 className="font-display text-2xl font-semibold text-[#0b3558]">
              Calendar sync
            </h3>
            <p className="mt-3 leading-relaxed text-slate-600">
              Busy times are blocked automatically, and new bookings appear on your
              calendar right away.
            </p>
            <ul className="mt-6 space-y-2">
              {calendars.map((c) => (
                <li
                  key={c}
                  className="flex items-center justify-between rounded-2xl bg-[#f6f9fe] px-4 py-3 text-sm font-medium text-[#0b3558]"
                >
                  {c}
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#dff5e8] text-[#178a52]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reminders */}
          <div className="rounded-[24px] border border-[#e3ebf7] bg-white p-8">
            <h3 className="font-display text-2xl font-semibold text-[#0b3558]">
              Fewer no-shows
            </h3>
            <p className="mt-3 leading-relaxed text-slate-600">
              Reminders go out on their own, before and after every meeting.
            </p>
            <ol className="relative mt-6 space-y-4 border-l border-[#dbe7f7] pl-6">
              {reminders.map((r) => (
                <li key={r} className="relative text-sm text-[#0b3558]">
                  <span className="absolute -left-[33px] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#eaf3ff] text-[#0069ff] ring-4 ring-white">
                    <Bell className="h-3 w-3" />
                  </span>
                  {r}
                </li>
              ))}
            </ol>
          </div>

          {/* Team */}
          <div className="rounded-[32px] bg-[#f0edff] p-8 lg:col-span-2">
            <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#0b3558]">
                  Scheduling for teams
                </h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Rotate meetings between teammates, or let guests choose anyone
                  who&apos;s free. One link covers everyone.
                </p>
              </div>
              <div className="rounded-3xl bg-white/80 p-6">
                <div className="flex -space-x-3">
                  {team.map((t) => (
                    <span
                      key={t.i}
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold ring-4 ring-white ${t.c}`}
                    >
                      {t.i}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm font-medium text-[#0b3558]">
                  Next meeting goes to Ana
                </p>
                <p className="mt-1 text-sm text-slate-500">Round robin, 4 teammates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}