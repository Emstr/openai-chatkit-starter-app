import { notFound } from "next/navigation";
import { getSpeakerBySlug, getTalksBySpeaker, getTalkSlug } from "@/lib/conference";
import Link from "next/link";
import Image from "next/image";

// Allow dynamic speaker slugs and ContactIds
export const dynamicParams = true;

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/speakers" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to all speakers
      </Link>
      
      <article className="mt-8">
        <div className="flex items-start gap-6 mb-6">
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
            <h1 className="text-4xl font-bold mb-2">{speaker.DisplayName}</h1>
            {speaker.Position && speaker.Organization && (
              <p className="text-xl text-gray-600 mb-4">
                {speaker.Position} • {speaker.Organization}
              </p>
            )}
            {(speaker.SocialMedia.FullTwitterHandle || speaker.SocialMedia.FullLinkedInUrl) && (
              <div className="flex gap-4">
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

        {(speaker.Bio || speaker.PresentationBio) && (
          <div className="prose max-w-none mb-8">
            {speaker.Bio && (
              <div 
                className="text-lg text-gray-700"
                dangerouslySetInnerHTML={{ __html: speaker.Bio }}
              />
            )}
            {speaker.PresentationBio && !speaker.Bio && (
              <div 
                className="text-lg text-gray-700"
                dangerouslySetInnerHTML={{ __html: speaker.PresentationBio }}
              />
            )}
          </div>
        )}

        {speakerTalks.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h2 className="text-2xl font-bold mb-4">Talks</h2>
            <ul className="space-y-4">
              {speakerTalks.map((talk) => (
                <li key={talk.Id}>
                  <Link
                    href={`/talks/${getTalkSlug(talk)}`}
                    className="text-xl text-blue-600 hover:underline"
                  >
                    {talk.Name}
                  </Link>
                  {talk.Location && (
                    <span className="text-gray-500 ml-2">• {talk.Location}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
}

