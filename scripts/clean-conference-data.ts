import fs from 'fs';
import path from 'path';

// Load the conference data
const dataPath = path.join(process.cwd(), 'data', 'conference.json');
const conferenceData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Create a map of DisplayName -> Real ContactId from PresentersData
const speakerIdMap = new Map<string, string>();

if (conferenceData.PresentersData?.Speakers) {
  conferenceData.PresentersData.Speakers.forEach((speaker: any) => {
    const displayName = speaker.DisplayName || `${speaker.FirstName} ${speaker.LastName}`;
    speakerIdMap.set(displayName, speaker.ContactId);
  });
}

console.log(`Found ${speakerIdMap.size} speakers in PresentersData`);

// Track replacements
let replacementCount = 0;
const placeholderUuid = '00000000-0000-0000-0000-000000000000';

// Update all speakers in AgendaItems
if (conferenceData.AgendaData?.AgendaItems) {
  conferenceData.AgendaData.AgendaItems.forEach((item: any) => {
    if (item.Speakers && Array.isArray(item.Speakers)) {
      item.Speakers.forEach((speaker: any) => {
        const displayName = speaker.DisplayName || `${speaker.FirstName} ${speaker.LastName}`;
        const realContactId = speakerIdMap.get(displayName);
        
        // Replace if we have a real UUID and current is placeholder
        if (realContactId && speaker.ContactId === placeholderUuid) {
          console.log(`Replacing UUID for: ${displayName}`);
          console.log(`  Old: ${speaker.ContactId}`);
          console.log(`  New: ${realContactId}`);
          speaker.ContactId = realContactId;
          replacementCount++;
        }
      });
    }
  });
}

console.log(`\nTotal replacements made: ${replacementCount}`);

// Write the cleaned data
const outputPath = path.join(process.cwd(), 'data', 'conference-clean.json');
fs.writeFileSync(outputPath, JSON.stringify(conferenceData, null, 2));

console.log(`\n✅ Cleaned data written to: ${outputPath}`);
console.log(`\nTo use this cleaned version, rename it to conference.json or update your import.`);

