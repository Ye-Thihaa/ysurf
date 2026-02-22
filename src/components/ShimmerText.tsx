import { useEffect, useRef } from "react";

interface ShimmerTextProps {
  text: string;
  className?: string;
  tag?: "h2" | "h3" | "p" | "span";
}

const ShimmerText = ({ text, className = "", tag: Tag = "h2" }: ShimmerTextProps) => {
  const elRef = useRef<HTMLElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;

          // Trigger shimmer via CSS animation class
          el.classList.add("shimmer-active");
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .shimmer-text {
          position: relative;
          display: inline-block;
          background-clip: text;
          -webkit-background-clip: text;
        }
        .shimmer-text::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255, 255, 255, 0.55) 50%,
            transparent 80%
          );
          background-size: 200% 100%;
          background-position: -200% 0;
          pointer-events: none;
          border-radius: inherit;
        }
        .shimmer-text.shimmer-active::after {
          animation: shimmerSweep 1s ease-in-out 0.1s forwards;
        }
        @keyframes shimmerSweep {
          0%   { background-position: -200% 0; opacity: 0; }
          10%  { opacity: 1; }
          100% { background-position: 200% 0; opacity: 0; }
        }
      `}</style>
      {/* @ts-ignore — dynamic tag */}
      <Tag ref={elRef} className={`shimmer-text ${className}`}>
        {text}
      </Tag>
    </>
  );
};

export default ShimmerText;