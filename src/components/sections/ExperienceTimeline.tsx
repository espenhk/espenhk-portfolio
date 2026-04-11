import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { jobs, education, certifications } from '@/data/experience';
import { Briefcase, GraduationCap, Award, ChevronDown } from 'lucide-react';

function CompactJob({ job, index, visible, theme, isDark }: {
  job: typeof jobs[0]; index: number; visible: boolean;
  theme: ReturnType<typeof useTheme>['theme']; isDark: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const c = theme.colors;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;
  const border = isDark ? c.border.dark : c.border.light;
  const panelBg = isDark
    ? 'linear-gradient(145deg, #0C1228 0%, #101A38 50%, #0C1228 100%)'
    : '#FFFFFF';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={() => setExpanded(!expanded)}
      style={{
        background: isDark ? undefined : panelBg,
        backgroundImage: isDark ? panelBg : undefined,
        borderRadius: theme.radii.md,
        padding: '14px 18px',
        border: `1px solid ${isDark ? 'rgba(255,159,28,0.08)' : border}`,
        boxShadow: isDark ? theme.shadows.card : '0 1px 4px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
      }}
      whileHover={{
        borderColor: isDark ? 'rgba(255,159,28,0.2)' : 'rgba(0,0,0,0.15)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <h3 style={{
              fontFamily: theme.fonts.sans, fontSize: '0.92rem',
              fontWeight: 600, color: fg,
            }}>
              {job.company}
            </h3>
            <span style={{
              fontFamily: theme.fonts.mono, fontSize: '0.72rem',
              color: c.accent, textTransform: 'uppercase',
            }}>
              {job.role}
            </span>
          </div>
          <span style={{
            fontFamily: theme.fonts.mono, fontSize: '0.68rem',
            color: isDark ? '#99CCFF' : fg2,
          }}>
            {job.period}
          </span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0, marginLeft: 8 }}
        >
          <ChevronDown size={16} color={fg2} />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              fontFamily: theme.fonts.sans, fontSize: '0.82rem',
              color: fg2, lineHeight: 1.55, marginTop: 10,
            }}>
              {job.description}
            </p>
            {job.tags && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {job.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: theme.fonts.mono, fontSize: '0.65rem',
                    color: isDark ? '#CC99FF' : c.accent,
                    background: isDark ? 'rgba(204,153,255,0.08)' : 'rgba(255,159,28,0.08)',
                    padding: '2px 8px', borderRadius: theme.radii.sm,
                    border: `1px solid ${isDark ? 'rgba(204,153,255,0.15)' : 'rgba(255,159,28,0.15)'}`,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ExperienceTimeline() {
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
      id="experience"
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
          background: '#FF9F1C', opacity: 0.6,
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
          Service Record
        </h2>

        {/* Postings — compact expandable */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Briefcase size={16} color={c.accent} />
            <span style={{
              fontFamily: theme.fonts.display, fontSize: '0.95rem',
              color: c.accent, textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Postings
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {jobs.map((job, i) => (
              <CompactJob key={job.company} job={job} index={i} visible={visible} theme={theme} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* Education & Certs — side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <GraduationCap size={16} color="#99CCFF" />
              <span style={{
                fontFamily: theme.fonts.display, fontSize: '0.9rem',
                color: '#99CCFF', textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                Academy
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {education.map((edu, i) => (
                <motion.div
                  key={edu.degree}
                  initial={{ opacity: 0, y: 10 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                  style={{
                    background: isDark ? undefined : panelBg,
                    backgroundImage: isDark ? panelBg : undefined,
                    borderRadius: theme.radii.md,
                    padding: '10px 14px',
                    border: `1px solid ${isDark ? 'rgba(153,204,255,0.08)' : border}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: theme.fonts.sans, fontSize: '0.8rem', fontWeight: 600, color: fg }}>
                      {edu.institution}
                    </span>
                    <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.65rem', color: isDark ? '#CC99FF' : c.accent, opacity: 0.85 }}>
                      {edu.degree}
                    </span>
                  </div>
                  {edu.details && (
                    <p style={{ fontFamily: theme.fonts.sans, fontSize: '0.72rem', color: fg2, marginTop: 2 }}>
                      {edu.details}
                    </p>
                  )}
                  <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.65rem', color: isDark ? '#99CCFF' : fg2 }}>
                    {edu.period}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Award size={16} color="#E8655A" />
              <span style={{
                fontFamily: theme.fonts.display, fontSize: '0.9rem',
                color: '#E8655A', textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                Commendations
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.06 }}
                  style={{
                    background: isDark ? undefined : panelBg,
                    backgroundImage: isDark ? panelBg : undefined,
                    borderRadius: theme.radii.md,
                    padding: '10px 14px',
                    border: `1px solid ${isDark ? 'rgba(153,204,255,0.08)' : border}`,
                  }}
                >
                  <span style={{ fontFamily: theme.fonts.sans, fontSize: '0.8rem', fontWeight: 600, color: fg }}>
                    {cert.name}
                  </span>
                  <p style={{ fontFamily: theme.fonts.mono, fontSize: '0.65rem', color: isDark ? '#99CCFF' : fg2, marginTop: 2 }}>
                    {cert.date}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
