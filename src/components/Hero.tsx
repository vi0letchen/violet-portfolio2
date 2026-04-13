"use client";

import gsap from "gsap";
import { useState, useEffect, useRef } from "react";
import { useHScroll } from "./HScrollContext";

/* ─── Typewriter ────────────────────────────────────────────────────── */

const roles = ["Full-Stack Developer", "Next.js Engineer", "TypeScript Enthusiast"];

function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setWordIdx((w) => (w + 1) % words.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

/* ─── Social icons ──────────────────────────────────────────────────── */

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/vi0letchen",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/violet-chen",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:violetchenbusiness@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Website",
    href: "https://www.violetchen.dev",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

/* ─── Hero ──────────────────────────────────────────────────────────── */

const FIRST = "VIOLET";
const LAST  = "CHEN";
const LETTER_COUNT = FIRST.length + LAST.length;

export default function Hero() {
  const role = useTypewriter(roles);
  const { containerRef, isHorizontal } = useHScroll();

  const firstRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lastRefs  = useRef<(HTMLSpanElement | null)[]>([]);
  const badgeRef  = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollBtn = useRef<HTMLButtonElement>(null);

  // Stable random explosion targets — computed once on mount
  const targets = useRef<{ x: number; y: number; r: number }[]>([]);

  /* ── Cinematic intro: letters scatter → assemble ─────────────────── */
  useEffect(() => {
    // Build targets
    targets.current = Array.from({ length: LETTER_COUNT }, () => ({
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 900,
      r: (Math.random() - 0.5) * 720,
    }));

    const allLetters = [...firstRefs.current, ...lastRefs.current].filter(
      (el): el is HTMLSpanElement => el !== null
    );

    // Set every letter to its scattered starting position
    allLetters.forEach((el, i) => {
      const t = targets.current[i];
      gsap.set(el, { x: t.x, y: t.y, rotation: t.r, opacity: 0 });
    });

    // Hide supporting elements
    gsap.set(
      [badgeRef.current, bottomRef.current, scrollBtn.current].filter(Boolean),
      { opacity: 0, y: 18 }
    );

    // Letters assemble
    gsap.to(allLetters, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      duration: 1.9,
      stagger: { amount: 1.1, from: "random" },
      ease: "power4.out",
      delay: 0.15,
    });

    // Supporting elements reveal after assembly
    gsap.to(
      [badgeRef.current, bottomRef.current, scrollBtn.current].filter(Boolean),
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power2.out",
        delay: 2.1,
      }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Scroll-triggered explosion ──────────────────────────────────── */
  useEffect(() => {
    const allLetters = [...firstRefs.current, ...lastRefs.current].filter(
      (el): el is HTMLSpanElement => el !== null
    );
    if (!allLetters.length) return;

    const update = (scrollPos: number, viewSize: number) => {
      const progress = Math.min(Math.max(scrollPos / viewSize, 0), 1);

      allLetters.forEach((el, i) => {
        const t = targets.current[i];
        if (!t) return;
        gsap.set(el, {
          x: t.x * progress,
          y: t.y * progress,
          rotation: t.r * progress,
          opacity: Math.max(0, 1 - progress * 2.2),
        });
      });

      // Other content fades faster
      const ui = Math.max(0, 1 - progress * 3.5);
      if (badgeRef.current)  gsap.set(badgeRef.current,  { opacity: ui });
      if (scrollBtn.current) gsap.set(scrollBtn.current, { opacity: ui });
      if (bottomRef.current)
        gsap.set(bottomRef.current, { opacity: ui, y: -progress * 28 });
    };

    if (isHorizontal) {
      const container = containerRef.current;
      if (!container) return;
      const onScroll = () => update(container.scrollLeft, window.innerWidth);
      container.addEventListener("scroll", onScroll, { passive: true });
      return () => container.removeEventListener("scroll", onScroll);
    } else {
      const onScroll = () => update(window.scrollY, window.innerHeight * 0.6);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [isHorizontal, containerRef]);

  /* ── Scroll to next section ──────────────────────────────────────── */
  const scrollToNext = () => {
    const about = document.getElementById("about");
    if (!about) return;
    if (isHorizontal) {
      about.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    } else {
      about.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <section
      id="hero"
      className="relative h-screen w-screen flex items-center justify-center overflow-hidden"
    >
      {/* Film-grain texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[6] mix-blend-overlay"
        style={{
          opacity: 0.055,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "250px 250px",
        }}
      />

      {/* Radial vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 20% 50%, transparent 35%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full px-6 md:px-16 max-w-4xl mx-auto text-center flex flex-col items-center">

        {/* Badge */}
        <div ref={badgeRef} className="flex mb-8 md:mb-10 justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-[#7c6af7]/10 border border-[#7c6af7]/30 text-[#a78bfa]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
            Available for opportunities
          </span>
        </div>

        {/* "VIOLET" — exploding letters */}
        <div
          className="flex leading-none justify-center"
          style={{ marginBottom: "0.06em" }}
        >
          {FIRST.split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => { firstRefs.current[i] = el; }}
              className="inline-block font-black text-[#e2e8f0] select-none"
              style={{
                fontSize: "clamp(3.2rem, 9vw, 10.5rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                willChange: "transform, opacity",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* "CHEN" — exploding letters with gradient */}
        <div className="flex leading-none mb-8 md:mb-12 justify-center">
          {LAST.split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => { lastRefs.current[i] = el; }}
              className="inline-block font-black select-none"
              style={{
                fontSize: "clamp(3.2rem, 9vw, 10.5rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                willChange: "transform, opacity",
                background: "linear-gradient(125deg, #7c6af7 0%, #a78bfa 45%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Thin cinematic rule */}
        <div
          className="mb-7 md:mb-8"
          style={{
            width: "clamp(160px, 22vw, 340px)",
            height: 1,
            background: "linear-gradient(90deg, rgba(124,106,247,0.7) 0%, rgba(56,189,248,0.3) 60%, transparent 100%)",
          }}
        />

        {/* Role / tagline / buttons / social */}
        <div ref={bottomRef}>
          {/* Typewriter role */}
          <div className="text-lg sm:text-xl text-[#94a3b8] mb-3 h-7 flex items-center gap-1 justify-center">
            <span className="text-[#a78bfa] font-medium tracking-wide">{role}</span>
            <span className="inline-block w-0.5 h-[1.1em] bg-[#7c6af7] animate-pulse" />
          </div>

          {/* Tagline */}
          <p className="text-sm sm:text-base text-[#6b7280] max-w-md mb-9 leading-relaxed">
            CS graduate from University of Auckland building real products
            for real people — fast, polished, and production-ready.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-10 justify-center">
            <button
              onClick={() => {
                const el = document.getElementById("projects");
                if (!el) return;
                isHorizontal
                  ? el.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
                  : el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="px-6 py-3 rounded-xl bg-[#7c6af7] hover:bg-[#6d5ce6] text-white text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#7c6af7]/30 cursor-pointer"
            >
              View Projects
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("contact");
                if (!el) return;
                isHorizontal
                  ? el.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
                  : el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="px-6 py-3 rounded-xl border border-[#1e1e2e] hover:border-[#7c6af7]/50 text-[#94a3b8] hover:text-[#a78bfa] text-sm font-semibold transition-all duration-200 hover:scale-105 glass cursor-pointer"
            >
              Get in Touch
            </button>
          </div>

          {/* Social links */}
          <div className="flex gap-5 justify-center">
            {socials.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#1e1e2e] text-[#6b7280] hover:text-[#a78bfa] hover:border-[#7c6af7]/40 transition-all duration-200 hover:scale-110 glass"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────── */}
      <button
        ref={scrollBtn}
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group md:bottom-auto md:right-8 md:left-auto md:translate-x-0 md:top-1/2 md:-translate-y-1/2 md:flex-row"
        aria-label="Scroll to next section"
      >
        <span className="text-[10px] text-[#6b7280] tracking-[0.25em] uppercase group-hover:text-[#a78bfa] transition-colors">
          Scroll
        </span>
        {/* vertical (mobile) */}
        <div className="relative w-0.5 h-8 bg-white/[0.06] rounded-full overflow-hidden md:hidden">
          <div
            className="absolute top-0 w-full rounded-full"
            style={{
              height: "50%",
              background: "linear-gradient(to bottom, #7c6af7, transparent)",
              animation: "scrollPulse 1.6s ease-in-out infinite",
            }}
          />
        </div>
        {/* horizontal (desktop) */}
        <div className="relative hidden md:block h-0.5 w-8 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="absolute left-0 h-full rounded-full"
            style={{
              width: "50%",
              background: "linear-gradient(to right, #7c6af7, transparent)",
              animation: "scrollPulseH 1.6s ease-in-out infinite",
            }}
          />
        </div>
      </button>

      <style>{`
        @keyframes scrollPulse {
          0%   { transform: translateY(-100%); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        @keyframes scrollPulseH {
          0%   { transform: translateX(-100%); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: translateX(200%); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
