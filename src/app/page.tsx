import HScrollProvider from "@/components/HScrollProvider";
import HorizontalScroller from "@/components/HorizontalScroller";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    /*
     * HScrollProvider wraps everything so both Navbar and inner sections
     * can read `containerRef` and `isHorizontal` from context.
     */
    <HScrollProvider>
      <Navbar />
      <main>
        <HorizontalScroller>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
          <Footer />
        </HorizontalScroller>
      </main>
    </HScrollProvider>
  );
}
