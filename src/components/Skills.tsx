"use client";

import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import MagneticText from "./MagneticText";
import { SkillSpan } from "./SkillPreview";
import { useHScroll } from "./HScrollContext";

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

/** Shared fade-in variant reused for both title items and cards. */
const fadeIn = {
  hidden: (custom: { x?: number; y?: number }) => ({
    opacity: 0,
    x: custom.x ?? 0,
    y: custom.y ?? 0,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function SkillCards() {
  const { containerRef, isHorizontal } = useHScroll();

  return (
    <>
      {skillCategories.map((cat, i) => (
        <motion.div
          key={cat.label}
          custom={{ x: isHorizontal ? 50 + i * 20 : 0, y: isHorizontal ? 0 : 20 }}
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{
            root: isHorizontal ? containerRef : undefined,
            once: false,
            amount: 0.25,
          }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 }}
          className="h-full"
        >
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
                <SkillSpan key={skill} skill={skill}>
                  <motion.span
                    whileHover={{ scale: 1.06, borderColor: `${cat.accent}60`, color: cat.accent }}
                    className="inline-block px-3 py-1.5 rounded-lg text-sm font-medium text-[#94a3b8] border border-[#1e1e2e] glass cursor-default transition-colors"
                  >
                    {skill}
                  </motion.span>
                </SkillSpan>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
}

export default function Skills() {
  const { containerRef, isHorizontal } = useHScroll();

  return (
    <SectionWrapper id="skills">
      <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-14 xl:gap-20">

        {/* Title column */}
        <div className="flex-shrink-0 md:w-[34%]">
          <motion.span
            className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#7c6af7] mb-3"
            custom={{ x: isHorizontal ? 30 : 0, y: isHorizontal ? 0 : 16 }}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ root: isHorizontal ? containerRef : undefined, once: false, amount: 0.5 }}
          >
            04 — Skills
          </motion.span>

          <motion.div
            custom={{ x: isHorizontal ? 30 : 0, y: isHorizontal ? 0 : 20 }}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.05 }}
            viewport={{ root: isHorizontal ? containerRef : undefined, once: false, amount: 0.5 }}
          >
            <MagneticText className="text-4xl xl:text-5xl font-bold text-[#e2e8f0] leading-tight mb-4">
              What I work with.
            </MagneticText>
          </motion.div>

          <motion.p
            className="text-[#6b7280] text-base leading-relaxed"
            custom={{ x: isHorizontal ? 30 : 0, y: isHorizontal ? 0 : 16 }}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
            viewport={{ root: isHorizontal ? containerRef : undefined, once: false, amount: 0.5 }}
          >
            A snapshot of my technical and professional toolkit.
          </motion.p>
        </div>

        {/* Skill cards */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5">
          <SkillCards />
        </div>

      </div>
    </SectionWrapper>
  );
}
