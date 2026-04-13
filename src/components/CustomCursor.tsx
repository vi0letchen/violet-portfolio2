"use client";

/**
 * CustomCursor — Magnetic particle cluster cursor.
 *
 * Structure:
 *   • Main dot     — snaps instantly to pointer; glowing purple orb
 *   • Trailing ring — 36 px stroke ring, lerps at 0.10 (loose follow)
 *   • Particle cluster — 6 micro-dots orbiting the cursor at different
 *     radii and angular speeds, each lerping with its own lag so they
 *     smear into a "comet tail" on fast moves
 *
 * Interactive states:
 *   • Hovering a button/link/[data-cursor-grow]: ring grows, dot brightens
 *   • All transitions driven by a single RAF loop — zero CSS transitions
 *     (avoids jank on heavy scroll frames).
 */

import { useEffect, useRef } from "react";

/* ─── Particle config ───────────────────────────────────────────────── */

const PARTICLES = [
  { r: 13, speed: 1.1, phase: 0.0,             size: 4, color: "#7c6af7", lag: 0.07 },
  { r: 13, speed: 1.1, phase: Math.PI,          size: 4, color: "#38bdf8", lag: 0.07 },
  { r: 20, speed: 0.65, phase: Math.PI / 3,     size: 3, color: "#a78bfa", lag: 0.05 },
  { r: 20, speed: 0.65, phase: Math.PI + Math.PI / 3, size: 3, color: "#38bdf8", lag: 0.05 },
  { r: 28, speed: 0.40, phase: Math.PI * 0.8,   size: 2, color: "#7c6af7", lag: 0.035 },
  { r: 28, speed: 0.40, phase: Math.PI * 1.8,   size: 2, color: "#a78bfa", lag: 0.035 },
];

/* ─── Lerp helper ───────────────────────────────────────────────────── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ─── Component ─────────────────────────────────────────────────────── */

export default function CustomCursor() {
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const ptRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const stateRef  = useRef({
    mx: -200, my: -200,       // raw mouse
    rx: -200, ry: -200,       // ring (lagged)
    ptX: PARTICLES.map(() => -200),
    ptY: PARTICLES.map(() => -200),
    t: 0,
    hover: false,
  });

  useEffect(() => {
    document.body.style.cursor = "none";

    const s = stateRef.current;
    let rafId: number;

    /* Mouse tracking */
    const onMove = (e: MouseEvent) => { s.mx = e.clientX; s.my = e.clientY; };

    /* Interactive hover detection */
    const onEnter = () => { s.hover = true; };
    const onLeave = () => { s.hover = false; };
    const INTERACTIVE = "a, button, [role='button'], input, textarea, select, [data-cursor-grow]";
    document.querySelectorAll<HTMLElement>(INTERACTIVE).forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    /* RAF loop */
    const tick = () => {
      s.t += 0.022;
      const { mx, my, hover } = s;

      /* Dot — instant */
      if (dotRef.current) {
        const scale = hover ? 2.4 : 1;
        dotRef.current.style.transform = `translate(${mx - 4}px, ${my - 4}px) scale(${scale})`;
        dotRef.current.style.opacity   = mx < -100 ? "0" : "1";
      }

      /* Ring — lerp 0.10 */
      s.rx = lerp(s.rx, mx, 0.10);
      s.ry = lerp(s.ry, my, 0.10);
      if (ringRef.current) {
        const ringSize = hover ? 52 : 36;
        const half = ringSize / 2;
        ringRef.current.style.transform = `translate(${s.rx - half}px, ${s.ry - half}px)`;
        ringRef.current.style.width  = `${ringSize}px`;
        ringRef.current.style.height = `${ringSize}px`;
        ringRef.current.style.opacity = hover ? "0.7" : "0.45";
      }

      /* Particles — orbit + individual lag */
      PARTICLES.forEach((p, i) => {
        const targetX = mx + Math.cos(p.phase + s.t * p.speed) * p.r;
        const targetY = my + Math.sin(p.phase + s.t * p.speed) * p.r;
        s.ptX[i] = lerp(s.ptX[i], targetX, p.lag);
        s.ptY[i] = lerp(s.ptY[i], targetY, p.lag);
        const el = ptRefs.current[i];
        if (el) {
          const half = p.size / 2;
          el.style.transform = `translate(${s.ptX[i] - half}px, ${s.ptY[i] - half}px)`;
          el.style.opacity = mx < -100 ? "0" : `${0.55 - i * 0.06}`;
        }
      });

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      document.querySelectorAll<HTMLElement>(INTERACTIVE).forEach(el => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="absolute rounded-full border border-[#7c6af7]"
        style={{ willChange: "transform, width, height", transition: "width 0.15s, height 0.15s" }}
      />

      {/* Particle cluster */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          ref={el => { ptRefs.current[i] = el; }}
          className="absolute rounded-full"
          style={{
            width:  p.size,
            height: p.size,
            background: p.color,
            willChange: "transform",
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
        />
      ))}

      {/* Main dot */}
      <div
        ref={dotRef}
        className="absolute w-2 h-2 rounded-full bg-[#c4b5fd]"
        style={{
          willChange: "transform, opacity",
          boxShadow: "0 0 8px 3px rgba(167,139,250,0.9), 0 0 20px 6px rgba(124,106,247,0.4)",
          transition: "transform 0.08s",
        }}
      />
    </div>
  );
}
