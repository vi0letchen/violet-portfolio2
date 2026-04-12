"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ScrollFade from "./ScrollFade";

/* ─── Data ─────────────────────────────────────────────────────────── */

const mainProjects = [
  {
    title: "Auckland University Esports Club",
    url: "https://www.auec.club",
    displayUrl: "auec.club",
    description:
      "NZ's largest university esports club — event management, payment processing, and user auth built with a team of six.",
    tags: ["Next.js", "TypeScript", "Auth", "Payments", "Team of 6"],
    image: "/AUEC.png",
    accent: "#7c6af7",
    border: "rgba(124,106,247,0.35)",
    glow: "rgba(124,106,247,0.18)",
  },
  {
    title: "CoLab",
    url: "https://colab.exchange",
    displayUrl: "colab.exchange",
    description:
      "Helps UoA Chemistry researchers share and trade lab reagents. Solo full-stack project from design to deployment.",
    tags: ["Next.js", "Supabase", "Full-Stack", "Solo"],
    image: "/CoLab.png",
    accent: "#06b6d4",
    border: "rgba(6,182,212,0.35)",
    glow: "rgba(6,182,212,0.14)",
  },
  {
    title: "Rainbow Engineering",
    url: "https://rainbowengineering.wdcc.co.nz",
    displayUrl: "rainbowengineering.wdcc.co.nz",
    description:
      "Full-stack club website for UoA Rainbow Engineering with Payload CMS and MongoDB for content management.",
    tags: ["Next.js", "Payload CMS", "MongoDB", "Full-Stack"],
    image: "/RainbowEngineering.png",
    accent: "#a78bfa",
    border: "rgba(167,139,250,0.35)",
    glow: "rgba(167,139,250,0.14)",
  },
];

const hackathonProjects = [
  {
    title: "PartScanner",
    date: "Jul 2025",
    event: "Partly × WDCC Hackathon",
    description:
      "Vehicle part identification tool — select parts from multiple angles for backend condition analysis.",
    tags: ["Python", "Tkinter"],
    github: null,
    accent: "#f97316",
  },
  {
    title: "SpacePlates",
    date: "Apr 2024",
    event: "SESA × WDCC Hackathon",
    description:
      "Alien food delivery with Tinder-style swiping under the 'Escape from Earth' hackathon theme.",
    tags: ["JavaScript", "HTML / CSS"],
    github: "https://github.com/saikam2003/wdcc-team-teletubbies",
    accent: "#818cf8",
  },
];

/* ─── Browser mockup card ───────────────────────────────────────────── */

