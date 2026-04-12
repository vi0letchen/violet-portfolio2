"use client";

import { ReactNode } from "react";
import ScrollFade from "./ScrollFade";

interface Props {
  id: string;
  num: string;       // e.g. "01"
  label: string;     // e.g. "About"
  title: string;
  subtitle?: string;
  children: ReactNode; // right-column content
}

/**
 * Consistent section layout used by every section except Hero and Projects.
 *
 * Mobile  (< md): stacked — title block on top, content below.
 * Desktop (≥ md): side-by-side — title column (26 vw) | content column (flex-1).
 *                 The section is exactly min-w-screen so it fills one viewport panel.
 */
export default function SectionLayout({
  id,
  num,
  label,
  title,
  subtitle,
  children,
}: Props) {
  return (
    <section
      id={id}
      className="flex flex-col md:flex-row md:min-w-screen md:h-screen"
    >
      {/* ── Left: title column ─────────────────────────────────────── */}
      <div
        className={[
          // Mobile: top padding clears the fixed navbar
          "flex flex-col justify-start pt-28 pb-10 px-8",
          // Desktop: full-height column, content centered, subtle right border
          "md:flex-shrink-0 md:w-[26vw] md:justify-center md:pt-0 md:pb-0 md:px-12",
          "md:border-r md:border-white/[0.05]",
        ].join(" ")}
      >
        <ScrollFade yOffset={20}>
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#7c6af7] mb-3">
            {num} — {label}
          </span>
        </ScrollFade>

        <ScrollFade yOffset={24}>
          <h2 className="text-4xl xl:text-5xl font-bold text-[#e2e8f0] leading-tight mb-4">
            {title}
          </h2>
        </ScrollFade>

        {subtitle && (
          <ScrollFade yOffset={18}>
            <p className="text-[#6b7280] text-base leading-relaxed">{subtitle}</p>
          </ScrollFade>
        )}
      </div>

      {/* ── Right: content ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 pb-16 md:px-12 md:py-16">
        {children}
      </div>
    </section>
  );
}
