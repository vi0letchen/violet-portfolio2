"use client";

import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import SectionHeading from "./SectionHeading";
import ScrollFade from "./ScrollFade";

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

export default function Skills() {
  return (
    <SectionWrapper id="skills">
      <SectionHeading
        label="04 — Skills"
        title="What I work with."
        subtitle="A snapshot of my technical and professional toolkit."
      />

      <div className="flex flex-col gap-10">
        {skillCategories.map((cat) => (
          <div key={cat.label}>
            <ScrollFade yOffset={16}>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[#7c6af7] mb-4">
                {cat.label}
              </h3>
            </ScrollFade>

            <div className="flex flex-wrap gap-3">
              {cat.skills.map((skill) => (
                <ScrollFade key={skill} yOffset={16}>
                  <motion.span
                    whileHover={{ scale: 1.07, borderColor: "rgba(124,106,247,0.55)", color: "#a78bfa" }}
                    className="inline-block px-4 py-2 rounded-xl text-sm font-medium text-[#94a3b8] border border-[#1e1e2e] glass cursor-default transition-colors"
                  >
                    {skill}
                  </motion.span>
                </ScrollFade>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
