import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { defaultSectionData } from "@/cms/defaults";
import { useSiteSettings } from "@/cms/api";
import type { ContactData } from "@/cms/types";
import { Mail, Linkedin, Github } from "lucide-react";

// Custom Medium "M" icon component
function MediumIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

export default function ContactCTA({ data = defaultSectionData.contact, anchorId = "contact" }: { data?: ContactData; anchorId?: string }) {
  const { theme, palette: p } = useTheme();
  const { socials } = useSiteSettings();
  // Social tiles: icon colour (ink), tile background and edge – all design tokens.
  const links = [
    { icon: Linkedin, label: "LinkedIn", href: socials.linkedin, color: p.linkedin, bg: p.linkedinTint, edge: p.linkedinEdge },
    { icon: Github, label: "GitHub", href: socials.github, color: p.secondaryInk, bg: p.secondaryTint, edge: p.secondaryEdge },
    { icon: MediumIcon, label: "Medium", href: socials.medium, color: p.accentInk, bg: p.accentTint, edge: p.accentEdge },
  ].filter((l) => l.href);
  const fg = p.fg;
  const fg2 = p.fg2;

  return (
    <section
      id={anchorId}
      style={{
        padding: "80px 24px",
        backgroundImage: p.flourish ? p.sectionBg : undefined,
        background: p.flourish ? undefined : p.sectionBg,
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {p.flourish && <div style={p.rail(p.accent)} />}

      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: theme.fonts.display,
            fontSize: "1.8rem",
            color: fg,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 12,
          }}
        >
          {data.heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontFamily: theme.fonts.sans,
            fontSize: "0.95rem",
            color: fg2,
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          {data.text}
        </motion.p>

        <motion.a
          href={`mailto:${data.email}`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 28px",
            borderRadius: theme.radii.md,
            background: p.ctaBg,
            color: p.ctaInk,
            fontFamily: theme.fonts.sans,
            fontWeight: 600,
            fontSize: "0.9rem",
            textDecoration: "none",
            boxShadow: p.shadowCta,
            cursor: "pointer",
          }}
        >
          <Mail size={18} />
          {data.buttonLabel}
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 28,
          }}
        >
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: theme.radii.md,
                  background: link.bg,
                  border: `1px solid ${link.edge}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <Icon size={18} color={link.color} />
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
