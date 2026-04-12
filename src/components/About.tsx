"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionWrapper from "./SectionWrapper";
import SectionHeading from "./SectionHeading";

const strengths = [
  { icon: "⚡", label: "Fast Learning" },
  { icon: "🎯", label: "Leadership" },
  { icon: "🔄", label: "Adaptability" },
  { icon: "⏱️", label: "Time Management" },
  { icon: "🔍", label: "Attention to Detail" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <SectionWrapper id="about">
      <div className="grid lg:grid-cols-2 gap-16 items-center" ref={ref}>
        {/* Left — text */}
        <motion.div variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"}>
          <motion.div variants={fadeUp}>
            <SectionHeading label="01 — About" title="Building things that matter." />
          </motion.div>

          <motion.p variants={fadeUp} className="text-[#94a3b8] text-base leading-relaxed mb-5">
            I&apos;m a Computer Science and Information Technology Management graduate from the
            University of Auckland, currently working as a Junior Developer where I build
            full-stack web applications for university clubs and communities.
          </motion.p>
          <motion.p variants={fadeUp} className="text-[#94a3b8] text-base leading-relaxed mb-5">
            I&apos;m passionate about shipping products that are used by real people — not just
            prototypes. I care deeply about clean code, great UX, and getting things done right
            the first time.
          </motion.p>
          <motion.p variants={fadeUp} className="text-[#6b7280] text-sm leading-relaxed">
            Based in Auckland, NZ • Open to full-time & contract roles
          </motion.p>
        </motion.div>

        {/* Right — strengths grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {strengths.map(({ icon, label }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              whileHover={{ scale: 1.04, borderColor: "rgba(124,106,247,0.5)" }}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl glass border border-[#1e1e2e] cursor-default transition-colors"
            >
              <span className="text-3xl">{icon}</span>
              <span className="text-xs font-medium text-[#94a3b8] text-center">{label}</span>
            </motion.div>
          ))}

          {/* Decorative card */}
          <motion.div
            variants={fadeUp}
            className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-[#7c6af7]/10 border border-[#7c6af7]/30"
          >
            <span className="text-2xl font-bold gradient-text">UoA</span>
            <span className="text-xs text-[#6b7280] text-center">CS + ITM<br />Graduate 2025</span>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
