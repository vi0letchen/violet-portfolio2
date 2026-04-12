"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionWrapper from "./SectionWrapper";
import SectionHeading from "./SectionHeading";

const projects = [
  {
    title: "Auckland University Esports Club",
    url: "https://www.auec.club",
    description:
      "Club information website with event editing, payment systems, and user authentication. Built collaboratively with a team of six.",
    tags: ["Next.js", "TypeScript", "Team Project", "Payments", "Auth"],
    gradient: "from-[#7c6af7]/20 to-[#6366f1]/10",
    accent: "#7c6af7",
  },
  {
    title: "CoLab",
    url: "https://colab.exchange",
    description:
      "Helps the UoA Chemistry Department share and trade lab reagents. Solo full-stack project spanning every development phase — design, build, and deployment.",
    tags: ["Full-Stack", "Solo", "Design to Deploy"],
    gradient: "from-[#06b6d4]/20 to-[#0891b2]/10",
    accent: "#06b6d4",
  },
  {
    title: "Rainbow Engineering",
    url: "https://rainbowengineering.wdcc.co.nz",
    description:
      "Full-stack website for the UoA Rainbow Engineering Club, featuring Payload CMS and MongoDB for flexible content management.",
    tags: ["Next.js", "Payload CMS", "MongoDB", "Full-Stack"],
    gradient: "from-[#f472b6]/20 to-[#ec4899]/10",
    accent: "#f472b6",
  },
];

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <SectionWrapper id="projects">
      <SectionHeading
        label="03 — Projects"
        title="Things I've built."
        subtitle="Real products, shipped and used."
      />

      <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <motion.a
            key={project.title}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`group relative flex flex-col rounded-2xl border border-[#1e1e2e] overflow-hidden bg-gradient-to-br ${project.gradient} glass transition-all duration-300 hover:border-[${project.accent}]/40 hover:shadow-xl p-6 cursor-pointer`}
            style={{
              boxShadow: undefined,
            }}
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${project.accent}20`, border: `1px solid ${project.accent}30` }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={project.accent}
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4 text-[#6b7280] group-hover:text-[#a78bfa] transition-colors -translate-x-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
              >
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-[#e2e8f0] mb-2 group-hover:text-white transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-[#6b7280] leading-relaxed mb-5 flex-1">{project.description}</p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#0a0a0f]/40 text-[#94a3b8]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </SectionWrapper>
  );
}
