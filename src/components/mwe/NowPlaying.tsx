import { useTheme } from '@/context/ThemeContext';
import { useSiteSettings } from '@/cms/api';
import { useLastTrack } from '@/lib/lastfm';
import { tint } from '@/design-system/palette';

/** Live Last.fm track (or the manual status when overridden) shown as a pill. */
export default function NowPlaying() {
  const { theme, isDark, palette: p } = useTheme();
  const settings = useSiteSettings();
  const { data: track } = useLastTrack(settings.lastfmUser, !settings.statusOverride);
  const status = track && !settings.statusOverride
    ? { emoji: '🎧', label: track.nowPlaying ? 'Listening to' : 'Last played', value: `${track.artist} – ${track.name}`, url: track.url || undefined }
    : settings.status;
  const fg2 = p.fg2;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 8,
      padding: '6px 14px',
      borderRadius: theme.radii.full,
      border: `1px solid ${isDark ? tint(p.accent, 19) : p.border}`,
      background: tint(p.fg, isDark ? 3 : 2),
      fontSize: '0.75rem',
      fontFamily: theme.fonts.mono,
      color: fg2,
    }}>
      <span style={{ fontSize: '0.85rem' }}>{status.emoji}</span>
      <span style={{ opacity: 0.6 }}>{status.label}</span>
      {status.url ? (
        <a href={status.url} target="_blank" rel="noopener noreferrer" style={{ color: p.accentInk, textDecoration: 'none' }}>
          {status.value}
        </a>
      ) : (
        <span>{status.value}</span>
      )}
    </div>
  );
}
