/** Manually updated "currently vibing to" status.
 *  Update this whenever you want to change what shows in the footer widget. */
export interface CurrentStatus {
  emoji: string;
  label: string;   // e.g. "Listening to", "Reading", "Building", "Watching"
  value: string;   // e.g. "Daft Punk – Random Access Memories"
  url?: string;     // optional link
}

export const currentStatus: CurrentStatus = {
  emoji: '🎧',
  label: 'Listening to',
  value: 'Daft Punk – Random Access Memories',
  url: 'https://open.spotify.com/album/4m2880jivSbbyEGAKfITCa',
};
