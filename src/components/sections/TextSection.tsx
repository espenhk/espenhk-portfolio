import { useTheme } from '@/context/ThemeContext';
import { Fragment, type ReactNode } from 'react';
import type { TextData } from '@/cms/types';

/** Minimal, safe markdown: **bold**, *italic*, [link](https://…), "- " lists, blank-line paragraphs. */
function inline(text: string, color: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)/g;
  let last = 0; let m: RegExpExecArray | null; let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={k++}>{m[1]}</strong>);
    else if (m[2]) out.push(<em key={k++}>{m[2]}</em>);
    else out.push(<a key={k++} href={m[4]} target="_blank" rel="noopener noreferrer" style={{ color, textDecoration: 'underline' }}>{m[3]}</a>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function TextSection({ data, anchorId = 'text' }: { data: TextData; anchorId?: string }) {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;
  const blocks = data.body.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);

  return (
    <section
      id={anchorId}
      style={{
        padding: '60px 24px',
        backgroundImage: isDark ? 'linear-gradient(180deg, #060A18 0%, #0C1030 50%, #060A18 100%)' : undefined,
        background: isDark ? undefined : c.background.light,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isDark && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: '#99CCFF', opacity: 0.6 }} />}
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {data.heading && (
          <h2 style={{
            fontFamily: theme.fonts.display, fontSize: '1.8rem', color: fg, marginBottom: 20,
            textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center',
          }}>{data.heading}</h2>
        )}
        <div style={{ fontFamily: theme.fonts.sans, color: fg2, fontSize: '0.95rem', lineHeight: 1.7 }}>
          {blocks.map((b, i) => {
            const lines = b.split('\n');
            if (lines.every(l => /^\s*[-*] /.test(l))) {
              return <ul key={i} style={{ paddingLeft: 20, marginBottom: 14, listStyle: 'disc' }}>
                {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*] /, ''), c.accent)}</li>)}
              </ul>;
            }
            return <p key={i} style={{ marginBottom: 14 }}>
              {lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{inline(l, c.accent)}</Fragment>)}
            </p>;
          })}
        </div>
      </div>
    </section>
  );
}
