"use client";

import { ReactNode } from "react";
import { useHScroll } from "./HScrollContext";

interface Props {
  id: string;
  children: ReactNode;
  className?: string;
}

export default function SectionWrapper({ id, children, className = "" }: Props) {
  const { isHorizontal } = useHScroll();

  return (
    <section
      id={id}
      className={[
        // Shared
        "max-w-7xl mx-auto w-full",
        isHorizontal ? "px-16" : "px-8",
        // Vertical (mobile)
        !isHorizontal ? "py-24" : "",
        // Horizontal (desktop): exactly one viewport wide, content centered vertically
        isHorizontal
          ? "flex flex-col justify-center min-h-screen py-16 md:min-w-screen"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}
