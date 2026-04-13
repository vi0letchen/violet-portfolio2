"use client";

import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import ScrollFade from "./ScrollFade";
import MagneticText from "./MagneticText";
import { SkillSpan } from "./SkillPreview";

const experiences = [
  {
    role: "Junior Developer",
    company: "University of Auckland",
    period: "Apr 2025 – Present",
    current: true,
    bullets: [
      "Build full-stack web applications for UoA clubs using Next.js, TypeScript, React, and Tailwind CSS.",
      "Implement backend systems including authentication, databases, and CMS with Prisma, Supabase, MongoDB, and Payload CMS.",
    ],
    tags: ["Next.js", "TypeScript", "React", "Tailwind", "Prisma", "Supabase", "MongoDB", "Payload CMS"],
    accent: "#7c6af7",
  },
  {
    role: "Data Administrator",
    company: "University of Auckland",
    period: "Feb 2026 – Apr 2026",
    current: false,
    bullets: [
      "Processed and maintained employee records across Workday and SmartRecruiters platforms.",
      "Ensured data accuracy, compliance, and adherence to right-to-work regulations.",
    ],
    tags: ["Workday", "SmartRecruiters", "Data Management", "Compliance"],
    accent: "#6366f1",
  },
];

/* ─── Experience card ───────────────────────────────────────────────── */

function ExpCard({
  exp,
  align,
  className = "",
}: {
  exp: typeof experiences[0];
  align: "left" | "right";
  className?: string;
}) {
  return (
    <ScrollFade yOffset={align === "left" ? 24 : -24} className={className}>
      <motion.div
        whileHover={{ borderColor: `${exp.accent}55`, boxShadow: `0 0 28px 2px ${exp.accent}18` }}
        transition={{ duration: 0.2 }}
        className="relative glass rounded-2xl border border-[#1e1e2e] p-6 h-full flex flex-col"
      >
        {/* Current badge */}
        {exp.current && (
          <div className="absolute top-5 right-5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs bg-[#7c6af7]/15 text-[#a78bfa] border border-[#7c6af7]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
            Current
          </div>
        )}

        {/* Period — shown inside card on mobile only; desktop shows it in the timeline rail */}
        <p className="md:hidden text-[11px] font-mono tracking-widest text-[#4b5563] uppercase mb-3">
          {exp.period}
        </p>

        {/* Role + company */}
        <h3 className="text-lg font-semibold text-[#e2e8f0] leading-tight mb-0.5">{exp.role}</h3>
        <p className="text-sm font-medium mb-5" style={{ color: exp.accent }}>{exp.company}</p>

        {/* Bullets */}
        <ul className="space-y-2.5 mb-5 flex-1">
          {exp.bullets.map((b, j) => (
            <li key={j} className="flex gap-2.5 text-[#94a3b8] text-sm leading-relaxed">
              <span className="shrink-0 mt-[3px]" style={{ color: exp.accent }}>▸</span>
              {b}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#1e1e2e]">
          {exp.tags.map((tag) => (
            <SkillSpan
              key={tag}
              skill={tag}
              className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#12121e] text-[#6b7280] border border-[#2a2a40]"
            >
              {tag}
            </SkillSpan>
          ))}
        </div>
      </motion.div>
    </ScrollFade>
  );
}

/* ─── Section ───────────────────────────────────────────────────────── */

export default function Experience() {
  return (
    <SectionWrapper id="experience">
      <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-14 xl:gap-20">

        {/* Title column */}
        <div className="flex-shrink-0 md:w-[34%]">
          <ScrollFade yOffset={20}>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#7c6af7] mb-3">
              02 — Experience
            </span>
          </ScrollFade>
          <ScrollFade yOffset={24}>
            <MagneticText className="text-4xl xl:text-5xl font-bold text-[#e2e8f0] leading-tight mb-4">
              Where I've worked.
            </MagneticText>
          </ScrollFade>
          <ScrollFade yOffset={20}>
            <p className="text-[#6b7280] text-base leading-relaxed">
              Building real things, solving real problems.
            </p>
          </ScrollFade>
        </div>

        {/* ── Timeline ─────────────────────────────────────────────── */}
        <div className="flex-1">

          {/* ── Mobile: left-rail vertical list ─────────────────── */}
          <div className="md:hidden relative pl-6">
            {/* Left rail line */}
            <div
              className="absolute left-[7px] top-3 bottom-3 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, #7c6af7 0%, #6366f1 60%, transparent 100%)",
                opacity: 0.35,
              }}
            />

            {experiences.map((exp, i) => (
              <div key={exp.role} className="relative mb-8 last:mb-0">
                {/* Rail dot */}
                <div
                  className="absolute -left-6 top-7 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a14]"
                  style={{
                    background: exp.accent,
                    boxShadow: exp.current ? `0 0 10px ${exp.accent}90` : "none",
                    left: -23,
                  }}
                />
                <ExpCard exp={exp} align="left" />
              </div>
            ))}
          </div>

          {/* ── Desktop: left-rail timeline ───────────────────── */}
          {/*
              Layout per row: [period 8rem] [dot col 2.5rem] [card 23vw]
              Vertical line runs at left = 8rem + 1.25rem = 9.25rem (center of dot col)
          */}
          <div className="hidden md:flex flex-col justify-between relative min-h-[62vh]">

            {/* Vertical rail line */}
            <div
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: "calc(8rem + 1.25rem)",
                background:
                  "linear-gradient(to bottom, transparent 0%, #7c6af755 8%, #7c6af7cc 30%, #6366f1cc 70%, #6366f155 92%, transparent 100%)",
              }}
            />

            {experiences.map((exp, i) => (
              <div key={exp.role} className="flex items-start">

                {/* Period label — right-aligned, sits left of the rail */}
                <div className="flex-shrink-0 w-32 text-right pr-5 pt-[3px]">
                  <ScrollFade yOffset={16}>
                    <p className="text-[10px] font-mono tracking-widest text-[#4b5563] uppercase leading-relaxed">
                      {exp.period.split("–").map((part, k) => (
                        <span key={k} className="block">{part.trim()}</span>
                      ))}
                    </p>
                  </ScrollFade>
                </div>

                {/* Dot — centred on the rail */}
                <div className="flex-shrink-0 w-10 flex justify-center z-10 pt-[2px]">
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 border-[#0a0a14]"
                    style={{
                      background: exp.accent,
                      boxShadow: exp.current
                        ? `0 0 12px 3px ${exp.accent}80`
                        : `0 0 6px 1px ${exp.accent}50`,
                    }}
                  />
                </div>

                {/* Card — flush left from the rail */}
                <div className="flex-shrink-0 w-[23vw] pl-5">
                  <ExpCard exp={exp} align="left" />
                </div>

              </div>
            ))}

          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
