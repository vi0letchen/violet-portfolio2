"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ScrollFade from "./ScrollFade";
import MagneticText from "./MagneticText";
import { SkillSpan } from "./SkillPreview";
import { useHScroll } from "./HScrollContext";

/* ─── Shader sources ─────────────────────────────────────────────────── */

const VERT = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

/**
 * Nebula shader — violet / indigo / cyan palette.
 * Based on "To Boldly Go" by Matthias Hurrle (@atzedent), adapted for
 * a cool-hue dark-space aesthetic that matches the Projects section accent
 * colours (#7c6af7, #06b6d4, #a78bfa).
 *
 * Animation is time-driven; time only advances while the section is
 * visible in the viewport (see IntersectionObserver below).
 */
const FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T  time
#define R  resolution
#define MN min(R.x,R.y)

float rnd(vec2 p){
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p){
  float t=.0,a=1.;
  mat2 m=mat2(1.,-.5,.2,1.2);
  for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}
  return t;
}
float clouds(vec2 p){
  float d=1.,t=.0;
  for(float i=.0;i<3.;i++){
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);d=a;p*=2./(i+1.);
  }
  return t;
}
void main(){
  vec2 uv=(FC-.5*R)/MN*0.55, st=uv*vec2(2,1);
  vec3 col=vec3(0);

  /* slow-drifting nebula cloud base */
  float bg=clouds(vec2(st.x+T*.18,-st.y));

  uv*=1.-.3*(sin(T*.12)*.5+.5);

  for(float i=1.;i<12.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.22+.1*uv.x);
    vec2 p=uv;
    float d=length(p);

    /* Violet / indigo palette: R×0.48  G×0.28  B×1.0  */
    vec3 hue=(cos(sin(i)*vec3(1,2,3))+1.)*vec3(0.48,0.28,1.0);
    col+=.00125/d*hue;

    /* Cyan rim glow on noise ridges */
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)))*vec3(0.22,0.55,1.0);

    /* Deep indigo / space-navy fog */
    col=mix(col,vec3(bg*.04,bg*.025,bg*.18),d);
  }

  /* Subtle cyan sheen on bright filaments */
  float lum=dot(col,vec3(0.299,0.587,0.114));
  col=mix(col,col*vec3(0.6,0.82,1.45),smoothstep(0.08,0.55,lum)*0.22);

  /* Keep it dark enough so content stays readable */
  col*=0.72;

  O=vec4(col,1);
}`;

/* ─── Data ─────────────────────────────────────────────────────────── */

const mainProjects = [
  {
    title: "Auckland University Esports Club",
    url: "https://www.auec.club",
    displayUrl: "auec.club",
    description:
      "Auckland University Esports Club is a full-stack club platform built for one of New Zealand's largest university esports communities. The website allows users to browse upcoming events and manage registrations, while also handling merchandise sales. Members can sign up, log in, and stay up to date with the club.",
    tags: ["Next.js", "TypeScript", "Prisma", "Supabase", "Auth", "Payments"],
    image: "/AUEC.png",
    accent: "#7c6af7",
    border: "rgba(124,106,247,0.35)",
    glow: "rgba(124,106,247,0.18)",
  },
  {
    title: "CoLab",
    url: "https://colab.exchange",
    displayUrl: "colab.exchange",
    description:
      "CoLab is a collaborative platform designed for New Zealand institutions' Chemistry Departments. It aims to prevent wastes of expired reagents and promote sustainable practices in chemistry labs. It provides a space for students and educators to share chemical products. Users can create profiles, upload products with detailed information, and explore contributions from others.",
    tags: ["Next.js", "TSOA", "Firebase", "Full-Stack"],
    image: "/CoLab.png",
    accent: "#06b6d4",
    border: "rgba(6,182,212,0.35)",
    glow: "rgba(6,182,212,0.14)",
  },
  {
    title: "Rainbow Engineering",
    url: "https://rainbowengineering.wdcc.co.nz",
    displayUrl: "rainbowengineering.wdcc.co.nz",
    description:
      "Rainbow Engineering is an information website made for the club Rainbow Engineering at the University of Auckland. Managed and built through the Web Development and Consulting Club. The website provides a platform for the club to manage registrations and share information about the events. It supports users to sign up for events from a Google Form and clients to edit website content through Payload CMS.",
    tags: ["Next.js", "Payload CMS", "MongoDB", "Full-Stack"],
    image: "/RainbowEngineering.png",
    accent: "#f472b6",
    border: "rgba(244,114,182,0.35)",
    glow: "rgba(244,114,182,0.14)",
  },
];

const hackathonProjects = [
  {
    title: "Quater",
    date: "Apr 2026",
    event: "WEB3UOA Hackathon",
    description:
      "Quater is an AI-powered marketplace that lets users purchase real-world products using stablecoins. Instead of relying on a single store, Quater searches and aggregates products from across the internet, helping users discover the best options available. Its built-in AI assistant compares price, quality, and value in real time to deliver smarter, more reliable recommendations.",
    tags: ["Next.js", "TypeScript", "AI", "Web3"],
    github: "https://github.com/stuutzer/ATLUniEsportsClub",
    accent: "#10b981",
  },
  {
    title: "PartScanner",
    date: "Jul 2025",
    event: "Partly × WDCC Hackathon",
    description:
      "PartScanner is a vehicle assessment tool built with Tkinter for vehicle part identification. It allows users to select parts of the vehicle from different angles and those data are sent to a backend server provided by Partly for analysis. The tool then provides feedback on the condition of the parts, helping users to identify potential issues.",
    tags: ["Python", "Tkinter"],
    github: null,
    accent: "#f97316",
  },
  {
    title: "SpacePlates",
    date: "Apr 2024",
    event: "SESA × WDCC Hackathon",
    description:
      "SpacePlates is a vanilla based food delivery platform to help aliens across different planets under the 2024 SESA x WDCC Hackathon theme 'Escape from Earth'. It contains a Tinder like swiping system for users to select their preferred food options, for aliens to find their ideal food quickly, including ordering and payment system.",
    tags: ["HTML / CSS", "JavaScript"],
    github: "https://github.com/saikam2003/wdcc-team-teletubbies",
    accent: "#818cf8",
  },
];

/* ─── Browser mockup card ───────────────────────────────────────────── */

function BrowserCard({ project }: { project: typeof mainProjects[0] }) {
  return (
    <ScrollFade className="h-full">
      <motion.a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -5, boxShadow: `0 0 36px 3px ${project.glow}`, borderColor: project.border }}
        transition={{ duration: 0.18 }}
        className="group flex flex-col h-full rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0e0e1a]/80 backdrop-blur-sm cursor-pointer"
      >
        {/* Browser chrome */}
        <div className="flex-shrink-0 bg-[#13131f]/90 border-b border-white/[0.06] px-3 py-2 flex items-center gap-2">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <div className="w-2 h-2 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex items-center gap-1.5 bg-[#0a0a14] rounded px-2 py-0.5 min-w-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5 text-[#4b5563] flex-shrink-0">
              <rect width="11" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-[10px] text-[#4b5563] font-mono truncate">{project.displayUrl}</span>
          </div>
          <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: project.accent }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>

        {/* Screenshot */}
        <div className="relative flex-shrink-0 overflow-hidden" style={{ height: 190 }}>
          <Image src={project.image} alt={project.title} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 23vw" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0e0e1a] to-transparent" />
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-sm font-semibold text-[#e2e8f0] leading-snug group-hover:text-white transition-colors mb-1.5">
            {project.title}
          </h3>
          <p className="text-xs text-[#6b7280] leading-relaxed mb-3 flex-1">{project.description}</p>
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <SkillSpan
                key={tag}
                skill={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                style={{ color: project.accent, borderColor: `${project.accent}35`, background: `${project.accent}0d` }}
              >
                {tag}
              </SkillSpan>
            ))}
          </div>
        </div>
      </motion.a>
    </ScrollFade>
  );
}

/* ─── Hackathon card ────────────────────────────────────────────────── */

function HackathonCard({ project }: { project: typeof hackathonProjects[0] }) {
  const Tag = project.github ? motion.a : motion.div;
  const linkProps = project.github
    ? { href: project.github, target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <ScrollFade className="h-full">
      <Tag
        {...linkProps}
        whileHover={{ y: -5, boxShadow: `0 0 36px 3px ${project.accent}18`, borderColor: `${project.accent}50` }}
        transition={{ duration: 0.18 }}
        className={`rounded-2xl border border-white/[0.07] bg-[#0e0e1a]/80 backdrop-blur-sm overflow-hidden h-full flex flex-col${project.github ? " cursor-pointer" : ""}`}
      >
        {/* ── Accent banner ── */}
        <div
          className="relative flex-shrink-0 flex flex-col items-center justify-center overflow-hidden"
          style={{ height: 170, background: `linear-gradient(135deg, ${project.accent}20 0%, ${project.accent}07 100%)` }}
        >
          {/* Grid texture */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(${project.accent}18 1px, transparent 1px), linear-gradient(90deg, ${project.accent}18 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
          {/* Faded watermark — club/event name */}
          <span
            className="absolute inset-0 flex items-center justify-center text-7xl font-black leading-none select-none pointer-events-none tracking-tighter text-center px-4"
            style={{ color: project.accent, opacity: 0.1 }}
          >
            {project.event.replace(" Hackathon", "")}
          </span>
          {/* GitHub link */}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 transition-opacity opacity-40 hover:opacity-100"
              style={{ color: project.accent }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col flex-1 p-5">
          <h4 className="text-xl font-bold text-[#e2e8f0] leading-tight mb-1">{project.title}</h4>
          <p className="text-[11px] font-mono mb-4" style={{ color: `${project.accent}99` }}>{project.date}</p>
          <p className="text-xs text-[#6b7280] leading-relaxed flex-1 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <SkillSpan
                key={tag}
                skill={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                style={{ color: project.accent, borderColor: `${project.accent}30`, background: `${project.accent}0d` }}
              >
                {tag}
              </SkillSpan>
            ))}
          </div>
        </div>
      </Tag>
    </ScrollFade>
  );
}

