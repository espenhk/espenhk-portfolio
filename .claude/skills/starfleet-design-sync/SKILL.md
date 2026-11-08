---
name: starfleet-design-sync
description: Change the portfolio's design via the Claude Design system «Starfleet», sync it into this repo, open a PR and, once merged and confirmed, publish the site through the Lovable connector. Use when Espen asks for a design change on the portfolio (e.g. "gjør oransje litt varmere", "øk radius på kort", "legg til en token for …", "make the orange warmer", "bigger card radius", any colour/font/spacing/radius/shadow tweak) or asks to "synke Starfleet" / "sync Starfleet", or to merge/publish a design-sync PR ("publiser", "merge og publiser").
---

# Starfleet design sync

The design system is the source of truth for colours, fonts, spacing, radii and shadows:

- **Design system:** https://claude.ai/artifact/FA1pGo3SvMXS6nvMmRqpa9 («Starfleet», Artifact type "Design System")
- **Local copy:** `src/design-system/starfleet/tokens.json` → generated `tokens.css` + `tokens.generated.ts` (`bun run tokens`)
- **Direction:** design system → generated code → GitHub → Lovable → published site. Never the other way.
- **Lovable project:** `Espen's Portfolio`, id `2f4f655a-9890-449d-ac49-e16c095aef4d`, live at https://espenhk.lovable.app/

The mechanical steps are scripts — use them instead of doing the work by hand:

| Command | What it does |
|---|---|
| `./scripts/install-deps.sh` | `bun install` that works outside Lovable (bun.lock points at Lovable's private npm cache) and leaves `bun.lock` untouched |
| `bun run tokens:contrast [file]` | WCAG check of a tokens.json (default: repo copy), both modes; exit 1 on failure |
| `bun run tokens:sync <file> --diff-out <md>` | validate + contrast + version check → copy verbatim → regenerate → token diff → build → tests |
| `bun run tokens:diff <before> [after]` | markdown before → after table with contrast; `git:<ref>` reads the repo copy at a ref |

CI (`.github/workflows/ci.yml`) runs the same checks on every PR and every push to `main`.

## Hard rules

- **Never run `/design-sync`** (the Claude command — not the `tokens:sync` script). It goes code → design system and locks the system read-only.
- **Never hand-edit** `tokens.json`, `tokens.css` or `tokens.generated.ts`. `tokens.json` is only ever replaced with the design system's `project/tokens.json`; the other two only come from `bun run tokens`.
- **Never change design values in code** that did not come from the design system. The only code changes allowed are components *using* tokens (new token adopted, removed token replaced), following AGENTS.md → "Design system".
- **Never push to the default branch.** Always a `design-sync/<short-description>` branch and a PR.
- **Never merge on your own.** Merge only when Espen asks for it in the conversation (e.g. "merge og publiser"), and only with CI green.
- **Never publish without Espen's go-ahead.** "merge og publiser" (or "publiser") in this conversation is the go-ahead; otherwise ask after the merge. Never call `deploy_project` before Lovable has the merge commit or while CI on that commit is red, never pass `name` to it (that changes the site's URL), and never ignore or dismiss security findings to get a deploy through.

## 1. Change the system first (only if a change was requested)

Skip to step 2 if Espen only asked to sync.

1. Read the Design System type's instructions: `Artifact` `read` on the design system URL with `path: "SKILL.md"` (the type's skill). **That file wins over this section.** The steps below describe the contract as of v2 (`project/design-system.json` index, `lastChange`, index published last). If the type's file names other files, fields or a different publish order, follow it, tell Espen what differed, and stop if you can't see how to publish safely.
2. Read `project/design-system.json` (the index), `project/tokens.json` and `project/README.md` from the design system (`Artifact` `read` with `paths`).
3. Make **only** the requested change in the **whole** `tokens.json` (keep every other token and field byte-for-byte) and **bump `version` by 1** — `tokens:sync` refuses a changed file with an unchanged version.
   - Keep the surface/ink rule: `accent`/`secondary`/`tertiary`/`highlight` are surfaces; text/icons/borders use `-ink`.
   - New tokens need `name`, `value` (string, `{light,dark}` object, or `"{alias}"`) and `usage`.
