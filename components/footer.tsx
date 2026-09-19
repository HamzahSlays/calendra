import Link from "next/link";
import { Calendar } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#pricing", label: "Pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#e9eff7] px-6 py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0069ff]">
              <Calendar className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-xl font-semibold text-[#0b3558]">Calendra</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            Scheduling that takes the back and forth out of meetings.
          </p>
        </div>

        <div className="flex gap-16">
          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-[#0b3558]">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-500 transition hover:text-[#0b3558]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-7xl text-sm text-slate-400">
        © {new Date().getFullYear()} Calendra
      </p>
    </footer>
  );
}