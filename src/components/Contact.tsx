"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionWrapper from "./SectionWrapper";
import SectionHeading from "./SectionHeading";

const contacts = [
  {
    label: "Email",
    value: "violetchenbusiness@gmail.com",
    href: "mailto:violetchenbusiness@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: "vi0letchen",
    href: "https://github.com/vi0letchen",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "Violet Chen",
    href: "https://linkedin.com/in/violet-chen",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <SectionWrapper id="contact">
      <div className="max-w-2xl mx-auto text-center" ref={ref}>
        <SectionHeading label="05 — Contact" title="Let's work together." />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.55 }}
          className="text-[#94a3b8] text-base leading-relaxed mb-12"
        >
          Whether you&apos;re looking for a developer, want to collaborate on a project, or just
          want to say hi — my inbox is always open.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
        >
          <a
            href="mailto:violetchenbusiness@gmail.com"
            className="px-8 py-4 rounded-xl bg-[#7c6af7] hover:bg-[#6d5ce6] text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#7c6af7]/30"
          >
            Say Hello
          </a>
          <a
            href="https://github.com/vi0letchen"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl border border-[#1e1e2e] hover:border-[#7c6af7]/50 text-[#94a3b8] hover:text-[#a78bfa] font-semibold transition-all duration-200 hover:scale-105 glass"
          >
            See My Work
          </a>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {contacts.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.04, borderColor: "rgba(124,106,247,0.4)" }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl border border-[#1e1e2e] glass text-[#6b7280] hover:text-[#a78bfa] transition-colors text-sm"
            >
              <span className="text-[#7c6af7]">{c.icon}</span>
              <span>{c.value}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
