/**
 * Sync a tokens.json fetched from the Claude Design system «Starfleet» into the repo.
 *
 *   bun run design:sync <path/to/fetched/tokens.json> [--diff-out <file.md>] [--skip-checks]
 *
 * 1. validates the file and checks contrast (fails before touching anything)
 * 2. copies it byte-for-byte to src/design-system/starfleet/tokens.json
 * 3. regenerates tokens.css and tokens.generated.ts
 * 4. prints the token diff (and writes it to --diff-out, for the PR body)
 * 5. runs `bun run build` and `bunx vitest run` (unless --skip-checks)
 *
 * It never edits the design system and never edits generated files by hand.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { generate, PATHS, TokenError, type TokensJson } from './build-design-tokens';
import { checkContrast } from './check-contrast';
import { diffTokens } from './diff-tokens';

function fail(msg: string): never {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

const args = process.argv.slice(2);
const src = args.find(a => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--diff-out');
const diffOut = args.includes('--diff-out') ? args[args.indexOf('--diff-out') + 1] : undefined;
const skipChecks = args.includes('--skip-checks');
if (!src) fail('usage: bun run design:sync <fetched tokens.json> [--diff-out file.md] [--skip-checks]');

const raw = readFileSync(src, 'utf8');
let next: TokensJson;
try {
  next = JSON.parse(raw) as TokensJson;
  generate(next); // validates names, values and aliases
} catch (e) {
  fail(`fetched tokens.json is invalid: ${e instanceof TokenError || e instanceof Error ? e.message : String(e)}`);
}

const bad = checkContrast(next).filter(r => !r.ok);
if (bad.length) {
  fail(
    'contrast check failed – fix this in the design system (adjust the -ink token), not in code:\n' +
    bad.map(r => `  ${r.theme} ${r.token} ${r.fg} on ${r.on}: ${r.ratio.toFixed(2)}:1 < ${r.min}:1`).join('\n'),
  );
}

const prevRaw = readFileSync(PATHS.json, 'utf8');
if (prevRaw === raw) {
  console.log(`✓ Already in sync with Starfleet v${next.version} – nothing to do.`);
  process.exit(0);
}
const prev = JSON.parse(prevRaw) as TokensJson;

writeFileSync(PATHS.json, raw); // verbatim copy
const { css, ts } = generate(next);
writeFileSync(PATHS.css, css);
writeFileSync(PATHS.ts, ts);
console.log(`✓ Synced Starfleet v${prev.version} → v${next.version}; regenerated tokens.css and tokens.generated.ts\n`);

const diff = diffTokens(prev, next);
console.log(diff);
if (diffOut) writeFileSync(diffOut, diff);

if (!skipChecks) {
  for (const [cmd, cmdArgs] of [['bun', ['run', 'build']], ['bunx', ['vitest', 'run']]] as const) {
    console.log(`\n$ ${cmd} ${cmdArgs.join(' ')}`);
    const r = spawnSync(cmd, cmdArgs, { stdio: 'inherit' });
    if (r.status !== 0) fail(`${cmd} ${cmdArgs.join(' ')} failed – components may still use a removed/renamed token`);
  }
  console.log('\n✓ build and tests pass');
}
