import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { tint } from '@/design-system/palette';

const stats = [
  { label: 'Python', value: 90, category: 'language' },
  { label: 'SQL', value: 88, category: 'language' },
  { label: 'Azure Data', value: 85, category: 'framework' },
  { label: 'Data Engineering', value: 92, category: 'tool' },
];

export default function CharacterSheet() {
  const { theme, palette: p } = useTheme();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const panelBg = p.statPanelBg;

  return (
    <div
      ref={ref}
      style={{
        background: p.flourish ? undefined : panelBg,
        backgroundImage: p.flourish ? panelBg : undefined,
        borderRadius: theme.radii.lg,
        padding: 32,
        maxWidth: 500,
        width: '100%',
        boxShadow: p.shadowPanel,
        border: `${theme.borders.width} ${theme.borders.style} ${p.panelEdge}`,
        fontFamily: theme.fonts.sans,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <img
          src="https://avatars.githubusercontent.com/u/9327813?v=4"
          alt="Portrait"
          style={{
            width: 60, height: 60,
            borderRadius: theme.radii.full,
            border: `2px solid ${p.accent}`,
          }}
        />
        <div>
          <h3 style={{
            fontFamily: theme.characterSheetTheme.nameFont,
            color: p.statLabel,
            fontSize: '1.3rem',
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            Personnel File
          </h3>
          <p style={{ color: tint(p.statLabel, 70), fontSize: '0.85rem', fontFamily: theme.fonts.mono }}>
            DATA ENGINEER / MANAGER
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {stats.map((stat, i) => (
          <div key={stat.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{
                color: p.statLabel,
                fontSize: '0.8rem',
                fontFamily: theme.fonts.mono,
              }}>
                {stat.label}
              </span>
              <span style={{ color: p.accent, fontSize: '0.8rem', fontFamily: theme.fonts.mono, fontWeight: 700 }}>
                {stat.value}%
              </span>
            </div>
            <div style={{
              height: 8,
              background: p.statTrack,
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={visible ? { width: `${stat.value}%` } : { width: 0 }}
                transition={{
                  duration: 1,
                  delay: i * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  height: '100%',
                  backgroundImage: `linear-gradient(90deg, ${p.accent}, ${p.warm})`,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
