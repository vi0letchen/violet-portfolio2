"use client";

/**
 * MagneticText — wraps a string in per-character <span>s and applies
 * a physics-spring repulsion from the cursor.
 *
 * Physics per character (runs in a shared global RAF loop):
 *
 *   Each frame:
 *     1. Read viewport position via getBoundingClientRect (batched read
 *        before any writes — one reflow per frame max)
 *     2. If cursor within RADIUS: apply outward impulse scaled by proximity
 *     3. Spring force pulls displacement back to (0, 0)
 *     4. Damping bleeds velocity each frame
 *     5. Write transform — pure translate, no layout impact
 *
 * The shared RAF loop (module-level) means N MagneticText instances on
 * the page all update in the same animation frame, not N separate loops.
 */

import {
  useEffect,
  useMemo,
  useRef,
  CSSProperties,
  ElementType,
} from "react";

/* ─── Physics constants ─────────────────────────────────────────────── */
const RADIUS    = 110;   // px — cursor influence radius
const STRENGTH  = 220;   // max pixel push at distance = 0
const SPRING    = 0.10;  // how strongly chars snap back (higher = snappier)
const DAMPING   = 0.78;  // velocity bleed per frame (lower = more friction)

/* ─── Module-level shared RAF loop ─────────────────────────────────── */

type CharState = {
  el:   HTMLSpanElement;
  px:   number; py:   number;   // current displacement
  vx:   number; vy:   number;   // velocity
};

const registry: Set<CharState[]> = new Set();
let mouse = { x: -9999, y: -9999 };
let rafId = 0;

function startLoop() {
  if (rafId) return;

  const onMove = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };
  window.addEventListener("mousemove", onMove, { passive: true });

  const tick = () => {
    const mx = mouse.x, my = mouse.y;

    for (const chars of registry) {
      /* Phase 1 — batch read (single layout reflow for the whole set) */
      const rects = chars.map(c => c.el.getBoundingClientRect());

      /* Phase 2 — compute + write (no reads after this point) */
      for (let i = 0; i < chars.length; i++) {
        const c = rects[i];
        const s = chars[i];

        // Centre of character glyph in viewport coords
        const cx = c.left + c.width  * 0.5;
        const cy = c.top  + c.height * 0.5;

        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS && dist > 0.5) {
          // Outward impulse (away from cursor)
          const t     = 1 - dist / RADIUS;
          const force = t * t * STRENGTH;           // quadratic falloff
          const nx    = dx / dist;
          const ny    = dy / dist;
          s.vx -= nx * force * 0.35;
          s.vy -= ny * force * 0.35;
        }

        // Spring back toward origin
        s.vx += -s.px * SPRING;
        s.vy += -s.py * SPRING;

        // Damping
        s.vx *= DAMPING;
        s.vy *= DAMPING;

        // Integrate
        s.px += s.vx;
        s.py += s.vy;

        // Write — skip negligibly small values to avoid dirty transforms
        if (Math.abs(s.px) > 0.05 || Math.abs(s.py) > 0.05) {
          s.el.style.transform = `translate(${s.px.toFixed(2)}px,${s.py.toFixed(2)}px)`;
        } else if (s.px !== 0 || s.py !== 0) {
          s.el.style.transform = "";
          s.px = s.py = s.vx = s.vy = 0;
        }
      }
    }

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
}

function stopLoop() {
  if (registry.size === 0 && rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

/* ─── Component ─────────────────────────────────────────────────────── */

interface Props {
  children: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

export default function MagneticText({
  children,
  as: Tag = "h2",
  className = "",
  style,
}: Props) {
  const charsRef = useRef<CharState[]>([]);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Build state objects for every character span in document order
    const states: CharState[] = Array.from(spansRef.current)
      .filter((el): el is HTMLSpanElement => Boolean(el))
      .map(el => ({ el, px: 0, py: 0, vx: 0, vy: 0 }));

    charsRef.current = states;
    registry.add(states);
    startLoop();

    return () => {
      registry.delete(states);
      stopLoop();
    };
  }, [children]);

  // Split into word/space segments — memoised so the structure is stable across renders.
  // Each word's character spans are wrapped in a whitespace-nowrap container so the
  // browser can only break between words, never mid-letter.
  const segments = useMemo(() => {
    // split(" ") with the captured delimiter gives ["word", " ", "word", ...]
    return children.split(/( )/).map((seg, si, arr) => {
      const startIdx = arr.slice(0, si).join("").length;
      return { isSpace: seg === " ", text: seg, startIdx };
    });
  }, [children]);

  return (
    <Tag className={className} style={style}>
      {segments.map((seg, si) => {
        if (seg.isSpace) {
          return (
            <span
              key={`sp-${si}`}
              ref={el => { spansRef.current[seg.startIdx] = el; }}
              className="inline-block"
              style={{ willChange: "transform" }}
            >
              {"\u00a0"}
            </span>
          );
        }
        // Word wrapper — whitespace-nowrap prevents any break within the word
        return (
          <span key={`w-${si}`} className="inline-block whitespace-nowrap">
            {seg.text.split("").map((ch, j) => (
              <span
                key={j}
                ref={el => { spansRef.current[seg.startIdx + j] = el; }}
                className="inline-block"
                style={{ willChange: "transform" }}
              >
                {ch}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
