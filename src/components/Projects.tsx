"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import SectionHeading from "./SectionHeading";
import ScrollFade from "./ScrollFade";

/* ─── Data ─────────────────────────────────────────────────────────── */

const mainProjects = [
  {
    title: "Auckland University Esports Club",
    url: "https://www.auec.club",
    displayUrl: "auec.club",
    description:
      "NZ's largest university esports club site — event management, payment processing, and user authentication built with a team of six.",
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
      "Vehicle assessment tool for part identification. Users select parts from multiple angles; data is sent to Partly's backend for condition analysis.",
    tags: ["Python", "Tkinter"],
    github: null,
    accent: "#f97316",
    border: "rgba(249,115,22,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        <path d="M11 8v3l2 2" />
      </svg>
    ),
  },
  {
    title: "SpacePlates",
    date: "Apr 2024",
    event: "SESA × WDCC Hackathon",
    description:
      "Food delivery platform for aliens across planets. Tinder-style food swiping, ordering and payments under the 'Escape from Earth' theme.",
    tags: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com/saikam2003/wdcc-team-teletubbies",
    accent: "#818cf8",
    border: "rgba(129,140,248,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
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
        whileHover={{ y: -6, boxShadow: `0 0 40px 4px ${project.glow}`, borderColor: project.border }}
        transition={{ duration: 0.18 }}
        className="group flex flex-col h-full rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0e0e1a] cursor-pointer"
      >
        {/* Browser chrome */}
        <div className="flex-shrink-0 bg-[#13131f] border-b border-white/[0.06] px-3 py-2.5 flex items-center gap-2.5">
          {/* Traffic lights */}
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          {/* URL bar */}
          <div className="flex-1 flex items-center gap-1.5 bg-[#0a0a14] rounded-md px-2.5 py-1 min-w-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-[#4b5563] flex-shrink-0">
              <rect width="11" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-[11px] text-[#4b5563] font-mono truncate">{project.displayUrl}</span>
          </div>
          {/* External link icon */}
          <div
            className="flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150"
            style={{ color: project.accent }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>

        {/* Screenshot */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: 190 }}>
          <div className="absolute inset-0">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          {/* Gradient overlay at bottom of image */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0e0e1a] to-transparent" />
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-5 pt-4">
          <h3 className="text-base font-semibold text-[#e2e8f0] leading-snug group-hover:text-white transition-colors mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-[#6b7280] leading-relaxed mb-4 flex-1">{project.description}</p>
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
                  style={{ color: project.accent, borderColor: `${project.accent}35`, background: `${project.accent}0d` }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* External link icon button */}
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150"
              style={{ background: `${project.accent}14`, borderColor: `${project.accent}40`, color: project.accent }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-3.5 h-3.5">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </div>
          </div>
        </div>
      </motion.a>
    </ScrollFade>
  );
}

/* ─── Hackathon card ─────────────────────────────────────────────────── */

function HackathonCard({ project }: { project: typeof hackathonProjects[0] }) {
  return (
    <ScrollFade className="h-full">
      <motion.div
        whileHover={{ y: -4, borderColor: project.border }}
        transition={{ duration: 0.22 }}
        className="group flex flex-col h-full rounded-2xl border border-white/[0.07] bg-[#0e0e1a] p-5 transition-colors"
      >
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${project.accent}18`, border: `1px solid ${project.accent}30`, color: project.accent }}
            >
              {project.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{ color: project.accent, background: `${project.accent}18`, border: `1px solid ${project.accent}30` }}
                >
                  Hackathon
                </span>
              </div>
              <p className="text-[11px] text-[#4b5563] mt-0.5 font-mono">{project.event} · {project.date}</p>
            </div>
          </div>
        </div>

        <h3 className="text-base font-semibold text-[#e2e8f0] mb-2">{project.title}</h3>
        <p className="text-sm text-[#6b7280] leading-relaxed mb-4 flex-1">{project.description}</p>



        {/* Icon-only CTA */}
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
                style={{ color: project.accent, borderColor: `${project.accent}30`, background: `${project.accent}0d` }}
              >
                {tag}
              </span>
            ))}
          </div>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-200 hover:brightness-125 cursor-pointer"
              style={{ background: `${project.accent}14`, borderColor: `${project.accent}40`, color: project.accent }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
        </div>
      </motion.div>
    </ScrollFade>
  );
}

/* ─── Section ───────────────────────────────────────────────────────── */

export default function Projects() {
  return (
    <SectionWrapper id="projects">
      <SectionHeading
        label="03 — Projects"
        title="Things I've built."
        subtitle="Real products, shipped and used by real people."
      />

      {/* Main projects — browser mockup cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {mainProjects.map((project) => (
          <BrowserCard key={project.title} project={project} />
        ))}
      </div>

      {/* Divider */}
      <ScrollFade>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#4b5563]">
            Hackathon Projects
          </span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
      </ScrollFade>

      {/* Hackathon projects */}
      <div className="grid md:grid-cols-2 gap-5">
        {hackathonProjects.map((project) => (
          <HackathonCard key={project.title} project={project} />
        ))}
      </div>
    </SectionWrapper>
  );
}
