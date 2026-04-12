"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const COUNT = 80;
    const MAX_DIST = 140;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 0.8,
        opacity: Math.random() * 0.6 + 0.25,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.28;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 106, 247, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* Aurora gradient orbs — CSS animated, covers full page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {/* Orb 1 — top left */}
        <div
          className="absolute rounded-full"
          style={{
            width: "60vw",
            height: "60vw",
            top: "-15vw",
            left: "-15vw",
            background: "radial-gradient(circle, rgba(124,106,247,0.18) 0%, transparent 70%)",
            animation: "orb1 18s ease-in-out infinite alternate",
          }}
        />
        {/* Orb 2 — bottom right */}
        <div
          className="absolute rounded-full"
          style={{
            width: "55vw",
            height: "55vw",
            bottom: "-10vw",
            right: "-10vw",
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            animation: "orb2 22s ease-in-out infinite alternate",
          }}
        />
        {/* Orb 3 — center */}
        <div
          className="absolute rounded-full"
          style={{
            width: "40vw",
            height: "40vw",
            top: "35%",
            left: "30%",
            background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
            animation: "orb3 26s ease-in-out infinite alternate",
          }}
        />
        {/* Subtle noise grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px",
          }}
        />
      </div>

      {/* Particle canvas — scrolls with page */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden
      />

      <style>{`
        @keyframes orb1 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(6vw, 4vw) scale(1.08); }
          66%  { transform: translate(-4vw, 8vw) scale(0.95); }
          100% { transform: translate(3vw, -3vw) scale(1.04); }
        }
        @keyframes orb2 {
          0%   { transform: translate(0, 0) scale(1); }
          40%  { transform: translate(-8vw, -5vw) scale(1.1); }
          100% { transform: translate(4vw, 6vw) scale(0.92); }
        }
        @keyframes orb3 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(-6vw, 5vw) scale(1.12); }
          100% { transform: translate(5vw, -4vw) scale(0.96); }
        }
      `}</style>
    </>
  );
}
