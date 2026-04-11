import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Sparkles, MessageSquare, Code2, Layers, Rocket, Brain, Palette } from 'lucide-react';
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
      background: isDark ? 'rgba(12,18,40,0.8)' : 'rgba(0,0,0,0.03)',
      border: `1px solid ${isDark ? 'rgba(255,159,28,0.1)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: 8, padding: 14, maxWidth: 260,
    }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FF9F1C', marginBottom: 8 }}>
        ▸ Character Sheet Preview
      </div>
      <MiniStatBar label="Data Engineering" value={85} color="#CC99FF" />
      <MiniStatBar label="Python" value={75} color="#FF9F1C" />
      <MiniStatBar label="SQL" value={80} color="#FF9F1C" />
      <MiniStatBar label="Azure Databricks" value={80} color="#99CCFF" />
    </div>
  );
}

function MiniRepoCard() {
  const { theme, isDark } = useTheme();
  return (
    <div style={{
      background: isDark ? 'linear-gradient(145deg, #0C1228 0%, #101A38 50%, #0C1228 100%)' : '#fff',
      border: `1px solid ${isDark ? 'rgba(255,159,28,0.08)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: 8, padding: 12, maxWidth: 260,
    }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FF9F1C', marginBottom: 8 }}>
        ▸ Repository Card Preview
      </div>
      <div style={{ fontFamily: theme.fonts.sans, fontSize: '0.78rem', fontWeight: 600, color: isDark ? '#F0EDDF' : '#1A1A2E', marginBottom: 4 }}>
        espenhk/portfolio
      </div>
      <div style={{ fontFamily: theme.fonts.sans, fontSize: '0.65rem', color: isDark ? '#9A9AAF' : '#5A5A6A', marginBottom: 8 }}>
        Personal portfolio site built with Lovable
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3178C6', display: 'inline-block' }} />
          <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', color: isDark ? '#9A9AAF' : '#5A5A6A' }}>TypeScript</span>
        </span>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', color: isDark ? '#9A9AAF' : '#5A5A6A' }}>⭐ 2</span>
      </div>
    </div>
  );
}

