import conferenceData from "../data/conference.json";

// Helper function to generate slugs
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

// Speaker interface matching the JSON structure
export interface Speaker {
  ContactId: string;
  PresenationTitle?: string | null;
  PresentationBio?: string | null;
  Title: string | null;
  FirstName: string;
  LastName: string;
  Position: string | null;
  Organization: string | null;
  PhotoUrl: string | null;
  IsPresentingAuthor: boolean;
  Order: number | null;
  Documents: unknown[] | null;
  CoAuthors: unknown[] | null;
  StartTime: string | null;
  EndTime: string | null;
  KeywordIds: unknown[] | null;
  SocialMedia: {
    TwitterHandle: string | null;
    LinkedInUrl: string | null;
    FullTwitterHandle: string;
    FullLinkedInUrl: string;
    [key: string]: unknown;
  };
  SocialMediaLinks: unknown[];
  Bio: string | null;
  Presentations: unknown[];
  DisplayName: string;
  TimeDisplay: string | null;
}

// Talk/AgendaItem interface matching the JSON structure
export interface Talk {
  Id: string;
  SessionBlockId: string | null;
  Name: string;
  IsSession: boolean;
  ShowTimes: boolean;
  Date: string;
  StartTime: string;
  EndTime: string;
  StartTimeOverride: string;
  EndTimeOverride: string;
  Details: string;
  Overview: string;
  Bold: boolean;
  Tracks: number[];
  SessionName: string | null;
  TextColor: string;
  AgendaTypeName: string;
  BackgroundColor: string;
  Location: string;
  Track: number;
  SpanToTrack: number;
  AdditionalTracks: unknown[];
  Speakers: Speaker[];
  Chairpersons: unknown[];
  Sponsors: unknown[];
  TrackHeadings: unknown[];
}

export interface ConferenceData {
  AgendaData: {
    TrackHeadings: unknown[];
    AgendaItems: Talk[];
  };
  PresentersData: {
    Speakers: Speaker[];
  };
  SponsorsData: {
    RankedSponsors: unknown[];
    ShowRankHeadings: boolean;
  };
}

export const conference = conferenceData as ConferenceData;

// Get all unique speakers - use PresentersData.Speakers for canonical source
function getAllUniqueSpeakers(): Speaker[] {
  // Return speakers from PresentersData which has the authoritative speaker list with correct ContactIds
  if (conference.PresentersData && conference.PresentersData.Speakers) {
    return conference.PresentersData.Speakers;
  }
  
  // Fallback to extracting from AgendaItems if PresentersData is not available
  const speakerMap = new Map<string, Speaker>();
  conference.AgendaData.AgendaItems.forEach((talk) => {
    talk.Speakers.forEach((speaker) => {
      const key = speaker.DisplayName || `${speaker.FirstName} ${speaker.LastName}`;
      if (!speakerMap.has(key)) {
        speakerMap.set(key, speaker);
      }
    });
  });
  
  return Array.from(speakerMap.values());
}

// Helper functions
export function getTalkBySlug(slug: string): Talk | undefined {
  return conference.AgendaData.AgendaItems.find((talk) => {
    const talkSlug = generateSlug(talk.Name);
    return talkSlug === slug || talk.Id === slug;
  });
}

export function getTalkById(id: string): Talk | undefined {
  return conference.AgendaData.AgendaItems.find((talk) => talk.Id === id);
}

export function getSpeakerBySlug(slug: string): Speaker | undefined {
  const speakers = getAllUniqueSpeakers();
  return speakers.find((speaker) => {
    const speakerSlug = generateSlug(speaker.DisplayName || `${speaker.FirstName} ${speaker.LastName}`);
    return speakerSlug === slug || speaker.ContactId === slug || speaker.DisplayName === slug;
  });
}

export function getSpeakerByName(name: string): Speaker | undefined {
  const speakers = getAllUniqueSpeakers();
  return speakers.find((speaker) => speaker.DisplayName === name);
}

export function getSpeakerById(id: string): Speaker | undefined {
  const speakers = getAllUniqueSpeakers();
  return speakers.find((speaker) => speaker.ContactId === id);
}

export function getAllTalks(): Talk[] {
  return conference.AgendaData.AgendaItems.filter((item) => item.IsSession);
}

export function getAllSpeakers(): Speaker[] {
  return getAllUniqueSpeakers();
}

export function getTalksBySpeaker(speakerName: string): Talk[] {
  return conference.AgendaData.AgendaItems.filter((talk) =>
    talk.Speakers.some((speaker) => speaker.DisplayName === speakerName)
  );
}

// Helper to get unique speaking dates for a speaker
export function getSpeakerSpeakingDates(speakerName: string): string[] {
  const talks = getTalksBySpeaker(speakerName);
  const uniqueDates = new Set<string>();
  
  talks.forEach((talk) => {
    const dateKey = talk.Date.split("T")[0]; // Extract just the date part
    if (dateKey && dateKey !== "0001-01-01") { // Filter out invalid dates
      uniqueDates.add(dateKey);
    }
  });
  
  return Array.from(uniqueDates).sort();
}

// Helper to get slug for a talk
export function getTalkSlug(talk: Talk): string {
  return generateSlug(talk.Name);
}

// Helper to get slug for a speaker
export function getSpeakerSlug(speaker: Speaker): string {
  return generateSlug(speaker.DisplayName || `${speaker.FirstName} ${speaker.LastName}`);
}

