/**
 * Markdown diff of two «Starfleet» tokens.json files, for design-sync PR descriptions.
 *
 *   bun run tokens:diff <before> [after]
 *
 * <before>/<after> are file paths or `git:<ref>` (reads src/design-system/starfleet/tokens.json
 * at that ref). <after> defaults to the working copy. Prints a token table (before → after)
 * and every contrast pair whose ratio changed.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { PATHS, resolveTokens, type TokensJson } from './build-design-tokens';
import { checkContrast } from './check-contrast';

function load(spec: string): TokensJson {
  if (spec.startsWith('git:')) {
    const rel = relative(process.cwd(), PATHS.json).split('\\').join('/');
    return JSON.parse(execFileSync('git', ['show', `${spec.slice(4)}:${rel}`], { encoding: 'utf8' }));
  }
  return JSON.parse(readFileSync(spec, 'utf8'));
}

type Flat = Map<string, Record<string, string>>;

function flatten(json: TokensJson): { themes: string[]; values: Flat } {
  const r = resolveTokens(json);
  const values: Flat = new Map(r.entries.map(e => [e.name, e.raw]));
  for (const [n, v] of [...r.fontVars, ...r.typeVars]) values.set(n, Object.fromEntries(r.themes.map(t => [t, v])));
  return { themes: r.themes, values };
}

export function diffTokens(before: TokensJson, after: TokensJson): string {
  const a = flatten(before);
  const b = flatten(after);
  const themes = b.themes;
  const cell = (v?: Record<string, string>, t?: string) => (v ? `\`${t ? v[t] : Object.values(v)[0]}\`` : '—');
  const sameAcross = (v?: Record<string, string>) => !v || themes.every(t => v[t] === v[themes[0]]);

  const ca = new Map(checkContrast(before).map(r => [`${r.theme}|${r.token}|${r.on}`, r]));
  const cb = checkContrast(after);
  const minRatio = (results: typeof cb, token: string, theme: string) => {
    const rs = results.filter(r => r.token === token && r.theme === theme);
    return rs.length ? Math.min(...rs.map(r => r.ratio)) : undefined;
  };
  const caList = [...ca.values()];

  const rows: string[] = [];
  const names = [...new Set([...a.values.keys(), ...b.values.keys()])];
  for (const name of names) {
    const va = a.values.get(name);
    const vb = b.values.get(name);
    if (JSON.stringify(va) === JSON.stringify(vb)) continue;
    const modes = sameAcross(va) && sameAcross(vb) ? [undefined] : themes;
    for (const t of modes) {
      if (t && va?.[t] === vb?.[t]) continue;
      const theme = t ?? themes[0];
      const r1 = minRatio(caList, name, theme);
      const r2 = minRatio(cb, name, theme);
      const ratio = r1 || r2 ? `${r1?.toFixed(2) ?? '—'} → ${r2?.toFixed(2) ?? '—'}:1` : '';
      const status = !va ? 'added' : !vb ? 'removed' : '';
      rows.push(`| \`${name}\`${status ? ` (${status})` : ''} | ${t ?? 'both'} | ${cell(va, t)} | ${cell(vb, t)} | ${ratio} |`);
    }
  }

  const contrastRows = cb
    .map(r => ({ r, old: ca.get(`${r.theme}|${r.token}|${r.on}`) }))
    .filter(({ r, old }) => !old || Math.abs(old.ratio - r.ratio) >= 0.01)
    .map(({ r, old }) => `| ${r.ok ? '✓' : '✗'} | ${r.theme} | \`${r.token}\` on \`${r.on}\` | ${old ? old.ratio.toFixed(2) : '—'} → ${r.ratio.toFixed(2)}:1 | ${r.min}:1 |`);

  const out = [
    `**Starfleet v${before.version} → v${after.version}**`,
    '',
    rows.length
      ? ['| Token | Mode | Before | After | Contrast (min) |', '|---|---|---|---|---|', ...rows].join('\n')
      : '_No token values changed._',
  ];
  if (contrastRows.length) {
    out.push('', '**Contrast pairs that changed**', '', '| | Mode | Pair | Before → after | Min |', '|---|---|---|---|---|', ...contrastRows);
  }
  return out.join('\n') + '\n';
}

if ((import.meta as { main?: boolean }).main) {
  const [beforeSpec, afterSpec = PATHS.json] = process.argv.slice(2);
  if (!beforeSpec) {
    console.error('usage: bun run tokens:diff <before.json|git:REF> [after.json|git:REF]');
    process.exit(2);
  }
  process.stdout.write(diffTokens(load(beforeSpec), load(afterSpec)));
}
