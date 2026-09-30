"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Trash2, ExternalLink } from "lucide-react";
import { deleteEventType } from "@/actions/events";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string | null;
    duration: number;
    slug: string;
  };
  username: string | null;
}

export default function EventCard({ event, username }: EventCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;
    setIsDeleting(true);
    try {
      await deleteEventType(event.id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
      setIsDeleting(false);
    }
  };

  const bookingHref = username ? `/${username}/${event.slug}` : "#";

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-base font-bold text-[#0b3558]">{event.title}</h4>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            type="button"
            title="Delete Event Type"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
          {event.description || "No description provided."}
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Clock className="h-3.5 w-3.5 text-[#0069ff]" />
          <span>{event.duration} mins</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        {username ? (
          <Link
            href={bookingHref}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0069ff] hover:underline"
          >
            Preview Booking Page <ExternalLink className="h-3 w-3" />
          </Link>
        ) : (
          <span className="text-xs text-slate-400">Set username to preview</span>
        )}
      </div>
    </div>
  );
}