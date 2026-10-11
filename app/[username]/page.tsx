import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Calendar, ChevronRight, Video, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle"; // Using your existing ThemeToggle component

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;

  const user = await db.user.findUnique({
    where: { username },
    include: {
      eventTypes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) notFound();

  const userInitial = (user.name || username)[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[#fbfcfe] text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* Top minimal nav for guest theme toggle */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0069ff] text-base font-black text-white shadow-md shadow-blue-500/25">
              C
            </span>
            <span className="text-lg font-extrabold tracking-tight text-[#0b3558] dark:text-white">
              Calendra
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Host Profile Header Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/90 sm:p-10">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Host Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#0069ff] to-blue-400 text-3xl font-extrabold text-white shadow-xl shadow-blue-500/20">
              {userInitial}
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-[#0069ff] dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Verified Host</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b3558] dark:text-white">
                {user.name || username}
              </h1>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl">
                Welcome to my scheduling page. Select a meeting type below to view available slots and schedule a session directly on my calendar.
              </p>
            </div>
          </div>
        </div>

        {/* Event Types Section */}
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select an Event Type
            </h2>
            <span className="text-xs font-medium text-slate-400">
              {user.eventTypes.length} {user.eventTypes.length === 1 ? "Option" : "Options"} available
            </span>
          </div>

          {user.eventTypes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <Calendar className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                No active event types
              </p>
              <p className="text-xs text-slate-400">
                This host hasn&apos;t published any public event booking types yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {user.eventTypes.map((et) => (
                <Link
                  key={et.id}
                  href={`/${username}/${et.slug}`}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#0069ff] hover:shadow-lg hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-[#0069ff]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-[#0b3558] transition-colors group-hover:text-[#0069ff] dark:text-white dark:group-hover:text-blue-400">
                        {et.title}
                      </h3>
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#0069ff] transition-transform group-hover:translate-x-0.5 dark:bg-blue-950/60 dark:text-blue-400">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>

                    {et.description && (
                      <p className="mt-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {et.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800/80">
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                      <Clock className="h-3.5 w-3.5 text-[#0069ff] dark:text-blue-400" />
                      {et.duration} mins
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <Video className="h-3.5 w-3.5" />
                      Google Meet
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}