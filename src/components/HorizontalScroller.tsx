"use client";

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  Children,
  useCallback,
} from "react";
import { useHScroll } from "./HScrollContext";

interface Props {
  children: ReactNode;
}

/** Smoothing factor per frame (0–1). Higher = snappier, lower = floatier. */
const LERP = 0.12;

/** Slower lerp when jumping to a section (navbar / scrollToSection) — lower = longer glide. */
const LERP_SECTION_NAV = 0.045;

/**
 * Scroll distance multiplier per wheel event. Higher = faster scrolling.
 * Combined with low LERP for smooth, fast feeling.
 */
const SCROLL_MULTIPLIER = 1.8;

/**
 * Horizontal scroll container for desktop (≥ md).
 * Mobile falls back to normal vertical flow.
 *
 * Each wheel event adds to a target position; a rAF loop lerps the actual
 * scrollLeft toward that target every frame — identical smooth deceleration
 * curve regardless of how fast or slow the wheel fires.
 */
export default function HorizontalScroller({ children }: Props) {
  const { containerRef, isHorizontal, registerSectionScroller } = useHScroll();
  const panelCount  = Children.count(children);
  const [currentPanel, setCurrentPanel] = useState(0);

  const targetX = useRef(0);
  const rafId   = useRef(0);
  /** Which lerp `animate` uses; wheel resets to `LERP`, section nav uses `LERP_SECTION_NAV`. */
  const activeLerp = useRef(LERP);

  /* ── Core lerp animation loop ─────────────────────────────────────── */
  const animate = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const diff = targetX.current - el.scrollLeft;
    if (Math.abs(diff) < 0.5) {
      el.scrollLeft = targetX.current;
      activeLerp.current = LERP;
      return;
    }
    el.scrollLeft += diff * activeLerp.current;
    rafId.current = requestAnimationFrame(animate);
  }, [containerRef]);

  /* ── Wheel → accumulate into targetX, lerp does the rest ─────────── */
  useEffect(() => {
    if (!isHorizontal) return;
    const el = containerRef.current;
    if (!el) return;

    targetX.current = el.scrollLeft;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      activeLerp.current = LERP;
      const max = el.scrollWidth - el.clientWidth;
      targetX.current = el.scrollLeft;
      targetX.current = Math.max(0, Math.min(max, targetX.current + e.deltaY * SCROLL_MULTIPLIER));
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(animate);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafId.current);
    };
  }, [isHorizontal, containerRef, animate]);

  /* ── Navbar / in-page links: scroll to section id (syncs wheel target + cancels rAF) ─ */
  useEffect(() => {
    registerSectionScroller((id: string) => {
      const c = containerRef.current;
      if (!c) return;
      const target = document.getElementById(id);
      if (!target) return;
      cancelAnimationFrame(rafId.current);
      const max = c.scrollWidth - c.clientWidth;
      const left =
        target.getBoundingClientRect().left -
        c.getBoundingClientRect().left +
        c.scrollLeft;
      activeLerp.current = LERP_SECTION_NAV;
      targetX.current = Math.max(0, Math.min(max, left));
      rafId.current = requestAnimationFrame(animate);
    });
    return () => registerSectionScroller(null);
  }, [registerSectionScroller, containerRef, animate]);

  /* ── Scroll-to-panel (dots + keyboard) ───────────────────────────── */
  const scrollToPanel = useCallback(
    (index: number) => {
      const el = containerRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(panelCount - 1, index));
      const panel = el.children[clamped] as HTMLElement | undefined;
      targetX.current = panel ? panel.offsetLeft : clamped * window.innerWidth;
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(animate);
    },
    [containerRef, panelCount, animate]
  );

  /* ── Keyboard navigation ─────────────────────────────────────────── */
  useEffect(() => {
    if (!isHorizontal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); scrollToPanel(currentPanel + 1); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); scrollToPanel(currentPanel - 1); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isHorizontal, currentPanel, scrollToPanel]);

  /* ── Track current panel ─────────────────────────────────────────── */
  useEffect(() => {
    if (!isHorizontal) return;
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const panels = Array.from(el.children) as HTMLElement[];
      if (!panels.length) return;

      let nearestIdx = 0;
      let nearestDist = Math.abs(el.scrollLeft - panels[0].offsetLeft);

      for (let i = 1; i < panels.length; i += 1) {
        const dist = Math.abs(el.scrollLeft - panels[i].offsetLeft);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = i;
        }
      }

      setCurrentPanel(nearestIdx);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isHorizontal, containerRef, panelCount]);

  /* ── Render ───────────────────────────────────────────────────────── */
  return (
    <>
      <div
        ref={containerRef}
        className={[
          "flex flex-col",
          "md:flex-row md:h-screen md:overflow-x-auto md:overflow-y-hidden",
          "[&::-webkit-scrollbar]:hidden",
        ].join(" ")}
        style={{ scrollbarWidth: "none" }}
      >
        {Children.map(children, (child, i) => (
          <div
            key={i}
            className="w-full md:w-auto md:flex-shrink-0 md:h-screen md:overflow-y-auto"
            style={{
              marginRight: i >= 1 && i <= 4 ? "10vw" : 0,
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Dot progress indicator — desktop only */}
      {isHorizontal && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
          {Array.from({ length: panelCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPanel(i)}
              aria-label={`Go to panel ${i + 1}`}
              className="transition-all duration-300 rounded-full cursor-pointer"
              style={{
                width:      i === currentPanel ? 24 : 6,
                height:     6,
                background: i === currentPanel
                  ? "rgba(124,106,247,1)"
                  : "rgba(62,62,94,0.8)",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