function MiniNavBar() {
  const { theme, isDark } = useTheme();
  const items = ['Stats', 'Posts', 'Contact', 'Repos', 'Work'];
  return (
    <div style={{
      background: isDark ? 'rgba(6,10,24,0.85)' : 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(12px)',
      borderRadius: 8, padding: '8px 14px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      maxWidth: 320,
    }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FF9F1C', marginBottom: 6 }}>
        ▸ Nav Bar Preview
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {items.map((item, i) => (
          <span key={item} style={{
            fontFamily: theme.fonts.mono,
            fontSize: '0.55rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: i === 0 ? '#FF9F1C' : (isDark ? 'rgba(208,208,208,0.5)' : 'rgba(0,0,0,0.4)'),
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
    { role: 'Manager', company: 'Bouvet', period: '2024–Present' },
    { role: 'Sr. Consultant', company: 'Bouvet', period: '2021–2024' },
  ];
  return (
    <div style={{
      background: isDark ? 'rgba(12,18,40,0.8)' : 'rgba(0,0,0,0.03)',
      border: `1px solid ${isDark ? 'rgba(255,159,28,0.08)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: 8, padding: 14, maxWidth: 260,
    }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FF9F1C', marginBottom: 8 }}>
        ▸ Experience Preview
      </div>
      {jobs.map((j, i) => (
        <div key={i} style={{
          padding: '6px 0',
          borderTop: i > 0 ? `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}` : undefined,
        }}>
          <div style={{ fontFamily: theme.fonts.sans, fontSize: '0.72rem', fontWeight: 600, color: isDark ? '#F0EDDF' : '#1A1A2E' }}>
            {j.role}
          </div>
          <div style={{ fontFamily: theme.fonts.sans, fontSize: '0.6rem', color: isDark ? '#9A9AAF' : '#5A5A6A' }}>
            {j.company} · {j.period}
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniThemeSwatches() {
  const { theme, isDark } = useTheme();
  const themes = [
    { name: 'Starfleet', colors: ['#FF9F1C', '#CC99FF', '#99CCFF', '#0A0E1A'], selected: true },
    { name: 'Noir', colors: ['#E0E0E0', '#888', '#555', '#111'] },
    { name: 'Cyberpunk', colors: ['#00FF87', '#FF0080', '#00D4FF', '#0D0221'] },
    { name: 'Earth', colors: ['#8B6914', '#4A7C59', '#C4956A', '#2C1810'] },
    { name: 'Arctic', colors: ['#64B5F6', '#E1BEE7', '#80CBC4', '#E8EAF6'] },
  ];
  return (
    <div style={{
      background: isDark ? 'rgba(12,18,40,0.8)' : 'rgba(0,0,0,0.03)',
      border: `1px solid ${isDark ? 'rgba(255,159,28,0.1)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: 8, padding: 14, maxWidth: 320,
    }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#CC99FF', marginBottom: 10 }}>
        ▸ Theme Candidates
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {themes.map(t => (
          <div key={t.name} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 8px',
            borderRadius: 6,
            background: t.selected ? (isDark ? 'rgba(255,159,28,0.08)' : 'rgba(255,159,28,0.06)') : 'transparent',
            border: t.selected ? '1px solid rgba(255,159,28,0.2)' : '1px solid transparent',
          }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {t.colors.map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c, border: '1px solid rgba(255,255,255,0.1)' }} />
              ))}
            </div>
            <span style={{
              fontFamily: theme.fonts.mono, fontSize: '0.6rem',
              color: t.selected ? '#FF9F1C' : (isDark ? 'rgba(208,208,208,0.5)' : 'rgba(0,0,0,0.4)'),
              fontWeight: t.selected ? 700 : 400,
            }}>
              {t.name} {t.selected && '✓'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── step data ──────────────────────────────────────────── */

interface Step {
  phase: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
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
      'Before opening Lovable, I spent time with Claude Opus 4.6 designing the portfolio concept and writing a detailed prompt. Claude proposed five distinct visual themes to choose from.',
    details: [
      'Started with a loose brief: "I want a portfolio that feels like an RPG character sheet"',
      'Claude generated five visual theme directions: Starfleet (sci-fi amber), Noir (monochrome elegance), Cyberpunk (neon glitch), Earth (warm naturals), and Arctic (cool minimal)',
      'Each theme came with a color palette, font pairing, and layout philosophy',
      'We iterated on the Starfleet concept — it had the right balance of personality and professionalism',
      'Over ~8 rounds, refined the prompt to cover every section: Hero, Character Sheet, Transmissions, Repositories, Experience, Contact',
      'The final prompt was ~2,000 words specifying layout, design tokens (VT323, Outfit, JetBrains Mono), color system (#FF9F1C amber, #CC99FF purple, #99CCFF blue), animations, and data schema',
      'No code was written — this phase was entirely about design thinking and prompt craft',
    ],
    toolsUsed: ['Claude Opus 4.6', 'Prompt engineering', 'Design thinking'],
    color: '#CC99FF',
    expandableSection: {
      title: 'View the Original Prompt (v4)',
      content: `# Personal Developer Portfolio — Complete Specification v4

**Owner:** Espen H. Kristensen
**GitHub:** \`espenhk\` · **Medium:** \`espen-haukeland-kristensen\` · **Instagram/Bluesky:** \`@bgosl\` · **Facebook:** \`espenhk\`

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
> Each MWE must be a single-page, self-contained deployment. All five share the same component code — the *only* difference is the \`theme.ts\` file loaded.
>
> **Present all five MWEs for review.** Once a profile is approved, proceed with the full build using that theme. The full spec (Parts 1–17) describes the complete site.

---

## 0.2 Graphical Profile A — "CUPERTINO" · Apple-Flat Minimalism

**Mood:** Clean, corporate, confident. The portfolio as a product page.

| Element | Treatment |
|---|---|
| Headings | \`Inter\` — medium weight, generous letter-spacing |
| Body | \`Inter\` — regular weight, max readability |
| Mono | \`JetBrains Mono\` |
| Palette | Near-white \`#FAFAFA\` / void-black \`#0A0A0A\`. Accent: electric blue \`#0071E3\`. |
| Corners | Rounded: \`8–20px\` |
| Shadows | Soft: \`0 2px 12px rgba(0,0,0,0.06)\` |
| Borders | Subtle \`1px\` border in light grey |
| Motion | Smooth \`ease-out\` fades, scale-ups on hover |
| Character sheet | Clean horizontal bars, accent fill, no glow |
| Light mode | Primary — pure, airy white |
| Dark mode | Deep black, high contrast text |

---

## 0.3 Graphical Profile B — "ARCADIA" · 8-Bit Retro Pixel Art

**Mood:** Nostalgic, playful. The portfolio as a retro game cartridge. Think NES-era UI.

| Element | Treatment |
|---|---|
| Headings | \`Press Start 2P\` — all-caps, chunky pixel letterforms |
| Body | \`IBM Plex Mono\` — readable monospace |
| Palette | NES-inspired: blue \`#209CEE\`, green \`#92CC41\`, gold \`#F7D51D\`, red \`#E76E55\` |
| Corners | \`0px\` everywhere — hard right angles |
| Shadows | Chunky: \`4px 4px 0px rgba(0,0,0,0.25)\` |
| Borders | Thick \`4px\` solid — NES dialog box style |
| Motion | \`steps(6)\` timing — frame-by-frame feel |
| Character sheet | RPG stat screen. Labels: STR / DEX / INT / WIS |

---

## 0.4 Graphical Profile C — "NIGHTCITY" · Cyberpunk Neon Terminal

**Mood:** Edgy, technical. Blade Runner meets a senior engineer's GitHub.

| Element | Treatment |
|---|---|
| Headings | \`Rajdhani\` / \`Orbitron\` — uppercase, tracked wide |
| Body | \`Exo 2\` / \`Inter\` — clean sans for dark backgrounds |
| Palette | Cyan \`#00F0FF\`, magenta \`#FF2A6D\`, amber \`#FCEE0A\`. Background: \`#0D0E14\` |
| Corners | Asymmetric: \`0 12px 0 12px\` — cyberpunk "cut corner" |
| Shadows | Glow: \`0 0 20px rgba(0,240,255,0.15)\` on hover |
| Motion | \`cubic-bezier(0.77, 0, 0.175, 1)\`. Optional glitch entrance. |
| Character sheet | HUD overlay. Neon cyan fill + sweep animation. |

---

## 0.5 Graphical Profile D — "STARFLEET" · Sci-Fi Command Console (LCARS / Mass Effect)

**Mood:** Structured, information-dense, exploratory. The portfolio as a starship personnel file.

| Element | Treatment |
|---|---|
| Headings | \`Antonio\` / \`Chakra Petch\` — semi-condensed futuristic sans |
| Body | \`Outfit\` / \`Inter\` — max readability |
| Palette | LCARS amber \`#FF9F1C\`, lavender \`#CC99FF\`, sky-blue \`#99CCFF\`, coral \`#E8655A\`, tan \`#FFCC99\` |
| Corners | LCARS capsule: \`24px 8px 8px 24px\` |
| Borders | None — colour blocks *are* the borders |
| Motion | \`ease-out\`, elements slide from left |
| Character sheet | Crew personnel dossier. "PERSONNEL FILE" header in amber. |

---

## 0.6 Graphical Profile E — "FOXGLEN" · Tunic-Inspired Mythical Manual

**Mood:** Gentle mystery. The portfolio as a discovered instruction booklet.

| Element | Treatment |
|---|---|
| Headings | \`Uncial Antiqua\` or \`MedievalSharp\` — uncial letterforms |
| Body | \`Nunito\` or \`Karla\` — soft, rounded sans-serif |
| Decorative | \`Noto Sans Runic\` — aesthetic glyphs, not translatable |
| Palette | Parchment \`#F2EDE4\`, sage \`#8CAA7E\`, dusty rose \`#C4907C\`, slate blue \`#7B95A5\`, soft gold \`#D4B87B\` |
| Corners | Rounded \`16px\`. Inner shadow simulating manual-page indentation. |
| Backgrounds | Subtle parchment texture overlay at ~5% opacity |
| Character sheet | "The Hero's Page" — styled as a discovered manual page |

---

## 0.7 Theme Comparison Matrix

| Feature | CUPERTINO | ARCADIA | NIGHTCITY | STARFLEET | FOXGLEN |
|---|---|---|---|---|---|
| Mood | Clean, corporate | Nostalgic, playful | Edgy, technical | Structured, exploratory | Gentle, mysterious |
| Dark feel | Void black | NES cartridge | Blade Runner | Starship bridge | Charcoal on vellum |
| Key gimmick | None — pure clarity | Pixel borders | Neon glow, glitch | Colour-block sidebar | Runic glyphs |
| Recruiter-safe? | ✅ Most professional | ⚠️ Bold | ✅ Dark = slick | ✅ Both modes | ✅ Elegant + unique |
| Fun | ★★★☆☆ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★★ |

---

# PART 1–17 — FULL SITE SPECIFICATION

The remaining 17 parts covered: site map, data architecture (GitHub API, Medium RSS, project overrides, character sheet stats, hobbies data), front page sections (Hero, GitHub Graph, Featured Projects, Character Sheet, Beyond the Code, Medium Articles, Social Links, Footer), project pages, interactive component registry, SEO & metadata, maintainability, three tech paths (Astro / Next.js / Vite SPA), deployment targets (GitHub Pages / Vercel / Azure), shared component library, file structure, CI/CD workflows, and a Lovable prompt sequence.

**Decision:** Start with Path C (Vite + React SPA) for maximum Lovable compatibility and fastest time-to-live. The prompt was ~4,500 words specifying every data structure, component, design token, and deployment path.`,
    },
  },
  {
    phase: 'Phase 1',
    icon: <Sparkles size={20} />,
    title: 'First Generation in Lovable',
    description:
      'Pasted the Claude-refined prompt into Lovable. The Starfleet theme — selected from the five candidates — came through clearly, and the first generation nailed the overall structure.',
    details: [
      'Lovable generated the full single-page app with all sections from the detailed prompt',
      'The Starfleet theme system (ThemeContext + starfleet.ts) was set up with dark/light mode',
      'RPG-style Character Sheet with animated stat bars landed close to the vision on first try',
      'Hero section with starfield background, gradient accent strip, and profile layout',
      'Data files scaffolded: experience.ts, characterSheet.ts, siteConfig.tsx',
      'GitHub API integration for live repository data was wired up immediately',
      'Nav bar with scroll-aware blur and section highlighting',
    ],
    toolsUsed: ['Lovable AI', 'React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    color: '#FF9F1C',
    preview: <MiniThemeSwatches />,
  },
  {
    phase: 'Phase 2',
    icon: <Code2 size={20} />,
    title: 'Iterative Refinement',
    description:
      'Dozens of follow-up prompts to tune every detail — mobile responsiveness, animation timing, 3D avatar, scroll interactions, and component polish.',
    details: [
      'Added Three.js / React Three Fiber for 3D section avatars',
      'Built the GitHub Activity Log (contribution calendar) with live API data',
      'Fixed mobile issues — canvas overflow on iPhone, profile image centering',
      'Added horizontal scroll arrows for the Transmissions carousel on desktop',
      'Tuned Character Sheet stat bars: glow on high stats, category grouping, color coding',
      'Iterated on nav bar behavior — scroll-aware background, active section detection',
      'Added "Off-Duty Interests" with clickable links (Tromsø Flaggfotball)',
      'Dark/light theme toggle refinement across all sections',
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
    title: 'Content & Data Population',
    description:
      'Filled in real data — work experience, education history, skill ratings, LinkedIn posts, and project metadata for featured GitHub repos.',
    details: [
      'Wrote detailed experience entries with role descriptions and tech stacks',
      'Configured project overrides for featured repositories',
      'Added LinkedIn post data with titles, engagement metrics, and URLs',
      'Uploaded CV as PDF and linked it to the download button',
      'Translated Norwegian education descriptions to English',
      'Added spoken languages, certifications, and education details',
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
    title: 'Polish & Ship',
    description:
      'Final QA, documentation, and publishing to espenhk.lovable.app.',
    details: [
      'Responsive QA across desktop and mobile viewports',
      'Wrote comprehensive README documenting the architecture and theming system',
      'Published via Lovable\'s one-click deploy to espenhk.lovable.app',
      'Built this very page you\'re reading right now 🤯',
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
        background: isDark ? 'rgba(19,26,46,0.7)' : 'rgba(255,255,255,0.8)',
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
              color: isDark ? '#F0EDDF' : '#1A1A2E',
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

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
                  {step.details.map((d, i) => (
                    <li key={i} style={{
                      fontFamily: theme.fonts.sans, fontSize: '0.82rem', lineHeight: 1.6,
                      color: isDark ? 'rgba(208,208,208,0.65)' : 'rgba(0,0,0,0.5)',
                      padding: '4px 0 4px 16px', position: 'relative',
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: step.color, fontWeight: 700 }}>›</span>
                      {d}
                    </li>
                  ))}
                </ul>

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
    ? 'linear-gradient(180deg, #060A18 0%, #0C1030 50%, #060A18 100%)'
    : '#F4F1EC';

  return (
    <div style={{
      background: isDark ? undefined : mainBg,
      backgroundImage: isDark ? mainBg : undefined,
      minHeight: '100vh',
      padding: '60px 20px 80px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
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
            color: isDark ? '#F0EDDF' : '#1A1A2E',
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
              ? 'linear-gradient(180deg, transparent, rgba(255,159,28,0.2), transparent)'
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
            background: isDark ? 'rgba(255,159,28,0.06)' : 'rgba(255,159,28,0.08)',
            border: `1px solid ${isDark ? 'rgba(255,159,28,0.12)' : 'rgba(255,159,28,0.15)'}`,
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
                <strong style={{ color: isDark ? '#F0EDDF' : '#1A1A2E' }}>Total time:</strong> ~8–10 hours from blank canvas to published site.
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