4. If README.md or a component README mentions a rule or a value you changed, update that text too.
5. Set `lastChange` in `project/design-system.json`: `{ "by": "Espen", "via": "Claude Code", "at": "<ISO timestamp now>", "note": "<what changed>" }`.
6. **Check contrast in both modes before publishing.** Write your edited tokens.json to the scratchpad and run
   `bun run tokens:contrast <that file>` (every `-ink` ≥ 4.5:1 on `background`/`surface` or its own `-bg`, `on-accent` ≥ 4.5:1 on `accent`/`accent-hover`).
   The script does not cover borders and icons yet (issue #5): check by hand that any changed border/icon colour is ≥ **3:1** against what it sits on.
   If anything fails, **do not publish**. Tell Espen the numbers and propose an `-ink` adjustment (e.g. keep the new flat `accent`, darken `accent-ink` in light mode) and wait for an answer.
7. Publish with the Artifact tool as the type's SKILL.md describes: do a fresh `read` right before publishing, publish **only the changed files**, and the **index (`project/design-system.json`) last**. If the publish is refused because of a newer version, merge onto that version and retry; never `force`.

## 2. Sync into the code

1. If `node_modules` is missing: `./scripts/install-deps.sh`.
2. `Artifact` `read` the design system with `path: "project/tokens.json"`. It is saved to the scratchpad; don't retype or reformat it.
3. `bun run tokens:sync <saved tokens.json> --diff-out <scratchpad>/token-diff.md`
   - It refuses invalid files, contrast failures and version problems before touching the repo.
     - Contrast failure → the design system must change: go back to step 1 of "Change the system first" and propose an `-ink` fix.
     - Older version → probably a stale read: read the design system again. Same version with different content → the version wasn't bumped: bump it in the design system (step 1.3) and sync again. Use `--allow-version-mismatch` only if Espen explicitly wants a rollback.
   - "Already in sync" means there is nothing to deliver: say so and stop.
   - If build or tests fail after the copy, the synced files are **kept on purpose**: go to step 4. Only if the components can't be fixed within the rules, undo with `git checkout -- src/design-system/starfleet` and report what blocked.
4. If tokens were **added** that components should use, or **removed/renamed** tokens are still referenced (`grep -rn "var(--<name>)" src`, `src/design-system/palette.ts`, `src/design-system/categoryColors.ts`, `src/config/themes/starfleet.ts`, `src/index.css`), make the component changes, following AGENTS.md → "Design system" (palette slots, `-ink` for text, no literals, flourishes only for Starfleet dark). Then `bun run build` and `bunx vitest run` again.
5. If anything visual changed, look at the dev server (`bunx vite --host 127.0.0.1`) in light and dark mode.

## 3. Deliver

1. `git checkout -b design-sync/<short-description>` from the latest default branch.
2. Commit with a message that names the design system version, e.g. `Sync Starfleet design system v3: warmer accent`.
3. **Catch up with Lovable.** Lovable commits straight to `main`, so before pushing (and again before a merge) run `git fetch origin main && git merge origin/main`:
   - conflict in `tokens.json` → keep this branch's copy (it is the design system's current file);
   - conflict in `tokens.css` / `tokens.generated.ts` → never resolve by hand: take either side, run `bun run tokens`, and stage the result;
   - conflict in components → resolve normally, keeping both Lovable's change and the token usage;
   - then `bun run build` and `bunx vitest run` again before pushing.
4. Push and open a PR against the default branch. Paste `token-diff.md` (from `tokens:sync`, or `bun run tokens:diff git:origin/main`) into the PR body as-is, then add any component changes and anything that is not visually identical.
5. Subscribe to the PR's activity, watch its CI run and fix it if it goes red.
6. Tell Espen the PR is ready, and that once it's merged you'll publish after his go-ahead (or straight away if he says "merge og publiser"). Then wait: the merge event or his message brings you back.

## 4. Publish (after the merge, with Espen's go-ahead)

Uses the Lovable connector (`get_project`, `deploy_project`). If those tools are missing in this session, tell Espen to press **Publish** in Lovable instead and stop.

1. **Go-ahead:** if Espen hasn't said "publiser" / "merge og publiser" in this conversation, ask now and wait.
2. **Merge commit:** `git fetch origin main` and take the PR's merge commit SHA (from the PR, or `git rev-parse origin/main` right after the merge).
3. **Wait for Lovable to have it.** `get_project` → `latest_commit_sha`.
   - Equal to the merge commit → go on.
   - Not there yet → check again in a couple of minutes with `send_later` (not a sleep loop). After ~10 minutes without it, tell Espen the GitHub sync hasn't arrived and stop.
   - A **newer** commit that contains the merge (`git merge-base --is-ancestor <merge> <latest>`) → Lovable/Espen committed after the merge, and publishing will ship those too. List them (`git log --oneline <merge>..<latest>`) and ask Espen before publishing.
4. **CI must be green on that commit.** Read the GitHub check runs for `latest_commit_sha` (on `main`). Red → don't deploy: report the failing check to Espen. Still running → wait for it. No run (docs-only change skipped by `paths-ignore`) → fine.
5. **Deploy:** `deploy_project` with only `project_id`. If it is refused with `security_critical_findings`, report the findings and their references to Espen and stop.
6. **Verify:** `get_project` shows `is_published: true`. If https://espenhk.lovable.app/ is reachable from the session, fetch it, open the linked `/assets/*.css` and check that a changed token has its new value (e.g. `--accent: #ff9410`). Cloud sessions often can't reach that host; then look at the screenshot `get_project` returns (it may lag behind the deploy) and say plainly what could and couldn't be verified.
7. **Report:** live URL, what changed (the token diff summary), and anything that also went live from step 3.
