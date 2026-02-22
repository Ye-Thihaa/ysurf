import { useRef } from "react";
import { animate } from "animejs";

interface AnimatedTechPillProps {
  label: string;
}

const AnimatedTechPill = ({ label }: AnimatedTechPillProps) => {
  const pillRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!pillRef.current) return;
    const rect = pillRef.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const angle = Math.atan2(dy, dx);
    animate(pillRef.current, {
      translateX: -Math.cos(angle) * 6,
      translateY: -Math.sin(angle) * 6,
      scale: 1.08,
      duration: 250,
      ease: "spring(1, 80, 12, 0)",
    });
  };

  const handleMouseLeave = () => {
    if (!pillRef.current) return;
    animate(pillRef.current, {
      translateX: 0,
      translateY: 0,
      scale: 1,
      duration: 500,
      ease: "spring(1, 60, 10, 0)",
    });
  };

  return (
    <span
      ref={pillRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block", willChange: "transform" }}
      className="px-4 py-2 bg-card border border-border rounded-md text-sm font-mono text-foreground hover:border-foreground/40 hover:bg-card/80 transition-colors cursor-default select-none"
    >
      {label}
    </span>
  );
};

export default AnimatedTechPill;