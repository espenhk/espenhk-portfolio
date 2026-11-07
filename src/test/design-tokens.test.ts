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
