// npx tsx src/lib/fetchTracks.ts para correrlo
// es un script para poblar src/content/canciones
// la idea es que Astro las convierta en contenido estatico con ssg

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { getTopTracks } from './spotify';

async function main() {
  const tracks = await getTopTracks();

  for (const track of tracks) {
    const slug = track.id;
    const filePath = path.join('src/content/canciones', `${slug}.md`);
    const content = `---
id: "${track.id}"
name: "${track.name.replace(/"/g, '\\"')}"
artist: "${track.artists[0].name.replace(/"/g, '\\"')}"
image: "${track.album.images[0].url}"
preview_url: ${track.preview_url ? `"${track.preview_url}"` : null}
---
`;
    fs.writeFileSync(filePath, content);
    console.log(`Saved ${filePath}`);
  }
}

main();
