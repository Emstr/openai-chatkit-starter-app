"use client";

import { useState, useMemo } from "react";
import { getAllTalks, getTalkSlug } from "@/lib/conference";
import Link from "next/link";

// Helper to format time
function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
}

// Helper to get weekday from date string
function getWeekday(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  } catch {
    return "";
  }
}

type DayFilter = "all" | "Tuesday" | "Wednesday" | "Thursday";

export default function TalksPage() {
  const [selectedDay, setSelectedDay] = useState<DayFilter>("all");
  
  // Memoize talks list to avoid recalculating on every render
  const allTalks = useMemo(() => getAllTalks(), []);

  // Filter talks based on selected day
  const filteredTalks = useMemo(() => {
    if (selectedDay === "all") {
      return allTalks;
    }

    return allTalks.filter((talk) => {
      return getWeekday(talk.Date) === selectedDay;
    });
  }, [allTalks, selectedDay]);

  return (
    <div className="min-h-screen">
      {/* Colored header section */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 py-32 mb-8">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
            <div>
              <h1 className="text-4xl font-bold text-white">FAAA Talks</h1>
              <p className="text-white/90 text-lg mt-2">Explore sessions and presentations</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/speakers"
                className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-colors text-white font-medium"
              >
                View Speakers
              </Link>
              <Link
                href="/agenda"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md font-medium"
              >
                View Agenda
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
      {/* Day Filter Navigation */}
      <div className="mb-12 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Filter by day:</span>
        {(["all", "Tuesday", "Wednesday", "Thursday"] as DayFilter[]).map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedDay === day
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100"
            }`}
          >
            {day === "all" ? "All Days" : day}
          </button>
        ))}
        {selectedDay !== "all" && (
          <span className="ml-auto text-sm text-gray-500">
            {filteredTalks.length} talk{filteredTalks.length !== 1 ? "s" : ""} on {selectedDay}
          </span>
        )}
      </div>
      
      {filteredTalks.length === 0 ? (
        <p className="text-gray-600">
          {selectedDay === "all" 
            ? "No talks available yet." 
            : `No talks found for ${selectedDay}.`}
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredTalks.map((talk) => (
            <Link
              key={talk.Id}
              href={`/talks/${getTalkSlug(talk)}`}
              className="group relative block bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/30 rounded-2xl" />
              
              <div className="relative p-6">
                {/* Title */}
                <h2 className="!text-lg md:!text-xl font-bold mb-4 text-gray-900">
                  {talk.Name}
                </h2>

                {/* Time and location */}
                <div className="flex flex-col gap-2 mt-4">
                  {talk.StartTime && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{formatTime(talk.StartTime)}</span>
                    </div>
                  )}
                  {talk.Location && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">{talk.Location}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

