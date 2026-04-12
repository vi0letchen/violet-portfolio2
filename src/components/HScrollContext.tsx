"use client";

import { createContext, useContext } from "react";

export interface HScrollCtx {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  isHorizontal: boolean;
  /** Desktop only: scrolls the horizontal strip to a section by DOM id (wired by HorizontalScroller). */
  scrollToSection: (id: string) => void;
  /** Internal: HorizontalScroller registers the implementation on mount. */
  registerSectionScroller: (fn: ((id: string) => void) | null) => void;
}

const HScrollContext = createContext<HScrollCtx>({
  containerRef: { current: null },
  isHorizontal: false,
  scrollToSection: () => {},
  registerSectionScroller: () => {},
});

export const useHScroll = () => useContext(HScrollContext);
export default HScrollContext;
