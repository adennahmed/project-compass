import { ElementType, useCallback, useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_/[]=+*#%·";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** "view" decodes when scrolled into view, "hover" on mouseenter, "mount" once. */
  trigger?: "view" | "hover" | "mount";
  /** Total decode duration in ms. */
  duration?: number;
  /** For trigger="view": re-decode each time it re-enters the viewport. */
  replay?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * ScrambleText — a terminal-style "decode" effect. Characters resolve from
 * random glyphs to the real text left-to-right over `duration`. Spaces stay
 * fixed so word shapes hold. Honours prefers-reduced-motion.
 */
const ScrambleText = ({
  text,
  className = "",
  trigger = "view",
  duration = 720,
  replay = true,
  as = "span",
}: ScrambleTextProps) => {
  const ref = useRef<HTMLElement>(null);
  const rafRef = useRef(0);
  const [display, setDisplay] = useState(text);

  const run = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const len = text.length;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const lock = Math.floor(p * len);
      let out = "";
      for (let i = 0; i < len; i++) {
        const c = text[i];
        out += c === " " || i < lock ? c : CHARS[(Math.random() * CHARS.length) | 0];
      }
      setDisplay(out);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    if (trigger === "mount") {
      run();
      return () => cancelAnimationFrame(rafRef.current);
    }
    if (trigger === "view") {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              run();
              if (!replay) obs.disconnect();
            }
          }
        },
        { threshold: 0.5 },
      );
      obs.observe(el);
      return () => {
        obs.disconnect();
        cancelAnimationFrame(rafRef.current);
      };
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, replay, run]);

  const Tag: ElementType = as;
  const hoverProps = trigger === "hover" ? { onMouseEnter: run } : {};

  return (
    <Tag ref={ref} className={className} {...hoverProps}>
      {display}
    </Tag>
  );
};

export default ScrambleText;
