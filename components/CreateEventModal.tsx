"use client";

import { useState } from "react";
import { Plus, X, Clock, AlignLeft, Tag } from "lucide-react";
import { createEventType } from "@/actions/events";

export default function CreateEventModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      await createEventType(formData);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create event type.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-[#0069ff] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0057d6] active:scale-95"
      >
        <Plus className="h-4 w-4" />
        New Event Type
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-[#0b3558]">Create Event Type</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Tag className="h-3.5 w-3.5 text-slate-400" />
                  Event Title
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="e.g., 30 Min Quick Sync"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 transition focus:border-[#0069ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0069ff]/20"
                />
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Duration (minutes)
                </label>
                <select
                  name="duration"
                  defaultValue="30"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 transition focus:border-[#0069ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0069ff]/20"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <AlignLeft className="h-3.5 w-3.5 text-slate-400" />
                  Description (optional)
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="A quick one-on-one call to discuss project updates."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 transition focus:border-[#0069ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0069ff]/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#0069ff] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0057d6] disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Save Event Type"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}