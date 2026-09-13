"use client";

import { useState } from "react";
import { createEventType } from "@/actions/events";

export default function CreateEventModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await createEventType({ title, description, duration });

    if (!res.success) {
      setError(res.error || "Failed to create event");
    } else {
      setTitle("");
      setDescription("");
      setDuration(30);
      setIsOpen(false);
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition"
      >
        + Create Event Type
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Event Type</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15 Min Quick Chat"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Duration (minutes)</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value={15}>15 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Description (Optional)</label>
                <textarea
                  placeholder="Brief note about the meeting..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-sm font-medium rounded-lg disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}