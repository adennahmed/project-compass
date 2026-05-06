import { useEffect, useRef, useState } from "react";

interface CharRevealProps {
  children: string;
  /** Per-char stagger in ms */
  stagger?: number;
  /** Initial delay in ms */
  delay?: number;
  className?: string;
  splitBy?: "word" | "char";
  immediate?: boolean;
}

/**
 * Word/character reveal — wraps each unit in an `overflow:hidden` mask and
 * translates the inner span up from below the mask. Triggered by
 * IntersectionObserver, latched once.
 */
const CharReveal = ({
  children,
  stagger = 26,
  delay = 0,
  className = "",
  splitBy = "char",
  immediate = false,
}: CharRevealProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [immediate]);

  const units =
    splitBy === "word" ? children.split(/(\s+)/) : Array.from(children);

  return (
    <span ref={ref} className={className}>
      {units.map((u, i) => {
        if (u === " " || /^\s+$/.test(u)) {
          return <span key={i}>&nbsp;</span>;
        }
        return (
          <span key={i} className={`char-reveal ${shown ? "is-in" : ""}`}>
            <span style={{ transitionDelay: `${delay + i * stagger}ms` }}>{u}</span>
          </span>
        );
      })}
    </span>
  );
};

export default CharReveal;
