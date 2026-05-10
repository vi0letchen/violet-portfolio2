"use client";

import { motion } from "framer-motion";
import { Zap, Users, Shuffle, Clock, ScanSearch, Lightbulb } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import ScrollFade from "./ScrollFade";
import MagneticText from "./MagneticText";
import type { LucideIcon } from "lucide-react";

const strengths: { icon: LucideIcon; color: string; label: string }[] = [
  { icon: Zap,        color: "#facc15", label: "Fast Learning"       },
  { icon: Users,      color: "#fb923c", label: "Leadership"          },
  { icon: Shuffle,    color: "#34d399", label: "Adaptability"        },
  { icon: Clock,      color: "#7c6af7", label: "Time Management"     },
  { icon: ScanSearch, color: "#06b6d4", label: "Attention to Detail" },
  { icon: Lightbulb,  color: "#f472b6", label: "Problem Solving"     },
];

export default function About() {
  return (
    <SectionWrapper id="about">
      <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-14 xl:gap-20">

        {/* Title column — full width on mobile, fixed on desktop */}
        <div className="flex-shrink-0 md:w-[40%]">
          <ScrollFade yOffset={20}>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#7c6af7] mb-3">
              01 — About
            </span>
          </ScrollFade>
          <ScrollFade yOffset={24}>
            <MagneticText className="text-4xl xl:text-5xl font-bold text-[#e2e8f0] leading-tight">
              I build for passion, not validation.
            </MagneticText>
          </ScrollFade>
        </div>

        {/* Content column */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Text */}
          <div>
            <ScrollFade>
              <p className="text-[#94a3b8] text-base leading-relaxed mb-5">
                I'm currently volunteering as a Junior Developer where I build
                full-stack web applications for UoA clubs. 
                I truly enjoy the entire development process, from brainstorming, design, coding, problem solving, to deployment.
              </p>
            </ScrollFade>
            <ScrollFade>
              <p className="text-[#94a3b8] text-base leading-relaxed mb-5">
                I care deeply about clean code, great UX, and getting things done right.
                 Witnessing the work I poured my heart into being used and 
                appreciated by real users has always been my goal.
              </p>
            </ScrollFade>
            <ScrollFade>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Based in Auckland, NZ • Open to relocation, full-time &amp; contract roles
              </p>
            </ScrollFade>
          </div>

          {/* Strengths grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {strengths.map(({ icon: Icon, color, label }) => (
              <ScrollFade key={label}>
                <motion.div
                  whileHover={{ borderColor: "rgba(124,106,247,0.5)" }}
                  transition={{ duration: 0.1 }}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl glass border border-[#1e1e2e] cursor-default h-full"
                >
                  <Icon size={28} color={color} strokeWidth={1.6} />
                  <span className="text-xs font-medium text-[#94a3b8] text-center">{label}</span>
                </motion.div>
              </ScrollFade>
            ))}
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
