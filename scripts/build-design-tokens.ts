/**
 * Generates CSS variables and a typed TS object from the Claude Design system «Starfleet».
 *
 *   bun run tokens
 *
 * Input:  src/design-system/starfleet/tokens.json  (verbatim copy of project/tokens.json in the design system)
 * Output: src/design-system/starfleet/tokens.css
 *         src/design-system/starfleet/tokens.generated.ts
 *
 * `generate()` is pure so src/test/design-tokens.test.ts can run it in memory and
 * check that the committed output is in sync.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const HEADER = '/* GENERATED from Claude Design «Starfleet» – do not edit. Run: bun run tokens */';

type ThemedValue = string | Record<string, string>;
interface Token { name: string; value: ThemedValue; usage?: string }
interface TypeStyle {
  name: string; fontSize: string; lineHeight: number | string; fontWeight: number | string; letterSpacing?: string;
}
export interface TokensJson {
  name: string;
  version: number;
  color: { themes: { id: string; name: string }[]; tokens: Token[] };
  type?: { families?: Record<string, string>; groups?: { name: string; family: string; styles: TypeStyle[] }[] };
  spacing?: { tokens: Token[] };
  radius?: { tokens: Token[] };
  shadow?: { tokens: Token[] };
  size?: { tokens: Token[] };
  opacity?: { tokens: Token[] };
}

export class TokenError extends Error {
  constructor(message: string) { super(`[design-tokens] ${message}`); }
}

const ALIAS = /^\{([a-z0-9-]+)\}$/;
const NAME = /^[a-z][a-z0-9-]*$/;
const COLOR = /^(#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\([^()]*\)|hsla?\([^()]*\)|transparent)$/i;
const LENGTH = /^-?\d*\.?\d+(px|rem|em|%)$|^0$/;
const NUMBER = /^\d*\.?\d+$/;
// a box-shadow list: lengths and colors, comma separated; no aliases, no `{`
const SHADOW = /^(inset\s+)?(-?\d*\.?\d+(px)?\s+){2,3}(-?\d*\.?\d+px\s+)?(#[0-9a-f]{3,8}|rgba?\([^()]*\))(\s*,\s*(inset\s+)?(-?\d*\.?\d+(px)?\s+){2,3}(-?\d*\.?\d+px\s+)?(#[0-9a-f]{3,8}|rgba?\([^()]*\)))*$|^none$/i;

type Kind = 'color' | 'shadow' | 'length' | 'number';

interface Resolved {
  /** css custom-property value per theme (aliases become var(--x)) */
  css: Record<string, string>;
  /** concrete value per theme (aliases resolved) */
  raw: Record<string, string>;
}

function perTheme(token: Token, themes: string[], family: string): Record<string, string> {
  const { name, value } = token;
  if (typeof value === 'string') return Object.fromEntries(themes.map(t => [t, value]));
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const k of Object.keys(value)) {
      if (!themes.includes(k)) throw new TokenError(`${family} token "${name}" has value for unknown theme "${k}"`);
    }
    const first = value[themes[0]];
    if (first === undefined) throw new TokenError(`${family} token "${name}" has no value for the first theme "${themes[0]}"`);
    return Object.fromEntries(themes.map(t => [t, value[t] ?? first]));
  }
  throw new TokenError(`${family} token "${name}" has invalid value ${JSON.stringify(value)}`);
}

function validate(kind: Kind, name: string, v: string) {
  if (typeof v !== 'string' || !v.trim()) throw new TokenError(`token "${name}" has empty/invalid value`);
  if (ALIAS.test(v)) return;
  const ok = kind === 'color' ? COLOR.test(v)
    : kind === 'shadow' ? SHADOW.test(v)
    : kind === 'length' ? LENGTH.test(v)
    : NUMBER.test(v);
  if (!ok) throw new TokenError(`token "${name}" has invalid ${kind} value "${v}"`);
}

