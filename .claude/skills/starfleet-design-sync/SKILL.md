---
name: starfleet-design-sync
description: Change the portfolio's design via the Claude Design system «Starfleet», then sync it into this repo and open a PR. Use when Espen asks for a design change on the portfolio (e.g. "gjør oransje litt varmere", "øk radius på kort", "legg til en token for …", "make the orange warmer", "bigger card radius", any colour/font/spacing/radius/shadow tweak) or asks to "synke Starfleet" / "sync Starfleet".
---

# Starfleet design sync

The design system is the source of truth for colours, fonts, spacing, radii and shadows:

- **Design system:** https://claude.ai/artifact/FA1pGo3SvMXS6nvMmRqpa9 («Starfleet», Artifact type "Design System")
- **Local copy:** `src/design-system/starfleet/tokens.json` → generated `tokens.css` + `tokens.generated.ts` (`bun run tokens`)
- **Direction:** design system → generated code → GitHub → Lovable. Never the other way.

The mechanical steps are scripts — use them instead of doing the work by hand:

| Command | What it does |
|---|---|
| `./scripts/install-deps.sh` | `bun install` that works outside Lovable (bun.lock points at Lovable's private npm cache) and leaves `bun.lock` untouched |
| `bun run tokens:contrast [file]` | WCAG check of a tokens.json (default: repo copy), both modes; exit 1 on failure |
| `bun run design:sync <file> --diff-out <md>` | validate + contrast → copy verbatim → regenerate → token diff → build → tests |
| `bun run tokens:diff <before> [after]` | markdown before → after table with contrast; `git:<ref>` reads the repo copy at a ref |

CI (`.github/workflows/ci.yml`) runs the same checks on every PR and every push to `main`.

## Hard rules

- **Never run `/design-sync`.** It goes code → design system and locks the system read-only.
- **Never hand-edit** `tokens.json`, `tokens.css` or `tokens.generated.ts`. `tokens.json` is only ever replaced with the design system's `project/tokens.json`; the other two only come from `bun run tokens`.
- **Never change design values in code** that did not come from the design system. The only code changes allowed are components *using* tokens (new token adopted, removed token replaced), following AGENTS.md → "Design system".
- **Never push to the default branch.** Always a `design-sync/<short-description>` branch and a PR.

## 1. Change the system first (only if a change was requested)

Skip to step 2 if Espen only asked to sync.

1. Read the Design System type's instructions: `Artifact` `read` on the design system URL with `path: "SKILL.md"` (the type's skill). Follow what it says about files and publishing.
2. Read `project/design-system.json` (the index), `project/tokens.json` and `project/README.md` from the design system (`Artifact` `read` with `paths`).
3. Make **only** the requested change in the **whole** `tokens.json` (keep every other token and field byte-for-byte; bump `version` if the type's instructions say so).
   - Keep the surface/ink rule: `accent`/`secondary`/`tertiary`/`highlight` are surfaces; text/icons/borders use `-ink`.
   - New tokens need `name`, `value` (string, `{light,dark}` object, or `"{alias}"`) and `usage`.
4. If README.md or a component README mentions a rule or a value you changed, update that text too.
5. Set `lastChange` in `project/design-system.json`: `{ "by": "Espen", "via": "Claude Code", "at": "<ISO timestamp now>", "note": "<what changed>" }`.
6. **Check contrast in both modes before publishing.** Write your edited tokens.json to the scratchpad and run
   `bun run tokens:contrast <that file>` (every `-ink` ≥ 4.5:1 on `background`/`surface` or its own `-bg`, `on-accent` ≥ 4.5:1 on `accent`/`accent-hover`).
   The script does not cover borders and icons: check by hand that any changed border/icon colour is ≥ **3:1** against what it sits on.
   If anything fails, **do not publish**. Tell Espen the numbers and propose an `-ink` adjustment (e.g. keep the new flat `accent`, darken `accent-ink` in light mode) and wait for an answer.
7. Publish with the Artifact tool as the type's SKILL.md describes: do a fresh `read` right before publishing, publish **only the changed files**, and the **index (`project/design-system.json`) last**. If the publish is refused because of a newer version, merge onto that version and retry; never `force`.

## 2. Sync into the code

1. If `node_modules` is missing: `./scripts/install-deps.sh`.
2. `Artifact` `read` the design system with `path: "project/tokens.json"`. It is saved to the scratchpad; don't retype or reformat it.
3. `bun run design:sync <saved tokens.json> --diff-out <scratchpad>/token-diff.md`
   - It refuses invalid files and contrast failures before touching the repo. A contrast failure means the design system must change: go back to step 1 of "Change the system first" and propose an `-ink` fix.
   - "Already in sync" means there is nothing to deliver: say so and stop.
   - If build or tests fail after the copy, components still use a removed/renamed token.
4. If tokens were **added** that components should use, or **removed/renamed** tokens are still referenced (`grep -rn "var(--<name>)" src`, `src/design-system/palette.ts`, `src/config/themes/starfleet.ts`, `src/index.css`), make the component changes, following AGENTS.md → "Design system" (palette slots, `-ink` for text, no literals, flourishes only for Starfleet dark). Then `bun run build` and `bunx vitest run` again.
5. If anything visual changed, look at the dev server (`bunx vite --host 127.0.0.1`) in light and dark mode.

## 3. Deliver

1. `git checkout -b design-sync/<short-description>` from the latest default branch.
2. Commit with a message that names the design system version, e.g. `Sync Starfleet design system v3: warmer accent`.
3. Push and open a PR against the default branch. Paste `token-diff.md` (from `design:sync`, or `bun run tokens:diff git:origin/main`) into the PR body as-is, then add any component changes and anything that is not visually identical.
4. Watch the PR's CI run and fix it if it goes red.
5. End by telling Espen: **Lovable picks the change up once the PR is merged (two-way GitHub sync), and he has to press _Publish_ in Lovable** for it to go live.
