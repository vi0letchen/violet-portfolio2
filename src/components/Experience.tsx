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

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#7c6af7]/60 via-[#7c6af7]/20 to-transparent hidden sm:block" />

        <div className="flex flex-col gap-10">
          {experiences.map((exp) => (
            <ScrollFade key={exp.role + exp.period} className="relative sm:pl-12">
              {/* Timeline dot */}
              <div className="hidden sm:flex absolute left-[-3rem] top-6 w-8 h-8 items-center justify-center">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    exp.current
                      ? "bg-[#7c6af7] border-[#7c6af7] shadow-[0_0_12px_rgba(124,106,247,0.6)]"
                      : "bg-[#1a1a28] border-[#3d3d5e]"
                  }`}
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.01, borderColor: "rgba(124,106,247,0.35)" }}
                className="glass rounded-2xl border border-[#1e1e2e] p-6 sm:p-8 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#e2e8f0]">{exp.role}</h3>
                    <p className="text-[#7c6af7] font-medium">{exp.company}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1">
                    <span className="text-sm text-[#6b7280] font-mono">{exp.period}</span>
                    {exp.current && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs bg-[#7c6af7]/15 text-[#a78bfa] border border-[#7c6af7]/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 mb-5">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="flex gap-3 text-[#94a3b8] text-sm leading-relaxed">
                      <span className="text-[#7c6af7] mt-1 shrink-0">▸</span>
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-[#12121e] text-[#6b7280] border border-[#2a2a40]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </ScrollFade>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
