"use client";

import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import ScrollFade from "./ScrollFade";

const strengths = [
  { icon: "⚡", label: "Fast Learning" },
  { icon: "🎯", label: "Leadership" },
  { icon: "🔄", label: "Adaptability" },
  { icon: "⏱️", label: "Time Management" },
  { icon: "🔍", label: "Attention to Detail" },
];

export default function About() {
  return (
    <SectionWrapper id="about">
      <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-14 xl:gap-20">

        {/* Title column — full width on mobile, fixed on desktop */}
        <div className="flex-shrink-0 md:w-[34%]">
          <ScrollFade yOffset={20}>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#7c6af7] mb-3">
              01 — About
            </span>
          </ScrollFade>
          <ScrollFade yOffset={24}>
            <h2 className="text-4xl xl:text-5xl font-bold text-[#e2e8f0] leading-tight">
              Building things that matter.
            </h2>
          </ScrollFade>
        </div>

        {/* Content column */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Text */}
          <div>
            <ScrollFade>
              <p className="text-[#94a3b8] text-base leading-relaxed mb-5">
                I&apos;m a Computer Science and Information Technology Management graduate from the
                University of Auckland, currently working as a Junior Developer where I build
                full-stack web applications for university clubs and communities.
              </p>
            </ScrollFade>
            <ScrollFade>
              <p className="text-[#94a3b8] text-base leading-relaxed mb-5">
                I&apos;m passionate about shipping products that are used by real people — not just
                prototypes. I care deeply about clean code, great UX, and getting things done right
                the first time.
              </p>
            </ScrollFade>
            <ScrollFade>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Based in Auckland, NZ • Open to full-time &amp; contract roles
              </p>
            </ScrollFade>
          </div>

          {/* Strengths grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {strengths.map(({ icon, label }) => (
              <ScrollFade key={label}>
                <motion.div
                  whileHover={{ scale: 1.04, borderColor: "rgba(124,106,247,0.5)" }}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl glass border border-[#1e1e2e] cursor-default transition-colors h-full"
                >
                  <span className="text-3xl">{icon}</span>
                  <span className="text-xs font-medium text-[#94a3b8] text-center">{label}</span>
                </motion.div>
              </ScrollFade>
            ))}
            <ScrollFade className="col-span-2 sm:col-span-1">
              <div className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-[#7c6af7]/10 border border-[#7c6af7]/30 h-full">
                <span className="text-2xl font-bold gradient-text">UoA</span>
                <span className="text-xs text-[#6b7280] text-center">CS + ITM<br />Graduate 2025</span>
              </div>
            </ScrollFade>
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
