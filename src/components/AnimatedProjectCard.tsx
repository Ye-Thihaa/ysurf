import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { GitBranch, ExternalLink } from "lucide-react";

interface AnimatedProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  delay?: number;
  github?: string;
  demo?: string;
}

const AnimatedProjectCard = ({
  title,
  description,
  tech,
  delay = 0,
  github,
  demo,
}: AnimatedProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const animatedIn = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(40px) rotateX(8deg)";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedIn.current) {
          animatedIn.current = true;
          animate(el, {
            opacity: [0, 1],
            translateY: [40, 0],
            rotateX: [8, 0],
            duration: 700,
            delay,
            ease: "spring(1, 70, 12, 0)",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    animate(el, {
      rotateY: x * 6,
      rotateX: -y * 6,
      scale: 1.02,
      duration: 200,
      ease: "outQuad",
    });
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    animate(el, {
      rotateY: 0, rotateX: 0, scale: 1,
      duration: 500, ease: "spring(1, 60, 10, 0)",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: "transform, opacity", transformStyle: "preserve-3d" }}
      className="bg-card border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors duration-300 flex flex-col"
    >
      <h3 className="font-heading font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">{description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tech.map((t) => (
          <span key={t} className="text-xs font-mono px-2 py-1 bg-secondary text-secondary-foreground rounded-sm">
            {t}
          </span>
        ))}
      </div>

      {/* Links */}
      {(github || demo) && (
        <div className="flex items-center gap-4 pt-3 border-t border-border/50">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <GitBranch size={13} />
              <span>Source</span>
            </a>
          )}
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink size={13} />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimatedProjectCard;