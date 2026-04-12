"use client";

import { motion } from "framer-motion";
import { useHScroll } from "./HScrollContext";
import { useCallback } from "react";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/vi0letchen",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/violet-chen",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:violetchenbusiness@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { isHorizontal, scrollToSection } = useHScroll();

  const scrollToHero = useCallback(() => {
    if (isHorizontal) {
      scrollToSection("hero");
      return;
    }
    const hero = document.getElementById("hero");
    if (!hero) return;
    hero.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [isHorizontal, scrollToSection]);

  /* Desktop: full closing panel centered vertically */
  if (isHorizontal) {
    return (
      <footer className="h-screen w-screen flex flex-col items-center justify-center text-center px-8 select-none">
        {/* Monogram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl font-bold gradient-text glow-text mb-4 tracking-tight"
        >
          vc.
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-[#6b7280] text-sm mb-8"
        >
          Designed &amp; built by{" "}
          <span className="text-[#a78bfa] font-medium">Violet Chen</span>
          {" "}· v2 · 2026
        </motion.p>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="flex gap-3"
        >
          {socials.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-[#1e1e2e] text-[#6b7280] hover:text-[#a78bfa] hover:border-[#7c6af7]/40 transition-all duration-200 hover:scale-110 glass"
            >
              {icon}
            </a>
          ))}
        </motion.div>

        {/* Subtle "end of portfolio" hint */}
        <motion.button
          onClick={scrollToHero}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-12 text-xs text-[#3d3d5e] font-mono tracking-widest uppercase cursor-pointer hover:text-[#a78bfa] transition-colors duration-300"
          whileHover={{ x: -8, transition: { duration: 0.3 } }}
          aria-label="Scroll back to hero"
        >
          ← scroll back to explore
        </motion.button>
      </footer>
    );
  }

  /* Mobile: minimal strip */
  return (
    <footer className="border-t border-[#1e1e2e] py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#6b7280]">
        <span>
          Designed &amp; built by{" "}
          <span className="text-[#a78bfa] font-medium">Violet Chen</span>
        </span>
        <span className="font-mono text-xs">v2 · 2026</span>
      </div>
    </footer>
  );
}
