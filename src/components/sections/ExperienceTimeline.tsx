import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Job } from '@/data/experience';
import { defaultSectionData } from '@/cms/defaults';
import type { ExperienceData } from '@/cms/types';
import { Briefcase, GraduationCap, Award, ChevronDown } from 'lucide-react';
import { tint } from '@/design-system/palette';

function CompactJob({ job, index, visible, theme, isDark }: {
  job: Job; index: number; visible: boolean;
  theme: ReturnType<typeof useTheme>['theme']; isDark: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const { palette: p } = useTheme();
  const fg = p.fg;
  const fg2 = p.fg2;
  const panelBg = p.panelBg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={() => setExpanded(!expanded)}
      style={{
        background: p.flourish ? undefined : panelBg,
        backgroundImage: p.flourish ? panelBg : undefined,
        borderRadius: theme.radii.md,
        padding: '14px 18px',
        border: `1px solid ${p.jobEdge}`,
        boxShadow: p.shadowJob,
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
      }}
      whileHover={{
        borderColor: p.jobEdgeHover,
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
              color: p.accentInk, textTransform: 'uppercase',
            }}>
              {job.role}
            </span>
          </div>
          <span style={{
            fontFamily: theme.fonts.mono, fontSize: '0.68rem',
            color: p.metaInk,
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
                    color: p.jobTagInk,
                    background: p.jobTagBg,
                    padding: '2px 8px', borderRadius: theme.radii.sm,
                    border: `1px solid ${p.jobTagEdge}`,
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

export default function ExperienceTimeline({ data = defaultSectionData.experience, anchorId = 'experience' }: { data?: ExperienceData; anchorId?: string }) {
  const { jobs, education, certifications } = data;
  const { theme, isDark, palette: p } = useTheme();
  const fg = p.fg;
  const fg2 = p.fg2;
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
  const eduEdge = p.flourish ? tint(p.tertiary, 8) : p.jobEdge;

  return (
    <section
      id={anchorId}
      ref={ref}
      style={{
        padding: '60px 24px',
        backgroundImage: p.flourish ? p.sectionBg : undefined,
        background: p.flourish ? undefined : p.sectionBg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {p.flourish && <div style={p.rail(p.accent)} />}

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
          {data.heading}
        </h2>

        {/* Postings — compact expandable */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Briefcase size={16} color={p.accentInk} />
            <span style={{
              fontFamily: theme.fonts.display, fontSize: '0.95rem',
              color: p.accentInk, textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Postings
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {jobs.map((job, i) => (
              <CompactJob key={`${job.company}-${i}`} job={job} index={i} visible={visible} theme={theme} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* Education & Certs — side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <GraduationCap size={16} color={p.tertiaryInk} />
              <span style={{
                fontFamily: theme.fonts.display, fontSize: '0.9rem',
                color: p.tertiaryInk, textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                Academy
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {education.map((edu, i) => (
                <motion.div
                  key={`${edu.degree}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                  style={{
                    background: p.flourish ? undefined : panelBg,
                    backgroundImage: p.flourish ? panelBg : undefined,
                    borderRadius: theme.radii.md,
                    padding: '10px 14px',
                    border: `1px solid ${eduEdge}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: theme.fonts.sans, fontSize: '0.8rem', fontWeight: 600, color: fg }}>
                      {edu.institution}
                    </span>
                    <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.65rem', color: isDark ? p.secondaryInk : p.accentInk, opacity: p.isStarfleet && !isDark ? 1 : 0.85 }}>
                      {edu.degree}
                    </span>
                  </div>
                  {edu.details && (
                    <p style={{ fontFamily: theme.fonts.sans, fontSize: '0.72rem', color: fg2, marginTop: 2 }}>
                      {edu.details}
                    </p>
                  )}
                  <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.65rem', color: p.metaInk }}>
                    {edu.period}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Award size={16} color={p.highlightInk} />
              <span style={{
                fontFamily: theme.fonts.display, fontSize: '0.9rem',
                color: p.highlightInk, textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                Commendations
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {certifications.map((cert, i) => (
                <motion.div
                  key={`${cert.name}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.06 }}
                  style={{
                    background: p.flourish ? undefined : panelBg,
                    backgroundImage: p.flourish ? panelBg : undefined,
                    borderRadius: theme.radii.md,
                    padding: '10px 14px',
                    border: `1px solid ${eduEdge}`,
                  }}
                >
                  <span style={{ fontFamily: theme.fonts.sans, fontSize: '0.8rem', fontWeight: 600, color: fg }}>
                    {cert.name}
                  </span>
                  <p style={{ fontFamily: theme.fonts.mono, fontSize: '0.65rem', color: p.metaInk, marginTop: 2 }}>
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
