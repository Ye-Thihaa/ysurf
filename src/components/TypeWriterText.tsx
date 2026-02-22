import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  text: string;
  delay?: number; // ms before typing starts
  speed?: number; // ms per character
  className?: string;
}

const TypewriterText = ({
  text,
  delay = 800,
  speed = 45,
  className = "",
}: TypewriterTextProps) => {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);
  const startedRef = useRef(false);

  useEffect(() => {
    // Wait for initial delay then type
    const startTimer = setTimeout(() => {
      startedRef.current = true;
      const interval = setInterval(() => {
        if (indexRef.current < text.length) {
          setDisplayed(text.slice(0, indexRef.current + 1));
          indexRef.current += 1;
        } else {
          clearInterval(interval);
          // Blink cursor for 1.5s then hide it
          setTimeout(() => setShowCursor(false), 1500);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, delay, speed]);

  // Cursor blink
  useEffect(() => {
    if (!showCursor) return;
    const blink = setInterval(() => {
      setShowCursor((v) => !v);
    }, 530);
    // Stop blinking after typing completes (handled above)
    return () => clearInterval(blink);
  }, []);

  return (
    <span className={className}>
      {displayed}
      <span
        style={{
          opacity: showCursor ? 1 : 0,
          transition: "opacity 0.1s",
          marginLeft: "1px",
          fontWeight: 300,
        }}
      >
        |
      </span>
    </span>
  );
};

export default TypewriterText;