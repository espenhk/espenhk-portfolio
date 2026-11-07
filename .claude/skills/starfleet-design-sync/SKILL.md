---
name: starfleet-design-sync
description: Change the portfolio's design via the Claude Design system «Starfleet», then sync it into this repo and open a PR. Use when Espen asks for a design change on the portfolio (e.g. "gjør oransje litt varmere", "øk radius på kort", "legg til en token for …", "make the orange warmer", "bigger card radius", any colour/font/spacing/radius/shadow tweak) or asks to "synke Starfleet" / "sync Starfleet".
---

# Starfleet design sync

The design system is the source of truth for colours, fonts, spacing, radii and shadows:

- **Design system:** https://claude.ai/artifact/FA1pGo3SvMXS6nvMmRqpa9 («Starfleet», Artifact type "Design System")
- **Local copy:** `src/design-system/starfleet/tokens.json` → generated `tokens.css` + `tokens.generated.ts` (`bun run tokens`)
- **Direction:** design system → generated code → GitHub → Lovable. Never the other way.

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
6. **Check contrast in both modes before publishing** (WCAG luminance, composite alpha over the ground):
   - text (`-ink`, `text-*`, `on-accent`, `nav-ink`, `cta-ink` on `cta-bg`, …) ≥ **4.5:1** against `background` and `surface` (or its own `-bg`);
   - borders and icons ≥ **3:1**.
   If the change breaks contrast, **do not publish**. Tell Espen the numbers and propose an `-ink` adjustment (e.g. keep the new flat `accent`, darken `accent-ink` in light mode) and wait for an answer.
7. Publish with the Artifact tool as the type's SKILL.md describes: do a fresh `read` right before publishing, publish **only the changed files**, and the **index (`project/design-system.json`) last**. If the publish is refused because of a newer version, merge onto that version and retry; never `force`.

## 2. Sync into the code

1. `Artifact` `read` the design system with `path: "project/tokens.json"` and write it **unchanged** to `src/design-system/starfleet/tokens.json` (check the sha256 matches the saved file).
2. `bun run tokens`
3. Diff the generated files. If tokens were **added** that components should use, or **removed/renamed** tokens are still referenced (`grep -rn "var(--<name>)" src`, `src/design-system/palette.ts`, `src/config/themes/starfleet.ts`, `src/index.css`), make the component changes, following AGENTS.md → "Design system" (palette slots, `-ink` for text, no literals, flourishes only for Starfleet dark).
4. Verify:
   - `bun run build`
   - `bunx vitest run` (includes `src/test/design-tokens.test.ts`: literals, generated-file sync, `-ink` contrast)
   - If anything visual changed, look at the dev server (`bunx vite --host 127.0.0.1`) in light and dark mode.

If `bun install` fails because `bun.lock` points to a mirror you can't reach, rewrite the tarball URLs to `registry.npmjs.org` **temporarily**, install, and restore `bun.lock` before committing.

## 3. Deliver

1. `git checkout -b design-sync/<short-description>` from the latest default branch.
2. Commit with a message that names the design system version, e.g. `Sync Starfleet design system v3: warmer accent`.
3. Push and open a PR against the default branch. The PR body has a token diff table:

   | Token | Mode | Before | After | Contrast (before → after) |
   |---|---|---|---|---|
   | `accent` | both | `#ff9f1c` | `#ff9410` | on-accent 8.3 → 8.1:1 |

   plus any component changes and anything that is not visually identical.
4. End by telling Espen: **Lovable picks the change up once the PR is merged (two-way GitHub sync), and he has to press _Publish_ in Lovable** for it to go live.
