import { CalendarCheck, Link2, SlidersHorizontal } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    title: "Connect your calendar",
    body: "Calendra reads your Google or Outlook calendar so it never offers a time you're already busy.",
  },
  {
    icon: SlidersHorizontal,
    title: "Set your availability",
    body: "Choose working hours, meeting lengths and buffers between calls. Change them any time.",
  },
  {
    icon: Link2,
    title: "Share your link",
    body: "Send it in an email or add it to your site. Guests pick a time and it lands on both calendars.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display max-w-2xl text-3xl font-semibold tracking-tight text-[#082238] sm:text-4xl">
          Set it up once, then let the link do the work
        </h2>

        <div className="relative mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          {/* connecting line */}
          <div
            aria-hidden
            className="absolute left-6 right-6 top-6 hidden h-px bg-[#d7e3f4] md:block"
          />

          {steps.map((s, i) => (
            <div key={s.title} className="relative">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0069ff] shadow-[0_0_0_6px_#fbfcfe,0_8px_24px_-10px_rgba(11,53,88,0.3)] ring-1 ring-[#dbe7f7]">
                <s.icon className="h-5 w-5" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0b3558] text-[11px] font-semibold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-[#0b3558]">{s.title}</h3>
              <p className="mt-2 max-w-sm leading-relaxed text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}