"use client";

import { useState } from "react";
import { DayOfWeek } from "@prisma/client";
import { updateAvailability, DaySchedule } from "@/actions/availability";

const DAYS: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

interface AvailabilityFormProps {
  initialData: {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
  }[];
}

export default function AvailabilityForm({ initialData }: AvailabilityFormProps) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(() => {
    return DAYS.map((day) => {
      const existing = initialData.find((item) => item.day === day);
      return {
        day,
        isAvailable: !!existing,
        startTime: existing?.startTime || "09:00",
        endTime: existing?.endTime || "17:00",
      };
    });
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleToggle = (index: number) => {
    const updated = [...schedule];
    updated[index].isAvailable = !updated[index].isAvailable;
    setSchedule(updated);
  };

  const handleTimeChange = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateAvailability(schedule);
      setMessage("Availability saved successfully!");
    } catch {
      setMessage("Failed to save availability.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {schedule.map((item, index) => (
        <div
          key={item.day}
          className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl"
        >
          <div className="flex items-center gap-3 w-36">
            <input
              type="checkbox"
              id={`day-${item.day}`}
              checked={item.isAvailable}
              onChange={() => handleToggle(index)}
              className="w-4 h-4 rounded text-purple-600 bg-gray-950 border-gray-700"
            />
            <label
              htmlFor={`day-${item.day}`}
              className={`text-sm font-medium ${
                item.isAvailable ? "text-white" : "text-gray-500"
              }`}
            >
              {item.day.charAt(0) + item.day.slice(1).toLowerCase()}
            </label>
          </div>

          {item.isAvailable ? (
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={item.startTime}
                onChange={(e) =>
                  handleTimeChange(index, "startTime", e.target.value)
                }
                className="bg-gray-950 border border-gray-800 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none"
              />
              <span className="text-gray-500 text-sm">to</span>
              <input
                type="time"
                value={item.endTime}
                onChange={(e) =>
                  handleTimeChange(index, "endTime", e.target.value)
                }
                className="bg-gray-950 border border-gray-800 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none"
              />
            </div>
          ) : (
            <span className="text-sm text-gray-500 italic">Unavailable</span>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between pt-4">
        {message && (
          <p
            className={`text-sm ${
              message.includes("success") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="ml-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition"
        >
          {loading ? "Saving..." : "Save Schedule"}
        </button>
      </div>
    </form>
  );
}