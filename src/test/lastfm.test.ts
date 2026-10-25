import { describe, it, expect } from 'vitest';
import { parseRecentTracks } from '@/lib/lastfm';

describe('parseRecentTracks', () => {
  it('detects now playing', () => {
    const r = parseRecentTracks({ recenttracks: { track: [{ name: 'One More Time', artist: { '#text': 'Daft Punk' }, url: 'u', '@attr': { nowplaying: 'true' } }] } });
    expect(r).toEqual({ artist: 'Daft Punk', name: 'One More Time', url: 'u', nowPlaying: true });
  });
  it('last played when not playing', () => {
    const r = parseRecentTracks({ recenttracks: { track: [{ name: 'X', artist: { '#text': 'Y' }, url: 'u' }] } });
    expect(r?.nowPlaying).toBe(false);
  });
  it('returns null for empty', () => {
    expect(parseRecentTracks({ recenttracks: { track: [] } })).toBeNull();
  });
});
