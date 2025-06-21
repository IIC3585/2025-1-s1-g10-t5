import spotifyPreviewFinder from 'spotify-preview-finder';

export async function findPreviewUrl(songName: string, artistName: string): Promise<string | null> {
  try {
    const result = await spotifyPreviewFinder(songName, artistName);

    if (result.success && result.results.length > 0) {
      const valid = result.results.find((r: any) => r.previewUrls.length > 0);
      return valid?.previewUrls[0] ?? null;
    }
  } catch (err) {
    console.error('Error buscando preview alternativo:', err);
  }

  return null;
}
