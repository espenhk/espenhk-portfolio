/**
 * WCAG contrast check for the «Starfleet» tokens, used by src/test/design-tokens.test.ts
 * and by the starfleet-design-sync skill before it publishes a change to the design system.
 *
 *   bun run tokens:contrast [path/to/tokens.json]     (default: the repo copy)
 *
 * Rules (both themes):
 *   - every `*-ink` token ≥ 4.5:1 against `background` and `surface`
 *     (an ink with its own `<prefix>-bg` token is checked on that bg, composited on background/surface)
 *   - `on-accent` ≥ 4.5:1 on `accent` and `accent-hover`
 * Exits 1 and lists failures if any pair is below its minimum.
 */
import { readFileSync } from 'node:fs';
import { PATHS, resolveTokens, type TokensJson } from './build-design-tokens';

type RGBA = [number, number, number, number];

export function parseColor(value: string): RGBA {
  const hex = /^#([0-9a-f]{3,8})$/i.exec(value);
  if (hex) {
    let h = hex[1];
    if (h.length <= 4) h = h.split('').map(c => c + c).join('');
    const n = [0, 2, 4, 6].map(i => (h.length > i ? parseInt(h.slice(i, i + 2), 16) : 255));
    return [n[0], n[1], n[2], n[3] / 255];
  }
  const rgb = /^rgba?\(([^)]+)\)$/i.exec(value);
  if (rgb) {
    const [r, g, b, a = '1'] = rgb[1].split(',').map(s => s.trim());
    return [Number(r), Number(g), Number(b), Number(a)];
  }
  throw new Error(`cannot parse colour ${value}`);
}

const over = (fg: RGBA, bg: RGBA): RGBA =>
  [0, 1, 2].map(i => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1) as RGBA;

const luminance = ([r, g, b]: RGBA) => {
  const ch = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
};

/** Contrast of `fg` (alpha composited) on an opaque `bg`. */
export function contrast(fg: string, bg: string | RGBA): number {
  const b = typeof bg === 'string' ? over(parseColor(bg), [255, 255, 255, 1]) : bg;
  const f = over(parseColor(fg), b);
  const [l1, l2] = [luminance(f), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

export interface ContrastResult {
  theme: string; token: string; on: string; fg: string; ratio: number; min: number; ok: boolean;
}

export function checkContrast(json: TokensJson): ContrastResult[] {
  const { themes, entries } = resolveTokens(json);
  const out: ContrastResult[] = [];
  for (const theme of themes) {
    const c = Object.fromEntries(entries.filter(e => e.kind === 'color').map(e => [e.name, e.raw[theme]]));
    const ground = (name: string) => over(parseColor(c[name]), [255, 255, 255, 1]);
    const push = (token: string, on: string, bg: RGBA, min: number) => {
      const ratio = contrast(c[token], bg);
      out.push({ theme, token, on, fg: c[token], ratio, min, ok: ratio >= min });
    };
    for (const ink of Object.keys(c).filter(n => n.endsWith('-ink'))) {
      const ownBg = c[ink.replace(/-ink$/, '-bg')];
      for (const g of ['background', 'surface']) {
        const bg = ownBg ? over(parseColor(ownBg), ground(g)) : ground(g);
        push(ink, ownBg ? `${ink.replace(/-ink$/, '-bg')} on ${g}` : g, bg, 4.5);
      }
    }
    if (c['on-accent']) for (const g of ['accent', 'accent-hover']) if (c[g]) push('on-accent', g, ground(g), 4.5);
  }
  return out;
}

if ((import.meta as { main?: boolean }).main) {
  const path = process.argv[2] ?? PATHS.json;
  const results = checkContrast(JSON.parse(readFileSync(path, 'utf8')) as TokensJson);
  const bad = results.filter(r => !r.ok);
  for (const r of results) {
    console.log(`${r.ok ? '✓' : '✗'} ${r.theme.padEnd(6)} ${r.token.padEnd(16)} on ${r.on.padEnd(26)} ${r.ratio.toFixed(2)}:1 (min ${r.min})`);
  }
  if (bad.length) {
    console.error(`\n${bad.length} pair(s) below minimum contrast`);
    process.exit(1);
  }
}
