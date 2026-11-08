/**
 * Guards that keep the Claude Design system «Starfleet» the single source of truth.
 * See AGENTS.md → "Design system". CI runs this on every push (.github/workflows/ci.yml).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generate, PATHS, type TokensJson } from '../../scripts/build-design-tokens';
import { checkContrast } from '../../scripts/check-contrast';

const ROOT = resolve(__dirname, '../..');
const tokensJson = JSON.parse(readFileSync(PATHS.json, 'utf8')) as TokensJson;

// ---------------------------------------------------------------------------
// 1. No colour literals anywhere in src/
// ---------------------------------------------------------------------------

/**
 * Paths (file, or folder ending in `/`) allowed to contain colour literals, with the reason.
 * `kinds: 'tailwind'` allows only Tailwind palette classes there; hex etc. are still flagged.
 * Prefer an inline `design-tokens:allow` comment (one line) or a
 * `design-tokens:allow-start` … `design-tokens:allow-end` block over adding a path here.
 */
const ALLOWED: { path: string; reason: string; kinds?: 'tailwind' }[] = [
  { path: 'src/design-system/starfleet/', reason: 'generated from tokens.json (bun run tokens)' },
  { path: 'src/config/themes/', reason: "the other site themes' own palettes and their neutral fallbacks" },
  { path: 'src/data/languageColors.ts', reason: "GitHub's language colours (data, not design)" },
  { path: 'src/data/brandColors.ts', reason: 'third-party brand colours (data, not design)' },
  { path: 'src/test/', reason: 'tests use literals as fixtures' },
  { path: 'src/components/3d/SectionAvatar.tsx', reason: 'three.js material colours of the 3D animal models (artwork, not UI)' },
  { path: 'src/components/ui/chart.tsx', reason: "shadcn selectors that match recharts' default stroke attributes ([stroke='#ccc'])" },
  { path: 'src/components/ui/', reason: 'vendored shadcn primitives: modal scrim bg-black/80, destructive toast text-red-*', kinds: 'tailwind' },
];

const NAMED = 'white|black|red|green|blue|yellow|orange|purple|pink|gray|grey|silver|navy|teal|maroon|olive|lime|aqua|cyan|magenta|fuchsia|gold|crimson|coral|salmon|tomato|indigo|violet|brown|beige|ivory|khaki';
const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

const DETECTORS: { kind: 'literal' | 'tailwind'; label: string; re: RegExp }[] = [
  { kind: 'literal', label: 'hex colour', re: /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/ },
  { kind: 'literal', label: 'colour function', re: /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/ },
  {
    kind: 'literal',
    label: 'named colour',
    // only where a colour is expected: style/CSS properties and JSX colour props
    re: new RegExp(String.raw`\b(?:color|background|fill|stroke|border|outline|caret|accent)[\w-]*\s*[:=]\s*\{?\s*['"\x60]?[^'"\x60;]*?\b(?:${NAMED})\b`, 'i'),
  },
  {
    kind: 'tailwind',
    label: 'Tailwind palette class',
    re: new RegExp(String.raw`(?<![\w-])(?:[\w-]+:)*(?:text|bg|border|ring|fill|stroke|from|via|to|outline|divide|placeholder|caret|accent|decoration|shadow)-(?:white|black|(?:${PALETTE})-\d{2,3})\b`),
  },
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(name) ? [p] : [];
  });
}

function findColorLiterals(source: string, skip: 'tailwind' | undefined = undefined): { line: number; text: string; label: string }[] {
  const hits: { line: number; text: string; label: string }[] = [];
  let inBlock = false;
  source.split('\n').forEach((text, i) => {
    if (text.includes('design-tokens:allow-start')) inBlock = true;
    if (text.includes('design-tokens:allow-end')) { inBlock = false; return; }
    if (inBlock || /design-tokens:allow(?!-)/.test(text)) return;
    const d = DETECTORS.find(det => det.kind !== skip && det.re.test(text));
    if (d) hits.push({ line: i + 1, text: text.trim(), label: d.label });
  });
  return hits;
}

