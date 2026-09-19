import { SignUpButton } from "@clerk/nextjs";
import { Check } from "lucide-react";

// Placeholder plans and prices: replace with your real ones.
const plans = [
  {
    name: "Free",
    price: "$0",
    note: "For one person getting started",
    features: ["One event type", "One connected calendar", "Email confirmations"],
    cta: "Start for free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$8",
    note: "per month, for busy professionals",
    features: [
      "Unlimited event types",
      "Multiple connected calendars",
      "Custom reminders and follow-ups",
      "Buffers and daily limits",
    ],
    cta: "Get Pro",
    featured: true,
  },
  {
    name: "Team",
    price: "$16",
    note: "per seat, per month",
    features: [
      "Everything in Pro",
      "Round-robin scheduling",
      "Shared event types",
      "Admin controls",
    ],
    cta: "Start with Team",
    featured: false,
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0069ff]/50";

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display max-w-2xl text-3xl font-semibold tracking-tight text-[#082238] sm:text-4xl">
          Simple pricing, free to start
        </h2>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          Upgrade when you need more. Cancel any time.
        </p>

        <div className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-[28px] p-8 ${
                p.featured
                  ? "bg-[#0b3558] text-white shadow-[0_30px_70px_-30px_rgba(11,53,88,0.7)]"
                  : "border border-[#e3ebf7] bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="font-display mt-5 text-5xl font-semibold tracking-tight">
                {p.price}
              </p>
              <p className={`mt-2 text-sm ${p.featured ? "text-[#b9cde3]" : "text-slate-500"}`}>
                {p.note}
              </p>

              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        p.featured ? "bg-white/15 text-white" : "bg-[#eaf3ff] text-[#0069ff]"
                      }`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className={p.featured ? "text-[#dce8f5]" : "text-slate-600"}>{f}</span>
                  </li>
                ))}
              </ul>

              <SignUpButton mode="modal">
                <button
                  className={`mt-8 w-full cursor-pointer rounded-full py-3 text-sm font-semibold transition ${focusRing} ${
                    p.featured
                      ? "bg-white text-[#0b3558] hover:bg-[#eaf3ff]"
                      : "bg-[#eaf3ff] text-[#0057d6] hover:bg-[#d8e8ff]"
                  }`}
                >
                  {p.cta}
                </button>
              </SignUpButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}