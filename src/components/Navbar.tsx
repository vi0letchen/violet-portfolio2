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
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { isHorizontal, scrollToSection } = useHScroll();

  /* Detect when the hero panel leaves the viewport (works for both axes) */
  useEffect(() => {
    // Wait one tick so the hero section is in the DOM
    const timer = setTimeout(() => {
      const hero = document.getElementById("hero");
      if (!hero) return;

      const observer = new IntersectionObserver(
        ([entry]) => setScrolled(!entry.isIntersecting),
        { threshold: 0 }
      );
      observer.observe(hero);
      return () => observer.disconnect();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-[#1e1e2e]" : "bg-transparent"
      }`}
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
