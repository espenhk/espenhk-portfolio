/**
 * Guards that keep the Claude Design system «Starfleet» the single source of truth.
 * See AGENTS.md → "Design system".
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generate, PATHS, type TokensJson } from '../../scripts/build-design-tokens';
import { tokens } from '@/design-system/starfleet/tokens.generated';

const ROOT = resolve(__dirname, '../..');
const tokensJson = JSON.parse(readFileSync(PATHS.json, 'utf8')) as TokensJson;

// ---------------------------------------------------------------------------
// 1. No colour literals in components/pages
// ---------------------------------------------------------------------------

/**
 * Files allowed to contain colour literals, with the reason. Prefer an inline
 * `design-tokens:allow` comment (one line) or a
 * `design-tokens:allow-start` … `design-tokens:allow-end` block over adding a file here.
 */
const ALLOWED_FILES: Record<string, string> = {
  'src/components/3d/SectionAvatar.tsx': 'three.js material colours of the 3D animal models (artwork, not UI)',
  'src/components/ui/chart.tsx': "shadcn selectors that match recharts' default stroke attributes ([stroke='#ccc'])",
};

const COLOR_LITERAL = /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|\b(?:rgba?|hsla?)\(/;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(name) ? [p] : [];
  });
}

function findColorLiterals(source: string): { line: number; text: string }[] {
  const hits: { line: number; text: string }[] = [];
  let inBlock = false;
  source.split('\n').forEach((text, i) => {
    if (text.includes('design-tokens:allow-start')) inBlock = true;
    if (text.includes('design-tokens:allow-end')) { inBlock = false; return; }
    if (inBlock || /design-tokens:allow(?!-)/.test(text)) return;
    if (COLOR_LITERAL.test(text)) hits.push({ line: i + 1, text: text.trim() });
  });
  return hits;
}

describe('design tokens: no colour literals', () => {
  const files = ['src/components', 'src/pages'].flatMap(d => walk(join(ROOT, d)));

  it('scans the component and page trees', () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it('components and pages use var(--token), not hex/rgb/hsl', () => {
    const offenders = files
      .map(f => relative(ROOT, f).split('\\').join('/'))
      .filter(rel => !(rel in ALLOWED_FILES))
      .flatMap(rel => findColorLiterals(readFileSync(join(ROOT, rel), 'utf8')).map(h => `${rel}:${h.line}  ${h.text}`));
    expect(offenders, `Colour literals found – use a design token (see AGENTS.md):\n${offenders.join('\n')}`).toEqual([]);
  });

  it('allowlisted files still exist (keep the list honest)', () => {
    for (const f of Object.keys(ALLOWED_FILES)) expect(statSync(join(ROOT, f)).isFile()).toBe(true);
  });

  it('detector catches the usual forms', () => {
    expect(findColorLiterals("color: '#FF9F1C'")).toHaveLength(1);
    expect(findColorLiterals("background: 'rgba(255,159,28,0.1)'")).toHaveLength(1);
    expect(findColorLiterals('`${c.accent}25` hsl(20 10% 5%)')).toHaveLength(1);
    expect(findColorLiterals("href='#projects' &#123;")).toHaveLength(0);
    expect(findColorLiterals("x: '#fff', // design-tokens:allow data")).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// 2. Generated files match tokens.json
// ---------------------------------------------------------------------------

describe('design tokens: generated files are in sync', () => {
  const { css, ts } = generate(tokensJson);

  it('tokens.css matches `bun run tokens` output', () => {
    expect(readFileSync(PATHS.css, 'utf8'), 'tokens.css is stale or hand-edited – run `bun run tokens`').toBe(css);
  });

  it('tokens.generated.ts matches `bun run tokens` output', () => {
    expect(readFileSync(PATHS.ts, 'utf8'), 'tokens.generated.ts is stale or hand-edited – run `bun run tokens`').toBe(ts);
  });

  it('generator rejects unknown aliases, duplicates and invalid values', () => {
    const base = structuredClone(tokensJson);
    const withTokens = (extra: { name: string; value: unknown }[]) => {
      const j = structuredClone(base);
      j.color.tokens.push(...(extra as TokensJson['color']['tokens']));
      return j;
    };
    expect(() => generate(withTokens([{ name: 'x', value: '{does-not-exist}' }]))).toThrow(/unknown alias/);
    expect(() => generate(withTokens([{ name: 'accent', value: '#000000' }]))).toThrow(/duplicate/);
    expect(() => generate(withTokens([{ name: 'x', value: 'banana' }]))).toThrow(/invalid color/);
    expect(() => generate(withTokens([{ name: 'x', value: { light: '#fff', sepia: '#000' } }]))).toThrow(/unknown theme/);
  });
});

// ---------------------------------------------------------------------------
// 3. Contrast of -ink tokens in light mode (WCAG 2.x)
// ---------------------------------------------------------------------------

type RGBA = [number, number, number, number];

function parseColor(value: string): RGBA {
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

const over = (fg: RGBA, bg: RGBA): RGBA => {
  const a = fg[3];
  return [0, 1, 2].map(i => fg[i] * a + bg[i] * (1 - a)).concat(1) as RGBA;
};

const luminance = ([r, g, b]: RGBA) => {
  const ch = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
};

const contrast = (a: RGBA, b: RGBA) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

describe('design tokens: -ink contrast in light mode', () => {
  const light = tokens.color.light as Record<string, string>;
  const background = parseColor(light.background);
  const surface = parseColor(light.surface);
  const inks = Object.keys(light).filter(n => n.endsWith('-ink'));

  it('has -ink tokens to check', () => {
    expect(inks).toEqual(expect.arrayContaining(['accent-ink', 'secondary-ink', 'tertiary-ink', 'highlight-ink']));
  });

  it.each(inks)('%s ≥ 4.5:1 against background and surface (or its own -bg)', name => {
    // An ink with a dedicated `<prefix>-bg` token (cta-ink → cta-bg, job-tag-ink → job-tag-bg)
    // sits on that surface, which itself sits on background/surface.
    const ownBg = light[name.replace(/-ink$/, '-bg')];
    const grounds = [background, surface].map(g => (ownBg ? over(parseColor(ownBg), g) : g));
    for (const g of grounds) {
      const ratio = contrast(over(parseColor(light[name]), g), g);
      expect(ratio, `${name} ${light[name]} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
