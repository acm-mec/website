import { useState, useEffect, useRef } from "react";

/**
 * TypingHeadline — types out `text` character by character on mount.
 * Respects prefers-reduced-motion: renders final text immediately if set.
 *
 * Props:
 *   text: string — the text to type out
 *   speed: number — ms per character (default 45)
 *   className: string — additional classes
 */
export default function TypingHeadline({ text, speed = 45, className = "" }) {
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const [displayed, setDisplayed] = useState(prefersReduced ? text : "");
  const indexRef = useRef(prefersReduced ? text.length : 0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (prefersReduced) return;

    timerRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        clearInterval(timerRef.current);
      }
    }, speed);

    return () => clearInterval(timerRef.current);
  }, [text, speed, prefersReduced]);

  return (
    <span className={className} aria-label={text}>
      {displayed}
      {!prefersReduced && displayed.length < text.length && (
        <span
          className="inline-block w-0.5 h-[1em] bg-indigo ml-0.5 align-middle animate-pulse"
          aria-hidden="true"
        />
      )}
    </span>
  );
}
