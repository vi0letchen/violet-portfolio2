"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHScroll } from "./HScrollContext";

const navLinks = [
  { label: "About",      id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Projects",   id: "projects" },
  { label: "Skills",     id: "skills" },
  { label: "Contact",    id: "contact" },
];

export default function Navbar() {
  const [bgOpacity, setBgOpacity] = useState(0);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { isHorizontal, containerRef, scrollToSection } = useHScroll();

  /* Fade in — full opacity exactly when About scrolls into view */
  useEffect(() => {
    // The hero is always one full viewport wide (horizontal) or tall (vertical),
    // so scrolling one viewport unit brings About to the left/top edge.
    const compute = (scrollPos: number) => {
      const target = isHorizontal ? window.innerWidth : window.innerHeight;
      setBgOpacity(Math.min(1, scrollPos / target));
    };

    if (isHorizontal) {
      const el = containerRef.current;
      if (!el) return;
      const onScroll = () => compute(el.scrollLeft);
      el.addEventListener("scroll", onScroll, { passive: true });
      return () => el.removeEventListener("scroll", onScroll);
    } else {
      const onScroll = () => compute(window.scrollY);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [isHorizontal, containerRef]);

  const scrollTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;

      if (isHorizontal) {
        scrollToSection(id);
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [isHorizontal, scrollToSection]
  );

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo("hero");
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background:       `rgba(18, 18, 30, ${(bgOpacity * 0.92).toFixed(3)})`,
        backdropFilter:   bgOpacity > 0.01 ? `blur(${(bgOpacity * 16).toFixed(1)}px)` : "none",
        WebkitBackdropFilter: bgOpacity > 0.01 ? `blur(${(bgOpacity * 16).toFixed(1)}px)` : "none",
        borderBottom:     `1px solid rgba(255, 255, 255, ${(bgOpacity * 0.07).toFixed(3)})`,
      }}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.a
          href="#"
          onClick={handleLogoClick}
          className="text-lg font-semibold tracking-tight gradient-text"
          whileHover={{ scale: 1.03 }}
        >
          vc.
        </motion.a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.li
              key={link.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
            >
              <button
                onClick={() => scrollTo(link.id)}
                className="text-sm text-[#94a3b8] hover:text-[#a78bfa] transition-colors duration-200 font-medium cursor-pointer"
              >
                {link.label}
              </button>
            </motion.li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-[#e2e8f0] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#e2e8f0] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#e2e8f0] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass border-t border-[#1e1e2e] overflow-hidden"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      scrollTo(link.id);
                      setMenuOpen(false);
                    }}
                    className="text-sm text-[#94a3b8] hover:text-[#a78bfa] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
