# AGENTS.md

- Homepage content comes from the CMS document (`cms_documents` row `published`), normalized through `src/cms/resolve.ts`; static `src/data/*` files are only defaults/fallback — so the site still renders if the backend is empty or down.
- Each homepage section type is registered in `src/cms/types.ts`, `src/cms/defaults.ts`, `src/cms/SectionRenderer.tsx` and `src/pages/admin/editors.tsx`; add new types in all four — keeps editor and renderer in sync.
- The CMS is one JSON document (draft + published) plus revisions — keeps content portable via JSON export/import and avoids lock-in.
- Editor access is enforced by RLS via `public.has_role(auth.uid(), 'admin')`; never gate on client state — client checks are UI only.
- `/admin` must never be linked or mentioned from public pages, sitemap or robots.txt — it stays hidden, discoverable only by URL.

## Design system

- All colours, fonts, spacing, radii and shadows come from `src/design-system/starfleet/tokens.json`, a verbatim copy of the Claude Design system «Starfleet» (https://claude.ai/artifact/FA1pGo3SvMXS6nvMmRqpa9) — one source of truth, so the site and the design system cannot drift apart.
- Never hand-edit `tokens.json`, `tokens.css` or `tokens.generated.ts`; change the design system and sync it in (`.claude/skills/starfleet-design-sync`), then `bun run tokens` — `src/test/design-tokens.test.ts` fails on stale or hand-edited output.
- Components use `var(--token)` (via `useTheme().palette` or the theme object) and never colour literals; the test fails on hex/rgb/hsl in `src/components/**` and `src/pages/**` outside its allowlist.
- Text, icons and control borders use the `-ink` tokens (`--accent-ink`, `--secondary-ink`, …); `accent`/`secondary`/`tertiary`/`highlight` are surfaces only — the flat colours fail WCAG contrast as text in light mode.
- Text on an accent button uses `--on-accent`, nav items `--nav-ink` — these are the contrast-checked pairs from the design system.
- Starfleet flourishes (rails, starfield, orange glow, stardate, deep-space gradients) render only when `palette.flourish` (Starfleet + dark); other themes take values from their own `Theme` object — keeps the alternative themes from inheriting Starfleet's look.
- Light/dark switch via `data-theme` on `<html>` (set by `ThemeContext`, plus `.dark` for shadcn); use `tokens.generated.ts` only where CSS variables cannot work (framer-motion colour targets, SVG fill attributes, values stored in the CMS).
- Never run `/design-sync` for Starfleet — it goes code → design system and would lock the system read-only; the flow is design system → generated code → GitHub → Lovable.
