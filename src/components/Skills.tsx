"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Terminal, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import ScrollFade from "./ScrollFade";
import { SkillSpan } from "./SkillPreview";
import MagneticText from "./MagneticText";

/* ─── Data ──────────────────────────────────────────────────────────── */

type SkillCategory = {
  id: number;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  accent: string;
  skills: string[];
};

const skillCategories: SkillCategory[] = [
  {
    id: 0,
    label: "Frameworks & Tools",
    shortLabel: "Frameworks",
    icon: Layers,
    accent: "#7c6af7",
    skills: [
      "Next.js", "React", "Node.js", "Prisma",
      "Payload CMS", "Supabase", "Firebase", "MongoDB", "SQLite", "Excel",
    ],
  },
  {
    id: 1,
    label: "Languages",
    shortLabel: "Languages",
    icon: Terminal,
    accent: "#06b6d4",
    skills: ["TypeScript", "JavaScript", "Python", "HTML / CSS", "SQL", "C"],
  },
  {
    id: 2,
    label: "Soft Skills",
    shortLabel: "Soft Skills",
    icon: Sparkles,
    accent: "#a78bfa",
    skills: [
      "Fast Learning", "Leadership", "Adaptability",
      "Time Management", "Attention to Detail",
    ],
  },
];

/* ─── Layout constants ──────────────────────────────────────────────── */

const RADIUS = 340;
const ORB_W  = 320;
const ARENA  = RADIUS * 2 + 220;

/* ─── Field physics constants ───────────────────────────────────────── */

const FIELD_SPRING   = 0.060; // spring pull toward drift target
const FIELD_DAMPING  = 0.86;  // velocity bleed per frame
const DRIFT_AMP      = 6;     // idle drift amplitude (px)
const DRIFT_FREQ     = 0.00042; // rad/ms
const DRIFT_PHASES   = [0, 2.09, 4.19]; // 120° spread across nodes
const LERP_SCL       = 0.10;  // scale interpolation speed
const LERP_GLOW      = 0.09;  // glow interpolation speed

type NodePhysics = {
  dx: number; dy: number; // displacement from orbital target
  vx: number; vy: number; // velocity
  scl: number;            // interpolated scale (toward active or depth)
  glowT: number;          // 0 → inactive, 1 → active (lerped)
};

/* ─── OrbitalSystem ─────────────────────────────────────────────────── */

