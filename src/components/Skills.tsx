"use client";

import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import ScrollFade from "./ScrollFade";

const skillCategories = [
  {
    label: "Frameworks & Tools",
    icon: "⚙️",
    accent: "#7c6af7",
    skills: ["Next.js", "React", "Node.js", "Prisma", "Payload CMS", "Supabase", "Firebase", "MongoDB", "SQLite", "Excel"],
  },
  {
    label: "Languages",
    icon: "💬",
    accent: "#06b6d4",
    skills: ["TypeScript", "JavaScript", "Python", "HTML / CSS", "SQL", "C"],
  },
  {
    label: "Soft Skills",
    icon: "🧠",
    accent: "#a78bfa",
    skills: ["Fast Learning", "Leadership", "Adaptability", "Time Management", "Attention to Detail"],
  },
];

function SkillCards() {
  return (
    <>
      {skillCategories.map((cat) => (
        <ScrollFade key={cat.label} yOffset={20}>
          <div
            className="rounded-2xl border border-white/[0.06] bg-[#0e0e1a] p-5 h-full flex flex-col"
            style={{ boxShadow: `inset 0 0 40px ${cat.accent}08` }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                style={{ background: `${cat.accent}15`, border: `1px solid ${cat.accent}25` }}
              >
                {cat.icon}
              </div>
              <div>
                <h3 className="text-xs font-semibold tracking-widest uppercase" style={{ color: cat.accent }}>
                  {cat.label}
                </h3>
                <p className="text-[10px] text-[#4b5563] mt-0.5">{cat.skills.length} items</p>
              </div>
            </div>

            {/* Pills */}
            <div className="flex flex-wrap gap-1.5 flex-1 content-start">
              {cat.skills.map((skill) => (
                <motion.span
                  key={skill}
                  whileHover={{ scale: 1.06, borderColor: `${cat.accent}60`, color: cat.accent }}
                  className="inline-block px-3 py-1.5 rounded-lg text-sm font-medium text-[#94a3b8] border border-[#1e1e2e] glass cursor-default transition-colors"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </ScrollFade>
      ))}
    </>
  );
}

export default function Skills() {
  return (
    <SectionWrapper id="skills">
      <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-14 xl:gap-20">

        {/* Title column — full width on mobile, fixed on desktop */}
        <div className="flex-shrink-0 md:w-[34%]">
          <ScrollFade yOffset={20}>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#7c6af7] mb-3">
              04 — Skills
            </span>
          </ScrollFade>
          <ScrollFade yOffset={24}>
            <h2 className="text-4xl xl:text-5xl font-bold text-[#e2e8f0] leading-tight mb-4">
              What I work with.
            </h2>
          </ScrollFade>
          <ScrollFade yOffset={20}>
            <p className="text-[#6b7280] text-base leading-relaxed">
              A snapshot of my technical and professional toolkit.
            </p>
          </ScrollFade>
        </div>

        {/* Skill cards */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5">
          <SkillCards />
        </div>

      </div>
    </SectionWrapper>
  );
}
