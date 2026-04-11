import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Sparkles, MessageSquare, Code2, Layers, Rocket, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Step {
  phase: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  toolsUsed: string[];
  color: string;
}

const steps: Step[] = [
  {
    phase: 'Phase 0',
    icon: <Brain size={20} />,
    title: 'Crafting the Prompt with Claude Opus 4.6',
    description:
      'Before touching Lovable, I spent time with Claude Opus 4.6 iterating on the perfect system prompt — a detailed brief describing every section, the RPG-inspired design language, and the Starfleet theme.',
    details: [
      'Started with a rough idea: "portfolio site that feels like an RPG character sheet"',
      'Asked Claude to brainstorm section structures — Hero, Stats, Transmissions, Repositories, Experience Timeline',
      'Iterated on the visual identity: dark sci-fi palette, VT323 display font, amber (#FF9F1C) accent',
      'Had Claude generate a comprehensive prompt covering layout, color tokens, typography, animations, and data schema',
      'Refined the prompt across ~8-10 rounds until it was specific enough to hand off to Lovable in one shot',
      'The final prompt was ~2,000 words covering every section, interaction, and design detail',
    ],
    toolsUsed: ['Claude Opus 4.6', 'Iterative prompt engineering', 'Design thinking'],
    color: '#CC99FF',
  },
  {
    phase: 'Phase 1',
    icon: <Sparkles size={20} />,
    title: 'Initial Generation in Lovable',
    description:
      'Pasted the refined prompt into Lovable and got a working first draft with all major sections scaffolded — Hero, Character Sheet, Publications, Projects, Experience, and Contact.',
    details: [
      'Lovable generated the full page structure from the detailed prompt',
      'Theme system (ThemeContext + starfleet.ts) was set up with dark/light mode support',
      'Data files (experience.ts, characterSheet.ts) were created with placeholder content',
      'GitHub API integration was scaffolded for live repository data',
      'The RPG stat bars and Character Sheet layout landed close to the vision on first try',
    ],
    toolsUsed: ['Lovable AI', 'React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    color: '#FF9F1C',
  },
  {
    phase: 'Phase 2',
    icon: <Code2 size={20} />,
    title: 'Iterative Refinement',
    description:
      'Dozens of follow-up prompts to dial in the details — fixing mobile layout, tuning animations, adjusting colors, adding the 3D avatar, and polishing every micro-interaction.',
    details: [
      'Added Three.js / React Three Fiber for the 3D section avatars',
      'Built the GitHub Activity Log (contribution calendar) with live API data',
      'Tuned the nav bar — scroll-aware background blur, active section highlighting',
      'Fixed responsive issues on iPhone — canvas overflow, profile image centering',
      'Added horizontal scroll arrows for the Transmissions (LinkedIn posts) carousel',
      'Iterated on the Character Sheet stat bars, labels, and "Off-Duty Interests" section',
    ],
    toolsUsed: ['Lovable AI', 'Three.js', 'React Three Fiber', 'GitHub API'],
    color: '#99CCFF',
  },
  {
    phase: 'Phase 3',
    icon: <Layers size={20} />,
    title: 'Content & Data',
    description:
      'Populated real data — work experience, education, skill ratings, LinkedIn post links, and project overrides for the GitHub repos.',
    details: [
      'Wrote experience entries with role descriptions and tech stacks',
      'Configured project overrides (projectOverrides.ts) for featured repos',
      'Added real LinkedIn post data with titles and URLs',
      'Uploaded CV PDF and linked it to the download button',
      'Translated Norwegian descriptions to English',
      'Added clickable links for off-duty interests (Tromsø Flaggfotball, etc.)',
    ],
    toolsUsed: ['Manual data entry', 'CV parsing', 'Content writing'],
    color: '#66CC99',
  },
  {
    phase: 'Phase 4',
    icon: <Rocket size={20} />,
    title: 'Ship It',
    description:
      'Final polish pass, README documentation, and publish to espenhk.lovable.app.',
    details: [
      'Wrote comprehensive README.md documenting the tech stack and architecture',
      'Final responsive QA across desktop and mobile viewports',
      'Published via Lovable\'s one-click deploy',
      'Built this very page you\'re reading right now 🤯',
    ],
    toolsUsed: ['Lovable Publish', 'GitHub', 'Custom domain'],
    color: '#E8655A',
  },
];

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
      <div
        style={{
          background: isDark ? 'rgba(19,26,46,0.7)' : 'rgba(255,255,255,0.8)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
          borderRadius: 12,
          overflow: 'hidden',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Header */}
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
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `${step.color}20`,
              border: `1px solid ${step.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: step.color,
              flexShrink: 0,
            }}
          >
            {step.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: theme.fonts.mono,
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: step.color,
              marginBottom: 2,
            }}>
              {step.phase}
            </div>
            <div style={{
              fontFamily: theme.fonts.sans,
              fontWeight: 600,
              fontSize: '1.05rem',
              color: isDark ? '#F0EDDF' : '#1A1A2E',
            }}>
              {step.title}
            </div>
          </div>
          <div style={{ color: isDark ? 'rgba(208,208,208,0.5)' : 'rgba(0,0,0,0.3)' }}>
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {/* Body */}
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
                  fontFamily: theme.fonts.sans,
                  fontSize: '0.88rem',
                  lineHeight: 1.7,
                  color: isDark ? 'rgba(208,208,208,0.8)' : 'rgba(0,0,0,0.6)',
                  marginBottom: 16,
                }}>
                  {step.description}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
                  {step.details.map((d, i) => (
                    <li key={i} style={{
                      fontFamily: theme.fonts.sans,
                      fontSize: '0.82rem',
                      lineHeight: 1.6,
                      color: isDark ? 'rgba(208,208,208,0.65)' : 'rgba(0,0,0,0.5)',
                      padding: '4px 0 4px 16px',
                      position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: step.color,
                        fontWeight: 700,
                      }}>›</span>
                      {d}
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {step.toolsUsed.map(t => (
                    <span key={t} style={{
                      fontFamily: theme.fonts.mono,
                      fontSize: '0.6rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '3px 8px',
                      borderRadius: 4,
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
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: theme.fonts.mono,
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: isDark ? 'rgba(208,208,208,0.5)' : 'rgba(0,0,0,0.4)',
            marginBottom: 48,
            padding: '6px 0',
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
            fontFamily: theme.fonts.mono,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: theme.colors.accent,
            marginBottom: 12,
          }}>
            Behind the scenes
          </div>
          <h1 style={{
            fontFamily: theme.fonts.display,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 400,
            color: isDark ? '#F0EDDF' : '#1A1A2E',
            lineHeight: 1.1,
            margin: 0,
          }}>
            How I Built This Site
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontFamily: theme.fonts.sans,
            fontSize: '0.95rem',
            lineHeight: 1.7,
            color: isDark ? 'rgba(208,208,208,0.7)' : 'rgba(0,0,0,0.55)',
            marginBottom: 48,
            maxWidth: 580,
          }}
        >
          This portfolio was built entirely with{' '}
          <a href="https://lovable.dev" target="_blank" rel="noopener" style={{ color: theme.colors.accent, textDecoration: 'none' }}>
            Lovable <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </a>
          , with the initial prompt carefully crafted through multiple rounds of iteration with Claude Opus 4.6. Here's the full breakdown.
        </motion.p>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: 43,
            top: 56,
            bottom: 56,
            width: 1,
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
            marginTop: 56,
            padding: '20px 24px',
            borderRadius: 12,
            background: isDark ? 'rgba(255,159,28,0.06)' : 'rgba(255,159,28,0.08)',
            border: `1px solid ${isDark ? 'rgba(255,159,28,0.12)' : 'rgba(255,159,28,0.15)'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <MessageSquare size={18} style={{ color: theme.colors.accent, marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{
                fontFamily: theme.fonts.sans,
                fontSize: '0.85rem',
                lineHeight: 1.7,
                color: isDark ? 'rgba(208,208,208,0.75)' : 'rgba(0,0,0,0.6)',
                margin: 0,
              }}>
                <strong style={{ color: isDark ? '#F0EDDF' : '#1A1A2E' }}>Total time:</strong> ~4 hours from blank canvas to published site.
                The key insight was front-loading effort into the prompt — a detailed, well-structured brief
                lets Lovable generate 80% of the site in one shot, then you iterate on the remaining 20%.
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
