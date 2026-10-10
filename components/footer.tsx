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
    <footer className="border-t border-slate-200/80 bg-white px-6 py-14 transition-colors dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:flex-row sm:justify-between">
        {/* Brand Section */}
        <div className="max-w-xs">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0069ff] shadow-sm shadow-blue-500/20 transition-transform group-hover:scale-105">
              <Calendar className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-[#0b3558] dark:text-white">
              Calendra
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Scheduling that takes the back and forth out of meetings.
          </p>
        </div>

        {/* Navigation Columns */}
        <div className="flex gap-16">
          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {c.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm font-medium text-slate-600 transition-colors hover:text-[#0069ff] dark:text-slate-400 dark:hover:text-blue-400"
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

      {/* Bottom Bar */}
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 dark:border-slate-900 sm:flex-row">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} Calendra. All rights reserved.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Built for seamless scheduling.
        </p>
      </div>
    </footer>
  );
}