/* ─── Section ───────────────────────────────────────────────────────── */

export default function Projects() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const rafRef       = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  const { containerRef, isHorizontal } = useHScroll();

  /* ── Scroll-driven grey overlay ── */
  useEffect(() => {
    if (!isHorizontal) return;
    const container = containerRef.current;
    const overlay   = overlayRef.current;
    if (!container || !overlay) return;

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // Ramp from 0 → 0.45 over the first viewport-width of scroll (Hero → About),
        // then stay at 0.45 for all subsequent sections.
        const progress = Math.min(container.scrollLeft / (window.innerWidth * 0.5), 1);
        overlay.style.opacity = String(progress * 0.45);
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      container.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isHorizontal, containerRef]);

  const glRef = useRef<{
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    resLoc: WebGLUniformLocation | null;
    timeLoc: WebGLUniformLocation | null;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("[Projects shader]", gl.getShaderInfoLog(s));
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[Projects shader link]", gl.getProgramInfoLog(program));
      return;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    glRef.current = {
      gl,
      program,
      resLoc:  gl.getUniformLocation(program, "resolution"),
      timeLoc: gl.getUniformLocation(program, "time"),
    };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    /* Animation loop — starts immediately on mount */
    const loop = (now: number) => {
      const state = glRef.current;
      if (!state) { rafRef.current = requestAnimationFrame(loop); return; }

      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsed = (now - startTimeRef.current) * 1e-3;

      const { gl: g, program: prog, resLoc, timeLoc } = state;
      g.clearColor(0, 0, 0, 1);
      g.clear(g.COLOR_BUFFER_BIT);
      g.useProgram(prog);
      g.uniform2f(resLoc, canvas.width, canvas.height);
      g.uniform1f(timeLoc, elapsed);
      g.drawArrays(g.TRIANGLE_STRIP, 0, 4);

      rafRef.current = requestAnimationFrame(loop);
    };

    canvas.style.opacity = "1";
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
      gl.deleteProgram(program);
      glRef.current = null;
    };
  }, []);

  return (
    <section id="projects" className="relative">

      {/* ── WebGL nebula background — fixed to viewport ─────────────── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 w-screen h-screen pointer-events-none"
        style={{
          zIndex: -1,
          background: "#07071a",
        }}
      />

      {/* ── Scroll-driven readability overlay ────────────────────────── */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 w-screen h-screen pointer-events-none"
        style={{
          zIndex: -1,
          opacity: 0,
          background: "rgba(5, 5, 18, 1)",
        }}
      />

      {/* ══════════════════════════════════════════════════════
          MOBILE layout  (< md)
         ══════════════════════════════════════════════════════ */}
      <div className="md:hidden relative z-10 py-24 px-6 max-w-6xl mx-auto" style={{ isolation: "isolate" }}>
        {/* Heading */}
        <div className="mb-10">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#7c6af7] mb-3">
            03 — Projects
          </span>
          <h2 className="text-4xl font-bold text-[#e2e8f0] leading-tight mb-2">
            Things I&apos;ve built.
          </h2>
        </div>

        {/* Live projects */}
        <div className="flex flex-col gap-5 mb-10">
          {mainProjects.map((p) => (
            <BrowserCard key={p.title} project={p} />
          ))}
        </div>

        {/* Hackathon */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#4b5563]">Hackathon Projects</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
        <div className="flex flex-col gap-4">
          {hackathonProjects.map((p) => (
            <HackathonCard key={p.title} project={p} />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP horizontal layout  (≥ md)
         ══════════════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-row h-screen items-stretch" style={{ position: "relative", zIndex: 10 }}>

        {/* ── Title column ──────────────────────────────────────────── */}
        <div className="flex-shrink-0 w-[35vw] flex flex-col justify-center pl-16 pr-12">
          <ScrollFade yOffset={20}>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#7c6af7] mb-3">
              03 — Projects
            </span>
          </ScrollFade>
          <ScrollFade yOffset={24}>
            <MagneticText className="text-4xl xl:text-5xl font-bold text-[#e2e8f0] leading-tight mb-4">
              Things I've built.
            </MagneticText>
          </ScrollFade>
          <ScrollFade yOffset={20}>
            <p className="text-[#6b7280] text-base leading-relaxed">
              Real products, shipped and used by real people.
            </p>
          </ScrollFade>
        </div>

        {/* ── Live projects — three cards in a row ──────────────────── */}
        <div className="flex flex-row items-center gap-5 px-10 py-10">
          {mainProjects.map((project) => (
            <div key={project.title} className="flex-shrink-0 w-[28vw] max-w-[460px] h-[480px] py-2 flex flex-col">
              <BrowserCard project={project} />
            </div>
          ))}
        </div>

        {/* ── Vertical "Hackathon Projects" divider ─────────────────── */}
        <div className="flex-shrink-0 flex items-center justify-center px-6 py-10">
          <ScrollFade yOffset={16}>
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <div className="h-20 w-px bg-white/[0.05]" />
              <div className="flex flex-col items-center gap-[4px]">
                {"HACKATHON".split("").map((char, i) => (
                  <span key={i} className="text-[12px] font-semibold tracking-widest uppercase text-[#4b5563] leading-none">
                    {char}
                  </span>
                ))}
                <span className="block h-4" />
                {"PROJECTS".split("").map((char, i) => (
                  <span key={i} className="text-[12px] font-semibold tracking-widest uppercase text-[#4b5563] leading-none">
                    {char}
                  </span>
                ))}
              </div>
              <div className="h-20 w-px bg-white/[0.05]" />
            </div>
          </ScrollFade>
        </div>

        {/* ── Hackathon — two cards side by side ────────────────────── */}
        <div className="flex-shrink-0 flex flex-row items-center gap-5 pl-8 pr-10 py-10">
          {hackathonProjects.map((project) => (
            <div key={project.title} className="flex-shrink-0 w-[22vw] max-w-[360px] min-w-[260px] h-[480px] py-2 flex flex-col">
              <HackathonCard project={project} />
            </div>
          ))}
        </div>

        {/* Right breathing room */}
        <div className="flex-shrink-0 w-24" />

      </div>
    </section>
  );
}
