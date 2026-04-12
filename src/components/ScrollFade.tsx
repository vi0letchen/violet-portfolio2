"use client";

import { useRef, useEffect, ReactNode, CSSProperties } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useHScroll } from "./HScrollContext";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  yOffset?: number;
}

/**
 * Smoothstep easing: slow at edges, fast in the middle.
 */
function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/**
 * Scroll-driven fade + scale.
 *
 * Vertical mode (mobile / default):
 *   Tracks window scroll. Element center position relative to viewport height.
 *   Animates opacity, scale, and Y offset.
 *
 * Horizontal mode (desktop):
 *   Tracks the HorizontalScroller container's scroll.
 *   Element center position relative to viewport width.
 *   Animates opacity, scale, and X offset.
 *   Entering from right → positive x offset fades to 0.
 *   Exiting to left → negative x offset fades to 0.
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
  const xMV       = useMotionValue(yOffset); // same magnitude, X axis

  const { containerRef, isHorizontal } = useHScroll();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number;

    const computeVertical = () => {
      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;
      const pos  = (rect.top + rect.height / 2) / vh;
      const edge = 0.30;

      let raw: number;
      if (pos <= 0 || pos >= 1) {
        raw = 0;
      } else if (pos < edge) {
        raw = pos / edge;          // exiting top
      } else if (pos > 1 - edge) {
        raw = (1 - pos) / edge;    // entering bottom
      } else {
        raw = 1;
      }

      const t = smoothstep(raw);
      opacityMV.set(t);
      scaleMV.set(0.93 + 0.07 * t);
      yMV.set(yOffset * (1 - t));
      xMV.set(0);
    };

    const computeHorizontal = () => {
      const rect = el.getBoundingClientRect();
      const vw   = window.innerWidth;
      const pos  = (rect.left + rect.width / 2) / vw;
      const edge = 0.30;

      let opacity: number;
      let scale: number;
      let x: number;

      if (pos <= 0 || pos >= 1) {
        opacity = 0; scale = 0.93; x = 0;
      } else if (pos < edge) {
        // Exiting to the left — slide left & fade
        const t = smoothstep(pos / edge);
        opacity = t;
        scale   = 0.93 + 0.07 * t;
        x       = -yOffset * (1 - t);
      } else if (pos > 1 - edge) {
        // Entering from the right — slide in from right & fade
        const t = smoothstep((1 - pos) / edge);
        opacity = t;
        scale   = 0.93 + 0.07 * t;
        x       = yOffset * (1 - t);
      } else {
        opacity = 1; scale = 1; x = 0;
      }

      opacityMV.set(opacity);
      scaleMV.set(scale);
      xMV.set(x);
      yMV.set(0);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(isHorizontal ? computeHorizontal : computeVertical);
    };

    const scrollTarget = isHorizontal ? containerRef.current : window;

    if (!scrollTarget) {
      // Container not yet mounted — fall back to vertical until it is
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      computeVertical();
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(rafId);
      };
    }

    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    (isHorizontal ? computeHorizontal : computeVertical)();

    return () => {
      scrollTarget.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [opacityMV, scaleMV, yMV, xMV, yOffset, isHorizontal, containerRef]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity: opacityMV, scale: scaleMV, y: yMV, x: xMV, ...style }}
    >
      {children}
    </motion.div>
  );
}
