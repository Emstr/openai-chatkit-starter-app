import { getAllTalks, getTalkSlug } from "@/lib/conference";
import Link from "next/link";

// Helper to format date
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

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

// Helper to format time range
function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

// Group talks by date
function groupTalksByDate(talks: ReturnType<typeof getAllTalks>) {
  const grouped = new Map<string, typeof talks>();
  
  talks.forEach((talk) => {
    const dateKey = talk.Date.split("T")[0]; // Extract just the date part
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(talk);
  });
  
  // Sort talks within each date by start time
  grouped.forEach((talksForDate) => {
    talksForDate.sort((a, b) => {
      return a.StartTime.localeCompare(b.StartTime);
    });
  });
  
  // Sort dates chronologically
  const sortedDates = Array.from(grouped.keys()).sort();
  
  return sortedDates.map((date) => ({
    date,
    talks: grouped.get(date)!,
  }));
}

export default function AgendaPage() {
  const talks = getAllTalks();
  const groupedByDate = groupTalksByDate(talks);

  if (talks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Conference Agenda</h1>
        <p className="text-gray-600">No agenda items available yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Conference Agenda</h1>
        <div className="flex gap-3">
          <Link
            href="/talks"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Talks
          </Link>
          <Link
            href="/speakers"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Speakers
          </Link>
        </div>
      </div>
      
      <div className="space-y-12">
        {groupedByDate.map(({ date, talks: dateTalks }) => (
          <div key={date} className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2">
              {formatDate(date)}
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Session</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Speakers</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {dateTalks.map((talk) => (
                    <tr
                      key={talk.Id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                        {formatTimeRange(talk.StartTime, talk.EndTime)}
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          href={`/talks/${getTalkSlug(talk)}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {talk.Name}
                        </Link>
                        {talk.Overview && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {talk.Overview.replace(/<[^>]*>/g, "")}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {talk.Speakers && talk.Speakers.length > 0 ? (
                          <div className="space-y-1">
                            {talk.Speakers.slice(0, 3).map((speaker, idx) => (
                              <div key={speaker.DisplayName || `speaker-${idx}`} className="text-sm text-gray-700">
                                {speaker.DisplayName}
                              </div>
                            ))}
                            {talk.Speakers.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{talk.Speakers.length - 3} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                        {talk.Location || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                          {talk.AgendaTypeName}
                        </span>
                        {talk.Track > 0 && (
                          <span className="ml-2 text-xs text-gray-500">
                            Track {talk.Track}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

