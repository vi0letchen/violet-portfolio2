"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionWrapper from "./SectionWrapper";
import SectionHeading from "./SectionHeading";

const skillCategories = [
  {
    label: "Frameworks & Tools",
    skills: ["Next.js", "React", "Node.js", "Prisma", "Payload CMS", "Supabase", "Firebase", "MongoDB", "SQLite", "Excel"],
  },
  {
    label: "Languages",
    skills: ["TypeScript", "JavaScript", "Python", "HTML / CSS", "SQL", "C"],
  },
  {
    label: "Soft Skills",
    skills: ["Fast Learning", "Leadership", "Adaptability", "Time Management", "Attention to Detail"],
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const chip = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "backOut" } },
};

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <SectionWrapper id="skills">
      <SectionHeading
        label="04 — Skills"
        title="What I work with."
        subtitle="A snapshot of my technical and professional toolkit."
      />

      <div ref={ref} className="flex flex-col gap-10">
        {skillCategories.map((cat, ci) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: ci * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#7c6af7] mb-4">
              {cat.label}
            </h3>
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="flex flex-wrap gap-3"
            >
              {cat.skills.map((skill) => (
                <motion.span
                  key={skill}
                  variants={chip}
                  whileHover={{ scale: 1.07, borderColor: "rgba(124,106,247,0.55)", color: "#a78bfa" }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[#94a3b8] border border-[#1e1e2e] glass cursor-default transition-colors"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
