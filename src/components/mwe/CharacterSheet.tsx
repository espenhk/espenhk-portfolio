import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { label: 'Python', value: 90, category: 'language' },
  { label: 'SQL', value: 88, category: 'language' },
  { label: 'Azure Data', value: 85, category: 'framework' },
  { label: 'Data Engineering', value: 92, category: 'tool' },
];

function getPanelBg(themeId: string, isDark: boolean, theme: any): string {
  if (!isDark) return theme.characterSheetTheme.panelBg;
  switch (themeId) {
    case 'cupertino':
      return 'linear-gradient(145deg, #0C1222 0%, #111830 50%, #0E1428 100%)';
    case 'arcadia':
      return 'linear-gradient(180deg, #0F0C20 0%, #1A1438 100%)';
    case 'nightcity':
      return 'linear-gradient(135deg, #0A0818 0%, #140C28 50%, #0D1218 100%)';
    case 'starfleet':
      return 'linear-gradient(145deg, #0C1228 0%, #101A38 50%, #0C1228 100%)';
    default:
      return theme.characterSheetTheme.panelBg;
  }
}

export default function CharacterSheet() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const border = isDark ? c.border.dark : c.border.light;
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
  const panelBg = getPanelBg(theme.id, isDark, theme);
  const isGradient = panelBg.includes('gradient');

  // Theme-specific bar colors
  const getBarBg = () => {
    if (!isDark) return c.accent;
    switch (theme.id) {
      case 'nightcity':
        return `linear-gradient(90deg, ${c.accent}, ${c.secondary || c.accent})`;
      case 'starfleet':
        return `linear-gradient(90deg, ${c.accent}, #FFCC99)`;
      case 'arcadia':
        return c.accent;
      case 'cupertino':
        return `linear-gradient(90deg, ${c.accent}, #5856D6)`;
      default:
        return c.accent;
    }
  };

  return (
    <div
      ref={ref}
      style={{
        background: isGradient ? undefined : panelBg,
        backgroundImage: isGradient ? panelBg : undefined,
        borderRadius: theme.radii.lg,
        padding: 32,
        maxWidth: 500,
        width: '100%',
        boxShadow: theme.id === 'nightcity' && isDark
          ? `0 0 30px rgba(0,240,255,0.08), ${theme.shadows.card}`
          : theme.id === 'starfleet' && isDark
          ? `0 0 20px rgba(255,159,28,0.08), ${theme.shadows.card}`
          : theme.shadows.card,
        border: `${theme.borders.width} ${theme.borders.style} ${
          theme.id === 'nightcity' && isDark ? `${c.accent}30` :
          theme.id === 'starfleet' && isDark ? `${c.accent}20` :
          border
        }`,
        fontFamily: theme.fonts.sans,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Nightcity corner accent */}
      {theme.id === 'nightcity' && isDark && (
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 100, height: 100,
          background: `radial-gradient(circle at 100% 0%, ${c.accent}10 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, position: 'relative', zIndex: 1 }}>
        <img
          src="https://avatars.githubusercontent.com/u/9327813?v=4"
          alt="Portrait"
          style={{
            width: 60,
            height: 60,
            borderRadius: theme.radii.full,
            border: `2px solid ${c.accent}`,
            boxShadow: theme.id === 'nightcity' && isDark ? `0 0 10px ${c.accent}40` : undefined,
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
        {stats.map((stat, i) => {
          const label = rpmLabels && rpmLabels[i] ? `${rpmLabels[i]} · ${stat.label}` : stat.label;
          const barBg = getBarBg();
          const isBarGradient = barBg.includes('gradient');

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
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)',
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
                    background: isBarGradient ? undefined : barBg,
                    backgroundImage: isBarGradient ? barBg : undefined,
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
