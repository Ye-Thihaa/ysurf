import { useEffect, useRef } from "react";

interface YGlyphProps {
  size: number;
  variant: "front" | "back" | "mid";
  opacity?: number;
}

/**
 * PixelLogo-style YGlyph:
 * - dark face
 * - white-ish border
 * - subtle glint on front
 */
const PixelYGlyph = ({ size, variant, opacity = 1 }: YGlyphProps) => {
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

  const leftArm = [
    [leftTopX, topPad],
    [leftTopX + armW, topPad],
    [cx + stemW / 2, midY],
    [cx - stemW / 2, midY],
  ]
    .map((p) => p.join(","))
    .join(" ");

  const rightArm = [
    [rightTopX - armW, topPad],
    [rightTopX, topPad],
    [cx + stemW / 2, midY],
    [cx - stemW / 2, midY],
  ]
    .map((p) => p.join(","))
    .join(" ");

  const stem = [
    [cx - stemW / 2, midY],
    [cx + stemW / 2, midY],
    [cx + stemW / 2, botY],
    [cx - stemW / 2, botY],
  ]
    .map((p) => p.join(","))
    .join(" ");

  const isFront = variant === "front";
  const isBack = variant === "back";

  // PixelLogo colors
  const faceColor = isFront ? "#111111" : isBack ? "#080808" : "#0e0e0e";
  const edgeTopLeft = isFront ? "#222222" : "#050505";
  const edgeBotRight = isFront ? "#000000" : "#0a0a0a";

  const strokeColor = isFront
    ? "rgba(255,255,255,0.75)"
    : "rgba(255,255,255,0.2)";
  const strokeWidth = isFront ? 1.2 : 0.5;
  const glintColor = "rgba(255,255,255,0.15)";

  // IMPORTANT: Make gradient IDs unique per instance
  const gradId = `fy-pixel-g-${variant}-${size}`;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ opacity, display: "block" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={edgeTopLeft} />
          <stop offset="40%" stopColor={faceColor} />
          <stop offset="100%" stopColor={edgeBotRight} />
        </linearGradient>

        <linearGradient
          id={`${gradId}-glint`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {[leftArm, rightArm, stem].map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill={`url(#${gradId})`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      ))}

      {isFront && (
        <>
          {[leftArm, rightArm, stem].map((pts, i) => (
            <polygon key={i} points={pts} fill={`url(#${gradId}-glint)`} />
          ))}

          <line
            x1={leftTopX}
            y1={topPad}
            x2={leftTopX + armW}
            y2={topPad}
            stroke={glintColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1={rightTopX - armW}
            y1={topPad}
            x2={rightTopX}
            y2={topPad}
            stroke={glintColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────
// Shared scroll state — one listener drives ALL instances
// ─────────────────────────────────────────────────────────────

let sharedScrollProgress = 0;
function ensureScrollListener() {
  if (typeof window === "undefined") return;

  const onScroll = () => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    sharedScrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  };

  if (!(window as any).__fyScrollAttached) {
    window.addEventListener("scroll", onScroll, { passive: true });
    (window as any).__fyScrollAttached = true;
    onScroll(); // initialize
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
  const rafRef = useRef<number | null>(null);

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
  const sliceDepths = Array.from(
    { length: 6 },
    (_, i) => (i / 5) * s * 0.16 - depth
  );

  const scene = (
    <div
      style={{
        width: s,
        height: s,
        perspective: s * 4,
        perspectiveOrigin: "50% 40%",
      }}
    >
      <div
        ref={shapeRef}
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: "rotateX(12deg) rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateZ(${depth}px)`,
          }}
        >
          <PixelYGlyph size={s} variant="front" />
        </div>

        {/* Back */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `rotateY(180deg) translateZ(${depth}px)`,
          }}
        >
          <PixelYGlyph size={s} variant="back" />
        </div>

        {/* Depth slices */}
        {sliceDepths.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translateZ(${d}px)`,
            }}
          >
            <PixelYGlyph size={s} variant="mid" opacity={0.35} />
          </div>
        ))}
      </div>
    </div>
  );

  if (mode === "fixed") {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "1.75rem",
          right: "1.75rem",
          width: s,
          height: s,
          zIndex: 40,
          pointerEvents: "none",
          maskImage:
            "radial-gradient(ellipse 85% 85% at 50% 50%, black 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 85% at 50% 50%, black 55%, transparent 100%)",
        }}
      >
        {scene}
      </div>
    );
  }

  return (
    <div
      style={{
        width: s,
        height: s,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {scene}
    </div>
  );
};

export default FloatingYModel;