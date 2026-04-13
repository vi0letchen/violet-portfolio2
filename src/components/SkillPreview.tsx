"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ── Icon map (Simple Icons CDN) ────────────────────────────────── */

const CDN = "https://cdn.simpleicons.org";

const SKILL_ICONS: Record<string, { slug: string; color: string }> = {
  "Next.js":      { slug: "nextdotjs",      color: "ffffff" },
  "React":        { slug: "react",          color: "61dafb" },
  "Node.js":      { slug: "nodedotjs",      color: "5fa04e" },
  "Prisma":       { slug: "prisma",         color: "ffffff" },
  "Payload CMS":  { slug: "payloadcms",     color: "ffffff" },
  "Supabase":     { slug: "supabase",       color: "3ecf8e" },
  "Firebase":     { slug: "firebase",       color: "dd2c00" },
  "MongoDB":      { slug: "mongodb",        color: "47a248" },
  "SQLite":       { slug: "sqlite",         color: "003b57" },
  "Excel":        { slug: "microsoftexcel", color: "217346" },
  "TypeScript":   { slug: "typescript",     color: "3178c6" },
  "JavaScript":   { slug: "javascript",     color: "f7df1e" },
  "Python":       { slug: "python",         color: "3776ab" },
  "HTML / CSS":   { slug: "html5",          color: "e34f26" },
  "SQL":          { slug: "postgresql",     color: "4169e1" },
  "C":            { slug: "c",              color: "a8b9cc" },
  "Tailwind":     { slug: "tailwindcss",    color: "06b6d4" },
  "Tailwind CSS": { slug: "tailwindcss",    color: "06b6d4" },
  "Auth":         { slug: "auth0",          color: "eb5424" },
  "Payments":     { slug: "stripe",         color: "635bff" },
  "Tkinter":      { slug: "python",         color: "3776ab" },
};

function getIconUrl(skill: string): string | null {
  const entry = SKILL_ICONS[skill];
  if (!entry) return null;
  return `${CDN}/${entry.slug}/${entry.color}`;
}

/* ── Dimensions ─────────────────────────────────────────────────── */

const CARD_W = 72;
const CARD_H = 72;
const GAP    = 10; // px gap above the element

/* ── Context ────────────────────────────────────────────────────── */

type Ctx = {
  show: (skill: string, rect: DOMRect) => void;
  move: (clientX: number, rect: DOMRect) => void;
  hide: () => void;
};

const SkillPreviewContext = createContext<Ctx>({
  show: () => {},
  move: () => {},
  hide: () => {},
});

/* ── Provider ───────────────────────────────────────────────────── */

export function SkillPreviewProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [skill, setSkill]     = useState("");
  const cardY                 = useMotionValue(0);

  // Raw cursor X clamped to element bounds → spring → left position
  const mvX   = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 500, damping: 38, mass: 0.4 });
  const leftX   = useTransform(springX, (v) => v - CARD_W / 2);

  const show = useCallback(
    (s: string, rect: DOMRect) => {
      if (!getIconUrl(s)) return;
      setSkill(s);
      cardY.set(rect.top - CARD_H - GAP);
      const cx = Math.max(rect.left + CARD_W / 2, Math.min(rect.right - CARD_W / 2, rect.left + rect.width / 2));
      mvX.set(cx);
      setVisible(true);
    },
    [mvX, cardY],
  );

  const move = useCallback(
    (clientX: number, rect: DOMRect) => {
      cardY.set(rect.top - CARD_H - GAP);
      const cx = Math.max(rect.left + CARD_W / 2, Math.min(rect.right - CARD_W / 2, clientX));
      mvX.set(cx);
    },
    [mvX, cardY],
  );

  const hide = useCallback(() => setVisible(false), []);

  // Only render portal after mount (avoids SSR mismatch)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const url = getIconUrl(skill);

  return (
    <SkillPreviewContext.Provider value={{ show, move, hide }}>
      {children}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {visible && url && (
              <motion.div
                key="skill-preview"
                initial={{ opacity: 0, scale: 0.7, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: 8 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  top: cardY,
                  left: leftX,
                  width: CARD_W,
                  height: CARD_H,
                  pointerEvents: "none",
                  zIndex: 10000,
                }}
                className="rounded-2xl bg-[#0e0e1a]/90 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={skill}
                  width={36}
                  height={36}
                  style={{ objectFit: "contain", display: "block" }}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </SkillPreviewContext.Provider>
  );
}

/* ── Hook ───────────────────────────────────────────────────────── */

export function useSkillPreview() {
  return useContext(SkillPreviewContext);
}

/* ── SkillSpan ──────────────────────────────────────────────────── */

interface SkillSpanProps {
  skill: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Drop-in wrapper for any skill mention.
 * Forwards className/style to the outer <span> and shows a logo
 * preview card above the element when hovered.
 */
export function SkillSpan({ skill, className, style, children }: SkillSpanProps) {
  const { show, move, hide } = useSkillPreview();
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={ref}
      className={className}
      style={style}
      onMouseEnter={() => {
        if (ref.current) show(skill, ref.current.getBoundingClientRect());
      }}
      onMouseMove={(e) => {
        if (ref.current) move(e.clientX, ref.current.getBoundingClientRect());
      }}
      onMouseLeave={hide}
    >
      {children ?? skill}
    </span>
  );
}