function OrbitalSystem() {
  const [activeId, setActiveId] = useState<number | null>(null);

  /* DOM refs — updated directly from RAF, never via React state */
  const wrapperRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const glowRef       = useRef<HTMLDivElement>(null);
  const centerOrbRef  = useRef<HTMLDivElement>(null);

  /* Physics ref */
  const physicsRef = useRef<NodePhysics[]>(
    skillCategories.map(() => ({ dx: 0, dy: 0, vx: 0, vy: 0, scl: 0.9, glowT: 0 }))
  );

  /* Shared refs */
  const mouseRef    = useRef({ x: 0, y: 0, active: false });
  const activeIdRef = useRef<number | null>(null);
  const angleRef    = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef      = useRef(0);

  /* Keep activeIdRef in sync */
  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  /* ── RAF loop ──────────────────────────────────────────────────────── */
  useEffect(() => {
    const tick = (time: number) => {
      const delta = lastTimeRef.current ? time - lastTimeRef.current : 0;
      lastTimeRef.current = time;

      /* Advance orbital rotation */
      angleRef.current = (angleRef.current + delta * 0.011) % 360;

      for (let i = 0; i < skillCategories.length; i++) {
        const cat       = skillCategories[i];
        const baseAngle = (i / skillCategories.length) * 360;
        const rad       = ((angleRef.current + baseAngle) * Math.PI) / 180;

        /* Orbital base position */
        const orbX = RADIUS * Math.cos(rad);
        const orbY = RADIUS * Math.sin(rad);

        /* Idle drift target — unique phase per node */
        const driftX = Math.sin(time * DRIFT_FREQ + DRIFT_PHASES[i])        * DRIFT_AMP;
        const driftY = Math.cos(time * DRIFT_FREQ + DRIFT_PHASES[i] * 1.41) * DRIFT_AMP;

        const p = physicsRef.current[i];

        /* Spring toward drift target */
        p.vx += (driftX - p.dx) * FIELD_SPRING;
        p.vy += (driftY - p.dy) * FIELD_SPRING;
        p.vx *= FIELD_DAMPING;
        p.vy *= FIELD_DAMPING;
        p.dx += p.vx;
        p.dy += p.vy;

        /* Depth cue */
        const depth      = (1 + Math.sin(rad)) / 2;
        const isActive   = activeIdRef.current === i;
        const targetScl  = isActive ? 1.35 : Math.max(0.72, 0.72 + 0.28 * depth);
        const targetGlow = isActive ? 1 : 0;
        const targetOp   = isActive ? 1 : Math.max(0.70, 0.70 + 0.30 * depth);

        p.scl   += (targetScl  - p.scl)   * LERP_SCL;
        p.glowT += (targetGlow - p.glowT) * LERP_GLOW;

        /* ── Write wrapper: position + opacity + z-index ── */
        const wEl = wrapperRefs.current[i];
        if (wEl) {
          const fx = orbX + p.dx;
          const fy = orbY + p.dy;
          wEl.style.transform = `translate(calc(-50% + ${fx.toFixed(2)}px), calc(-50% + ${fy.toFixed(2)}px))`;
          wEl.style.opacity   = targetOp.toFixed(3);
          wEl.style.zIndex    = isActive ? "30" : String(Math.round(depth * 10 + 1));
        }

        /* ── Write inner orb: scale + background + border + glow ── */
        const iEl = innerRefs.current[i];
        if (iEl) {
          const t       = p.glowT;
          const accent  = cat.accent;

          iEl.style.transform  = `scale(${p.scl.toFixed(4)})`;

          /* Background: accent tint always visible, intensifies on active */
          const baseTint = 0.18;
          const activeTint = Math.round((baseTint + t * 0.22) * 255).toString(16).padStart(2, "0");
          iEl.style.background = `radial-gradient(circle at 38% 32%, ${accent}${activeTint}, rgba(12,12,22,0.92))`;

          /* Border: always accent-coloured, gets fully opaque on active */
          iEl.style.borderColor = `${accent}${Math.round(0.55 + t * 0.45).toString(16).padStart(2,"0")}`;
          iEl.style.borderWidth = "1.5px";

          /* Glow: subtle at rest, strong when active */
          const g0 = Math.round(8  + t * 32);
          const g1 = Math.round(18 + t * 72);
          iEl.style.boxShadow = `0 0 ${g0}px ${accent}55, 0 0 ${g1}px ${accent}${Math.round(t * 0.38 * 255).toString(16).padStart(2,"0")}`;
        }

        /* ── Write label color ── */
        const lEl = labelRefs.current[i];
        if (lEl) {
          lEl.style.color      = p.glowT > 0.5 ? cat.accent : "rgba(255,255,255,0.85)";
          lEl.style.textShadow = p.glowT > 0.5 ? `0 0 12px ${cat.accent}70` : "none";
        }
      }

      /* ── Update center orb border based on active category ── */
      if (centerOrbRef.current) {
        const aId = activeIdRef.current;
        if (aId !== null) {
          const accent = skillCategories[aId].accent;
          centerOrbRef.current.style.borderColor = `${accent}60`;
          centerOrbRef.current.style.boxShadow   = `0 0 0 1px ${accent}18`;
        } else {
          centerOrbRef.current.style.borderColor = "rgba(255,255,255,0.10)";
          centerOrbRef.current.style.boxShadow   = "none";
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Mouse handlers ─────────────────────────────────────────────── */

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx   = e.clientX - rect.left;
    const my   = e.clientY - rect.top;

    /* Move cursor glow */
    if (glowRef.current) {
      glowRef.current.style.left = `${(mx - 180).toFixed(1)}px`;
      glowRef.current.style.top  = `${(my - 180).toFixed(1)}px`;
    }

    mouseRef.current.x = mx - ARENA / 2;
    mouseRef.current.y = my - ARENA / 2;
  };

  const handleMouseEnter = () => {
    mouseRef.current.active = true;
    if (glowRef.current) glowRef.current.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
    if (glowRef.current) glowRef.current.style.opacity = "0";
    setActiveId(null);
  };

  const activeCategory = skillCategories.find((c) => c.id === activeId) ?? null;

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: ARENA, height: ARENA }}
      onClick={() => setActiveId(null)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* ── Cursor glow ──────────────────────────────────────────── */}
      <div
        ref={glowRef}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 360,
          height: 360,
          opacity: 0,
          transition: "opacity 0.7s ease",
          background: "radial-gradient(circle, rgba(124,106,247,0.09) 0%, transparent 68%)",
        }}
      />

      {/* ── Nebula ambient ───────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(124,106,247,0.055) 0%, rgba(6,182,212,0.02) 45%, transparent 70%)",
        }}
      />

      {/* ── Rings ────────────────────────────────────────────────── */}
      <div className="absolute rounded-full pointer-events-none" style={{
        width: RADIUS * 2 + 120, height: RADIUS * 2 + 120,
        border: "1px solid rgba(255,255,255,0.04)",
      }} />
      <div className="absolute rounded-full pointer-events-none" style={{
        width: RADIUS * 2 + 56,  height: RADIUS * 2 + 56,
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 0 28px rgba(124,106,247,0.12), inset 0 0 28px rgba(124,106,247,0.07)",
      }} />
      <div className="absolute rounded-full pointer-events-none" style={{
        width: RADIUS * 2 - 60,  height: RADIUS * 2 - 60,
        border: "1px solid rgba(255,255,255,0.04)",
      }} />
      <div className="absolute rounded-full pointer-events-none" style={{
        width: RADIUS * 2 - 160, height: RADIUS * 2 - 160,
        border: "1px solid rgba(124,106,247,0.07)",
      }} />

      {/* ── Center orb shell (minimalist) ────────────────────────── */}
      <div
        ref={centerOrbRef}
        className="absolute z-10 rounded-full pointer-events-none"
        style={{
          width: ORB_W,
          height: ORB_W,
          background: "rgba(8,8,16,0.84)",
          border: "1px solid rgba(255,255,255,0.10)",
          backdropFilter: "blur(2px)",
          transition: "border-color 0.5s ease, box-shadow 0.5s ease",
        }}
      />

      {/* ── Center content ───────────────────────────────────────── */}
      <div
        className="absolute z-20 flex items-center justify-center"
        style={{ width: ORB_W, height: ORB_W }}
      >
        <AnimatePresence mode="wait">
          {!activeCategory && (
            <motion.div
              key="title"
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.90 }}
              transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col items-center text-center px-6"
            >
              <span className="text-sm font-semibold tracking-[0.3em] uppercase text-[#7c6af7] mb-4">
                04 — Skills
              </span>
              <MagneticText className="text-3xl font-bold text-[#e2e8f0] leading-tight text-center">
                What I work with.
              </MagneticText>
              <div className="mt-6 flex items-center gap-3">
                <span className="block w-8 h-px bg-gradient-to-r from-transparent to-[#7c6af7]/45" />
                <p className="text-[11px] text-[#374151] tracking-[0.3em] uppercase">click an orb</p>
                <span className="block w-8 h-px bg-gradient-to-l from-transparent to-[#7c6af7]/45" />
              </div>
            </motion.div>
          )}

          {activeCategory && (
            <motion.div
              key={`card-${activeCategory.id}`}
              initial={{ opacity: 0, scale: 0.90 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.90 }}
              transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full h-full rounded-full flex flex-col items-center justify-center px-7 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center gap-2 mb-5 flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5"
                  style={{
                    background: `${activeCategory.accent}18`,
                    border: `1px solid ${activeCategory.accent}40`,
                  }}
                >
                  {(() => { const Icon = activeCategory.icon; return <Icon size={20} color={activeCategory.accent} strokeWidth={1.5} />; })()}
                </div>
                <h3
                  className="text-sm font-semibold tracking-[0.25em] uppercase"
                  style={{ color: activeCategory.accent }}
                >
                  {activeCategory.label}
                </h3>
              </div>

              <div className="flex flex-wrap justify-center gap-2 overflow-hidden content-start">
                {activeCategory.skills.map((skill, idx) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.035, duration: 0.2 }}
                  >
                    <SkillSpan skill={skill}>
                      <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-medium text-[#94a3b8] border border-[#1e1e2e] bg-[#0a0a14]/90">
                        {skill}
                      </span>
                    </SkillSpan>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Orbiting nodes ───────────────────────────────────────── */}
      {skillCategories.map((cat, i) => {
        const isActive = activeId === cat.id;

        return (
          <div
            key={cat.id}
            ref={(el) => { wrapperRefs.current[i] = el; }}
            className="absolute"
            style={{ willChange: "transform, opacity" }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveId(activeId === cat.id ? null : cat.id);
            }}
          >
            {/* Inner orb — all visual state written by RAF */}
            <div
              ref={(el) => { innerRefs.current[i] = el; }}
              className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer"
              style={{
                backdropFilter: "blur(12px)",
                borderStyle: "solid",
                willChange: "transform, box-shadow",
              }}
            >
              {(() => { const Icon = cat.icon; return <Icon size={30} color={cat.accent} strokeWidth={1.5} />; })()}
            </div>

            {/* Label — color written by RAF */}
            <div
              ref={(el) => { labelRefs.current[i] = el; }}
              className="absolute top-[5.5rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-widest uppercase pointer-events-none"
              style={{ color: "rgba(255,255,255,0.85)", transition: "color 0.4s ease, text-shadow 0.4s ease" }}
            >
              {cat.shortLabel}
            </div>

            {/* Pulse rings — React-rendered, triggered by activeId change */}
            {isActive && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ border: `1.5px solid ${cat.accent}` }}
                  initial={{ scale: 1, opacity: 0.65 }}
                  animate={{ scale: 2.7, opacity: 0 }}
                  transition={{ duration: 1.4, ease: "easeOut", repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ border: `1px solid ${cat.accent}` }}
                  initial={{ scale: 1, opacity: 0.35 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 1.4, ease: "easeOut", repeat: Infinity, delay: 0.45 }}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Mobile fallback ────────────────────────────────────────────────── */

function MobileSkills() {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {skillCategories.map((cat) => {
        const isOpen = activeId === cat.id;
        return (
          <div key={cat.id}>
            <button
              onClick={() => setActiveId(isOpen ? null : cat.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all"
              style={{
                background: isOpen ? `${cat.accent}10` : "#0e0e1a",
                borderColor: isOpen ? `${cat.accent}40` : "#1e1e2e",
              }}
            >
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${cat.accent}15`, border: `1px solid ${cat.accent}30` }}
              >
                {(() => { const Icon = cat.icon; return <Icon size={18} color={cat.accent} strokeWidth={1.6} />; })()}
              </span>
              <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: cat.accent }}>
                {cat.label}
              </span>
              <span className="ml-auto text-[#4b5563] text-xs">{isOpen ? "▲" : "▼"}</span>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-3 px-1">
                    {cat.skills.map((skill) => (
                      <SkillSpan key={skill} skill={skill}>
                        <motion.span
                          whileHover={{ scale: 1.06, color: cat.accent }}
                          className="inline-block px-3 py-1.5 rounded-lg text-sm font-medium text-[#94a3b8] border border-[#1e1e2e] bg-[#0a0a14] cursor-default"
                        >
                          {skill}
                        </motion.span>
                      </SkillSpan>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Export ──────────────────────────────────────────────────────────── */

export default function Skills() {
  return (
    <SectionWrapper id="skills">
      <div className="hidden md:flex items-center justify-center w-full min-h-screen">
        <ScrollFade yOffset={20}>
          <OrbitalSystem />
        </ScrollFade>
      </div>

      <div className="md:hidden w-full">
        <div className="mb-6">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#7c6af7] mb-2">
            04 — Skills
          </span>
          <h2 className="text-3xl font-bold text-[#e2e8f0]">What I work with.</h2>
          <p className="text-[#6b7280] text-sm mt-2">A snapshot of my technical and professional toolkit.</p>
        </div>
        <MobileSkills />
      </div>
    </SectionWrapper>
  );
}
