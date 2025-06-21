import axios from 'axios';
import { findPreviewUrl } from './spotifyEnhanced';

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;

export async function getSpotifyToken(): Promise<string> {
  const res = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
      },
    }
  );

  return res.data.access_token;
}

export async function getTopTracksFromArtist(artistId: string): Promise<any[]> {
  const token = await getSpotifyToken();

  const res = await axios.get(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const tracks = res.data.tracks;

  const enriched = await Promise.all(
    tracks.map(async (track: any) => {
      if (!track.preview_url) {
        const fallback = await findPreviewUrl(track.name, track.artists[0]?.name ?? '');
        return { ...track, preview_url: fallback };
      }
      return track;
    })
  );

  return enriched;
}