function BrowserCard({ project }: { project: typeof mainProjects[0] }) {
  return (
    <ScrollFade className="h-full">
      <motion.a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -5, boxShadow: `0 0 36px 3px ${project.glow}`, borderColor: project.border }}
        transition={{ duration: 0.18 }}
        className="group flex flex-col h-full rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0e0e1a] cursor-pointer"
      >
        {/* Browser chrome */}
        <div className="flex-shrink-0 bg-[#13131f] border-b border-white/[0.06] px-3 py-2 flex items-center gap-2">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <div className="w-2 h-2 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex items-center gap-1.5 bg-[#0a0a14] rounded px-2 py-0.5 min-w-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5 text-[#4b5563] flex-shrink-0">
              <rect width="11" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-[10px] text-[#4b5563] font-mono truncate">{project.displayUrl}</span>
          </div>
          <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: project.accent }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>

        {/* Screenshot */}
        <div className="relative flex-shrink-0 overflow-hidden" style={{ height: 190 }}>
          <Image src={project.image} alt={project.title} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 23vw" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0e0e1a] to-transparent" />
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-sm font-semibold text-[#e2e8f0] leading-snug group-hover:text-white transition-colors mb-1.5">
            {project.title}
          </h3>
          <p className="text-xs text-[#6b7280] leading-relaxed mb-3 flex-1">{project.description}</p>
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                style={{ color: project.accent, borderColor: `${project.accent}35`, background: `${project.accent}0d` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.a>
    </ScrollFade>
  );
}

/* ─── Hackathon card ────────────────────────────────────────────────── */

function HackathonCard({ project }: { project: typeof hackathonProjects[0] }) {
  return (
    <ScrollFade>
      <motion.div
        whileHover={{ borderColor: `${project.accent}50` }}
        className="rounded-xl border border-white/[0.07] bg-[#0e0e1a] p-5 transition-colors"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: project.accent }} />
              <h4 className="text-sm font-semibold text-[#e2e8f0]">{project.title}</h4>
            </div>
            <p className="text-[11px] text-[#4b5563] font-mono">{project.event} · {project.date}</p>
          </div>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4b5563] hover:text-[#a78bfa] transition-colors flex-shrink-0 ml-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
        </div>

        <p className="text-xs text-[#6b7280] leading-relaxed mb-3">{project.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
              style={{ color: project.accent, borderColor: `${project.accent}30`, background: `${project.accent}0d` }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </ScrollFade>
  );
}

/* ─── Section ───────────────────────────────────────────────────────── */

export default function Projects() {
  return (
    <section id="projects">

      {/* ══════════════════════════════════════════════════════
          MOBILE layout  (< md)
          Normal vertical stacking — heading → live projects → hackathon
         ══════════════════════════════════════════════════════ */}
      <div className="md:hidden py-24 px-6 max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-10">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#7c6af7] mb-3">
            03 — Projects
          </span>
          <h2 className="text-4xl font-bold text-[#e2e8f0] leading-tight mb-2">
            Things I&apos;ve built.
          </h2>
          <p className="text-[#6b7280] text-base">Real products, shipped and used by real people.</p>
        </div>

        {/* Live projects */}
        <div className="flex flex-col gap-5 mb-10">
          {mainProjects.map((p) => (
            <BrowserCard key={p.title} project={p} />
          ))}
        </div>

        {/* Hackathon */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#4b5563]">Hackathon Projects</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
        <div className="flex flex-col gap-4">
          {hackathonProjects.map((p) => (
            <HackathonCard key={p.title} project={p} />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP horizontal layout  (≥ md)

          The section is wider than one viewport (~130vw) so the user
          scrolls through it naturally within the global horizontal scroll.

          Layout (left → right):
            [Title column 24vw] │ [Card 1 23vw] [Card 2 23vw] [Card 3 23vw] │ [Hackathon col 22vw] [right pad]

         ══════════════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-row h-screen items-stretch">

        {/* ── Title column ──────────────────────────────────────────── */}
        <div className="flex-shrink-0 w-[24vw] flex flex-col justify-center pl-16 pr-12 border-r border-white/[0.05]">
          <ScrollFade yOffset={20}>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#7c6af7] mb-3">
              03 — Projects
            </span>
          </ScrollFade>
          <ScrollFade yOffset={24}>
            <h2 className="text-4xl xl:text-5xl font-bold text-[#e2e8f0] leading-tight mb-4">
              Things I&apos;ve built.
            </h2>
          </ScrollFade>
          <ScrollFade yOffset={20}>
            <p className="text-[#6b7280] text-base leading-relaxed">
              Real products, shipped and used by real people.
            </p>
          </ScrollFade>
        </div>

        {/* ── Live projects — three cards in a row ──────────────────── */}
        <div className="flex flex-row items-center gap-5 px-10 py-10">
          {mainProjects.map((project) => (
            <div key={project.title} className="flex-shrink-0 w-[23vw] h-full py-2 flex flex-col">
              <BrowserCard project={project} />
            </div>
          ))}
        </div>

        {/* ── Thin separator ────────────────────────────────────────── */}
        <div className="flex-shrink-0 w-px self-stretch my-10 bg-white/[0.05]" />

        {/* ── Hackathon — two cards stacked top & bottom ────────────── */}
        <div className="flex-shrink-0 w-[22vw] flex flex-col justify-center gap-5 px-8 py-10">
          <ScrollFade yOffset={16}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4b5563] mb-1">
              Hackathon Projects
            </p>
          </ScrollFade>
          {hackathonProjects.map((project) => (
            <HackathonCard key={project.title} project={project} />
          ))}
        </div>

        {/* Right breathing room */}
        <div className="flex-shrink-0 w-24" />

      </div>
    </section>
  );
}
