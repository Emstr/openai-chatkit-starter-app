"use client";

import { useState, useMemo } from "react";
import { getAllSpeakers, getSpeakerSlug, getSpeakerSpeakingDates } from "@/lib/conference";
import Link from "next/link";
import Image from "next/image";

// Helper to format date nicely
function formatDateShort(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
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

export default function SpeakersPage() {
  const [selectedDay, setSelectedDay] = useState<DayFilter>("all");
  
  // Memoize speakers list to avoid recalculating on every render
  const allSpeakers = useMemo(() => getAllSpeakers(), []);

  // Filter speakers based on selected day
  const filteredSpeakers = useMemo(() => {
    if (selectedDay === "all") {
      return allSpeakers;
    }

    return allSpeakers.filter((speaker) => {
      const speakingDates = getSpeakerSpeakingDates(speaker.DisplayName);
      return speakingDates.some((date) => getWeekday(date) === selectedDay);
    });
  }, [allSpeakers, selectedDay]);

  return (
    <div className="min-h-screen">
      {/* Colored header section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 py-32 mb-8">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
            <div>
              <h1 className="text-4xl font-bold text-white">FAAA Speakers</h1>
              <p className="text-white/90 text-lg mt-2">Meet the experts sharing their insights</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/talks"
                className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-colors text-white font-medium"
              >
                View Talks
              </Link>
              <Link
                href="/agenda"
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md font-medium"
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
            {filteredSpeakers.length} speaker{filteredSpeakers.length !== 1 ? "s" : ""} on {selectedDay}
          </span>
        )}
      </div>
      
      {filteredSpeakers.length === 0 ? (
        <p className="text-gray-600">
          {selectedDay === "all" 
            ? "No speakers available yet." 
            : `No speakers found for ${selectedDay}.`}
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredSpeakers.map((speaker, index) => {
            const speakingDates = getSpeakerSpeakingDates(speaker.DisplayName);
            
            return (
              <Link
                key={speaker.DisplayName || `speaker-${index}`}
                href={`/speakers/${getSpeakerSlug(speaker)}`}
                className="group relative block bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/30 rounded-2xl" />
                
                <div className="relative p-6">
                  {/* Photo container with enhanced styling */}
                  <div className="mb-5 flex justify-center">
                    {speaker.PhotoUrl ? (
                      <div className="relative w-40 h-40 overflow-hidden rounded-full border-4 border-white">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                        <Image
                          src={speaker.PhotoUrl}
                          alt={speaker.DisplayName}
                          width={160}
                          height={160}
                          className="w-full h-full object-cover scale-125 group-hover:scale-[1.3] transition-transform duration-300 relative z-10"
                        />
                      </div>
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-200 to-gray-300">
                        <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <h2 className="!text-lg md:!text-xl font-bold mb-2 text-gray-900">
                    {speaker.DisplayName}
                  </h2>

                  {/* Position & Organization */}
                  {speaker.Position && speaker.Organization && (
                    <p className="text-gray-600">
                      {speaker.Position}
                      <span className="mx-2 text-gray-400">•</span>
                      {speaker.Organization}
                    </p>
                  )}

                  {/* Speaking Dates */}
                  {speakingDates.length > 0 && (
                    <div className="mt-6 mb-4 flex flex-wrap items-center justify-start gap-2">
                      {speakingDates.map((date) => (
                        <span
                          key={date}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDateShort(date)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}

