import { Helmet } from 'react-helmet-async';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Sparkles, MessageSquare, Code2, Layers, Rocket, Brain, Palette, PenLine, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── tiny inline previews of site components ────────────── */

function MiniStatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const { theme } = useTheme();
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ color: '#D0D0D0', fontSize: '0.6rem', fontFamily: theme.fonts.mono }}>{label}</span>
        <span style={{ color, fontSize: '0.6rem', fontFamily: theme.fonts.mono, fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${color}, ${color}99)`, borderRadius: 2 }}
        />
      </div>
    </div>
  );
}

function MiniCharacterSheet() {
  const { theme, isDark } = useTheme();
  return (
    <div style={{
      background: isDark ? `${theme.colors.surface.dark}CC` : 'rgba(0,0,0,0.03)',
      border: `1px solid ${isDark ? `${theme.colors.accent}1A` : 'rgba(0,0,0,0.08)'}`,
      borderRadius: 8, padding: 14, maxWidth: 260,
    }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.colors.accent, marginBottom: 8 }}>
        ▸ Character Sheet Preview
      </div>
      <MiniStatBar label="Data Engineering" value={85} color={theme.colors.secondary || '#CC99FF'} />
      <MiniStatBar label="Python" value={75} color={theme.colors.accent} />
      <MiniStatBar label="SQL" value={80} color={theme.colors.accent} />
      <MiniStatBar label="Azure Databricks" value={80} color={theme.colors.tertiary || '#99CCFF'} />
    </div>
  );
}

function MiniRepoCard() {
  const { theme, isDark } = useTheme();
  return (
    <div style={{
      background: isDark ? `linear-gradient(145deg, ${theme.colors.surface.dark} 0%, ${theme.colors.surface.dark}EE 50%, ${theme.colors.surface.dark} 100%)` : theme.colors.surface.light,
      border: `1px solid ${isDark ? `${theme.colors.accent}14` : 'rgba(0,0,0,0.08)'}`,
      borderRadius: 8, padding: 12, maxWidth: 260,
    }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.colors.accent, marginBottom: 8 }}>
        ▸ Repository Card Preview
      </div>
      <div style={{ fontFamily: theme.fonts.sans, fontSize: '0.78rem', fontWeight: 600, color: isDark ? theme.colors.textPrimary.dark : theme.colors.textPrimary.light, marginBottom: 4 }}>
        espenhk/portfolio
      </div>
      <div style={{ fontFamily: theme.fonts.sans, fontSize: '0.65rem', color: isDark ? theme.colors.textSecondary.dark : theme.colors.textSecondary.light, marginBottom: 8 }}>
        Personal portfolio site built with Lovable
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3178C6', display: 'inline-block' }} />
          <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', color: isDark ? theme.colors.textSecondary.dark : theme.colors.textSecondary.light }}>TypeScript</span>
        </span>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', color: isDark ? theme.colors.textSecondary.dark : theme.colors.textSecondary.light }}>⭐ 2</span>
      </div>
    </div>
  );
}

function MiniNavBar() {
  const { theme, isDark } = useTheme();
  const items = ['Stats', 'Posts', 'Contact', 'Repos', 'Work'];
  return (
    <div style={{
      background: isDark ? `${theme.colors.background.dark}D9` : `${theme.colors.background.light}E6`,
      backdropFilter: 'blur(12px)',
      borderRadius: 8, padding: '8px 14px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      maxWidth: 320,
    }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.colors.accent, marginBottom: 6 }}>
        ▸ Nav Bar Preview
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {items.map((item, i) => (
          <span key={item} style={{
            fontFamily: theme.fonts.mono,
            fontSize: '0.55rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: i === 0 ? theme.colors.accent : (isDark ? 'rgba(208,208,208,0.5)' : 'rgba(0,0,0,0.4)'),
            padding: '3px 6px',
            fontWeight: i === 0 ? 700 : 400,
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function MiniTimeline() {
  const { theme, isDark } = useTheme();
  const jobs = [
    { role: 'Manager', company: 'PwC Norway', period: '2025–Present' },
    { role: 'Data Engineer', company: 'Kantega AS', period: '2022–2025' },
  ];
  return (
    <div style={{
      background: isDark ? `${theme.colors.surface.dark}CC` : 'rgba(0,0,0,0.03)',
      border: `1px solid ${isDark ? `${theme.colors.accent}14` : 'rgba(0,0,0,0.08)'}`,
      borderRadius: 8, padding: 14, maxWidth: 260,
    }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.colors.accent, marginBottom: 8 }}>
        ▸ Experience Preview
      </div>
      {jobs.map((j, i) => (
        <div key={i} style={{
          padding: '6px 0',
          borderTop: i > 0 ? `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}` : undefined,
        }}>
          <div style={{ fontFamily: theme.fonts.sans, fontSize: '0.72rem', fontWeight: 600, color: isDark ? theme.colors.textPrimary.dark : theme.colors.textPrimary.light }}>
            {j.role}
          </div>
          <div style={{ fontFamily: theme.fonts.sans, fontSize: '0.6rem', color: isDark ? theme.colors.textSecondary.dark : theme.colors.textSecondary.light }}>
            {j.company} · {j.period}
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniThemeSwatches() {
  const { theme, isDark, setThemeById } = useTheme();
  const themeOptions = [
    { name: 'Cupertino', id: 'cupertino', colors: ['#0071E3', '#34C759', '#FF9F0A', '#0A0A0A'] },
    { name: 'Arcadia', id: 'arcadia', colors: ['#209CEE', '#92CC41', '#F7D51D', '#0F0F1B'] },
    { name: 'Nightcity', id: 'nightcity', colors: ['#00F0FF', '#FF2A6D', '#FCEE0A', '#0D0E14'] },
    { name: 'Starfleet', id: 'starfleet', colors: ['#FF9F1C', '#CC99FF', '#99CCFF', '#0A0E1A'] },
    { name: 'Foxglen', id: 'foxglen', colors: ['#D4B87B', '#8CAA7E', '#C4907C', '#1E1B17'] },
  ];
  return (
    <div style={{
      background: isDark ? 'rgba(12,18,40,0.8)' : 'rgba(0,0,0,0.03)',
      border: `1px solid ${isDark ? 'rgba(255,159,28,0.1)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: 8, padding: 14, maxWidth: 320,
    }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.colors.secondary || '#CC99FF', marginBottom: 10 }}>
        ▸ Theme Candidates — tap to preview
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {themeOptions.map(t => {
          const isActive = theme.id === t.id;
          return (
            <button
              key={t.name}
              onClick={() => setThemeById(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 8px',
                borderRadius: 6,
                background: isActive ? (isDark ? `${theme.colors.accent}14` : `${theme.colors.accent}0F`) : 'transparent',
                border: isActive ? `1px solid ${theme.colors.accent}33` : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', gap: 3 }}>
                {t.colors.map((c, i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c, border: '1px solid rgba(255,255,255,0.1)' }} />
                ))}
              </div>
              <span style={{
                fontFamily: theme.fonts.mono, fontSize: '0.6rem',
                color: isActive ? theme.colors.accent : (isDark ? 'rgba(208,208,208,0.5)' : 'rgba(0,0,0,0.4)'),
                fontWeight: isActive ? 700 : 400,
              }}>
                {t.name} {isActive && '✓'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── expandable prompt sub-section ───────────────────────── */

function ExpandablePrompt({ title, content, color }: { title: string; content: string; color: string }) {
  const [open, setOpen] = useState(false);
  const { theme, isDark } = useTheme();

  return (
    <div style={{ marginTop: 16 }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${color}12, ${color}06)`
            : `linear-gradient(135deg, ${color}10, ${color}05)`,
          border: `1px solid ${isDark ? `${color}35` : `${color}25`}`,
          borderRadius: 10, padding: '14px 18px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          textAlign: 'left',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}60`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? `${color}35` : `${color}25`; }}
      >
        <Code2 size={16} style={{ color, flexShrink: 0 }} />
        <span style={{
          fontFamily: theme.fonts.mono, fontSize: '0.75rem',
          color: isDark ? color : 'rgba(0,0,0,0.6)',
          fontWeight: 600, letterSpacing: '0.02em',
          flex: 1,
        }}>
          {title}
        </span>
        <span style={{ color: isDark ? 'rgba(208,208,208,0.4)' : 'rgba(0,0,0,0.25)' }}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 8, padding: 16, borderRadius: 8,
              background: isDark ? 'rgba(6,10,24,0.9)' : 'rgba(0,0,0,0.02)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}`,
              maxHeight: 500, overflowY: 'auto',
            }}>
              <pre style={{
                fontFamily: theme.fonts.mono, fontSize: '0.62rem', lineHeight: 1.65,
                color: isDark ? 'rgba(208,208,208,0.65)' : 'rgba(0,0,0,0.5)',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
              }}>
                {content}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── author prompt / reflection ─────────────────────────── */

function AuthorPrompt({ prompt, color = '#CC99FF' }: { prompt: string; color?: string }) {
  const { theme, isDark } = useTheme();
  return (
    <div style={{
      margin: '12px 0',
      padding: '12px 16px',
      borderLeft: `3px solid ${isDark ? `${color}90` : `${color}90`}`,
      background: isDark ? `${color}18` : `${color}1A`,
      borderRadius: '0 8px 8px 0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
    }}>
      <PenLine size={14} style={{ color, marginTop: 3, flexShrink: 0 }} />
      <span style={{
        fontFamily: theme.fonts.sans,
        fontSize: '0.8rem',
        fontStyle: 'italic',
        lineHeight: 1.6,
        color: isDark ? `${color}E6` : `${color}`,
      }}>
        {prompt}
      </span>
    </div>
  );
}

function AuthorReflection({ text, color = '#CC99FF' }: { text: string; color?: string }) {
  const { theme, isDark } = useTheme();
  return (
    <div style={{
      margin: '12px 0',
      padding: '14px 18px',
      borderLeft: `3px solid ${isDark ? `${color}CC` : `${color}CC`}`,
      background: isDark ? `${color}22` : `${color}20`,
      borderRadius: '0 8px 8px 0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
    }}>
      <Quote size={14} style={{ color, marginTop: 3, flexShrink: 0, opacity: 0.8 }} />
      <span style={{
        fontFamily: theme.fonts.sans,
        fontSize: '0.82rem',
        fontStyle: 'normal',
        lineHeight: 1.7,
        color: isDark ? 'rgba(230,230,230,0.9)' : 'rgba(30,30,30,0.85)',
      }}>
        {text}
      </span>
    </div>
  );
}

/* ── step data ──────────────────────────────────────────── */

interface Step {
  phase: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  details: (string | { prompt: string } | { reflection: string })[];
  toolsUsed: string[];
  color: string;
  preview?: React.ReactNode;
  expandableSection?: { title: string; content: string };
}

const steps: Step[] = [
  {
    phase: 'Phase 0',
    icon: <Brain size={20} />,
    title: 'Prompt Engineering with Claude Opus 4.6',
    description:
      'It started, as these things do, with a blank chat window. I had a vague idea — "my portfolio should feel like an RPG character sheet" — and a lot of opinions. So I opened Claude and started talking.',
    details: [
      'The first draft was loose. Something like: "I want a portfolio that feels like an RPG character sheet, with stat bars and a sci-fi aesthetic." Not exactly a spec.',
      { reflection: 'My experience is that when I skip the prompt build/plan phase, I quickly accept a direction I maybe didn\'t want because I get caught up in the finer details. And in the end, after a lot of iteration I end up with something I\'m only 4/6 happy with.' },
      'Claude came back with five fully distinct visual directions — not just color swaps, but completely different design philosophies: Cupertino (Apple minimalism), Arcadia (8-bit pixel art), Nightcity (cyberpunk neon), Starfleet (LCARS command console), and Foxglen (Tunic-inspired mythical manual)',
      'Each theme came with a full theme.ts config: palette, fonts, border radii, shadow philosophy, character sheet variant, layout strategy. It was like being handed five mood boards by five different designers.',
      { reflection: 'Building MWEs quickly with the graphical templates was super handy, because I could see a realization of each theme as it would end up — and iterate on them until I had something I was properly happy with. I was slightly disappointed with how samey the themes looked at first, background colors for instance were all quite the same (eggshell white and midnight blue for all).' },
      'Starfleet pulled ahead quickly. The LCARS amber/lavender/blue palette had this quality of being deeply nerdy but somehow still professional. The other four were good, but this one felt like *me*.',
      { reflection: 'I picked Starfleet because it retained a feeling of playfulness, while staying safely planted in the nerd/computer geek space, resonating with gamer identity.' },
      'Over ~8 rounds of iteration, the prompt grew from a rough brief into a 4,500-word specification: 17 parts covering data architecture, component library, theming, deployment paths, animations, even the exact LCARS capsule border-radii (24px 8px 8px 24px)',
      'Fonts were locked: Antonio for display, Outfit for body, JetBrains Mono for code. Colors codified: #FF9F1C amber, #CC99FF lavender, #99CCFF sky-blue.',
      { reflection: 'The prompt felt more done when I had finished iterating on all of it, and could generate the initial "make MWE sections" in the end. Knowing I had specified intent, desired output, core values behind choices and several technologies considered, was good.' },
      'No code was written in this phase. Just design thinking, prompt craft, and a slowly crystallizing vision.',
    ],
    toolsUsed: ['Claude Opus 4.6', 'Prompt engineering', 'Design thinking'],
    color: '#CC99FF',
    expandableSection: {
      title: '📋 View the Original Prompt — All 4,500 Words',
      content: `# Personal Developer Portfolio — Complete Specification v4

**Owner:** Espen H. Kristensen
**GitHub:** \`espenhk\` · **Medium:** \`espen-haukeland-kristensen\` · **Instagram/Bluesky:** \`@bgosl\` · **Facebook:** \`espenhk\`

---


# Personal Developer Portfolio — Complete Specification v4

**Owner:** Espen H. Kristensen
**GitHub:** espenhk · **Medium:** espen-haukeland-kristensen · **Instagram/Bluesky:** @bgosl · **Facebook:** espenhk

---

# PART 0 — GRAPHICAL PROFILES & BUILD STRATEGY

## 0.1 Build Strategy: Minimal Working Example First

> **INSTRUCTION TO THE BUILDER (human or AI):**
>
> **Do NOT build the full site immediately.**
>
> First, build **five minimal working examples (MWEs)** — one per graphical profile below. Each MWE must contain:
>
> 1. A **hero section** with profile image, name, tagline, and one CTA button.
> 2. One **project card** (hardcoded sample data).
> 3. One **character sheet stat bar** (3–4 bars, animated on scroll).
> 4. A **dark/light mode toggle** demonstrating both modes.
> 5. A **footer** with social icons.
>
> Each MWE must be a single-page, self-contained deployment. All five share the same component code — the *only* difference is the theme.ts file loaded.
>
> **Present all five MWEs for review.** Once a profile is approved, proceed with the full build using that theme. The full spec (Parts 1–17) describes the complete site.

---

## 0.2 Graphical Profile A — "CUPERTINO" · Apple-Flat Minimalism

**Mood:** Clean, corporate, confident. The portfolio as a product page.

| Element | Treatment |
|---|---|
| Headings | Inter — medium weight, generous letter-spacing |
| Body | Inter — regular weight, max readability |
| Mono | JetBrains Mono |
| Palette | Near-white #FAFAFA / void-black #0A0A0A. Accent: electric blue #0071E3. |
| Corners | Rounded: 8–20px |
| Shadows | Soft: 0 2px 12px rgba(0,0,0,0.06) |
| Borders | Subtle 1px border in light grey |
| Motion | Smooth ease-out fades, scale-ups on hover |
| Character sheet | Clean horizontal bars, accent fill, no glow |
| Light mode | Primary — pure, airy white |
| Dark mode | Deep black, high contrast text |

ts
export const theme = {
  id: 'cupertino',
  colors: {
    accent: '#0071E3', accentHover: '#005BB5',
    background: { light: '#FAFAFA', dark: '#0A0A0A' },
    surface: { light: '#FFFFFF', dark: '#1C1C1E' },
    textPrimary: { light: '#1D1D1F', dark: '#F5F5F7' },
    textSecondary: { light: '#6E6E73', dark: '#A1A1A6' },
    border: { light: '#E5E5EA', dark: '#2C2C2E' },
    success: '#34C759', warning: '#FF9F0A', error: '#FF3B30',
  },
  fonts: {
    display: "'Inter', system-ui, sans-serif",
    sans: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: { sm: '8px', md: '12px', lg: '20px', full: '9999px' },
  borders: { width: '1px', style: 'solid' },
  shadows: {
    card: '0 2px 12px rgba(0,0,0,0.06)',
    cardHover: '0 8px 30px rgba(0,0,0,0.10)',
  },
  spacing: { section: '120px', sectionMobile: '64px' },
  motion: { timingFunction: 'ease-out', durationFast: '150ms', durationNormal: '300ms' },
  characterSheetTheme: {
    panelBg: '#111114', barGlow: 'none', nameFont: "'Inter', sans-serif",
  },
  hobbySection: {
    background: { light: '#F5F5F5', dark: '#141414' },
    accentOverride: '#0071E3',
  },
  extras: {},
};

---

## 0.3 Graphical Profile B — "ARCADIA" · 8-Bit Retro Pixel Art

**Mood:** Nostalgic, playful. The portfolio as a retro game cartridge. Think NES-era UI.

| Element | Treatment |
|---|---|
| Headings | Press Start 2P (Google Fonts) — all-caps, chunky pixel letterforms |
| Body | IBM Plex Mono — readable monospace |
| Mono | IBM Plex Mono |
| Palette | NES-inspired: blue #209CEE, green #92CC41, gold #F7D51D, red #E76E55. Background: Game Boy cream #F7F0D0 / NES void #0F0F1B |
| Corners | 0px everywhere — hard right angles |
| Shadows | Chunky: 4px 4px 0px rgba(0,0,0,0.25). On hover: 2px 2px (pressed) |
| Borders | Thick 4px solid — NES dialog box style |
| Motion | steps(6) timing — frame-by-frame feel. No smooth easing. |
| Character sheet | RPG stat screen. Labels: STR / DEX / INT / WIS. Bars fill in discrete pixel chunks. |
| Light mode | Game Boy parchment cream |
| Dark mode | NES dark-blue void |
| Extra dep | NES.css (optional supplementary stylesheet)[1] |

ts
export const theme = {
  id: 'arcadia',
  colors: {
    accent: '#209CEE', accentHover: '#187BBE',
    background: { light: '#F7F0D0', dark: '#0F0F1B' },
    surface: { light: '#FFFEF5', dark: '#1A1A2E' },
    textPrimary: { light: '#1B1B1B', dark: '#F0F0F0' },
    textSecondary: { light: '#5A5A5A', dark: '#9A9AB0' },
    border: { light: '#1B1B1B', dark: '#4A4A6A' },
    success: '#92CC41', warning: '#F7D51D', error: '#E76E55',
  },
  fonts: {
    display: "'Press Start 2P', cursive",
    sans: "'IBM Plex Mono', monospace",
    mono: "'IBM Plex Mono', monospace",
  },
  radii: { sm: '0px', md: '0px', lg: '0px', full: '0px' },
  borders: { width: '4px', style: 'solid' },
  shadows: {
    card: '4px 4px 0px rgba(0,0,0,0.25)',
    cardHover: '2px 2px 0px rgba(0,0,0,0.25)',
  },
  spacing: { section: '100px', sectionMobile: '56px' },
  motion: { timingFunction: 'steps(6)', durationFast: '100ms', durationNormal: '200ms' },
  characterSheetTheme: {
    panelBg: '#0F0F1B', barStyle: 'segmented', barGlow: 'none',
    nameFont: "'Press Start 2P', cursive",
    statLabels: ['STR', 'DEX', 'INT', 'WIS', 'CHA', 'LCK'],
  },
  hobbySection: {
    background: { light: '#E8DFC0', dark: '#14142A' },
    accentOverride: '#E76E55',
    frameStyle: 'dialog-box',
  },
  extras: { pixelGrid: true, scanlines: false, chiptuneOnLoad: false, nessCssEnabled: true },
};

---

## 0.4 Graphical Profile C — "NIGHTCITY" · Cyberpunk Neon Terminal

**Mood:** Edgy, technical. Blade Runner meets a senior engineer's GitHub. Dark-mode-first.

| Element | Treatment |
|---|---|
| Headings | Rajdhani / Orbitron — uppercase, tracked wide |
| Body | Exo 2 / Inter — clean sans for dark backgrounds |
| Mono | JetBrains Mono with cyan tint |
| Palette | Cyan #00F0FF, magenta #FF2A6D, amber #FCEE0A. Background: #0D0E14 / #1A1A2E. |
| Corners | Asymmetric: 0 12px 0 12px — cyberpunk "cut corner" |
| Shadows | Glow: 0 0 20px rgba(0,240,255,0.15) on hover |
| Borders | 1px at rest, accent glow on hover |
| Motion | cubic-bezier(0.77, 0, 0.175, 1). Optional glitch entrance (2px chromatic offset). |
| Character sheet | HUD overlay. Bars with neon cyan fill + sweep animation. Terminal format: [██████░░░░] 75% |
| Light mode | Cool corporate grey, desaturated accents, no glow |
| Dark mode | Primary — full neon |

ts
export const theme = {
  id: 'nightcity',
  colors: {
    accent: '#00F0FF', accentHover: '#00C4CC',
    secondary: '#FF2A6D', tertiary: '#FCEE0A',
    background: { light: '#E8EAF0', dark: '#0D0E14' },
    surface: { light: '#F0F1F5', dark: '#1A1A2E' },
    textPrimary: { light: '#1B1B2F', dark: '#F0F1F5' },
    textSecondary: { light: '#5C647A', dark: '#939AB0' },
    border: { light: '#D1D4DE', dark: '#2A2D3A' },
    success: '#05FFA1', warning: '#FCEE0A', error: '#FF2A6D',
  },
  fonts: {
    display: "'Rajdhani', 'Orbitron', system-ui, sans-serif",
    sans: "'Exo 2', 'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: { sm: '2px', md: '4px', lg: '0 12px 0 12px', full: '9999px' },
  borders: { width: '1px', style: 'solid' },
  shadows: {
    card: '0 0 0 1px rgba(0,240,255,0.05)',
    cardHover: '0 0 20px rgba(0,240,255,0.15), 0 0 40px rgba(0,240,255,0.05)',
  },
  spacing: { section: '120px', sectionMobile: '64px' },
  motion: {
    timingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)',
    durationFast: '150ms', durationNormal: '300ms', glitchEntrance: true,
  },
  characterSheetTheme: {
    panelBg: '#0D0E14', barGlow: '0 0 12px rgba(0,240,255,0.5)',
    barSweep: true, nameFont: "'Rajdhani', sans-serif", statFormat: 'terminal',
  },
  hobbySection: {
    background: { light: '#E0E4EE', dark: '#12141D' },
    accentOverride: '#FF2A6D', frameStyle: 'data-feed',
  },
  extras: { matrixRain: false, noiseTexture: true, gridLines: true, scanlines: false },
};

---

## 0.5 Graphical Profile D — "STARFLEET" · Sci-Fi Command Console (LCARS / Mass Effect)

**Mood:** Structured, information-dense, exploratory. The portfolio as a starship personnel file.

| Element | Treatment |
|---|---|
| Headings | Antonio / Chakra Petch — semi-condensed futuristic sans |
| Body | Outfit / Inter — max readability |
| Mono | JetBrains Mono, amber tint |
| Palette | LCARS amber #FF9F1C, lavender #CC99FF, sky-blue #99CCFF, coral #E8655A, tan #FFCC99. Background: navy #0A0E1A. |
| Corners | LCARS capsule: 24px 8px 8px 24px (round-left, square-right) |
| Shadows | Moderate: 0 2px 8px rgba(0,0,0,0.2) |
| Borders | None — colour blocks *are* the borders. 40px sidebar rail changes hue per section. |
| Motion | ease-out, elements slide from left. No bounce. |
| Character sheet | Crew personnel dossier. "PERSONNEL FILE" header in amber. Stats as two-column data table. Easter egg: stardate display. |
| Light mode | White with pastel colour-block accents — Starfleet dossier feel |
| Dark mode | Primary — deep navy command bridge |

ts
export const theme = {
  id: 'starfleet',
  colors: {
    accent: '#FF9F1C', accentHover: '#E08A0C',
    secondary: '#CC99FF', tertiary: '#99CCFF',
    highlight: '#E8655A', warm: '#FFCC99',
    background: { light: '#F4F1EC', dark: '#0A0E1A' },
    surface: { light: '#FFFFFF', dark: '#131A2E' },
    textPrimary: { light: '#1A1A2E', dark: '#F0EDDF' },
    textSecondary: { light: '#5A5A6A', dark: '#9A9AAF' },
    border: { light: '#E0DDD5', dark: '#1E2640' },
    success: '#66CC99', warning: '#FF9F1C', error: '#E8655A',
  },
  fonts: {
    display: "'Antonio', 'Chakra Petch', system-ui, sans-serif",
    sans: "'Outfit', 'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: { sm: '4px', md: '8px', lg: '24px 8px 8px 24px', lgReverse: '8px 24px 24px 8px', full: '9999px' },
  borders: { width: '0px', style: 'none' },
  shadows: { card: '0 2px 8px rgba(0,0,0,0.2)', cardHover: '0 4px 16px rgba(0,0,0,0.3)' },
  spacing: { section: '110px', sectionMobile: '60px' },
  motion: { timingFunction: 'ease-out', durationFast: '150ms', durationNormal: '250ms', entranceDirection: 'left' },
  layout: {
    sidebarRail: true, sectionHeaderBars: true,
    sectionColors: {
      hero: '#FF9F1C', projects: '#99CCFF', characterSheet: '#CC99FF',
      hobbies: '#E8655A', articles: '#FFCC99', social: '#66CC99',
    },
  },
  characterSheetTheme: {
    panelBg: '#131A2E', barGlow: 'none', barColor: '#FF9F1C',
    nameFont: "'Antonio', sans-serif", statFormat: 'dossier',
    headerLabel: 'PERSONNEL FILE', classificationLabel: 'CLASSIFICATION', showStardate: true,
  },
  hobbySection: {
    background: { light: '#F0ECE4', dark: '#0E1324' },
    accentOverride: '#E8655A', frameStyle: 'lcars-panel', headerPrefix: 'OFF-DUTY ACTIVITIES //',
  },
  extras: { starField: true, sidebarRailAnimated: false },
};

---

## 0.6 Graphical Profile E — "FOXGLEN" · Tunic-Inspired Mythical Manual

**Mood:** Gentle mystery. The portfolio as a discovered instruction booklet in a runic language you almost understand. Muted watercolour tones, warmth, handcraft.

Inspired by *Tunic* (2022) — **a Zelda-inspired isometric adventure featuring an anthropomorphic fox, a constructed runic writing system, and a beautiful in-game instruction manual the player pieces together.**[2] The game won the **BAFTA for Artistic Achievement** and was praised for its **"simple-but-beautiful" art style described as an "extravagant diorama"**.[2]

| Element | Treatment |
|---|---|
| Headings | Uncial Antiqua or MedievalSharp (Google Fonts) — uncial letterforms evoking illuminated manuscripts |
| Body | Nunito or Karla — soft, rounded sans-serif matching Tunic's gentle world |
| Mono | Fira Code with ligatures — connected glyphs echo the runic script |
| Decorative | Noto Sans Runic (Google Fonts) — used *only* for section markers, pull-quote ornaments, and stat labels. Aesthetic glyphs, not translatable. |
| Palette | Deeply muted, warm: parchment #F2EDE4, sage #8CAA7E, dusty rose #C4907C, slate blue #7B95A5, soft gold #D4B87B, charcoal #3A3632. Never pure white or pure black. |
| Corners | Rounded 16px. Inner shadow simulating manual-page indentation. |
| Shadows | Barely-visible inner shadow + faint gold-edge glow on hover |
| Borders | Thin 1px in section accent. Section dividers: horizontal rule flanked by a centred runic SVG glyph. |
| Backgrounds | Subtle parchment texture overlay at ~5% opacity. Watercolour-wash CSS gradients (sage→cream, rose→cream) between sections. Optional faint isometric dot grid. |
| Buttons | Rounded-rectangle "manual page tab." Filled accent at 15% opacity, accent text. Hover: 30% fill, translateY(-1px). Double-line border (manual ruled edge). |
| Motion | Gentle, unhurried. Fade-in with slow vertical drift (page being placed on a table). Stat bars fill with smooth sweep + tiny trailing particle dots (golden sparkle of Tunic item pickups). cubic-bezier(0.25, 0.46, 0.45, 0.94). |
| Character sheet | **"The Hero's Page"** — styled as a discovered manual page. Slightly rotated cream card with ruled margins. Portrait in a rounded frame with colour border. Stats inscribed with runic decorative labels alongside readable English. Category headers in uncial font with runic ornament. |
| Hobby section | Each hobby framed as a manual page with hand-drawn-style SVG border. Section labelled with a runic glyph + readable title. Social embeds in a "field notes" frame. |
| Light mode | Primary — warm parchment cream #F2EDE4 |
| Dark mode | Deep forest brown-black #1E1B17 — warm charcoal, not blue-black. Accents desaturate slightly. |

ts
export const theme = {
  id: 'foxglen',
  colors: {
    accent: '#D4B87B',           // soft gold
    accentHover: '#C4A86B',
    secondary: '#8CAA7E',        // sage green
    tertiary: '#7B95A5',         // slate blue
    highlight: '#C4907C',        // dusty rose
    background: { light: '#F2EDE4', dark: '#1E1B17' },
    surface: { light: '#FAF7F2', dark: '#2A2520' },
    textPrimary: { light: '#3A3632', dark: '#E8E2D6' },
    textSecondary: { light: '#7A756C', dark: '#A09A8E' },
    border: { light: '#D8D2C6', dark: '#3A3530' },
    success: '#8CAA7E',
    warning: '#D4B87B',
    error: '#C4907C',
  },
  fonts: {
    display: "'Uncial Antiqua', 'MedievalSharp', serif",
    sans: "'Nunito', 'Karla', system-ui, sans-serif",
    mono: "'Fira Code', monospace",
    runic: "'Noto Sans Runic', sans-serif",    // decorative only
  },
  radii: { sm: '8px', md: '16px', lg: '20px', full: '9999px' },
  borders: { width: '1px', style: 'solid' },
  shadows: {
    card: 'inset 0 1px 3px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.06)',
    cardHover: '0 4px 16px rgba(212,184,123,0.15)',
  },
  spacing: { section: '110px', sectionMobile: '60px' },
  motion: {
    timingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    durationFast: '200ms', durationNormal: '400ms',
    particleTrail: true,        // golden sparkle on stat bar fill
  },
  characterSheetTheme: {
    panelBg: '#2A2520',
    barGlow: '0 0 8px rgba(212,184,123,0.3)',
    nameFont: "'Uncial Antiqua', serif",
    statFormat: 'manual-page',   // ruled margin, runic labels
    runicLabels: true,           // decorative runes alongside English
  },
  hobbySection: {
    background: { light: '#EDE6DA', dark: '#241F1A' },
    accentOverride: '#C4907C',
    frameStyle: 'manual-page',
    dividerGlyph: '/images/rune-divider.svg',
  },
  extras: {
    parchmentTexture: true,      // 5% opacity overlay
    watercolourDividers: true,   // CSS gradient section breaks
    isometricDotGrid: false,     // optional
    runicSectionMarkers: true,   // SVG glyphs at section breaks
  },
};

---

## 0.7 Theme Comparison Matrix

| Feature | CUPERTINO | ARCADIA | NIGHTCITY | STARFLEET | FOXGLEN |
|---|---|---|---|---|---|
| Mood | Clean, corporate | Nostalgic, playful | Edgy, technical | Structured, exploratory | Gentle, mysterious |
| Dark feel | Void black | NES cartridge | Blade Runner | Starship bridge | Charcoal on vellum |
| Light feel | Airy white | Game Boy parchment | Cool grey | Starfleet dossier | Warm parchment |
| Heading font | Inter | Press Start 2P | Rajdhani | Antonio | Uncial Antiqua |
| Corners | Rounded | Hard 0px | Asymmetric cut | LCARS capsule | Soft 16px |
| Key gimmick | None — pure clarity | Pixel borders, stepped animation | Neon glow, glitch | Colour-block sidebar | Runic glyphs, watercolour dividers |
| Char. sheet | Clean bars | RPG stat screen | Cyberpunk HUD | Personnel dossier | Discovered manual page |
| Extra deps | None | NES.css | None | None | None |
| Recruiter-safe? | ✅ Most professional | ⚠️ Bold | ✅ Dark = slick | ✅ Both modes | ✅ Elegant + unique |
| Fun | ★★★☆☆ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★★ |

## 0.8 Theme Switching Architecture

src/config/themes/
  cupertino.ts
  arcadia.ts
  nightcity.ts
  starfleet.ts
  foxglen.ts
src/config/activeTheme.ts   ← re-exports the chosen one

ts
// src/config/activeTheme.ts
export { theme } from './themes/foxglen'; // change this one line to switch

All components import from activeTheme.ts. Tailwind config reads from it. Switching themes = changing one import.

---

# PART 1 — OVERVIEW & PURPOSE

A professional personal portfolio website for **Espen H. Kristensen** to showcase hobby coding projects and life outside of code. Modular, template-driven, theme-parametrised, defined fully in code. Deployable to **GitHub Pages**, **standalone hosting** (Vercel/Netlify/Cloudflare Pages), or **Azure App Service as a Docker container**.

---

# PART 2 — DESIGN LANGUAGE

Defined entirely by the active theme (see Part 0). All components read from activeTheme.ts. Tailwind config maps tokens into utilities. Responsive: mobile-first, breakpoints at sm:640 / md:768 / lg:1024 / xl:1280. Dark/light mode toggle with system-preference awareness, persisted to localStorage. Icons: Lucide React.

---

# PART 3 — SITE MAP

/                     → Home (front page — all sections)
/projects/:slug       → Individual project page
/blog                 → Medium articles listing (optional)

---

# PART 4 — DATA ARCHITECTURE

## 4.1 Site Configuration

ts
export const siteConfig = {
  name: 'Espen H. Kristensen',
  tagline: 'Data Engineer · Manager @ PwC Norway',
  bio: 'Passionate about data engineering, LLMs and responsible AI. Mathematical background, sports geek, cocktail nerd.',
  profileImage: 'https://avatars.githubusercontent.com/u/9327813?v=4',
  logo: '/images/logo-placeholder.svg',
  resumeUrl: '/files/cv.pdf',
  githubUsername: 'espenhk',
  mediumUsername: 'espen-haukeland-kristensen',
  socials: {
    github: 'https://github.com/espenhk',
    linkedin: 'https://linkedin.com/in/espen-h-kristensen-4770a525',
    medium: 'https://medium.com/@espen-haukeland-kristensen',
    instagram: 'https://instagram.com/bgosl',
    bluesky: 'https://bsky.app/profile/bgosl.bsky.social',
    facebook: 'https://facebook.com/espenhk',
    youtube: '',
    twitter: '',
  },
  linkedinPostEmbedUrl: '',
};

## 4.2 GitHub Fetcher

Fetches public repos from GET /users/espenhk/repos (60 req/hr unauthenticated, 5k/hr with token). Filters out forks and archived repos. Paginates automatically. Runs at build time (SSG) or client-side (SPA) depending on tech path.

## 4.3 Medium RSS Fetcher

Fetches latest 10 posts from https://medium.com/feed/@espen-haukeland-kristensen via rss2json. Returns title, link, pubDate, thumbnail, contentSnippet.

## 4.4 Project Overrides & Resolved Projects

Only espenhk/* repos. Local overrides for editorial control:

ts
export const projectOverrides: ProjectOverride[] = [
  // === FEATURED ===
  {
    repoName: 'myfootballflags',
    featured: true, sortOrder: 1,
    titleOverride: 'MyFootballFlags',
    subtitleOverride: 'Live NFL play-by-play CLI for fantasy football nerds',
  },
  {
    repoName: 'python-ODESolver',
    featured: true, sortOrder: 2,
    titleOverride: 'Python ODE Solver',
    subtitleOverride: 'Runge-Kutta & Euler methods for ordinary differential equations',
  },
  {
    repoName: 'python-war-on-zombies',
    featured: true, sortOrder: 3,
    titleOverride: 'War on Zombies',
    subtitleOverride: 'Epidemiology simulation: pandemic spread, vaccines, and the undead',
  },
  {
    repoName: 'advent-of-code-2022',
    featured: false, sortOrder: 4,
    titleOverride: 'Advent of Code 2022',
    subtitleOverride: 'Daily coding puzzles solved in Python',
  },
  {
    repoName: 'gameoflife',
    featured: false, sortOrder: 5,
    titleOverride: "Conway's Game of Life",
    subtitleOverride: 'Classic cellular automaton in Java',
  },
  // === HIDDEN ===
  { repoName: 'bicep-training', hidden: true },
  { repoName: 'github-actions-training', hidden: true },
  { repoName: 'github-actions-tutorial001', hidden: true },
  { repoName: 'github-actions-tutorial002', hidden: true },
  { repoName: 'tomatoes', hidden: true },
  { repoName: 'ml-society-science', hidden: true },
];

The resolver merges GitHub API data + overrides → unified Project[] array.

## 4.5 Character Sheet Stats

ts
export const characterSheet = {
  name: 'Espen H. Kristensen',
  title: 'Data Engineer / Manager',
  portraitImage: 'https://avatars.githubusercontent.com/u/9327813?v=4',
  tagline: '"Sports geek · Cocktail nerd · Data wrangler"',
  stats: [
    { label: 'Python', value: 90, category: 'language' },
    { label: 'SQL', value: 88, category: 'language' },
    { label: 'Java', value: 65, category: 'language' },
    { label: 'Bicep / IaC', value: 60, category: 'language' },
    { label: 'Azure Data', value: 85, category: 'framework' },
    { label: 'Power BI', value: 80, category: 'framework' },
    { label: 'Kafka / Confluent', value: 75, category: 'framework' },
    { label: 'GitHub Actions', value: 70, category: 'framework' },
    { label: 'Data Engineering', value: 92, category: 'tool' },
    { label: 'Machine Learning', value: 78, category: 'tool' },
    { label: 'NLP', value: 72, category: 'tool' },
    { label: 'Data Anonymisation', value: 80, category: 'tool' },
    { label: 'Integration', value: 75, category: 'tool' },
    { label: 'Responsible AI', value: 77, category: 'tool' },
    { label: 'Communication', value: 90, category: 'soft-skill' },
    { label: 'Technical Writing', value: 85, category: 'soft-skill' },
    { label: 'Cocktail Mixing', value: 88, category: 'soft-skill' },
  ],
};

CV pipeline: scripts/cv-to-stats.ts reads JSON Resume → writes characterSheet.ts.

## 4.6 Hobbies Data

ts
export const hobbies: Hobby[] = [
  {
    slug: 'flag-football',
    name: 'Flag Football',
    role: 'Wide Receiver / Safety',  // update with real position
    teamName: 'TBD',                 // fill in
    teamLogo: '/images/hobbies/team-logo-placeholder.svg',
    description: 'Competing in Norwegian flag football.',
    coverImage: '/images/hobbies/flag-football-placeholder.webp',
    links: [
      { label: 'Team Website', url: '#', icon: 'globe' },
      { label: 'Instagram', url: '#', icon: 'instagram' },
      { label: 'Facebook', url: '#', icon: 'facebook' },
    ],
    pinnedEmbeds: [],
    gallery: [],
    stats: [],
    sortOrder: 1,
  },
];

## 4.7 Bio Texts

**Professional:**
> Espen H. Kristensen is a data engineer and manager at PwC Norway in Tromsø, working with data engineering, LLMs, and responsible AI. He holds a degree from the University of Oslo spanning algorithms, machine learning, NLP, reinforcement learning, numerical modelling, and image analysis — giving him a mathematical depth that goes well beyond the average data practitioner. He's certified across Azure Data Fundamentals, Power BI Data Analyst Associate, IBM ACE, webMethods, Confluent (Kafka), and SAFe 5 Agilist. He writes on Medium about topics like data anonymisation in practice — covering k-anonymisation, l-diversity, t-closeness, and differential privacy.

**Off the Clock:**
> A self-described sports geek and cocktail nerd. Served as a communication specialist in the Norwegian Armed Forces' Signal Battalion (Northern Brigade, Bardufoss). A lifelong American football enthusiast who once built a Java CLI for live NFL play-by-plays. Plays flag football. Has bartended at Fuglen — Oslo's legendary cocktail bar — and debates Negroni ratios with differential-privacy rigour. Originally from western Norway, lived in Oslo most of his adult life, recently moved to Tromsø above the Arctic Circle.

---

# PART 5 — FRONT PAGE SECTIONS

1. **Hero** — full-viewport. Profile image, name, tagline, bio. CTAs: "View Projects", "Download CV".
2. **GitHub Commit Graph** — react-github-calendar for espenhk, themed to accent.
3. **Featured Projects Grid** — responsive 1→2→3 col card grid from featured projects.
4. **Character Sheet** — Tekken-style (or theme-variant) panel with animated stat bars.
5. **Beyond the Code — Hobbies** — full-width hobby cards with cover image/carousel, links, social embeds (react-social-media-embed), fun stats.
6. **Latest Medium Articles** — article cards from RSS feed.
7. **Social Links & LinkedIn Post** — social icon row, LinkedIn embed, CV button.
8. **Footer** — name, copyright, social icons, credit.

---

# PART 6 — PROJECT PAGE (/projects/:slug)

Hero banner → metadata bar → Markdown body → interactive elements → "Back" link.

Interactive element types: image-carousel, embedded-game, interactive-diagram, power-bi, youtube-embed.

---

# PART 7 — INTERACTIVE COMPONENT REGISTRY

ts
export const interactiveRegistry: Record<string, () => Promise<{ default: React.FC }>> = {
  'NetworkDiagram': () => import('./NetworkDiagram'),
  'DataFlowDiagram': () => import('./DataFlowDiagram'),
};

---

# PART 8 — PLACEHOLDER IMAGES

| Image | Path | Spec |
|---|---|---|
| Profile | GitHub avatar URL (live) | 400×400 |
| Logo | /images/logo-placeholder.svg | SVG, 40px |
| Project hero | /images/projects/{slug}-placeholder.webp | 1200×630 |
| Character portrait | GitHub avatar URL (live) | 600×800 |
| OG | /images/og-default.webp | 1200×630 |
| Hobby cover | /images/hobbies/{slug}-placeholder.webp | 1200×630 |
| Team logo | /images/hobbies/{team}-logo-placeholder.svg | SVG, 60px |
| Rune divider | /images/rune-divider.svg | SVG (FOXGLEN only) |

---

# PART 9 — SEO & METADATA

Per-page <title>, <meta description>, OG tags. Auto-generated sitemap. robots.txt.

---

# PART 10 — MAINTAINABILITY

| Action | Effort |
|---|---|
| Add project | Push new public repo to espenhk. Optionally add override. |
| Add article | Publish on Medium. Auto-appears. |
| Add hobby | Add entry to hobbies.ts + images. |
| Change theme | Change one import in activeTheme.ts. |
| Update stats | Run scripts/cv-to-stats.ts. |
| Deploy | npm run build or docker build. |

---

# PART 11 — THREE TECH PATHS

| | Path A: Astro 5 + React | Path B: Next.js 15 | Path C: Vite + React SPA |
|---|---|---|---|
| Best for | GitHub Pages, max perf | Azure container, ISR | Lovable, fastest start |
| Lighthouse | ★★★★★ | ★★★☆☆ | ★★★☆☆ |
| GitHub Pages | ✅ | ✅ (output: 'export') | ✅ |
| Azure container | ⚠️ | ✅ Ideal | ✅ (Nginx) |
| Lovable compat | ❌ | ✅ | ✅ Direct |
| SEO (no JS) | ✅ | ✅ | ⚠️ |
| Live data | ❌ Build only | ✅ ISR | ✅ Client fetch |

---

# PART 12 — DEPLOYMENT TARGETS

**GitHub Pages:** Static only. 404.html hack for SPA routing. Base-path for sub-path. Daily cron rebuild.

**Standalone (Vercel/Netlify/CF):** Auto-deploy on push. ISR on Vercel. Free.

**Azure App Service:** Path B: Node.js on 3000. Path C: Nginx on 80. ACR push. ~$13/mo B1.

Dockerfiles for both Path B (Next.js SSR) and Path C (Vite+Nginx) provided in previous spec iterations — unchanged.

---

# PART 13 — SHARED COMPONENT LIBRARY

ProjectCard, CharacterSheet, StatBar, HobbyCard, HobbyGallery, HobbyStats, HobbyLinks, HobbySocialEmbeds, ImageCarousel, PowerBIEmbed, YouTubeEmbed, GameEmbed, GitHubGraph, MediumArticleCard, SocialBar, ThemeToggle, Button, TagPill, Card.

---

# PART 14 — FILE STRUCTURE (Path B — Next.js)

/
├── public/images/ & files/
├── src/
│   ├── config/themes/ (5 theme files) + activeTheme.ts
│   ├── data/ (siteConfig, projectOverrides, characterSheet, hobbies)
│   ├── lib/ (github/, medium/, resolveProjects.ts)
│   ├── app/ (layout, page, projects/[slug], blog)
│   ├── components/
│   │   ├── sections/ (Hero, GitHubGraph, FeaturedProjects, CharacterSheet, HobbiesSection, MediumArticles, SocialBar, Footer)
│   │   ├── hobby/ (HobbyCard, HobbyGallery, HobbyStats, HobbyLinks, HobbySocialEmbeds)
│   │   ├── interactive/ (registry, ImageCarousel, PowerBIEmbed, YouTubeEmbed, GameEmbed)
│   │   └── ui/ (Button, Card, TagPill, StatBar)
│   └── styles/globals.css
├── scripts/cv-to-stats.ts
├── Dockerfile
├── tailwind.config.ts
├── package.json
└── .github/workflows/ (deploy-gh-pages.yml, deploy-azure.yml)

---

# PART 15 — CI/CD WORKFLOWS

**GitHub Pages:** Build on push + daily cron. Upload to Pages.

**Azure:** Docker build → push to ACR → restart App Service.

(Full YAML provided in previous iterations — unchanged.)

---

# PART 16 — LOVABLE PROMPT SEQUENCE

1. Scaffold (theme, navbar, footer, dark mode)
2. Hero (profile, bio, CTAs)
3. GitHub Graph
4. Project Cards (fetch from GH API, cache)
5. Character Sheet (animated bars)
6. Hobbies ("Beyond the Code", social embeds)
7. Medium Articles (RSS fetch)
8. Social & LinkedIn
9. Project Page (dynamic route, interactive elements)

---

# PART 17 — SUMMARY

This specification is self-contained. Every data structure, component, deployment path, design token, bio text, repo list, and theme configuration is defined here. **Build the five MWEs first (Part 0). Get approval. Then build the full site.** An AI builder, a human developer, or a future Espen can reproduce the site deterministically from this document alone.

Citations:
[1] https://www.youtube.com/watch?v=pUy9rQdKV44
[2] https://en.wikipedia.org/w/index.php?title=Tunic_(video_game)&printable=yes

# Arguments about tech:


## Tech Stack Showdown: Astro vs Next.js vs Vite SPA

### The Core Tension

This site sits at an awkward sweet spot: it's fundamentally a **content portfolio** (which screams static), but the spec demands **heavy interactivity** (carousels, animated character sheets, live GitHub/Medium fetches, Power BI iframes, social embeds, games). That tension is what makes the choice non-trivial.

---

### Path A — Astro 5 + React Islands

**The argument for:** Astro ships zero JavaScript by default. For a portfolio where 70% of the page is static text, images, and cards, this is a genuine advantage. Lighthouse scores will hit 99–100 out of the box. Build output is plain HTML — perfect for GitHub Pages with zero configuration headaches. It's the leanest possible production bundle.

**The argument against:** Your spec has interactive components in *almost every section*: the GitHub calendar, the character sheet with scroll-triggered Framer Motion animations, the image carousels, the social embeds in the hobbies section, the Power BI iframes, the Medium fetch. Each one becomes a React island with its own hydration boundary. At some point you're managing a dozen client:visible directives and debugging hydration mismatches — you're fighting the framework instead of using it. Worse, **Lovable doesn't output Astro**. Every component Lovable generates needs to be manually rewrapped in .astro files. That kills the "AI-generated, easily maintainable" promise of the spec. And if you ever want the site on Azure App Service with ISR (so new GitHub repos appear without a redeploy), Astro's SSR story via the Node adapter is less mature and less documented than Next.js.

**Verdict:** The right tool if you're a purist who values Lighthouse scores above all else and is comfortable doing manual Astro integration work. The wrong tool if you want Lovable compatibility or Azure SSR.

---

### Path B — Next.js 15 + App Router

**The argument for:** This is the most *capable* option. React components work natively — no island pattern, no hydration wrangling. The App Router gives you React Server Components for the static parts (hero, footer, metadata) and client components for interactive sections, with the framework handling the boundary automatically. ISR means you deploy once and the site re-fetches your GitHub repos and Medium feed on a configurable schedule without a redeploy — critical for the Azure container use case. API routes are available if you later want a /api/refresh webhook or a contact form. The ecosystem is enormous: every tutorial, every Stack Overflow answer, every AI tool understands Next.js. Lovable output maps almost directly to Next.js components.

**The argument against:** You pay for that capability in bundle size. Next.js ships ~150–200KB of JavaScript to the client versus Astro's ~8–30KB. For a personal portfolio that gets a few hundred visits a month, that's over-engineering. The App Router caching model is notoriously confusing — there's revalidate, dynamic, force-static, force-dynamic, unstable_cache, and they interact in non-obvious ways. You will hit caching bugs during development. Self-hosting the Next.js server (on Azure, outside Vercel) requires managing a Node.js process, health checks, memory limits, and cold starts — real operational overhead for what could be a static site. And if you ultimately deploy to GitHub Pages, you must use output: 'export', which disables ISR, API routes, and middleware — stripping away the very features that justify choosing Next.js in the first place.

**Verdict:** The right tool if Azure App Service is a real deployment target and you want always-fresh data without redeploys. Overkill if you're just putting this on GitHub Pages.

---

### Path C — Vite + React SPA

**The argument for:** This is what Lovable actually generates. Zero translation layer — paste the spec prompts into Lovable, get a working codebase, deploy. The mental model is the simplest: it's just React. Every component is a regular React component. There's no framework magic, no server/client boundary to reason about, no island hydration, no caching model. npm run build produces a dist/ folder of static files that works on GitHub Pages, Vercel, Netlify, or an Nginx container on Azure. The Nginx container is ~25MB and starts in under a second — the lightest possible Azure deployment. For a developer maintaining this in spare hours between data engineering work, simplicity has real value.

**The argument against:** No server-side rendering. Google *does* execute JavaScript now, but your initial page load is a white screen until the JS bundle parses and React mounts. That's ~120–180KB of JavaScript before anything renders — a meaningful delay on mobile. The GitHub and Medium data is fetched client-side in every visitor's browser, which means: loading spinners instead of instant content, and each visitor's browser hits the GitHub API (60 req/hr per IP — fine for a portfolio, but inelegant). There's no build-time image optimisation — you're serving whatever you put in /public/. And there's a subtle long-term risk: if you ever want to add anything server-side (auth, a CMS, dynamic OG images), you'll hit a wall and need to migrate to Next.js anyway.

**Verdict:** The right tool if you want the fastest path from spec to deployed site with minimum complexity. The wrong tool if SEO without JavaScript or server-side capabilities matter to you.

---

### The Decision Framework

| If your priority is… | Choose |
|---|---|
| **Fastest from Lovable to live site** | **Path C** (Vite SPA) |
| **GitHub Pages as sole target, maximum performance** | **Path A** (Astro) |
| **Azure App Service container with live data** | **Path B** (Next.js) |
| **Minimum maintenance burden** | **Path C** — fewest concepts to understand |
| **Future-proofing for features you haven't imagined** | **Path B** — most extensible |
| **Best Lighthouse scores for bragging rights** | **Path A** — nothing beats zero-JS static HTML |

### My Recommendation

**Start with Path C.** Here's why: the spec explicitly prioritises Lovable compatibility, ease of maintenance, and "defined fully in code." Path C delivers all three with the least friction. Build the five MWEs in Lovable, pick a theme, generate the full site. Deploy to GitHub Pages immediately. Total time-to-live: hours, not days.

If you later decide you want ISR or server-side features, migrating from Vite+React to Next.js is a well-trodden path — your components, data files, and Tailwind config transfer unchanged. You're essentially adding a framework shell around existing code. The reverse migration (Next.js → Astro) is much harder.

Path A (Astro) is the theoretically elegant choice, but the mismatch with Lovable and the island-management overhead for this particular spec make it the hardest to maintain in practice. Save it for a future project that's truly content-only.

Let’s start with path C as the stack.`,
    },
  },
  {
    phase: 'Phase 1',
    icon: <Sparkles size={20} />,
    title: 'First Generation — "Show Me Five Worlds"',
    description:
      'The moment of truth. I pasted the 4,500-word spec into Lovable and hit enter. What came back was five self-contained mini-sites — five alternate realities for what this portfolio could be.',
    details: [
      'Lovable generated all five MWEs sharing the same component structure, differing only in theme.ts. Each had a hero, project card, stat bars, dark/light toggle, and footer. Same skeleton, five different skins.',
      { reflection: 'When I saw the MWEs side by side, after a bit of iteration, they all felt pretty cool. The Foxglen theme, meant to be heavily inspired by the Tunic videogame (go play that btw), was the one I was most curious about.' },
      'Cupertino was polished but anonymous — it could have been anyone\'s portfolio. Arcadia made me smile, but pixelated headings at 14px aren\'t great for readability.',
      'Nightcity looked incredible in screenshots but felt exhausting to actually read. The neon glow was a vibe, not an interface.',
      'Foxglen was the surprise contender — the parchment texture and uncial headings created something genuinely unique. But the execution never quite matched the vision I had in my head.',
      { reflection: 'I was sad to let the Foxglen theme go, since I loved the idea but the execution never got close to my vision. I\'d definitely revisit it for a different project someday.' },
      'Starfleet won. The LCARS amber bars, the structured layout, the "personnel file" framing — it felt like it was designed for someone who thinks in data pipelines and system architecture.',
      'Once selected, Lovable generated the full single-page app: all sections from the spec, ThemeContext, data files, nav bar, GitHub API integration — the whole scaffold, in one shot.',
      { reflection: 'The first full generation of each theme was quite unfinished, in general not being playful enough with colors and looking in large part like the same theme with different font choices. Each needed nurturing to get it good, and Starfleet was still the clear favorite despite iterating on each a lot.' },
    ],
    toolsUsed: ['Lovable AI', 'React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    color: '#FF9F1C',
    preview: <MiniThemeSwatches />,
  },
  {
    phase: 'Phase 2',
    icon: <Code2 size={20} />,
    title: 'The Iteration Grind',
    description:
      'This is where the glamorous "AI built my website" story becomes the real one. Phase 2 was dozens of follow-up prompts, each one fixing something the last one broke, chasing pixel-perfect results across screen sizes.',
    details: [
      '🔁 Mobile responsiveness was a recurring battle. The Three.js canvas (added for 3D section avatars) kept overflowing the viewport on iPhone. Every fix on one device shifted something on another.',
      { reflection: 'I cut the 3D elements once I realized they were really fiddly, and I had to find a website that could AI-generate avatars. It would still have caused issues.' },
      '🔁 The GitHub Activity Log background color refused to match the rest of the page. Fixed it, looked great, scrolled down — the Repositories section was now the wrong shade. This happened at least three times.',
      '🔁 Section background consistency across the entire page was a whack-a-mole game. Fix one section, break the gradient transition to the next.',
      { reflection: 'The turning point of the iteration feeling productive rather than just repetitive, was once the first Medium/YouTube section was properly up and running. This felt good!' },
      'Nav bar scroll behavior: blur background, active section highlighting, mobile hamburger — each of these was its own mini-project within the project',
      'Character Sheet stat bars got glow effects on high stats, category grouping, color coding — this section was pure fun to tune',
      'Dark/light theme toggle: every single section needed individual attention. What looks great in dark mode at 11pm looks washed out in light mode at noon.',
      { reflection: 'Most of the hours of Phase 2 were fun iteration. It never really got properly frustrating, but I think that was because I started by staying far outside the implementation, nailing a relatively good prompt first.' },
    ],
    toolsUsed: ['Lovable AI', 'Three.js', 'React Three Fiber', 'GitHub API'],
    color: '#99CCFF',
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MiniCharacterSheet />
        <MiniNavBar />
      </div>
    ),
  },
  {
    phase: 'Phase 3',
    icon: <Layers size={20} />,
    title: 'Filling In the Blanks',
    description:
      'With the design locked, it was time to make it real. This phase was less about code and more about content — translating a career into structured data, and making sure the story told was accurate.',
    details: [
      'Work history went in: PwC Norway (Manager), Kantega AS (Data Engineer), Avella AS (Integration Consultant), Kobler AS (News Trend Analyst). Four roles, four very different chapters.',
      { reflection: 'Reducing each job to a one-line description was super useful, and the model behind Lovable was able to do this quite well on its own. I don\'t feel much of relevance was omitted.' },
      'Project overrides for featured repos: MyFootballFlags, Python ODE Solver, War on Zombies. Each needed a custom description and hero image because the README alone doesn\'t tell the story.',
      'LinkedIn post data with engagement metrics went into the Transmissions carousel. This section was about showing a public voice, not just code.',
      '🔁 The Academy section had descriptions stuck in Norwegian from the CV parse — "Forsterkningslæring" doesn\'t mean much to an international audience. Translated and repositioned.',
      { reflection: 'The CV-to-data pipeline has not been tested yet, but the idea is to make it relatively simple to update this and/or migrate it to multiple people.' },
      'Six certifications, three education entries, four spoken languages, and a Medium publication list including the 4-part data anonymisation series',
      'The "Off-Duty Interests" section — flag football, hiking, genre fiction — felt like the hardest content to write. Technical stuff has structure; personality doesn\'t.',
      { reflection: 'I didn\'t deliberately leave anything out yet, except the repo sections covering forked repos I never worked much on. That felt a bit dishonest to have as featured.' },
    ],
    toolsUsed: ['Manual data entry', 'CV parsing', 'Content writing'],
    color: '#66CC99',
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MiniTimeline />
        <MiniRepoCard />
      </div>
    ),
  },
  {
    phase: 'Phase 4',
    icon: <Rocket size={20} />,
    title: 'Ship It (and Then Keep Going)',
    description:
      'The finishing line is a lie — there\'s always one more thing. But at some point you have to call it, push it live, and let people see it.',
    details: [
      'Responsive QA across desktop, tablet, and mobile viewports. Every breakpoint is a chance for something to quietly fall apart.',
      { reflection: 'The last thing to fix was all of it. Just going through small things, looking at how hovers and such worked, where a lot of smaller adjustments were necessary. I tried to pool a set of feedback with each prompt, so I didn\'t wait too long.' },
      'Published via Lovable\'s one-click deploy to espenhk.lovable.app',
      'Built this very page you\'re reading right now 🤯 — a meta-layer that documents how the thing was built, inside the thing itself',
      { reflection: 'I built this page much for myself, to test tools like Lovable that touch upon a way of coding that is new for me. It\'s also potentially useful for recruiters, colleagues, new clients etc. to showcase what I know.' },
    ],
    toolsUsed: ['Lovable Publish', 'GitHub', 'Custom domain'],
    color: '#E8655A',
  },
];

/* ── step card ──────────────────────────────────────────── */

function StepCard({ step, index }: { step: Step; index: number }) {
  const [open, setOpen] = useState(false);
  const { theme, isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div style={{
        background: isDark ? `${theme.colors.surface.dark}B3` : `${theme.colors.surface.light}CC`,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 12,
        overflow: 'hidden',
        backdropFilter: 'blur(8px)',
      }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '20px 24px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `${step.color}20`,
            border: `1px solid ${step.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: step.color, flexShrink: 0,
          }}>
            {step.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: theme.fonts.mono, fontSize: '0.65rem',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: step.color, marginBottom: 2,
            }}>
              {step.phase}
            </div>
            <div style={{
              fontFamily: theme.fonts.sans, fontWeight: 600, fontSize: '1.05rem',
              color: isDark ? theme.colors.textPrimary.dark : theme.colors.textPrimary.light,
            }}>
              {step.title}
            </div>
          </div>
          <div style={{ color: isDark ? 'rgba(208,208,208,0.5)' : 'rgba(0,0,0,0.3)' }}>
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '0 24px 24px' }}>
                <p style={{
                  fontFamily: theme.fonts.sans, fontSize: '0.88rem', lineHeight: 1.7,
                  color: isDark ? 'rgba(208,208,208,0.8)' : 'rgba(0,0,0,0.6)',
                  marginBottom: 16,
                }}>
                  {step.description}
                </p>

                {/* Mini preview */}
                {step.preview && (
                  <div style={{ marginBottom: 16 }}>
                    {step.preview}
                  </div>
                )}

                <div style={{ margin: '0 0 16px' }}>
                  {step.details.map((d, i) => (
                    typeof d === 'object' && 'reflection' in d ? (
                      <AuthorReflection key={i} text={(d as { reflection: string }).reflection} color={step.color} />
                    ) : typeof d === 'object' && 'prompt' in d ? (
                      <AuthorPrompt key={i} prompt={(d as { prompt: string }).prompt} color={step.color} />
                    ) : (
                      <div key={i} style={{
                        fontFamily: theme.fonts.sans, fontSize: '0.82rem', lineHeight: 1.6,
                        color: isDark ? 'rgba(208,208,208,0.65)' : 'rgba(0,0,0,0.5)',
                        padding: '4px 0 4px 16px', position: 'relative',
                      }}>
                        <span style={{ position: 'absolute', left: 0, color: step.color, fontWeight: 700 }}>›</span>
                        {d}
                      </div>
                    )
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {step.toolsUsed.map(t => (
                    <span key={t} style={{
                      fontFamily: theme.fonts.mono, fontSize: '0.6rem',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      padding: '3px 8px', borderRadius: 4,
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      color: isDark ? 'rgba(208,208,208,0.6)' : 'rgba(0,0,0,0.45)',
                    }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Expandable sub-section (e.g. original prompt) */}
                {step.expandableSection && (
                  <ExpandablePrompt title={step.expandableSection.title} content={step.expandableSection.content} color={step.color} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── page ────────────────────────────────────────────────── */

function PageContent() {
  const { theme, isDark } = useTheme();
  const navigate = useNavigate();

  const mainBg = isDark
    ? `linear-gradient(180deg, ${theme.colors.background.dark} 0%, ${theme.colors.surface.dark} 50%, ${theme.colors.background.dark} 100%)`
    : theme.colors.background.light;

  return (
    <div style={{
      background: isDark ? undefined : mainBg,
      backgroundImage: isDark ? mainBg : undefined,
      minHeight: '100vh',
      padding: '60px 20px 80px',
    }}>
      <Helmet>
        <title>How I Built This Site — Espen H. Kristensen</title>
        <meta name="description" content="Behind the scenes: how this portfolio was built with Lovable, from prompt design with Claude to theme system, data integrations, and deploy." />
        <link rel="canonical" href="https://espenhk.lovable.app/how-i-did-it" />
        <meta property="og:title" content="How I Built This Site — Espen H. Kristensen" />
        <meta property="og:description" content="Behind-the-scenes write-up of building a portfolio with Lovable: prompt design, theme system, data integrations, and deploy." />
        <meta property="og:url" content="https://espenhk.lovable.app/how-i-did-it" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "How I Built This Site",
          "description": "Behind-the-scenes write-up of building a portfolio with Lovable: prompt design, theme system, data integrations, and deploy.",
          "author": { "@type": "Person", "name": "Espen H. Kristensen" },
          "url": "https://espenhk.lovable.app/how-i-did-it"
        })}</script>
      </Helmet>
      <main style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Back link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: theme.fonts.mono, fontSize: '0.72rem',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            color: isDark ? 'rgba(208,208,208,0.5)' : 'rgba(0,0,0,0.4)',
            marginBottom: 48, padding: '6px 0',
          }}
        >
          <ArrowLeft size={14} /> Back to portfolio
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 20 }}
        >
          <div style={{
            fontFamily: theme.fonts.mono, fontSize: '0.65rem',
            textTransform: 'uppercase', letterSpacing: '0.15em',
            color: theme.colors.accent, marginBottom: 12,
          }}>
            Behind the scenes
          </div>
          <h1 style={{
            fontFamily: theme.fonts.display,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 400,
            color: isDark ? theme.colors.textPrimary.dark : theme.colors.textPrimary.light,
            lineHeight: 1.1, margin: 0,
          }}>
            How I Built This Site
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontFamily: theme.fonts.sans, fontSize: '0.95rem', lineHeight: 1.7,
            color: isDark ? 'rgba(208,208,208,0.7)' : 'rgba(0,0,0,0.55)',
            marginBottom: 48, maxWidth: 580,
          }}
        >
          This portfolio was built entirely with{' '}
          <a href="https://lovable.dev" target="_blank" rel="noopener" style={{ color: theme.colors.accent, textDecoration: 'none' }}>
            Lovable <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </a>
          , with the initial prompt carefully crafted through multiple rounds of iteration with Claude Opus 4.6. Five visual themes were proposed, one was selected, and the rest was iterative refinement. Here's the full breakdown.
        </motion.p>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 43, top: 56, bottom: 56, width: 1,
            background: isDark
              ? `linear-gradient(180deg, transparent, ${theme.colors.accent}33, transparent)`
              : 'linear-gradient(180deg, transparent, rgba(0,0,0,0.08), transparent)',
          }} />
          {steps.map((step, i) => (
            <StepCard key={i} step={step} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: 56, padding: '20px 24px', borderRadius: 12,
            background: isDark ? `${theme.colors.accent}0F` : `${theme.colors.accent}14`,
            border: `1px solid ${isDark ? `${theme.colors.accent}1F` : `${theme.colors.accent}26`}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <MessageSquare size={18} style={{ color: theme.colors.accent, marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{
                fontFamily: theme.fonts.sans, fontSize: '0.85rem', lineHeight: 1.7,
                color: isDark ? 'rgba(208,208,208,0.75)' : 'rgba(0,0,0,0.6)',
                margin: 0,
              }}>
                <strong style={{ color: isDark ? theme.colors.textPrimary.dark : theme.colors.textPrimary.light }}>Total time:</strong> ~8–10 hours from blank canvas to published site.
                The key insight was front-loading effort into prompt design with Claude — a detailed, well-structured brief
                let Lovable generate ~80% of the site in one shot, then iterative refinement handled the remaining 20%.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function HowIDidIt() {
  return (
    <ThemeProvider>
      <PageContent />
    </ThemeProvider>
  );
}
