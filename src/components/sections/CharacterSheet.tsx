import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { characterSheet, categoryLabels, categoryColors, type Stat } from '@/data/characterSheet';

function StatBar({ stat, index, visible, accentColor }: {
  stat: Stat;
  index: number;
  visible: boolean;
  accentColor: string;
}) {
  const { theme } = useTheme();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{
          color: '#D0D0D0',
          fontSize: '0.78rem',
          fontFamily: theme.fonts.mono,
        }}>
          {stat.label}
        </span>
        <span style={{
          color: accentColor,
          fontSize: '0.78rem',
          fontFamily: theme.fonts.mono,
          fontWeight: 700,
        }}>
          {stat.value}%
        </span>
      </div>
      <div style={{
        height: 7,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={visible ? { width: `${stat.value}%` } : { width: 0 }}
          transition={{
            duration: 0.8,
            delay: index * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            height: '100%',
            backgroundImage: `linear-gradient(90deg, ${accentColor}, ${accentColor}99)`,
            borderRadius: 3,
            boxShadow: `0 0 8px ${accentColor}30`,
          }}
        />
      </div>
    </div>
  );
}

export default function CharacterSheetFull() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;
  const border = isDark ? c.border.dark : c.border.light;
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Group stats by category
  const categories = ['language', 'framework', 'tool', 'soft-skill'] as const;
  const grouped = categories.map(cat => ({
    key: cat,
    label: categoryLabels[cat],
    color: categoryColors[cat],
    stats: characterSheet.stats.filter(s => s.category === cat),
  }));

  const panelBg = isDark
    ? 'linear-gradient(145deg, #0C1228 0%, #101A38 50%, #0C1228 100%)'
    : theme.characterSheetTheme.panelBg;

  // Calculate stardate (fun easter egg)
  const now = new Date();
  const stardate = (now.getFullYear() - 2000) * 1000 + Math.floor((now.getMonth() * 30 + now.getDate()) / 365.25 * 1000);

  return (
    <section
      id="character-sheet"
      style={{
        padding: '80px 24px',
        background: isDark ? undefined : c.background.light,
        backgroundImage: isDark
          ? 'linear-gradient(180deg, #060A18 0%, #0C1030 50%, #060A18 100%)'
          : undefined,
        position: 'relative',
        overflow: 'hidden',
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}
    >
      {/* LCARS side bar */}
      {isDark && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
          background: '#CC99FF', opacity: 0.6,
        }} />
      )}

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: '1.8rem',
          color: fg,
          marginBottom: 40,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}>
          Personnel Dossier
        </h2>

        <div
          ref={ref}
          style={{
            background: isDark ? undefined : panelBg,
            backgroundImage: isDark ? panelBg : undefined,
            borderRadius: theme.radii.lg,
            padding: '32px 28px',
            boxShadow: isDark
              ? `0 0 25px rgba(255,159,28,0.06), ${theme.shadows.card}`
              : theme.shadows.card,
            border: `1px solid ${isDark ? 'rgba(255,159,28,0.12)' : border}`,
            fontFamily: theme.fonts.sans,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Header — portrait + info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 28,
            paddingBottom: 20,
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
          }}>
            <img
              src={characterSheet.portraitImage}
              alt="Portrait"
              style={{
                width: 80,
                height: 80,
                borderRadius: theme.radii.full,
                border: `2px solid ${c.accent}`,
                boxShadow: isDark ? `0 0 12px rgba(255,159,28,0.15)` : undefined,
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontFamily: theme.characterSheetTheme.nameFont,
                color: isDark ? '#F0EDDF' : '#1A1A2E',
                fontSize: '1.5rem',
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 2,
              }}>
                {characterSheet.name}
              </h3>
              <p style={{
                color: isDark ? c.accent : fg2,
                fontSize: '0.85rem',
                fontFamily: theme.fonts.mono,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {characterSheet.title}
              </p>
              <p style={{
                color: isDark ? '#9A9AAF' : fg2,
                fontSize: '0.8rem',
                fontFamily: theme.fonts.sans,
                fontStyle: 'italic',
                marginTop: 4,
              }}>
                {characterSheet.tagline}
              </p>
            </div>
          </div>

          {/* Stardate easter egg */}
          {isDark && (
            <div style={{
              textAlign: 'right',
              fontFamily: theme.fonts.mono,
              fontSize: '0.7rem',
              color: 'rgba(153,204,255,0.5)',
              marginBottom: 16,
              marginTop: -12,
            }}>
              STARDATE {stardate.toFixed(1)}
            </div>
          )}

          {/* Stat categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {grouped.map((group, gi) => (
              <div key={group.key}>
                {/* Category header with LCARS-style bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 14,
                }}>
                  <div style={{
                    width: 4,
                    height: 20,
                    borderRadius: 2,
                    background: group.color,
                    boxShadow: isDark ? `0 0 6px ${group.color}40` : undefined,
                  }} />
                  <span style={{
                    fontFamily: theme.fonts.display,
                    fontSize: '1.1rem',
                    color: group.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 400,
                  }}>
                    {group.label}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 16 }}>
                  {group.stats.map((stat, si) => (
                    <StatBar
                      key={stat.label}
                      stat={stat}
                      index={gi * 4 + si}
                      visible={visible}
                      accentColor={group.color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
