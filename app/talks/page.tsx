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

export default function TalksPage() {
  const talks = getAllTalks();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Conference Talks</h1>
        <Link
          href="/agenda"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Agenda
        </Link>
      </div>
      
      {talks.length === 0 ? (
        <p className="text-gray-600">No talks available yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {talks.map((talk) => (
            <Link
              key={talk.Id}
              href={`/talks/${getTalkSlug(talk)}`}
              className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">{talk.Name}</h2>
              {talk.Speakers && talk.Speakers.length > 0 && (
                <div className="mb-2">
                  {talk.Speakers.slice(0, 2).map((speaker, idx) => (
                    <span key={speaker.DisplayName || `speaker-${idx}`} className="text-gray-600 text-sm">
                      {speaker.DisplayName}
                      {idx < Math.min(talk.Speakers.length - 1, 1) && ", "}
                    </span>
                  ))}
                  {talk.Speakers.length > 2 && (
                    <span className="text-gray-500 text-sm"> +{talk.Speakers.length - 2} more</span>
                  )}
                </div>
              )}
              {talk.Overview && (
                <p className="text-gray-500 text-sm line-clamp-3 mb-2">
                  {talk.Overview.replace(/<[^>]*>/g, "")}
                </p>
              )}
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                {talk.StartTime && (
                  <span>{formatTime(talk.StartTime)}</span>
                )}
                {talk.Location && (
                  <span>• {talk.Location}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

