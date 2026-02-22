import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

interface AnimatedHeroTitleProps {
  text?: string;
}

const AnimatedHeroTitle = ({ text = "Ysurf" }: AnimatedHeroTitleProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  // ── 1. Mount stagger animation ─────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const els = lettersRef.current.filter(Boolean);

    // Set initial styles directly
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(-60px) rotateZ(-12deg) scale(0.6)";
    });

    animate(els, {
      opacity: [0, 1],
      translateY: [-60, 0],
      rotateZ: [-12, 0],
      scale: [0.6, 1],
      duration: 900,
      delay: stagger(80, { start: 120 }),
      ease: "spring(1, 80, 10, 0)",
    });

    // Dot fades in last
    const dot = containerRef.current.querySelector(
      ".hero-dot"
    ) as HTMLElement | null;
    if (dot) {
      dot.style.opacity = "0";
      dot.style.transform = "scale(0)";
      animate(dot, {
        opacity: [0, 1],
        scale: [0, 1],
        duration: 600,
        delay: 120 + els.length * 80 + 200,
        ease: "spring(1, 60, 12, 0)",
      });
    }
  }, []);

  // ── 2. Cursor-follow magnetic repulsion ────────────────────────────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const tick = () => {
      lettersRef.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elCx = rect.left + rect.width / 2;
        const elCy = rect.top + rect.height / 2;
        const dx = mousePos.current.x - elCx;
        const dy = mousePos.current.y - elCy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 120;

        if (dist < radius) {
          const force = (1 - dist / radius) * 18;
          const angle = Math.atan2(dy, dx);
          animate(el, {
            translateX: -Math.cos(angle) * force,
            translateY: -Math.sin(angle) * force,
            rotateZ: -Math.cos(angle) * force * 0.4,
            duration: 300,
            ease: "outQuad",
          });
        } else {
          animate(el, {
            translateX: 0,
            translateY: 0,
            rotateZ: 0,
            duration: 600,
            ease: "spring(1, 60, 14, 0)",
          });
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const letters = text.split("");

  return (
    <h1
      ref={containerRef}
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground mt-6 tracking-tight leading-tight select-none"
      style={{ display: "flex", alignItems: "baseline", gap: "0.01em" }}
    >
      {letters.map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            if (el) lettersRef.current[i] = el;
          }}
          style={{
            display: "inline-block",
            willChange: "transform, opacity",
            cursor: "default",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      <span
        className="hero-dot text-muted-foreground"
        style={{
          display: "inline-block",
          marginLeft: "0.15em",
          willChange: "transform, opacity",
        }}
      >
        .
      </span>
    </h1>
  );
};

export default AnimatedHeroTitle;