import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { jobs, education, certifications } from '@/data/experience';
import { Briefcase, GraduationCap, Award } from 'lucide-react';

function TimelineDot({ color, delay, visible }: { color: string; delay: number; visible: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={visible ? { scale: 1 } : { scale: 0 }}
      transition={{ duration: 0.3, delay }}
      style={{
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: color,
        border: '2px solid rgba(255,255,255,0.1)',
        boxShadow: `0 0 8px ${color}40`,
        flexShrink: 0,
      }}
    />
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
        padding: '80px 24px',
        backgroundImage: isDark
          ? 'linear-gradient(180deg, #060A18 0%, #0C1030 50%, #060A18 100%)'
          : undefined,
        background: isDark ? undefined : c.background.light,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* LCARS bar */}
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
          marginBottom: 40,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}>
          Service Record
        </h2>

        {/* Work Experience */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
          }}>
            <Briefcase size={18} color={c.accent} />
            <span style={{
              fontFamily: theme.fonts.display,
              fontSize: '1.1rem',
              color: c.accent,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Postings
            </span>
          </div>

          <div style={{ position: 'relative', paddingLeft: 28 }}>
            {/* Vertical line */}
            <motion.div
              initial={{ height: 0 }}
              animate={visible ? { height: '100%' } : { height: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: 6,
                top: 0,
                width: 2,
                background: isDark
                  ? 'linear-gradient(180deg, #FF9F1C, #CC99FF, #99CCFF)'
                  : `linear-gradient(180deg, ${c.accent}, ${c.secondary})`,
                opacity: 0.4,
              }}
            />

            {jobs.map((job, i) => (
              <motion.div
                key={job.company + job.role}
                initial={{ opacity: 0, x: -20 }}
                animate={visible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                style={{
                  position: 'relative',
                  marginBottom: i < jobs.length - 1 ? 28 : 0,
                }}
              >
                <div style={{ position: 'absolute', left: -28, top: 4 }}>
                  <TimelineDot
                    color={i === 0 ? c.accent : isDark ? '#CC99FF' : c.accent}
                    delay={i * 0.15}
                    visible={visible}
                  />
                </div>

                <div style={{
                  background: isDark ? undefined : panelBg,
                  backgroundImage: isDark ? panelBg : undefined,
                  borderRadius: theme.radii.md,
                  padding: '16px 20px',
                  border: `1px solid ${isDark ? 'rgba(255,159,28,0.08)' : border}`,
                  boxShadow: isDark ? theme.shadows.card : '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    flexWrap: 'wrap', gap: 8, marginBottom: 4,
                  }}>
                    <h3 style={{
                      fontFamily: theme.fonts.sans,
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: fg,
                    }}>
                      {job.company}
                    </h3>
                    <span style={{
                      fontFamily: theme.fonts.mono,
                      fontSize: '0.72rem',
                      color: isDark ? '#99CCFF' : fg2,
                      whiteSpace: 'nowrap',
                    }}>
                      {job.period}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: '0.78rem',
                    color: c.accent,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: 8,
                  }}>
                    {job.role}
                  </p>
                  <p style={{
                    fontFamily: theme.fonts.sans,
                    fontSize: '0.85rem',
                    color: fg2,
                    lineHeight: 1.55,
                    marginBottom: job.tags ? 10 : 0,
                  }}>
                    {job.description}
                  </p>
                  {job.tags && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {job.tags.map(tag => (
                        <span key={tag} style={{
                          fontFamily: theme.fonts.mono,
                          fontSize: '0.65rem',
                          color: isDark ? '#CC99FF' : c.accent,
                          background: isDark ? 'rgba(204,153,255,0.08)' : 'rgba(255,159,28,0.08)',
                          padding: '2px 8px',
                          borderRadius: theme.radii.sm,
                          border: `1px solid ${isDark ? 'rgba(204,153,255,0.15)' : 'rgba(255,159,28,0.15)'}`,
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
          }}>
            <GraduationCap size={18} color="#99CCFF" />
            <span style={{
              fontFamily: theme.fonts.display,
              fontSize: '1.1rem',
              color: '#99CCFF',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Academy Records
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {education.map((edu, i) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, y: 15 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                style={{
                  background: isDark ? undefined : panelBg,
                  backgroundImage: isDark ? panelBg : undefined,
                  borderRadius: theme.radii.md,
                  padding: '14px 18px',
                  border: `1px solid ${isDark ? 'rgba(153,204,255,0.08)' : border}`,
                  boxShadow: isDark ? theme.shadows.card : '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  flexWrap: 'wrap', gap: 8, marginBottom: 2,
                }}>
                  <span style={{
                    fontFamily: theme.fonts.sans,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: fg,
                  }}>
                    {edu.institution}
                  </span>
                  <span style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: '0.72rem',
                    color: isDark ? '#99CCFF' : fg2,
                  }}>
                    {edu.period}
                  </span>
                </div>
                <p style={{
                  fontFamily: theme.fonts.sans,
                  fontSize: '0.82rem',
                  color: fg2,
                }}>
                  {edu.degree}
                </p>
                {edu.details && (
                  <p style={{
                    fontFamily: theme.fonts.sans,
                    fontSize: '0.78rem',
                    color: isDark ? 'rgba(153,204,255,0.6)' : fg2,
                    marginTop: 4,
                    fontStyle: 'italic',
                  }}>
                    {edu.details}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
          }}>
            <Award size={18} color="#E8655A" />
            <span style={{
              fontFamily: theme.fonts.display,
              fontSize: '1.1rem',
              color: '#E8655A',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Commendations
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 10,
          }}>
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={visible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 1 + i * 0.08 }}
                style={{
                  background: isDark ? 'rgba(232,101,90,0.04)' : panelBg,
                  borderRadius: theme.radii.md,
                  padding: '12px 14px',
                  border: `1px solid ${isDark ? 'rgba(232,101,90,0.1)' : border}`,
                }}
              >
                <p style={{
                  fontFamily: theme.fonts.sans,
                  fontSize: '0.78rem',
                  color: fg,
                  fontWeight: 500,
                  marginBottom: 4,
                }}>
                  {cert.name}
                </p>
                <span style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: '0.68rem',
                  color: isDark ? '#E8655A' : fg2,
                }}>
                  {cert.date}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
