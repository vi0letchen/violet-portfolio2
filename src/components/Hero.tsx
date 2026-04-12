"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const role = useTypewriter(roles);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center max-w-4xl mx-auto px-6 w-full"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-[#7c6af7]/10 border border-[#7c6af7]/30 text-[#a78bfa]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
            Available for opportunities
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-4 leading-none"
        >
          <span className="text-[#e2e8f0]">Violet</span>
          <span className="gradient-text glow-text"> Chen</span>
        </motion.h1>

        {/* Typewriter role */}
        <motion.div variants={itemVariants} className="text-xl sm:text-2xl text-[#94a3b8] mb-6 h-8">
          <span className="text-[#a78bfa] font-medium">{role}</span>
          <span className="inline-block w-0.5 h-5 bg-[#7c6af7] ml-0.5 animate-pulse" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-[#6b7280] max-w-xl mx-auto mb-10 leading-relaxed"
        >
          CS graduate from University of Auckland building real products for real people —
          fast, polished, and production-ready.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-12">
          <a
            href="#projects"
            className="px-6 py-3 rounded-xl bg-[#7c6af7] hover:bg-[#6d5ce6] text-white text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#7c6af7]/30"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-xl border border-[#1e1e2e] hover:border-[#7c6af7]/50 text-[#94a3b8] hover:text-[#a78bfa] text-sm font-semibold transition-all duration-200 hover:scale-105 glass"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div variants={itemVariants} className="flex justify-center gap-6">
          {[
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
          ].map(({ label, href, icon }) => (
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
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-[#6b7280] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-0.5 h-8 bg-gradient-to-b from-[#7c6af7] to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}
