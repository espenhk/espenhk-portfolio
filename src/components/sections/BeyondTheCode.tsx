import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Globe, Trophy, Wine, ExternalLink } from 'lucide-react';
import { tint, type Palette } from '@/design-system/palette';

interface Interest {
  icon: typeof Trophy;
  title: string;
  description: string;
  /** category colour slot in the palette */
  tone: 'accent' | 'highlight';
  link?: string;
}

const languages = [
  { name: 'Norwegian', level: 'Native', value: 100 },
  { name: 'English', level: 'Professional', value: 85 },
  { name: 'German', level: 'Basic', value: 25 },
  { name: 'Italian', level: 'Basic', value: 20 },
];

const interests: Interest[] = [
  {
    icon: Trophy,
    title: 'Flag Football',
    description: 'Tromsø Flaggfotball player. Sports geek through and through.',
    tone: 'accent',
    link: 'https://tromsoflaggfotball.lovable.app',
  },
  {
    icon: Wine,
    title: 'Cocktail Craft',
    description: 'Home bartender. Negroni enthusiast. Always experimenting.',
    tone: 'highlight',
  },
];

const toneColors = (p: Palette, tone: Interest['tone']) =>
  tone === 'highlight' ? { flat: p.highlight, ink: p.highlightInk } : { flat: p.accent, ink: p.accentInk };

export default function BeyondTheCode() {
  const { theme, palette: p } = useTheme();
  const fg = p.fg;
  const fg2 = p.fg2;
  const border = p.border;
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const panelBg = p.panelBg;

  return (
    <section
      id="beyond"
      ref={ref}
      style={{
        padding: '60px 24px',
        backgroundImage: p.flourish ? p.sectionBg : undefined,
        background: p.flourish ? undefined : p.sectionBg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {p.flourish && <div style={p.rail(`linear-gradient(180deg, ${p.accent}, ${p.highlight})`)} />}

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: '1.8rem',
          color: fg,
          marginBottom: 24,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}>
          Off Duty
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 20,
        }}>
          {/* Languages card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              background: p.flourish ? undefined : panelBg,
              backgroundImage: p.flourish ? panelBg : undefined,
              borderRadius: theme.radii.md,
              padding: '18px 20px',
              border: `1px solid ${p.flourish ? tint(p.tertiary, 10) : border}`,
              boxShadow: p.shadowJob,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Globe size={16} color={p.tertiaryInk} />
              <span style={{
                fontFamily: theme.fonts.display,
                fontSize: '0.9rem',
                color: p.tertiaryInk,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Languages
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {languages.map((lang, i) => (
                <div key={lang.name}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', marginBottom: 3,
                  }}>
                    <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.72rem', color: fg }}>
                      {lang.name}
                    </span>
                    <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.68rem', color: fg2 }}>
                      {lang.level}
                    </span>
                  </div>
                  <div style={{
                    height: 4, background: p.hairline, borderRadius: 2, overflow: 'hidden',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={visible ? { width: `${lang.value}%` } : { width: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{
                        height: '100%',
                        background: `linear-gradient(90deg, ${p.tertiary}, ${tint(p.tertiary, 53)})`,
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interests cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {interests.map((item, i) => {
              const Icon = item.icon;
              const { flat: color, ink: colorInk } = toneColors(p, item.tone);
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                  style={{
                    background: p.flourish ? undefined : panelBg,
                    backgroundImage: p.flourish ? panelBg : undefined,
                    borderRadius: theme.radii.md,
                    padding: '16px 18px',
                    border: `1px solid ${p.flourish ? tint(color, 8) : border}`,
                    boxShadow: p.shadowJob,
                    flex: 1,
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: theme.radii.sm,
                    background: tint(color, 6),
                    border: `1px solid ${tint(color, 12.5)}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={15} color={colorInk} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontFamily: theme.fonts.sans, fontSize: '0.85rem',
                      fontWeight: 600, color: fg, marginBottom: 3,
                    }}>
                      {item.title}
                    </h4>
                    <p style={{
                      fontFamily: theme.fonts.sans, fontSize: '0.78rem',
                      color: fg2, lineHeight: 1.45,
                    }}>
                      {item.description}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ marginLeft: 4, color: colorInk, opacity: 0.8 }}
                          onClick={e => e.stopPropagation()}
                        >
                          <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                        </a>
                      )}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
