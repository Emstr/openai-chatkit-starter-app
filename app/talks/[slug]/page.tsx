import { notFound } from "next/navigation";
import { getTalkBySlug, getAllTalks, getTalkSlug, getSpeakerSlug } from "@/lib/conference";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all talks at build time
export async function generateStaticParams() {
  const talks = getAllTalks();
  return talks.map((talk) => ({
    slug: getTalkSlug(talk),
  }));
}

// Helper to format date and time
function formatDateTime(dateStr: string, startTime: string, endTime: string): string {
  try {
    const date = new Date(dateStr);
    const dateFormatted = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };
    
    return `${dateFormatted} • ${formatTime(startTime)} - ${formatTime(endTime)}`;
  } catch {
    return `${dateStr} • ${startTime} - ${endTime}`;
  }
}

export default async function TalkPage({ params }: PageProps) {
  const { slug } = await params;
  const talk = getTalkBySlug(slug);

  if (!talk) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/talks" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to all talks
      </Link>
      
      <article className="mt-8">
        <h1 className="text-4xl font-bold mb-4">{talk.Name}</h1>
        
        {talk.Speakers && talk.Speakers.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Speakers</h2>
            <div className="space-y-3">
              {talk.Speakers.map((speaker, index) => (
                <div key={speaker.DisplayName || `speaker-${index}`} className="flex items-start gap-4">
                  {speaker.PhotoUrl && (
                    <Image
                      src={speaker.PhotoUrl}
                      alt={speaker.DisplayName}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <Link 
                      href={`/speakers/${getSpeakerSlug(speaker)}`}
                      className="text-xl text-gray-700 hover:text-gray-900 font-medium"
                    >
                      {speaker.DisplayName}
                    </Link>
                    {speaker.Position && speaker.Organization && (
                      <p className="text-gray-600">{speaker.Position} • {speaker.Organization}</p>
                    )}
                    {speaker.PresentationBio && (
                      <div 
                        className="text-gray-600 mt-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: speaker.PresentationBio }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {talk.Details && (
          <div className="prose max-w-none mb-6">
            <div 
              className="text-lg text-gray-700"
              dangerouslySetInnerHTML={{ __html: talk.Details }}
            />
          </div>
        )}

        {talk.Overview && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div 
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: talk.Overview }}
            />
          </div>
        )}

        <div className="mt-8 pt-6 border-t space-y-2">
          <p className="text-gray-600">
            <strong>Date & Time:</strong> {formatDateTime(talk.Date, talk.StartTime, talk.EndTime)}
          </p>
          {talk.Location && (
            <p className="text-gray-600">
              <strong>Location:</strong> {talk.Location}
            </p>
          )}
          {talk.AgendaTypeName && (
            <p className="text-gray-600">
              <strong>Type:</strong> {talk.AgendaTypeName}
            </p>
          )}
        </div>
      </article>
    </div>
  );
}

