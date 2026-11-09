/**
 * Concrete Starfleet token values per theme (aliases like "{accent-ink}" resolved), read straight
 * from the verbatim design-system copy in tokens.json — no generated file to drift.
 *
 * For places where CSS variables cannot work (framer-motion colour interpolation, SVG fill
 * attributes, the browser's `theme-color`). Prefer `var(--token)` from tokens.css everywhere else.
 *
 * tokens.json itself is validated by the design-sync drift test (src/test/test_starfleet_tokens.py);
 * this module only resolves, and throws on an unknown alias or a cycle.
 */
import tokensJson from './tokens.json';

type ThemedValue = string | Record<string, string>;
interface Token { name: string; value: ThemedValue }
interface Family { tokens?: Token[] }

const ALIAS = /^\{([a-z0-9-]+)\}$/;

const themes: string[] = tokensJson.color.themes.map(t => t.id);
export const tokenThemes = themes as readonly string[];
export type TokenTheme = string;

const families = tokensJson as unknown as Record<string, Family | undefined>;
const named = (family: string): Token[] => families[family]?.tokens ?? [];

/** Value of a token in one theme; a missing theme falls back to the first theme. */
function valueIn(token: Token, theme: string): string {
  const v = token.value;
  return typeof v === 'string' ? v : (v[theme] ?? v[themes[0]]);
}

const byName = new Map<string, Token>(
  ['color', 'shadow', 'spacing', 'radius', 'size', 'opacity'].flatMap(f => named(f).map(t => [t.name, t] as const)),
);

function resolve(name: string, theme: string, seen: string[] = []): string {
  const token = byName.get(name);
  if (!token) throw new Error(`[design-tokens] unknown alias "{${name}}" (from ${seen[seen.length - 1] ?? '?'})`);
  if (seen.includes(name)) throw new Error(`[design-tokens] alias cycle: ${[...seen, name].join(' → ')}`);
  const v = valueIn(token, theme);
  const m = ALIAS.exec(v);
  return m ? resolve(m[1], theme, [...seen, name]) : v;
}

const perTheme = (family: string): Record<string, Record<string, string>> =>
  Object.fromEntries(themes.map(t => [t, Object.fromEntries(named(family).map(tok => [tok.name, resolve(tok.name, t)]))]));

const flat = (...fams: string[]): Record<string, string> =>
  Object.fromEntries(fams.flatMap(f => named(f).map(tok => [tok.name, resolve(tok.name, themes[0])] as const)));

export const tokens = {
  color: perTheme('color'),
  shadow: perTheme('shadow'),
  length: flat('spacing', 'radius', 'size'),
  opacity: flat('opacity'),
  font: { ...(tokensJson.type?.families ?? {}) } as Record<string, string>,
};

export type ColorToken = string;
export type ShadowToken = string;
