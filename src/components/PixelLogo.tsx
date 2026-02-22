interface PixelLogoProps {
  size?: number;
}

const YGlyph = ({
  size,
  variant,
  opacity = 1,
}: {
  size: number;
  variant: "front" | "back" | "mid";
  opacity?: number;
}) => {
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

  const faceColor = isFront ? "#1a1a1a" : isBack ? "#0a0a0a" : "#111111";
  const edgeTopLeft = isFront ? "#3a3a3a" : "#050505";
  const edgeBotRight = isFront ? "#000000" : "#1f1f1f";
  const strokeColor = isFront ? "#2a2a2a" : "#181818";
  const glintColor = isFront
    ? "rgba(255,255,255,0.12)"
    : "rgba(255,255,255,0.03)";

  const gradId = `g-${variant}`;

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
          id={`glint-${variant}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id={`shadow-${variant}`}>
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation={size * 0.03}
            floodColor="#000000"
            floodOpacity="0.9"
          />
        </filter>
      </defs>

      <polygon
        points={leftArm}
        fill={`url(#${gradId})`}
        stroke={strokeColor}
        strokeWidth={isFront ? 1 : 0.4}
        strokeLinejoin="round"
        filter={isFront ? `url(#shadow-${variant})` : undefined}
      />
      <polygon
        points={rightArm}
        fill={`url(#${gradId})`}
        stroke={strokeColor}
        strokeWidth={isFront ? 1 : 0.4}
        strokeLinejoin="round"
        filter={isFront ? `url(#shadow-${variant})` : undefined}
      />
      <polygon
        points={stem}
        fill={`url(#${gradId})`}
        stroke={strokeColor}
        strokeWidth={isFront ? 1 : 0.4}
        strokeLinejoin="round"
        filter={isFront ? `url(#shadow-${variant})` : undefined}
      />

      {isFront && (
        <>
          <polygon points={leftArm} fill={`url(#glint-${variant})`} />
          <polygon points={rightArm} fill={`url(#glint-${variant})`} />
          <polygon points={stem} fill={`url(#glint-${variant})`} />
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

const PixelLogo = ({ size = 120 }: PixelLogoProps) => {
  const s = size;

  return (
    <div
      style={{
        width: s,
        height: s,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        @keyframes rotateY3D {
          0%   { transform: rotateX(12deg) rotateY(0deg); }
          100% { transform: rotateX(12deg) rotateY(360deg); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.8; }
        }
        .logo-scene-b {
          width: ${s}px;
          height: ${s}px;
          perspective: ${s * 4}px;
          perspective-origin: 50% 40%;
        }
        .logo-shape-b {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: rotateY3D 4s linear infinite;
        }
        .logo-face-b {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-face-b svg {
          animation: shimmer 4s ease-in-out infinite;
        }
        .logo-face-b.back-b svg {
          animation: shimmer 4s ease-in-out infinite reverse;
        }
      `}</style>

      <div className="logo-scene-b">
        <div className="logo-shape-b">
          <div
            className="logo-face-b"
            style={{ transform: `translateZ(${s * 0.08}px)` }}
          >
            <YGlyph size={s} variant="front" />
          </div>

          <div
            className="logo-face-b back-b"
            style={{
              transform: `rotateY(180deg) translateZ(${s * 0.08}px)`,
            }}
          >
            <YGlyph size={s} variant="back" />
          </div>

          {Array.from({ length: 6 }).map((_, i) => {
            const depth = (i / 5) * s * 0.16 - s * 0.08;
            return (
              <div
                key={i}
                className="logo-face-b"
                style={{ transform: `translateZ(${depth}px)` }}
              >
                <YGlyph size={s} variant="mid" opacity={0.35} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PixelLogo;