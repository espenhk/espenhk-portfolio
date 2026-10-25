# Live Last.fm "Listening to" footer

The footer status pill will show your latest scrobbled track from Last.fm user **bgosl**, checked live in the visitor's browser.

## Getting the API key (you do this, ~2 minutes)
1. Sign in to last.fm, open https://www.last.fm/api/account/create
2. Application name: "espen.hk", description: "Portfolio now-playing". Callback URL and homepage can be left blank or set to https://espen.hk.
3. Submit and copy the **API key** (not the shared secret) and paste it in chat.

This key is read-only and public by design, so it can live in the site code — no backend function needed (keeps the "keep it simple" rule).

## Behaviour
- Shows "Listening to" (with a pulsing dot) when a track is playing right now, otherwise "Last played" with the track.
- Text: "Artist – Track", linking to the song on Last.fm; refreshes every 60 seconds.
- If Last.fm is down or the key is missing, falls back to the current manual status from the editor, so the footer never breaks.
- Username is editable in the /admin settings (next to the status fields), defaulting to bgosl.

## Technical details
- New `src/lib/lastfm.ts`: fetch `user.getrecenttracks&limit=1&format=json`, parse `@attr.nowplaying`, react-query hook with 60s refetch.
- `SiteSettings` gains optional `lastfmUser`; added to defaults, normalizeDoc and SettingsEditor.
- FooterSection uses the hook, falling back to `settings.status`.
- Small test for the response parser (now playing vs last played, empty response).
