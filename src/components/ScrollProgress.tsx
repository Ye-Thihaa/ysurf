import { useEffect, useRef } from "react";

/**
 * Thin progress bar at the top of the page showing scroll depth.
 * Pure CSS/DOM — no deps. Syncs with FloatingYModel's scroll state visually.
 */
const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 100,
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(90deg, hsl(var(--foreground)/0.8), hsl(var(--foreground)/0.4))",
          transformOrigin: "left center",
          transform: "scaleX(0)",
          transition: "transform 0.05s linear",
        }}
      />
    </div>
  );
};

export default ScrollProgress;
