import { useEffect, useRef } from "react";

interface YGlyphProps {
  size: number;
  variant: "front" | "back" | "mid";
  opacity?: number;
}

const YGlyph = ({ size, variant, opacity = 1 }: YGlyphProps) => {
  const w = size;
  const h = size;
  const cx = w / 2;
  const armW = w * 0.14;
  const stemW = w * 0.16;
  const topPad = h * 0.08;
  const midY = h * 0.52;
  const botY = h * 0.92;
  const leftTopX = w * 0.08;
  const rightTopX = w * 0.92;

  const leftArm = [[leftTopX,topPad],[leftTopX+armW,topPad],[cx+stemW/2,midY],[cx-stemW/2,midY]]
    .map(p=>p.join(",")).join(" ");
  const rightArm = [[rightTopX-armW,topPad],[rightTopX,topPad],[cx+stemW/2,midY],[cx-stemW/2,midY]]
    .map(p=>p.join(",")).join(" ");
  const stem = [[cx-stemW/2,midY],[cx+stemW/2,midY],[cx+stemW/2,botY],[cx-stemW/2,botY]]
    .map(p=>p.join(",")).join(" ");

  const isFront = variant === "front";
  const isBack  = variant === "back";
  const faceColor   = isFront ? "#1a1a1a" : isBack ? "#0a0a0a" : "#111111";
  const edgeTopLeft = isFront ? "#3a3a3a" : "#050505";
  const edgeBotRight= isFront ? "#000000" : "#1f1f1f";
  const strokeColor = isFront ? "#2a2a2a" : "#181818";
  const glintColor  = isFront ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)";
  const gradId = `fy-g-${variant}-${size}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ opacity, display:"block" }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={edgeTopLeft}  />
          <stop offset="40%"  stopColor={faceColor}    />
          <stop offset="100%" stopColor={edgeBotRight} />
        </linearGradient>
        <linearGradient id={`${gradId}-glint`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
        </linearGradient>
        <filter id={`${gradId}-shadow`}>
          <feDropShadow dx="0" dy="2" stdDeviation={size*0.03} floodColor="#000" floodOpacity="0.9"/>
        </filter>
      </defs>
      {[leftArm, rightArm, stem].map((pts, i) => (
        <polygon key={i} points={pts} fill={`url(#${gradId})`} stroke={strokeColor}
          strokeWidth={isFront ? 1 : 0.4} strokeLinejoin="round"
          filter={isFront ? `url(#${gradId}-shadow)` : undefined} />
      ))}
      {isFront && (
        <>
          {[leftArm, rightArm, stem].map((pts, i) => (
            <polygon key={i} points={pts} fill={`url(#${gradId}-glint)`} />
          ))}
          <line x1={leftTopX}     y1={topPad} x2={leftTopX+armW}   y2={topPad} stroke={glintColor} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1={rightTopX-armW} y1={topPad} x2={rightTopX}     y2={topPad} stroke={glintColor} strokeWidth="1.5" strokeLinecap="round"/>
        </>
      )}
    </svg>
  );
};

// Shared scroll state — one listener drives ALL instances on the page
let sharedScrollProgress = 0;
const scrollSubscribers = new Set<(p: number) => void>();

function ensureScrollListener() {
  if (typeof window === "undefined") return;
  const onScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    sharedScrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    scrollSubscribers.forEach(fn => fn(sharedScrollProgress));
  };
  // Only attach once globally
  if (!(window as any).__fyScrollAttached) {
    window.addEventListener("scroll", onScroll, { passive: true });
    (window as any).__fyScrollAttached = true;
  }
}

interface FloatingYModelProps {
  size?: number;
  /**
   * "fixed"  — fixed bottom-right corner, scroll-driven (Index page)
   * "inline" — sits in normal flow, scroll-driven (Navbar / Footer)
   */
  mode?: "fixed" | "inline";
}

const FloatingYModel = ({ size = 96, mode = "fixed" }: FloatingYModelProps) => {
  const shapeRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    ensureScrollListener();

    const tick = () => {
      // Lerp toward shared scroll progress
      currentRef.current += (sharedScrollProgress - currentRef.current) * 0.06;
      const deg = currentRef.current * 360;
      if (shapeRef.current) {
        shapeRef.current.style.transform = `rotateX(12deg) rotateY(${deg}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const s = size;
  const depth = s * 0.08;
  const sliceDepths = Array.from({ length: 6 }, (_, i) => (i / 5) * s * 0.16 - depth);

  const scene = (
    <div style={{ width: s, height: s, perspective: s * 4, perspectiveOrigin: "50% 40%" }}>
      <div
        ref={shapeRef}
        style={{
          width: "100%", height: "100%",
          transformStyle: "preserve-3d",
          transform: "rotateX(12deg) rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", transform:`translateZ(${depth}px)` }}>
          <YGlyph size={s} variant="front" />
        </div>
        {/* Back */}
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", transform:`rotateY(180deg) translateZ(${depth}px)` }}>
          <YGlyph size={s} variant="back" />
        </div>
        {/* Depth slices */}
        {sliceDepths.map((d, i) => (
          <div key={i} style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", transform:`translateZ(${d}px)` }}>
            <YGlyph size={s} variant="mid" opacity={0.35} />
          </div>
        ))}
      </div>
    </div>
  );

  // ── Fixed corner (Index page) ────────────────────────────────────────────
  if (mode === "fixed") {
    return (
      <div style={{
        position: "fixed", bottom: "1.75rem", right: "1.75rem",
        width: s, height: s, zIndex: 40, pointerEvents: "none",
        maskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 55%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 55%, transparent 100%)",
      }}>
        {scene}
      </div>
    );
  }

  // ── Inline (Navbar / Footer) ─────────────────────────────────────────────
  return (
    <div style={{ width: s, height: s, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {scene}
    </div>
  );
};

export default FloatingYModel;