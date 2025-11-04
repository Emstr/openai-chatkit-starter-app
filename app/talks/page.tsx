"use client";

import { useState, useMemo } from "react";
import { getAllTalks, getTalkSlug } from "@/lib/conference";
import Link from "next/link";
import Image from "next/image";

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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Conference Talks</h1>
        <div className="flex gap-3">
          <Link
            href="/speakers"
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
          >
            View Speakers
          </Link>
          <Link
            href="/agenda"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            View Agenda
          </Link>
        </div>
      </div>

      {/* Day Filter Navigation */}
      <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Filter by day:</span>
        {(["all", "Tuesday", "Wednesday", "Thursday"] as DayFilter[]).map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedDay === day
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {day === "all" ? "All Days" : day}
          </button>
        ))}
        {selectedDay !== "all" && (
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {filteredTalks.length} talk{filteredTalks.length !== 1 ? "s" : ""} on {selectedDay}
          </span>
        )}
      </div>
      
      {filteredTalks.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          {selectedDay === "all" 
            ? "No talks available yet." 
            : `No talks found for ${selectedDay}.`}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTalks.map((talk) => (
            <Link
              key={talk.Id}
              href={`/talks/${getTalkSlug(talk)}`}
              className="group relative block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/30 dark:group-hover:from-blue-900/10 dark:group-hover:to-purple-900/10 transition-all duration-300 pointer-events-none" />
              
              <div className="relative">
                {/* Talk Type Badge */}
                {talk.AgendaTypeName && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {talk.AgendaTypeName}
                    </span>
                  </div>
                )}

                {/* Speaker Photos */}
                {talk.Speakers && talk.Speakers.length > 0 && (
                  <div className="mb-4 flex items-center">
                    {talk.Speakers.slice(0, 3).map((speaker, idx) => {
                      const zIndexClass = idx === 0 ? 'z-30' : idx === 1 ? 'z-20' : 'z-10';
                      return (
                        <div key={speaker.DisplayName || `speaker-photo-${idx}`} className={`relative ${zIndexClass} ${idx < Math.min(talk.Speakers.length, 3) - 1 ? '-mr-3' : ''}`}>
                          {speaker.PhotoUrl ? (
                            <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-white shadow-md group-hover:shadow-lg transition-shadow">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                              <Image
                                src={speaker.PhotoUrl}
                                alt={speaker.DisplayName}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-300 relative z-10"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shadow-md border-2 border-white">
                              <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                          {idx === 2 && talk.Speakers.length > 3 && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white text-xs font-medium z-20">
                              +{talk.Speakers.length - 3}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Title */}
                <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {talk.Name}
                </h2>

                {/* Speakers */}
                {talk.Speakers && talk.Speakers.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {talk.Speakers.slice(0, 2).map((speaker, idx) => (
                      <div key={speaker.DisplayName || `speaker-${idx}`}>
                        <div className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          {speaker.DisplayName}
                        </div>
                        {(speaker.Position || speaker.Organization) && (
                          <div className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                            {speaker.Position && speaker.Organization
                              ? `${speaker.Position} • ${speaker.Organization}`
                              : speaker.Position || speaker.Organization}
                          </div>
                        )}
                      </div>
                    ))}
                    {talk.Speakers.length > 2 && (
                      <div className="text-gray-500 dark:text-gray-400 text-sm font-medium pt-1">
                        +{talk.Speakers.length - 2} more speaker{talk.Speakers.length - 2 !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                )}

                {/* Overview */}
                {talk.Overview && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {talk.Overview.replace(/<[^>]*>/g, "")}
                  </p>
                )}

                {/* Footer with time and location */}
                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                  {talk.StartTime && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{formatTime(talk.StartTime)}</span>
                    </div>
                  )}
                  {talk.Location && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">{talk.Location}</span>
                    </div>
                  )}
                </div>

                {/* View talk indicator */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                    View talk details
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

