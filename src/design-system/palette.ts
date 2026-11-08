import type { Theme } from '@/config/themes/types';
import { legacyNeutrals as N } from '@/config/themes/shared';
import { tokens } from './starfleet/tokens.generated';

/**
 * One place that maps the active theme + mode to the semantic slots components use.
 * - Starfleet: every slot is `var(--token)` from the Claude Design system «Starfleet».
 * - Other themes: slots come from their own Theme object, with neutral fallbacks.
 * Components must use these slots (or theme fields) – never colour literals.
 */

/** Colour with alpha, works for hex and var(): `tint('var(--accent)', 10)`. */
export const tint = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;

// design-tokens:allow-start — this helper builds rgba() from token values
/**
 * Concrete rgba() from a concrete colour (hex or rgb()/rgba()) – for framer-motion targets,
 * which cannot interpolate var() or color-mix(). Anything else is returned unchanged
 * (opaque, but never `rgba(NaN…)`).
 */
export function hexAlpha(color: string, alpha: number): string {
  const c = color.trim();
  let rgb: number[] | undefined;
  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(c);
  if (hex) {
    const h = hex[1].length <= 4 ? hex[1].split('').map(ch => ch + ch).join('') : hex[1];
    rgb = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  } else {
    const fn = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(c);
    if (fn) rgb = [fn[1], fn[2], fn[3]].map(Number);
  }
  if (!rgb || rgb.some(n => Number.isNaN(n))) return color;
  return `rgba(${rgb.join(',')},${alpha})`;
}
// design-tokens:allow-end

const v = (name: string) => `var(--${name})`;

/** Text/icon colour for a flat category token: var(--accent) → var(--accent-ink). Other colours pass through. */
export const inkFor = (color: string) =>
  color.replace(/^var\(--(accent|secondary|tertiary|highlight)\)$/, 'var(--$1-ink)');

