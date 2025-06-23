// npx tsx src/lib/fetchTracks.ts para correrlo
// es un script para poblar src/content/canciones
// la idea es que Astro las convierta en contenido estatico con ssg

import "dotenv/config";
import fs from "fs";
import path from "path";
import { getTopTracksFromArtist } from "./spotify";

const ARTISTS = [
  { name: "The Weeknd", id: "1Xyo4u8uXC1ZmMpatF05PJ" },
  { name: "Taylor Swift", id: "06HL4z0CvFAxyc27GXpf02" },
  { name: "Coldplay", id: "4gzpq5DPGxSnKTe4SA8HAU" },
  { name: "Lana Del Rey", id: "00FQb4jTyendYWaN8pK0wa" },
  { name: "Billie Eilish", id: "6qqNVTkY8uBg9cP3Jd7DAH" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

async function main() {
  const baseDir = path.join("src/content/canciones");
  fs.mkdirSync(baseDir, { recursive: true });

  for (const artist of ARTISTS) {
    const tracks = await getTopTracksFromArtist(artist.id);

    for (const track of tracks) {
      const artistSlug = slugify(artist.name);
      const trackSlug = slugify(track.name);
      const fullSlug = `${artistSlug}-${trackSlug}`; // slug plano y único

      const filePath = path.join(baseDir, `${fullSlug}.md`);
      const content = `---
id: "${track.id}"
name: "${track.name.replace(/"/g, '\\"')}"
artist: "${artist.name.replace(/"/g, '\\"')}"
image: "${track.album.images[0].url}"
preview_url: ${track.preview_url ? `"${track.preview_url}"` : null}
---
`;
      fs.writeFileSync(filePath, content);
      console.log(`Saved ${filePath}`);
    }
  }
}

main();
