import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Globe, Football, Wine } from 'lucide-react';

const languages = [
  { name: 'Norwegian', level: 'Native', value: 100 },
  { name: 'English', level: 'Professional', value: 85 },
  { name: 'German', level: 'Basic', value: 25 },
  { name: 'Italian', level: 'Basic', value: 20 },
];

const interests = [
  {
    icon: Football,
    title: 'Flag Football',
    description: 'Active player on BGOSL. Sports geek through and through.',
    color: '#FF9F1C',
  },
  {
    icon: Wine,
    title: 'Cocktail Craft',
    description: 'Home bartender. Negroni enthusiast. Always experimenting.',
    color: '#E8655A',
  },
];

export default function BeyondTheCode() {
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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const panelBg = isDark
    ? 'linear-gradient(145deg, #0C1228 0%, #101A38 50%, #0C1228 100%)'
    : '#FFFFFF';

  return (
    <section
      id="beyond"
      ref={ref}
      style={{
        padding: '60px 24px',
        backgroundImage: isDark
          ? 'linear-gradient(180deg, #060A18 0%, #0C1030 50%, #060A18 100%)'
          : undefined,
        background: isDark ? undefined : c.background.light,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isDark && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
          background: 'linear-gradient(180deg, #FF9F1C, #E8655A)', opacity: 0.6,
        }} />
      )}

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
              background: isDark ? undefined : panelBg,
              backgroundImage: isDark ? panelBg : undefined,
              borderRadius: theme.radii.md,
              padding: '18px 20px',
              border: `1px solid ${isDark ? 'rgba(153,204,255,0.1)' : border}`,
              boxShadow: isDark ? theme.shadows.card : '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Globe size={16} color="#99CCFF" />
              <span style={{
                fontFamily: theme.fonts.display,
                fontSize: '0.9rem',
                color: '#99CCFF',
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
                    <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.72rem', color: '#D0D0D0' }}>
                      {lang.name}
                    </span>
                    <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.68rem', color: fg2 }}>
                      {lang.level}
                    </span>
                  </div>
                  <div style={{
                    height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={visible ? { width: `${lang.value}%` } : { width: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #99CCFF, #99CCFF88)',
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
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                  style={{
                    background: isDark ? undefined : panelBg,
                    backgroundImage: isDark ? panelBg : undefined,
                    borderRadius: theme.radii.md,
                    padding: '16px 18px',
                    border: `1px solid ${isDark ? `${item.color}15` : border}`,
                    boxShadow: isDark ? theme.shadows.card : '0 1px 4px rgba(0,0,0,0.06)',
                    flex: 1,
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: theme.radii.sm,
                    background: `${item.color}10`,
                    border: `1px solid ${item.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={15} color={item.color} />
                  </div>
                  <div>
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
