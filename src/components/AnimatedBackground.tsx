"use client";

import { useEffect, useRef } from "react";

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;       // trail length in px
  life: number;      // frames lived
  maxLife: number;   // total lifespan in frames
  maxOpacity: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const stars: ShootingStar[] = [];
    let frame = 0;
    // Random interval: spawn a star every 140–280 frames (~2.3–4.7s at 60fps)
    let nextSpawn = 120 + Math.floor(Math.random() * 140);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnStar = () => {
      // Angle: 28–52 degrees (roughly diagonal top-left → bottom-right)
      const angleDeg = 28 + Math.random() * 24;
      const angle = angleDeg * (Math.PI / 180);
      const speed = 10 + Math.random() * 7;

      // Start: either along the top edge or along the left edge
      const fromTop = Math.random() > 0.35;
      const x = fromTop
        ? Math.random() * canvas.width * 0.7    // tighter x spread → "closer"
        : -(Math.random() * 20);                 // less off-screen → enters sooner
      const y = fromTop
        ? -(Math.random() * 15)                  // nearly flush to top → closer in
        : Math.random() * canvas.height * 0.25;  // was 0.55 → upper 25% = +30% up

      stars.push({
        x,
        y,
        vx: speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        len: 260 + Math.random() * 220,
        life: 0,
        maxLife: 55 + Math.floor(Math.random() * 40),
        maxOpacity: 0.75 + Math.random() * 0.25,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      frame++;
      if (frame >= nextSpawn) {
        spawnStar();
        nextSpawn = frame + 140 + Math.floor(Math.random() * 140);
      }

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;

        const t = s.life / s.maxLife;
        // Fade in first 15%, full for middle 70%, fade out last 15%
        let alpha: number;
        if (t < 0.15) {
          alpha = (t / 0.15) * s.maxOpacity;
        } else if (t > 0.85) {
          alpha = ((1 - t) / 0.15) * s.maxOpacity;
        } else {
          alpha = s.maxOpacity;
        }

        // Tail origin (behind head along velocity direction)
        const spd = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        const tx = s.x - (s.vx / spd) * s.len;
        const ty = s.y - (s.vy / spd) * s.len;

        // Gradient trail: transparent tail → violet mid → white head
        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
        grad.addColorStop(0, `rgba(124, 106, 247, 0)`);
        grad.addColorStop(0.45, `rgba(180, 160, 255, ${alpha * 0.45})`);
        grad.addColorStop(0.8, `rgba(220, 210, 255, ${alpha * 0.75})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.8;
        ctx.lineCap = "round";
        ctx.stroke();

        // Bright head glow
        const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 9);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        headGlow.addColorStop(0.4, `rgba(220, 200, 255, ${alpha * 0.6})`);
        headGlow.addColorStop(1, `rgba(200, 180, 255, 0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = headGlow;
        ctx.fill();

        // Remove off-screen or expired stars
        if (
          s.life > s.maxLife ||
          s.x > canvas.width + 200 ||
          s.y > canvas.height + 200
        ) {
          stars.splice(i, 1);
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
      {/* Obsidian Halo — single large radial glow, slightly below center */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse 90% 65% at 50% 63%, rgba(109,92,230,0.32) 0%, rgba(99,102,241,0.14) 38%, rgba(80,50,180,0.05) 62%, transparent 75%)",
          animation: "haloPulse 7s ease-in-out infinite",
        }}
      />

      {/* Subtle vignette to keep edges dark */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{
          zIndex: 2,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Shooting star canvas — fixed viewport */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 3 }}
        aria-hidden
      />

      <style>{`
        @keyframes haloPulse {
          0%, 100% {
            opacity: 0.82;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.045);
          }
        }
      `}</style>
    </>
  );
}
