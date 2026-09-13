"use client";

import { useState } from "react";
import { updateUsername } from "@/actions/users";

interface BookingUrlCardProps {
  initialUsername: string;
}

export default function BookingUrlCard({ initialUsername }: BookingUrlCardProps) {
  const [username, setUsername] = useState(initialUsername || "");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const fullUrl = `${origin}/${username}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await updateUsername(username);
    if (!res.success) {
      setError(res.error || "Failed to update username");
    } else {
      setIsEditing(false);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-lg font-semibold">Your Public Booking Link</h2>
          <p className="text-sm text-gray-400">
            Share this URL so clients can reserve slots directly on your calendar.
          </p>
        </div>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setError("");
          }}
          className="text-xs text-purple-400 hover:text-purple-300 font-medium underline cursor-pointer"
        >
          {isEditing ? "Cancel" : "Change slug"}
        </button>
      </div>

      {!isEditing ? (
        <div className="flex items-center gap-3 mt-4">
          <input
            type="text"
            readOnly
            value={fullUrl}
            className="bg-gray-950 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 w-full max-w-md focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-sm font-medium rounded-lg transition"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{origin}/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              placeholder="your-username"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-sm font-medium rounded-lg transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </form>
      )}
    </div>
  );
}