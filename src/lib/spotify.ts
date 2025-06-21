import axios from 'axios';

const client_id = import.meta.env.SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;

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

  const accessToken = res.data.access_token;
  return accessToken;
}

export async function getTopTracks(): Promise<any[]> {
  const token = await getSpotifyToken();

  // ID de Taylor Swift
  const artistId = '06HL4z0CvFAxyc27GXpf02';

  const res = await axios.get(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.tracks;
}
