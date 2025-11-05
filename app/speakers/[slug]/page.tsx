import { notFound } from "next/navigation";
import { getSpeakerBySlug, getTalksBySpeaker, getTalkSlug } from "@/lib/conference";
import Link from "next/link";
import Image from "next/image";

// Allow dynamic speaker slugs and ContactIds
export const dynamicParams = true;

// Helper to extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// Extract YouTube video URLs from HTML content
function extractYouTubeVideos(html: string): string[] {
  const videoIds: string[] = [];
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>.*?Watch[^<]*video[^<]*<\/a>/gi;
  
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1];
    const videoId = extractYouTubeId(url);
    if (videoId) {
      videoIds.push(videoId);
    }
  }
  
  return [...new Set(videoIds)]; // Remove duplicates
}

// Remove video links from HTML (they'll be replaced with embeds)
function removeVideoLinks(html: string): string {
  return html.replace(/<b><u><a[^>]+href=["'][^"']+["'][^>]*>.*?Watch[^<]*video[^<]*<\/a><\/u><\/b>/gi, '');
}

// Helper to format date
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
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

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SpeakerPage({ params }: PageProps) {
  const { slug } = await params;
  const speaker = getSpeakerBySlug(slug);

  if (!speaker) {
    notFound();
  }

  const speakerTalks = getTalksBySpeaker(speaker.DisplayName);
  
  // Extract YouTube videos from bio
  const bioContent = speaker.Bio || speaker.PresentationBio || "";
  const videoIds = extractYouTubeVideos(bioContent);
  const bioWithoutVideoLinks = removeVideoLinks(bioContent);

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <Link href="/speakers" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to all speakers
      </Link>
      
      <article className="mt-12">
        <div className="flex items-start gap-8 mb-8">
          {speaker.PhotoUrl && (
            <Image
              src={speaker.PhotoUrl}
              alt={speaker.DisplayName}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold mb-4">{speaker.DisplayName}</h1>
            {speaker.Position && speaker.Organization && (
              <p className="text-xl text-gray-600 mb-6">
                {speaker.Position} • {speaker.Organization}
              </p>
            )}
            {(speaker.SocialMedia.FullTwitterHandle || speaker.SocialMedia.FullLinkedInUrl) && (
              <div className="flex gap-6">
                {speaker.SocialMedia.FullTwitterHandle && (
                  <a
                    href={speaker.SocialMedia.FullTwitterHandle}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Twitter
                  </a>
                )}
                {speaker.SocialMedia.FullLinkedInUrl && (
                  <a
                    href={speaker.SocialMedia.FullLinkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {(bioWithoutVideoLinks || videoIds.length > 0) && (
          <>
            {bioWithoutVideoLinks && (
              <div className="prose prose-lg max-w-none mb-8">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: bioWithoutVideoLinks }}
                />
              </div>
            )}
            
            {videoIds.length > 0 && (
              <div className="mb-8 space-y-6">
                {videoIds.map((videoId) => (
                  <div key={videoId} className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="Speaker video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {speakerTalks.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-8">Talks</h2>
            <div className="space-y-6">
              {speakerTalks.map((talk) => (
                <Link
                  key={talk.Id}
                  href={`/talks/${getTalkSlug(talk)}`}
                  className="block group"
                >
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-3 transition-colors">
                      {talk.Name}
                    </h3>
                    
                    {/* Overview/Description */}
                    {talk.Overview && (
                      <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                        {talk.Overview.replace(/<[^>]*>/g, "")}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                      {/* Date */}
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(talk.Date)}</span>
                      </div>
                      
                      {/* Time */}
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatTimeRange(talk.StartTime, talk.EndTime)}</span>
                      </div>
                      
                      {/* Location */}
                      {talk.Location && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{talk.Location}</span>
                        </div>
                      )}
                      
                      {/* Session Type */}
                      {talk.AgendaTypeName && (
                        <div className="ml-auto">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {talk.AgendaTypeName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