const allowFor = (rel: string) => ALLOWED.filter(a => (a.path.endsWith('/') ? rel.startsWith(a.path) : rel === a.path));

describe('design tokens: no colour literals', () => {
  const files = walk(join(ROOT, 'src')).map(f => relative(ROOT, f).split('\\').join('/'));

  it('scans all of src/', () => {
    expect(files.length).toBeGreaterThan(50);
    expect(files).toContain('src/index.css');
  });

  it('src/ uses var(--token), not hex/rgb/hsl/named colours or Tailwind palette classes', () => {
    const offenders = files.flatMap(rel => {
      const allow = allowFor(rel);
      if (allow.some(a => !a.kinds)) return [];
      const skip = allow.some(a => a.kinds === 'tailwind') ? 'tailwind' : undefined;
      return findColorLiterals(readFileSync(join(ROOT, rel), 'utf8'), skip).map(h => `${rel}:${h.line}  [${h.label}]  ${h.text}`);
    });
    expect(offenders, `Colour literals found – use a design token (see AGENTS.md):\n${offenders.join('\n')}`).toEqual([]);
  });

  it('allowlisted paths still exist (keep the list honest)', () => {
    for (const a of ALLOWED) expect(statSync(join(ROOT, a.path)).isFile() || statSync(join(ROOT, a.path)).isDirectory()).toBe(true);
  });

  it.each([
    ["color: '#FF9F1C'", 'hex colour'],
    ["background: 'rgba(255,159,28,0.1)'", 'colour function'],
    ['`${c.accent}25` hsl(20 10% 5%)', 'colour function'],
    ["color: 'oklch(70% 0.1 50)'", 'colour function'],
    ["color: 'white'", 'named colour'],
    ["border: '1px solid red'", 'named colour'],
    ['<Icon color="white" />', 'named colour'],
    ['  color: black;', 'named colour'],
    ['className="text-white p-2"', 'Tailwind palette class'],
    ['className="hover:bg-red-500/50"', 'Tailwind palette class'],
    ["cn('border-slate-200')", 'Tailwind palette class'],
  ])('detects %s', (line, label) => {
    expect(findColorLiterals(line).map(h => h.label)).toEqual([label]);
  });

  it.each([
    "href='#projects' &#123;",
    "x: '#fff', // design-tokens:allow data",
    "label: 'Black Friday white paper'",
    "title: 'Bluesky'",
    'className="text-foreground bg-primary/10 border-border"',
    "color: p.accentInk, background: 'transparent'",
    "fill: 'currentColor'",
  ])('ignores %s', line => {
    expect(findColorLiterals(line)).toEqual([]);
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
// 3. Contrast (WCAG 2.x) – rules live in scripts/check-contrast.ts, shared with the sync skill
// ---------------------------------------------------------------------------

describe('design tokens: contrast', () => {
  const results = checkContrast(tokensJson);

  it('checks the -ink tokens in both themes', () => {
    for (const theme of ['light', 'dark']) {
      const inks = results.filter(r => r.theme === theme).map(r => r.token);
      expect(inks).toEqual(expect.arrayContaining(['accent-ink', 'secondary-ink', 'tertiary-ink', 'highlight-ink', 'on-accent']));
    }
  });

  it.each(results.map(r => [`${r.theme} ${r.token} on ${r.on}`, r] as const))('%s ≥ 4.5:1', (_label, r) => {
    expect(r.ratio, `${r.token} ${r.fg} is ${r.ratio.toFixed(2)}:1 on ${r.on} (${r.theme})`).toBeGreaterThanOrEqual(r.min);
  });

  it('flags a token that breaks contrast', () => {
    const j = structuredClone(tokensJson);
    const ink = j.color.tokens.find(t => t.name === 'accent-ink')!;
    ink.value = { light: '#ff9f1c', dark: '{accent}' };
    expect(checkContrast(j).some(r => r.token === 'accent-ink' && !r.ok)).toBe(true);
  });
});
