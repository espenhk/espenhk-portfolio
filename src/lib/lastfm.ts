import { useQuery } from '@tanstack/react-query';

/** Public, read-only Last.fm API key (safe in client code). Paste yours here. */
export const LASTFM_API_KEY = 'a8a2ac2b9d472f2e94cb1f2adb97fdf3';
export const DEFAULT_LASTFM_USER = 'bgosl';

export interface LastTrack {
  artist: string;
  name: string;
  url: string;
  nowPlaying: boolean;
}

/** Parse a user.getrecenttracks JSON response into the latest track, or null. */
export function parseRecentTracks(json: any): LastTrack | null {
  const raw = json?.recenttracks?.track;
  const t = Array.isArray(raw) ? raw[0] : raw;
  if (!t || !t.name) return null;
  return {
    artist: t.artist?.['#text'] ?? t.artist?.name ?? '',
    name: t.name,
    url: t.url ?? '',
    nowPlaying: t['@attr']?.nowplaying === 'true',
  };
}

export function useLastTrack(user?: string) {
  const u = (user || DEFAULT_LASTFM_USER).trim();
  return useQuery({
    queryKey: ['lastfm', u],
    enabled: !!LASTFM_API_KEY && !!u,
    refetchInterval: 60_000,
    retry: 1,
    queryFn: async () => {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(u)}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Last.fm ${res.status}`);
      return parseRecentTracks(await res.json());
    },
  });
}