export function resolvePalette(theme: Theme, isDark: boolean) {
  const c = theme.colors;
  const m = isDark ? 'dark' : 'light';
  const sf = theme.id === 'starfleet';
  /** Starfleet dark-mode flourishes (rails, starfield, glow, stardate). */
  const flourish = sf && isDark;

  const bg = c.background[m];
  const surface = c.surface[m];
  const fg = c.textPrimary[m];
  const fg2 = c.textSecondary[m];
  const border = c.border[m];
  const accent = c.accent;
  const secondary = c.secondary ?? accent;
  const tertiary = c.tertiary ?? secondary;
  const highlight = c.highlight ?? accent;

  const accentInk = c.accentInk ?? accent;
  const secondaryInk = c.secondaryInk ?? secondary;
  const tertiaryInk = c.tertiaryInk ?? tertiary;
  const highlightInk = c.highlightInk ?? highlight;

  const groundGradient = `linear-gradient(180deg, ${v('ground-deep')} 0%, ${v('ground-mid')} 50%, ${v('ground-deep')} 100%)`;
  const panelGradient = `linear-gradient(145deg, ${v('panel-start')} 0%, ${v('panel-mid')} 50%, ${v('panel-start')} 100%)`;
  const t = tokens.color[m];

  return {
    isStarfleet: sf,
    isDark,
    flourish,
    bg, surface, fg, fg2, border,
    accent, accentHover: c.accentHover, secondary, tertiary, highlight, warm: c.warm ?? accent,
    success: c.success, warning: c.warning, error: c.error,
    accentInk, secondaryInk, tertiaryInk, highlightInk,
    onAccent: c.onAccent?.[m] ?? N.onAccent[m],
    /** dates and periods in lists */
    metaInk: sf ? v('meta-ink') : isDark ? tertiary : fg2,

    // navigation
    navInk: sf ? v('nav-ink') : N.navInk[m],
    navActive: sf ? v('nav-active') : isDark ? accent : fg,
    navScrolled: sf ? v('nav-scrolled') : tint(isDark ? bg : surface, isDark ? 85 : 90),
    hairline: sf ? v('hairline') : N.hairline[m],
    controlEdge: sf ? v('control-edge') : N.controlEdge[m],

    // backgrounds: Starfleet dark mode uses its deep-space gradients, everything else is flat
    pageBg: flourish ? groundGradient : bg,
    sectionBg: flourish ? groundGradient : bg,
    heroBg: flourish
      ? `linear-gradient(180deg, ${v('ground-deep')} 0%, ${v('ground-mid')} 40%, ${v('ground-deep')} 100%)`
      : bg,
    altSectionBg: flourish ? panelGradient : surface,
    footerBg: flourish ? `linear-gradient(180deg, ${v('background')} 0%, ${v('ground-deep')} 100%)` : surface,
    cardBg: flourish ? `linear-gradient(145deg, ${v('card-bg-start')} 0%, ${v('card-bg-end')} 100%)` : sf ? v('card-bg-start') : surface,
    panelBg: flourish ? panelGradient : sf ? v('panel-start') : surface,
    /** solid panel colour (fades over images) */
    panelSolid: sf ? v('panel-start') : surface,
    statPanelBg: flourish ? panelGradient : theme.characterSheetTheme.panelBg,
    statLabel: sf ? v('stat-label') : N.statLabel,
    statTrack: sf ? v('stat-track') : N.statTrack,

    // edges
    cardEdge: sf ? v('card-edge') : border,
    panelEdge: sf ? v('panel-edge') : border,
    jobEdge: sf ? v('job-edge') : border,
    /** concrete colour for framer-motion whileHover */
    jobEdgeHover: sf
      ? (isDark ? hexAlpha(t.accent, 0.2) : t['control-edge'])
      : (isDark && accent.startsWith('#') ? hexAlpha(accent, 0.2) : N.hoverEdgeLight),

    tertiaryEdgeHover: sf
      ? (isDark ? hexAlpha(t.tertiary, 0.2) : t['control-edge'])
      : (isDark && tertiary.startsWith('#') ? hexAlpha(tertiary, 0.2) : N.hoverEdgeLight),

    /** GitHub contribution calendar [empty, full]: SVG fill attributes need concrete colours. */
    calendarScale: (sf ? [t.surface, t.accent] : [border, accent]) as [string, string],

    // tints
    accentTint: sf ? v('accent-tint') : tint(accent, 9.4),
    accentTintStrong: sf ? v('accent-tint-strong') : tint(accent, 14.5),
    accentEdge: sf ? v('accent-edge') : tint(accent, 25),
    secondaryTint: sf ? v('secondary-tint') : tint(secondary, 10),
    secondaryEdge: sf ? v('secondary-edge') : tint(secondary, 25),
    jobTagInk: sf ? v('job-tag-ink') : isDark ? secondaryInk : accentInk,
    jobTagBg: sf ? v('job-tag-bg') : tint(isDark ? secondary : accent, 8),
    jobTagEdge: sf ? v('job-tag-edge') : tint(isDark ? secondary : accent, 15),
    ctaBg: sf ? (isDark ? `linear-gradient(135deg, ${v('cta-bg')}, ${v('accent-hover')})` : v('cta-bg')) : accent,
    ctaInk: sf ? v('cta-ink') : c.onAccent?.[m] ?? N.onAccent[m],
    linkedin: sf ? v('social-linkedin') : N.linkedin,
    linkedinTint: sf ? v('social-linkedin-tint') : tint(N.linkedin, 10),
    linkedinEdge: sf ? v('social-linkedin-edge') : tint(N.linkedin, 25),
    scrim: sf ? tint(v('stat-panel'), 50) : N.scrim,
    onScrim: sf ? v('stat-label') : N.onScrim,

    // shadows
    shadowCard: theme.shadows.card,
    shadowCardHover: theme.shadows.cardHover,
    shadowButton: sf ? v('shadow-button') : theme.shadows.card,
    shadowCta: sf ? v('shadow-cta') : theme.shadows.card,
    shadowPanel: sf ? v('shadow-panel') : theme.shadows.card,
    shadowJob: sf ? v('shadow-job') : isDark ? theme.shadows.card : N.softShadow,
    shadowAvatar: sf ? v('shadow-avatar') : theme.shadows.card,

    /** Left side-rail (Starfleet dark mode only – check `flourish` before rendering). */
    rail: (background: string, hero = false) => ({
      position: 'absolute' as const, left: 0, top: 0, bottom: 0, zIndex: hero ? 2 : undefined,
      width: v('rail-width'),
      background,
      opacity: hero ? v('rail-hero-opacity') : v('rail-opacity'),
    }),
  };
}

export type Palette = ReturnType<typeof resolvePalette>;
