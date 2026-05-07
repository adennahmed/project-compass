import { useEffect, useRef, useState } from "react";

interface CharRevealProps {
  children: string;
  stagger?: number;
  delay?: number;
  className?: string;
  splitBy?: "word" | "char";
  immediate?: boolean;
  /** Re-plays each time the element re-enters the viewport. Defaults true. */
  replay?: boolean;
}

const CharReveal = ({
  children,
  stagger = 26,
  delay = 0,
  className = "",
  splitBy = "char",
  immediate = false,
  replay = true,
}: CharRevealProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<"in" | "out">(immediate ? "in" : "out");

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setState("in");
          else if (replay) setState("out");
        }
      },
      { threshold: 0.18 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [immediate, replay]);

  const units =
    splitBy === "word" ? children.split(/(\s+)/) : Array.from(children);

  return (
    <span ref={ref} className={className}>
      {units.map((u, i) => {
        if (u === " " || /^\s+$/.test(u)) {
          return <span key={i}>&nbsp;</span>;
        }
        return (
          <span
            key={i}
            className={`char-reveal ${state === "in" ? "is-in" : "is-out"}`}
          >
            <span style={{ transitionDelay: `${delay + i * stagger}ms` }}>{u}</span>
          </span>
        );
      })}
    </span>
  );
};

export default CharReveal;
