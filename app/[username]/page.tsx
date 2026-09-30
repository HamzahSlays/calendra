import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;

  const user = await db.user.findUnique({
    where: { username },
    include: {
      eventTypes: {
        where: { isActive: true },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#070d18] text-white py-16 px-6">
      <div className="mx-auto max-w-3xl">
        {/* Profile Header */}
        <div className="text-center">
          {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt={user.name || "User"}
              className="mx-auto h-24 w-24 rounded-full border-2 border-slate-700 object-cover shadow-lg"
            />
          )}
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
            {user.name}
          </h1>
          <p className="mt-1 text-slate-400">@{user.username}</p>
          <p className="mt-3 text-sm text-slate-400 max-w-md mx-auto">
            Welcome to my scheduling page. Please choose an event below to book a time on my calendar.
          </p>
        </div>

        {/* Event Types List */}
        <div className="mt-12 space-y-4">
          <h2 className="text-lg font-semibold text-slate-200">
            Available Events ({user.eventTypes.length})
          </h2>

          {user.eventTypes.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-[#0d1726] p-8 text-center text-slate-400">
              No active events found. Create or activate an event type in your dashboard.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {user.eventTypes.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0d1726] p-6 shadow-sm transition hover:border-slate-700"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                      {event.description || "No description provided."}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="h-4 w-4 text-[#0069ff]" />
                      <span>{event.duration} mins</span>
                    </div>
                  </div>

                  <Link
                    href={`/${user.username}/${event.slug}`}
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#0069ff] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0057d6]"
                  >
                    Select Time
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}