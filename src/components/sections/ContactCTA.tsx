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
  const { theme, isDark } = useTheme();
  const { socials } = useSiteSettings();
  const links = [
    { icon: Linkedin, label: "LinkedIn", href: socials.linkedin, color: "#0A66C2" },
    { icon: Github, label: "GitHub", href: socials.github, color: "#CC99FF" },
    { icon: MediumIcon, label: "Medium", href: socials.medium, color: "#FF9F1C" },
  ].filter((l) => l.href);
  const c = theme.colors;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;

  return (
    <section
      id={anchorId}
      style={{
        padding: "80px 24px",
        backgroundImage: isDark ? "linear-gradient(180deg, #060A18 0%, #0C1030 50%, #060A18 100%)" : undefined,
        background: isDark ? undefined : c.background.light,
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {isDark && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: "#FF9F1C",
            opacity: 0.6,
          }}
        />
      )}

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
            background: isDark ? "linear-gradient(135deg, #FF9F1C, #E08A0C)" : "#1A1A2E",
            color: isDark ? "#0A0E1A" : "#F0EDDF",
            fontFamily: theme.fonts.sans,
            fontWeight: 600,
            fontSize: "0.9rem",
            textDecoration: "none",
            boxShadow: isDark ? "0 0 20px rgba(255,159,28,0.3)" : "0 2px 8px rgba(0,0,0,0.15)",
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
                  background: isDark ? `${link.color}10` : `${link.color}15`,
                  border: `1px solid ${isDark ? `${link.color}25` : `${link.color}30`}`,
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
