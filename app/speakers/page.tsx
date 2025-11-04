import { getAllSpeakers, getSpeakerSlug } from "@/lib/conference";
import Link from "next/link";
import Image from "next/image";

export default function SpeakersPage() {
  const speakers = getAllSpeakers();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Speakers</h1>
        <div className="flex gap-3">
          <Link
            href="/talks"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Talks
          </Link>
          <Link
            href="/agenda"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Agenda
          </Link>
        </div>
      </div>
      
      {speakers.length === 0 ? (
        <p className="text-gray-600">No speakers available yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {speakers.map((speaker, index) => (
            <Link
              key={speaker.DisplayName || `speaker-${index}`}
              href={`/speakers/${getSpeakerSlug(speaker)}`}
              className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
            >
              {speaker.PhotoUrl && (
                <Image
                  src={speaker.PhotoUrl}
                  alt={speaker.DisplayName}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{speaker.DisplayName}</h2>
              {speaker.Position && speaker.Organization && (
                <p className="text-gray-600 mb-2">{speaker.Position} • {speaker.Organization}</p>
              )}
              {(speaker.Bio || speaker.PresentationBio) && (
                <p className="text-gray-500 text-sm line-clamp-3">
                  {(speaker.Bio || speaker.PresentationBio || "").replace(/<[^>]*>/g, "")}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

