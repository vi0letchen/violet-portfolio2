"use client";

import ScrollFade from "./ScrollFade";

interface Props {
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ label, title, subtitle }: Props) {
  return (
    <div className="mb-16">
      <ScrollFade yOffset={20}>
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#7c6af7] mb-3">
          {label}
        </span>
      </ScrollFade>
      <ScrollFade yOffset={24}>
        <h2 className="text-4xl sm:text-5xl font-bold text-[#e2e8f0] leading-tight mb-4">
          {title}
        </h2>
      </ScrollFade>
      {subtitle && (
        <ScrollFade yOffset={20}>
          <p className="text-[#6b7280] text-lg max-w-xl">{subtitle}</p>
        </ScrollFade>
      )}
    </div>
  );
}
