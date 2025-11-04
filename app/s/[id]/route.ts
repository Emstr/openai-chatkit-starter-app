import { getTalkById, getTalkSlug, getAllTalks } from "@/lib/conference";
import { redirect, notFound } from "next/navigation";

export const runtime = "nodejs";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  const { id } = await params;
  
  // Try to find the talk by ID (exact match)
  let talk = getTalkById(id);
  
  // If not found by exact ID, try to find by partial match (in case someone uses shortened ID)
  if (!talk) {
    const talks = getAllTalks();
    // Try matching the last part of UUID or a substring
    talk = talks.find((t) => 
      t.Id === id || 
      t.Id.includes(id) || 
      t.Id.replace(/-/g, '').includes(id.replace(/-/g, ''))
    );
  }
  
  if (!talk) {
    notFound();
  }
  
  // Redirect to the slug-based URL
  const slug = getTalkSlug(talk);
  redirect(`/talks/${slug}`);
}

