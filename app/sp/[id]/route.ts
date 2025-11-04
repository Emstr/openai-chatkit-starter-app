import { getSpeakerById, getAllSpeakers, getSpeakerSlug, getSpeakerByName } from "@/lib/conference";
import { redirect, notFound } from "next/navigation";

export const runtime = "nodejs";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  context: RouteProps
) {
  const { id } = await context.params;
  
  // Try to find the speaker by ContactId (exact match)
  let speaker = getSpeakerById(id);
  
  // If not found by ContactId, try by DisplayName
  if (!speaker) {
    speaker = getSpeakerByName(id);
  }
  
  // If still not found, try partial match on ContactId or DisplayName
  if (!speaker) {
    const speakers = getAllSpeakers();
    speaker = speakers.find((s) => 
      s.ContactId.includes(id) || 
      s.ContactId.replace(/-/g, '').includes(id.replace(/-/g, '')) ||
      s.DisplayName.toLowerCase().includes(id.toLowerCase())
    );
  }
  
  if (!speaker) {
    notFound();
  }
  
  // Redirect to the slug-based URL
  const slug = getSpeakerSlug(speaker);
  return redirect(`/speakers/${slug}`);
}
