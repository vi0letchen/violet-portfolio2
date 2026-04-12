"use client";

import { useRef, useEffect, useState, ReactNode, useCallback } from "react";
import HScrollContext from "./HScrollContext";

/**
 * Provides the horizontal-scroll context to all descendants.
 * Must wrap both the Navbar and the HorizontalScroller so both
 * can read `containerRef` and `isHorizontal`.
 */
export default function HScrollProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionScrollerRef = useRef<(id: string) => void>(() => {});
  const [isHorizontal, setIsHorizontal] = useState(false);

  const scrollToSection = useCallback((id: string) => {
    sectionScrollerRef.current(id);
  }, []);

  const registerSectionScroller = useCallback((fn: ((id: string) => void) | null) => {
    sectionScrollerRef.current = fn ?? (() => {});
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsHorizontal(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsHorizontal(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <HScrollContext.Provider
      value={{
        containerRef,
        isHorizontal,
        scrollToSection,
        registerSectionScroller,
      }}
    >
      {children}
    </HScrollContext.Provider>
  );
}