export function generate(json: TokensJson): { css: string; ts: string } {
  const themes = json?.color?.themes?.map(t => t.id) ?? [];
  if (themes.length === 0) throw new TokenError('color.themes is empty');

  // collect every token in one namespace so duplicates across families are caught
  const all = new Map<string, { kind: Kind; family: string; values: Record<string, string> }>();
  const add = (family: string, kind: Kind, list: Token[] | undefined) => {
    for (const tok of list ?? []) {
      if (!tok || typeof tok.name !== 'string' || !NAME.test(tok.name)) {
        throw new TokenError(`${family}: invalid token name ${JSON.stringify(tok?.name)}`);
      }
      if (all.has(tok.name)) throw new TokenError(`duplicate token name "${tok.name}" (${all.get(tok.name)!.family} and ${family})`);
      const values = perTheme(tok, themes, family);
      for (const v of Object.values(values)) validate(kind, tok.name, v);
      all.set(tok.name, { kind, family, values });
    }
  };
  add('color', 'color', json.color.tokens);
  add('shadow', 'shadow', json.shadow?.tokens);
  add('spacing', 'length', json.spacing?.tokens);
  add('radius', 'length', json.radius?.tokens);
  add('size', 'length', json.size?.tokens);
  add('opacity', 'number', json.opacity?.tokens);

  const families = json.type?.families ?? {};
  const fontVars: [string, string][] = [];
  for (const [k, v] of Object.entries(families)) {
    const name = `font-${k}`;
    if (!NAME.test(name) || typeof v !== 'string' || !v.trim()) throw new TokenError(`invalid font family "${k}"`);
    if (all.has(name)) throw new TokenError(`duplicate token name "${name}"`);
    fontVars.push([name, v]);
  }
  const typeVars: [string, string][] = [];
  for (const g of json.type?.groups ?? []) {
    if (!families[g.family]) throw new TokenError(`type group "${g.name}" uses unknown family "${g.family}"`);
    for (const s of g.styles ?? []) {
      if (!NAME.test(s.name)) throw new TokenError(`invalid type style name "${s.name}"`);
      if (all.has(s.name)) throw new TokenError(`duplicate token name "${s.name}"`);
      typeVars.push([`type-${s.name}-family`, `var(--font-${g.family})`]);
      typeVars.push([`type-${s.name}-size`, String(s.fontSize)]);
      typeVars.push([`type-${s.name}-line-height`, String(s.lineHeight)]);
      typeVars.push([`type-${s.name}-weight`, String(s.fontWeight)]);
      if (s.letterSpacing) typeVars.push([`type-${s.name}-tracking`, String(s.letterSpacing)]);
    }
  }

  // resolve aliases
  const resolved = new Map<string, Resolved>();
  const resolveRaw = (name: string, theme: string, seen: string[]): string => {
    const entry = all.get(name);
    if (!entry) throw new TokenError(`unknown alias "{${name}}" (from ${seen[seen.length - 1] ?? '?'})`);
    if (seen.includes(name)) throw new TokenError(`alias cycle: ${[...seen, name].join(' → ')}`);
    const v = entry.values[theme];
    const m = ALIAS.exec(v);
    if (!m) return v;
    const target = all.get(m[1]);
    if (!target) throw new TokenError(`unknown alias "{${m[1]}}" in token "${name}"`);
    if (target.kind !== entry.kind) throw new TokenError(`alias "{${m[1]}}" in "${name}" crosses kinds (${entry.kind} → ${target.kind})`);
    return resolveRaw(m[1], theme, [...seen, name]);
  };
  for (const [name, entry] of all) {
    const css: Record<string, string> = {};
    const raw: Record<string, string> = {};
    for (const t of themes) {
      const v = entry.values[t];
      const m = ALIAS.exec(v);
      css[t] = m ? `var(--${m[1]})` : v;
      raw[t] = resolveRaw(name, t, []);
    }
    resolved.set(name, { css, raw });
  }

  const themed = [...all].filter(([, e]) => e.kind === 'color' || e.kind === 'shadow').map(([n]) => n);
  const rootOnly = [...all].filter(([, e]) => e.kind === 'length' || e.kind === 'number').map(([n]) => n);

  // ---------- CSS ----------
  const lines: string[] = [HEADER, `/* ${json.name} v${json.version} */`, ''];
  themes.forEach((t, i) => {
    const sel = i === 0 ? `:root,\n[data-theme="${t}"]` : `[data-theme="${t}"]`;
    lines.push(`${sel} {`);
    lines.push(`  color-scheme: ${t === 'dark' ? 'dark' : 'light'};`);
    for (const n of themed) {
      const v = resolved.get(n)!.css[t];
      // later themes only list values that differ from the first theme
      if (i > 0 && v === resolved.get(n)!.css[themes[0]]) continue;
      lines.push(`  --${n}: ${v};`);
    }
    lines.push('}', '');
  });
  lines.push(':root {');
  for (const n of rootOnly) lines.push(`  --${n}: ${resolved.get(n)!.css[themes[0]]};`);
  for (const [n, v] of fontVars) lines.push(`  --${n}: ${v};`);
  for (const [n, v] of typeVars) lines.push(`  --${n}: ${v};`);
  lines.push('}', '');
  const css = lines.join('\n');

  // ---------- TS ----------
  const q = (s: string) => JSON.stringify(s);
  const byKind = (kind: Kind) => [...all].filter(([, e]) => e.kind === kind).map(([n]) => n);
  const themedObj = (names: string[]) =>
    themes.map(t => `    ${t}: {\n${names.map(n => `      ${q(n)}: ${q(resolved.get(n)!.raw[t])},`).join('\n')}\n    },`).join('\n');
  const flatObj = (names: string[]) => names.map(n => `    ${q(n)}: ${q(resolved.get(n)!.raw[themes[0]])},`).join('\n');

  const ts = [
    HEADER,
    `// ${json.name} v${json.version}. Concrete values per theme (aliases resolved), for places where`,
    '// CSS variables cannot be used (e.g. framer-motion colour interpolation). Prefer var(--token) everywhere else.',
    '',
    `export const tokenThemes = ${JSON.stringify(themes)} as const;`,
    'export type TokenTheme = (typeof tokenThemes)[number];',
    '',
    'export const tokens = {',
    '  color: {',
    themedObj(byKind('color')),
    '  },',
    '  shadow: {',
    themedObj(byKind('shadow')),
    '  },',
    '  length: {',
    flatObj(byKind('length')),
    '  },',
    '  opacity: {',
    flatObj(byKind('number')),
    '  },',
    '  font: {',
    fontVars.map(([n, v]) => `    ${q(n.replace(/^font-/, ''))}: ${q(v)},`).join('\n'),
    '  },',
    '} as const;',
    '',
    `export type ColorToken = keyof typeof tokens.color.${themes[0]};`,
    `export type ShadowToken = keyof typeof tokens.shadow.${themes[0]};`,
    '',
  ].join('\n');

  return { css, ts };
}

export const PATHS = (() => {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const dir = resolve(root, 'src/design-system/starfleet');
  return { json: resolve(dir, 'tokens.json'), css: resolve(dir, 'tokens.css'), ts: resolve(dir, 'tokens.generated.ts') };
})();

if ((import.meta as { main?: boolean }).main) {
  try {
    const json = JSON.parse(readFileSync(PATHS.json, 'utf8')) as TokensJson;
    const { css, ts } = generate(json);
    writeFileSync(PATHS.css, css);
    writeFileSync(PATHS.ts, ts);
    console.log(`✓ ${json.name} v${json.version}: wrote tokens.css and tokens.generated.ts`);
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  }
}
