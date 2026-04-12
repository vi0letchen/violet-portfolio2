"use client";

import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import SectionHeading from "./SectionHeading";
import ScrollFade from "./ScrollFade";

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

export default function Experience() {
  return (
    <SectionWrapper id="experience">
      <SectionHeading
        label="02 — Experience"
        title="Where I've worked."
        subtitle="Building real things, solving real problems."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {experiences.map((exp) => (
          <ScrollFade key={exp.role + exp.period}>
            <motion.div
              whileHover={{ scale: 1.015, borderColor: `${exp.accent}55` }}
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

              {/* Icon dot */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${exp.accent}18`, border: `1px solid ${exp.accent}30` }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: exp.accent,
                    boxShadow: exp.current ? `0 0 12px ${exp.accent}80` : "none",
                  }}
                />
              </div>

              <h3 className="text-lg font-semibold text-[#e2e8f0] leading-tight mb-1">{exp.role}</h3>
              <p style={{ color: exp.accent }} className="font-medium text-sm mb-0.5">{exp.company}</p>
              <p className="text-xs text-[#6b7280] font-mono mb-4">{exp.period}</p>

              <ul className="space-y-2.5 mb-5 flex-1">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="flex gap-2.5 text-[#94a3b8] text-sm leading-relaxed">
                    <span className="shrink-0 mt-[3px]" style={{ color: exp.accent }}>▸</span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#1e1e2e]">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#12121e] text-[#6b7280] border border-[#2a2a40]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </ScrollFade>
        ))}
      </div>
    </SectionWrapper>
  );
}
