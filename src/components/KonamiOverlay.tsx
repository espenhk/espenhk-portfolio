import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const messages = [
  '🎮 Achievement Unlocked: Found the Secret!',
  '🚀 +9001 Nerd Cred',
  '☕ console.log("You found it!")',
  '🎯 Hidden quest complete. You have good instincts.',
  '🧪 Easter egg activated. No bugs were harmed.',
];

export default function KonamiOverlay({ active }: { active: boolean }) {
  const { theme } = useTheme();
  const msg = messages[Math.floor(Math.random() * messages.length)];

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 64,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            padding: '16px 32px',
            borderRadius: theme.radii.md,
            fontFamily: theme.fonts.mono,
            fontSize: '0.9rem',
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.secondary})`,
            color: '#000',
            boxShadow: `0 8px 32px rgba(255,159,28,0.4)`,
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
