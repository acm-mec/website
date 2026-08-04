import { useEffect, useRef, useCallback } from "react";

const DOT_COUNT = 65;
const BASE_RADIUS = 2;
const MAX_RADIUS = 3.8;
const MOUSE_RADIUS = 140;
const MOUSE_REPEL_FORCE = 0.04;
const BASE_SPEED = 0.4;
const CONNECTION_DIST = 115;

function createDot(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * BASE_SPEED,
    vy: (Math.random() - 0.5) * BASE_SPEED,
    baseVx: (Math.random() - 0.5) * BASE_SPEED,
    baseVy: (Math.random() - 0.5) * BASE_SPEED,
    radius: BASE_RADIUS + Math.random() * (MAX_RADIUS - BASE_RADIUS),
    opacity: 0.2 + Math.random() * 0.4,
    pulseOffset: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.015,
  };
}

export default function FloatingDots() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const dotsRef = useRef([]);
  const rafRef = useRef(null);
  const isDarkRef = useRef(false);

  const handleMouseMove = useCallback((e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      // Re-initialize dots if empty or resized significantly
      if (dotsRef.current.length === 0) {
        dotsRef.current = Array.from({ length: DOT_COUNT }, () => createDot(w, h));
      }
    };

    // Theme observer for real-time light/dark adaptation
    const themeObserver = new MutationObserver(() => {
      isDarkRef.current =
        document.documentElement.getAttribute("data-theme") === "dark";
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    isDarkRef.current =
      document.documentElement.getAttribute("data-theme") === "dark";

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    let frame = 0;

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mouse = mouseRef.current;
      const dark = isDarkRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, w, h);
      frame++;

      const dots = dotsRef.current;
      // Blue RGB palette matching ACM theme (Light: Vibrant Cobalt/Indigo | Dark: Electric Cyan/Sky Blue)
      const dotRgb = dark ? "45, 183, 229" : "37, 99, 235";
      const lineRgb = dark ? "66, 215, 255" : "59, 130, 246";

      // 1. Update dot positions & mouse interaction
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Mouse distance
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          // Push dot away from mouse
          const angle = Math.atan2(dy, dx);
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const push = force * MOUSE_REPEL_FORCE * 8;
          dot.vx -= Math.cos(angle) * push;
          dot.vy -= Math.sin(angle) * push;
        }

        // Return velocity towards base drift
        dot.vx += (dot.baseVx - dot.vx) * 0.05;
        dot.vy += (dot.baseVy - dot.vy) * 0.05;

        // Apply velocity
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Screen boundary wrapping
        if (dot.x < -20) dot.x = w + 20;
        if (dot.x > w + 20) dot.x = -20;
        if (dot.y < -20) dot.y = h + 20;
        if (dot.y > h + 20) dot.y = -20;
      }

      // 2. Draw subtle network connection lines between close dots
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * (dark ? 0.12 : 0.08);
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(${lineRgb}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 3. Draw dots
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const pulse = Math.sin(frame * dot.pulseSpeed + dot.pulseOffset);
        const currentRadius = Math.max(1, dot.radius + pulse * 0.6);
        const currentOpacity = Math.min(
          0.7,
          Math.max(0.1, dot.opacity + pulse * 0.1)
        );

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotRgb}, ${currentOpacity})`;
        ctx.fill();

        // Extra subtle outer glow on dark mode
        if (dark) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, currentRadius * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dotRgb}, ${currentOpacity * 0.15})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      themeObserver.disconnect();
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
