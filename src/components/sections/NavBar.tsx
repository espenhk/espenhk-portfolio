import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { themes } from '@/config/themes';

const navItems = [
  { label: 'Stats', id: 'character-sheet' },
  { label: 'Posts', id: 'publications' },
  { label: 'Contact', id: 'contact' },
  { label: 'Repos', id: 'projects' },
  { label: 'Work', id: 'experience' },
];

export default function NavBar() {
  const { theme, isDark, toggleDark, setThemeById } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);

      // Find active section
      let current = '';
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = item.id;
        }
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const bg = isDark
    ? scrolled ? 'rgba(6,10,24,0.85)' : 'transparent'
    : scrolled ? 'rgba(255,255,255,0.9)' : 'transparent';
  const fg2 = isDark ? 'rgba(208,208,208,0.7)' : 'rgba(0,0,0,0.5)';
  const fgActive = isDark ? '#FF9F1C' : '#1A1A2E';

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        padding: '0 24px',
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        background: bg,
        backdropFilter: scrolled ? 'blur(12px)' : undefined,
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : undefined,
        borderBottom: scrolled
          ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
          : '1px solid transparent',
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}>
        {navItems.map(item => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: theme.fonts.mono,
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: isActive ? fgActive : fg2,
                padding: '6px 10px',
                borderRadius: theme.radii.sm,
                transition: 'color 0.2s',
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Theme toggle + dark mode */}
      <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <select
          value={theme.id}
          onChange={e => setThemeById(e.target.value)}
          style={{
            background: 'transparent',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
            borderRadius: theme.radii.sm,
            padding: '4px 6px',
            cursor: 'pointer',
            color: isDark ? 'rgba(208,208,208,0.7)' : 'rgba(0,0,0,0.5)',
            fontFamily: theme.fonts.mono,
            fontSize: '0.58rem',
            outline: 'none',
            maxWidth: 80,
          }}
        >
          {themes.map(t => (
            <option key={t.id} value={t.id} style={{ background: isDark ? '#1a1a2e' : '#fff', color: isDark ? '#ccc' : '#333' }}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          onClick={toggleDark}
          style={{
            background: 'none',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
            borderRadius: theme.radii.sm,
            padding: '4px 6px',
            cursor: 'pointer',
            color: isDark ? 'rgba(208,208,208,0.7)' : 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isDark ? <Sun size={13} /> : <Moon size={13} />}
        </button>
      </div>
    </motion.nav>
  );
}
