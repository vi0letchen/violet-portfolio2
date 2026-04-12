"use client";

import { useRef, useEffect, ReactNode, CSSProperties } from "react";
import { motion, useMotionValue } from "framer-motion";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  yOffset?: number;
}

/**
 * Smoothstep easing: slow at edges, fast in the middle.
 * Gives a "snap into view" feel rather than a gradual linear fade.
 */
function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/**
 * Scroll-driven fade + scale.
 *
 * The viewport is split into thirds based on the element's center point:
 *   - Bottom third  (entering): opacity 0→1, scale 0.85→1
 *   - Middle third  (visible) : opacity 1,   scale 1
 *   - Top third     (exiting) : opacity 1→0, scale 1→0.85
 *
 * Values are recalculated on every scroll tick via rAF.
 * No CSS transitions — motion values are set directly so they
 * track scroll position in real time.
 */
export default function ScrollFade({
  children,
  className = "",
  style,
  yOffset = 24,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const opacityMV = useMotionValue(0);
  const scaleMV   = useMotionValue(0.85);
  const yMV       = useMotionValue(yOffset);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;

      // Normalised position of element center within viewport (0 = top, 1 = bottom)
      const pos = (rect.top + rect.height / 2) / vh;

      // Fade zone: only the outer 15% on each edge triggers the effect.
      // Elements are fully visible across the central 70% of the viewport.
      const edge = 0.30;

      let raw: number;
      if (pos <= 0 || pos >= 1) {
        raw = 0; // fully off-screen
      } else if (pos < edge) {
        // Exiting at top
        raw = pos / edge;
      } else if (pos > 1 - edge) {
        // Entering from bottom
        raw = (1 - pos) / edge;
      } else {
        // Fully visible zone (middle 70%)
        raw = 1;
      }

      // Smoothstep so the fade feels snappy rather than linear
      const t = smoothstep(raw);

      opacityMV.set(t);
      scaleMV.set(0.93 + 0.07 * t);
      yMV.set(yOffset * (1 - t));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    compute(); // run immediately so elements already in view appear correctly

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [opacityMV, scaleMV, yMV, yOffset]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity: opacityMV, scale: scaleMV, y: yMV, ...style }}
    >
      {children}
    </motion.div>
  );
}
