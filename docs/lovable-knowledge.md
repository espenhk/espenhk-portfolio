# Lovable Knowledge – design system rules

Paste the text below into the Lovable project's **Knowledge** (Project settings → Knowledge).

---

## Design system: «Starfleet» is the source of truth

This project's visual design (colours, fonts, spacing, radii, shadows) comes from an external design system, the Claude Design artifact «Starfleet» (https://claude.ai/artifact/FA1pGo3SvMXS6nvMmRqpa9). Code changes flow one way: **design system → generated code → GitHub → Lovable**. Do not change design values in this project.

Rules:

1. **Never edit these files:** `src/design-system/starfleet/tokens.json`, `src/design-system/starfleet/tokens.css`, `src/design-system/starfleet/tokens.generated.ts`. They are generated from the design system. A test (`src/test/design-tokens.test.ts`) fails if they are hand-edited.
2. **No colour literals in components or pages.** Do not write hex (`#FF9F1C`), `rgb()`/`rgba()` or `hsl()` values in `src/components/**` or `src/pages/**`. Use CSS variables from the tokens (`var(--accent)`, `var(--surface)`, `var(--card-edge)` …), normally through `const { palette } = useTheme()` or the theme object. The test fails on literals.
3. **Surfaces and ink are different.** `accent`, `secondary`, `tertiary` and `highlight` are for surfaces only (buttons, rails, bars, tinted backgrounds). Text, icons and control borders use the `-ink` versions: `--accent-ink`, `--secondary-ink`, `--tertiary-ink`, `--highlight-ink`. Text on an orange button uses `--on-accent`; navigation text uses `--nav-ink`.
4. **Fonts, spacing, radii and shadows** also come from tokens (`--font-display`, `--font-sans`, `--font-mono`, `--space-*`, `--radius-*`, `--shadow-*`, `--rail-width` …). Don't add new font families or hard-coded shadows.
5. **Light/dark mode** is controlled by `data-theme="light|dark"` on `<html>` (set by `src/context/ThemeContext.tsx`). Don't add separate colour values per mode in components; the tokens switch automatically.
6. **shadcn/ui variables** in `src/index.css` are linked to the tokens. Don't replace them with HSL values.
7. **When someone asks to change a colour, font, size, radius, shadow or other design value** (for example "make the orange warmer" or "increase the card radius"): don't change the code. Reply: **"Endre designsystemet: dette må endres i Claude Design «Starfleet», ikke her. Når designsystemet er endret og synket inn, kommer endringen til Lovable via GitHub."** Then stop.
8. You may build and change components, layout and content as normal, as long as they use the existing tokens.
