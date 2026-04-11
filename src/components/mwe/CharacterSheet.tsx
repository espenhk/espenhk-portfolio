import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { label: 'Python', value: 90, category: 'language' },
  { label: 'SQL', value: 88, category: 'language' },
  { label: 'Azure Data', value: 85, category: 'framework' },
  { label: 'Data Engineering', value: 92, category: 'tool' },
];

export default function CharacterSheet() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;
  const border = isDark ? c.border.dark : c.border.light;
  const panelBg = theme.characterSheetTheme.panelBg;
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

  const rpmLabels = theme.characterSheetTheme.statLabels;

  return (
    <div
      ref={ref}
      style={{
        background: panelBg,
        borderRadius: theme.radii.lg,
        padding: 32,
        maxWidth: 500,
        width: '100%',
        boxShadow: theme.shadows.card,
        border: `${theme.borders.width} ${theme.borders.style} ${border}`,
        fontFamily: theme.fonts.sans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <img
          src="https://avatars.githubusercontent.com/u/9327813?v=4"
          alt="Portrait"
          style={{
            width: 60,
            height: 60,
            borderRadius: theme.radii.full,
            border: `2px solid ${c.accent}`,
          }}
        />
        <div>
          <h3 style={{
            fontFamily: theme.characterSheetTheme.nameFont,
            color: '#F5F5F7',
            fontSize: theme.id === 'arcadia' ? '0.7rem' : '1.1rem',
            fontWeight: 700,
            textTransform: theme.id === 'nightcity' || theme.id === 'starfleet' ? 'uppercase' : undefined,
          }}>
            {theme.id === 'starfleet' ? 'PERSONNEL FILE' : 'Espen H. Kristensen'}
          </h3>
          <p style={{ color: '#A1A1A6', fontSize: '0.85rem', fontFamily: theme.fonts.mono }}>
            {theme.id === 'starfleet' ? 'DATA ENGINEER / MANAGER' : 'Data Engineer / Manager'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {stats.map((stat, i) => {
          const label = rpmLabels && rpmLabels[i] ? `${rpmLabels[i]} · ${stat.label}` : stat.label;
          return (
            <div key={stat.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{
                  color: '#E0E0E0',
                  fontSize: theme.id === 'arcadia' ? '0.6rem' : '0.8rem',
                  fontFamily: theme.fonts.mono,
                  textTransform: theme.id === 'nightcity' ? 'uppercase' : undefined,
                  letterSpacing: theme.id === 'nightcity' ? '0.05em' : undefined,
                }}>
                  {label}
                </span>
                <span style={{ color: c.accent, fontSize: '0.8rem', fontFamily: theme.fonts.mono, fontWeight: 700 }}>
                  {stat.value}%
                </span>
              </div>
              <div style={{
                height: theme.id === 'arcadia' ? 16 : 8,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: theme.id === 'arcadia' ? 0 : 4,
                overflow: 'hidden',
                border: theme.id === 'arcadia' ? '2px solid rgba(255,255,255,0.15)' : 'none',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={visible ? { width: `${stat.value}%` } : { width: 0 }}
                  transition={{
                    duration: theme.id === 'arcadia' ? 0.3 : 1,
                    delay: i * 0.15,
                    ease: theme.id === 'arcadia' ? 'linear' : [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{
                    height: '100%',
                    background: theme.id === 'nightcity'
                      ? `linear-gradient(90deg, ${c.accent}, ${c.secondary || c.accent})`
                      : c.accent,
                    borderRadius: theme.id === 'arcadia' ? 0 : 4,
                    boxShadow: theme.characterSheetTheme.barGlow,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
