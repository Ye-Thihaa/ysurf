import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Pixel "404" rendered as block squares
const PixelDisplay = () => {
  // Each digit: 5 rows x 3 cols grid (true = filled)
  const digits: Record<string, boolean[][]> = {
    "4": [
      [true, false, true],
      [true, false, true],
      [true, true, true],
      [false, false, true],
      [false, false, true],
    ],
    "0": [
      [true, true, true],
      [true, false, true],
      [true, false, true],
      [true, false, true],
      [true, true, true],
    ],
  };

  const sequence = ["4", "0", "4"];
  const blockSize = 14;
  const gap = 3;
  const digitGap = 10;

  return (
    <div style={{ display: "flex", gap: `${digitGap}px`, alignItems: "center" }}>
      {sequence.map((char, di) => (
        <div key={di} style={{ display: "flex", flexDirection: "column", gap: `${gap}px` }}>
          {digits[char].map((row, ri) => (
            <div key={ri} style={{ display: "flex", gap: `${gap}px` }}>
              {row.map((filled, ci) => (
                <div
                  key={ci}
                  style={{
                    width: blockSize,
                    height: blockSize,
                    backgroundColor: filled ? "#0D0D0D" : "transparent",
                    borderRadius: 1,
                    opacity: filled ? 1 : 0,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const NotFound = () => {
  const location = useLocation();
  const [glitch, setGlitch] = useState(false);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Glitch effect on interval
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

        .nf-root {
          min-height: 100vh;
          background-color: #EBEBEB;
          background-image:
            linear-gradient(45deg, #d4d4d4 1px, transparent 1px),
            linear-gradient(-45deg, #d4d4d4 1px, transparent 1px);
          background-size: 44px 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .nf-card {
          background: #ffffff;
          border: 1.5px solid #D0D0D0;
          border-radius: 4px;
          padding: 56px 64px;
          max-width: 560px;
          width: 90%;
          position: relative;
          box-shadow: 6px 6px 0px #D0D0D0;
          transition: transform 0.08s ease;
        }

        .nf-card.glitch {
          transform: translate(2px, -1px);
          filter: hue-rotate(10deg);
        }

        .nf-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.25em;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nf-label::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #0D0D0D;
          border-radius: 50%;
        }

        .nf-pixel-wrap {
          margin-bottom: 32px;
        }

        .nf-headline {
          font-family: 'DM Sans', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: #0D0D0D;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
        }

        .nf-sub {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #888;
          margin-bottom: 6px;
          min-height: 18px;
        }

        .nf-path {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #bbb;
          background: #F5F5F5;
          border: 1px solid #E0E0E0;
          border-radius: 3px;
          padding: 6px 12px;
          display: inline-block;
          margin-bottom: 32px;
          word-break: break-all;
        }

        .nf-divider {
          border: none;
          border-top: 1px solid #E8E8E8;
          margin-bottom: 28px;
        }

        .nf-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .nf-btn-primary {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          padding: 10px 22px;
          background: #0D0D0D;
          color: #fff;
          border: 1.5px solid #0D0D0D;
          border-radius: 3px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: background 0.15s, color 0.15s, transform 0.1s;
          letter-spacing: 0.04em;
        }

        .nf-btn-primary:hover {
          background: #fff;
          color: #0D0D0D;
          transform: translateY(-1px);
        }

        .nf-btn-ghost {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          padding: 10px 22px;
          background: transparent;
          color: #888;
          border: 1.5px solid #D0D0D0;
          border-radius: 3px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: border-color 0.15s, color 0.15s, transform 0.1s;
          letter-spacing: 0.04em;
        }

        .nf-btn-ghost:hover {
          border-color: #0D0D0D;
          color: #0D0D0D;
          transform: translateY(-1px);
        }

        /* Corner pixel decorations */
        .nf-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #0D0D0D;
        }
        .nf-corner.tl { top: -1px; left: -1px; }
        .nf-corner.tr { top: -1px; right: -1px; }
        .nf-corner.bl { bottom: -1px; left: -1px; }
        .nf-corner.br { bottom: -1px; right: -1px; }

        /* Floating pixel blobs in bg */
        .nf-float {
          position: absolute;
          background: #D8D8D8;
          animation: floatUp 8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes floatUp {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-18px) rotate(6deg); opacity: 1; }
        }

        .nf-card {
          animation: slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="nf-root">
        {/* Floating pixel decorations */}
        {[
          { w: 10, h: 10, top: "12%", left: "8%", delay: "0s" },
          { w: 6, h: 6, top: "70%", left: "15%", delay: "1.2s" },
          { w: 14, h: 14, top: "25%", right: "10%", delay: "0.6s" },
          { w: 8, h: 8, top: "80%", right: "18%", delay: "2s" },
          { w: 5, h: 5, top: "50%", left: "5%", delay: "1.8s" },
          { w: 12, h: 12, top: "40%", right: "5%", delay: "0.3s" },
        ].map((b, i) => (
          <div
            key={i}
            className="nf-float"
            style={{
              width: b.w,
              height: b.h,
              top: b.top,
              left: (b as any).left,
              right: (b as any).right,
              animationDelay: b.delay,
              borderRadius: 1,
            }}
          />
        ))}

        <div className={`nf-card ${glitch ? "glitch" : ""}`}>
          {/* Corner pixel accents */}
          <div className="nf-corner tl" />
          <div className="nf-corner tr" />
          <div className="nf-corner bl" />
          <div className="nf-corner br" />

          <div className="nf-label">System Error · Route Not Found</div>

          <div className="nf-pixel-wrap">
            <PixelDisplay />
          </div>

          <h1 className="nf-headline">Page doesn't exist{dots}</h1>
          <p className="nf-sub">Attempted route:</p>
          <div className="nf-path">{location.pathname}</div>

          <hr className="nf-divider" />

          <div className="nf-actions">
            <Link to="/" className="nf-btn-primary">
              ← Return Home
            </Link>
            <Link to="/appointment" className="nf-btn-ghost">
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;