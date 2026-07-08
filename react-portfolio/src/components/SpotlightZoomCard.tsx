/**
 * SpotlightZoomCard — Spotlight glow + hover zoom/lift animation
 * Cursor-tracked radial glow + scale + translateY on hover.
 * Adapts to dark/light mode via the `dark` prop.
 */
import { useRef, useState } from "react";

export interface SpotlightZoomCardProps {
  label?: string;
  title: string;
  description: string;
  tags?: string[];
  link?: string;
  linkLabel?: string;
  dark?: boolean;
  className?: string;
}

export default function SpotlightZoomCard({
  label,
  title,
  description,
  tags = [],
  link,
  linkLabel = "View Project",
  dark = false,
  className = "",
}: SpotlightZoomCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const rose = dark ? "#e08fa6" : "#c2748a";
  const bg = dark ? "rgba(45,20,30,0.82)" : "rgba(255,240,245,0.82)";
  const border = dark ? "rgba(194,116,138,0.22)" : "rgba(194,116,138,0.18)";
  const textMain = dark ? "#fdf6f9" : "#2d1f26";
  const textMuted = dark ? "#c4a0b0" : "#7a5c68";
  const glowColor = dark ? "rgba(194,116,138,0.32)" : "rgba(194,116,138,0.22)";
  const tagBg = dark ? "rgba(194,116,138,0.14)" : "rgba(194,116,138,0.09)";

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "1.75rem",
        borderRadius: "1.25rem",
        background: bg,
        border: `1px solid ${hovered ? rose : border}`,
        backdropFilter: "blur(14px)",
        overflow: "hidden",
        cursor: link ? "pointer" : "default",
        transition: "transform 0.28s cubic-bezier(0.23,1,0.32,1), box-shadow 0.28s cubic-bezier(0.23,1,0.32,1), border-color 0.2s",
        transform: hovered ? "translateY(-8px) scale(1.025)" : "translateY(0) scale(1)",
        boxShadow: hovered ? `0 20px 48px ${glowColor}, 0 4px 16px rgba(0,0,0,0.08)` : `0 2px 12px rgba(0,0,0,0.04)`,
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
      }}
    >
      {/* Spotlight radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "1.25rem",
          background: hovered ? `radial-gradient(circle 200px at ${pos.x}% ${pos.y}%, ${glowColor}, transparent 70%)` : "transparent",
          transition: "background 0.1s",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Rose accent top-edge line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${rose}, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
          borderRadius: "999px",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
        {label && (
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: rose,
            }}
          >
            {label}
          </span>
        )}
        {title && (
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: textMain,
              lineHeight: 1.25,
              margin: 0,
              transition: "color 0.2s",
            }}
          >
            {title}
          </h3>
        )}
        {description && (
          <p
            style={{
              fontSize: "0.83rem",
              color: textMuted,
              lineHeight: 1.7,
              margin: 0,
              flex: 1,
            }}
          >
            {description}
          </p>
        )}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.25rem" }}>
            {tags.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                  color: rose,
                  background: tagBg,
                  border: `1px solid rgba(194,116,138,0.22)`,
                  borderRadius: "999px",
                  padding: "0.2rem 0.65rem",
                  letterSpacing: "0.04em",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: "0.5rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.78rem",
              color: rose,
              fontWeight: 600,
              textDecoration: "none",
              opacity: hovered ? 1 : 0.7,
              transition: "opacity 0.2s",
              letterSpacing: "0.02em",
            }}
          >
            {linkLabel} →
          </a>
        )}
      </div>
    </div>
  );
}
