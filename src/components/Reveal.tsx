import { ReactNode, useEffect, useRef, useState } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms before this element fades in. */
  delay?: number;
  /** When true, skips the IntersectionObserver and reveals immediately. */
  immediate?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Tiny IntersectionObserver-based reveal. Adds the `is-in` class once the
 * element scrolls into view, which triggers the CSS transition defined in
 * `index.css` (`.reveal` → `.reveal.is-in`).
 *
 * Reveal is one-shot — once visible, it stays visible.
 */
const Reveal = ({
  children,
  delay = 0,
  immediate = false,
  className = "",
  as = "div",
}: RevealProps) => {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(immediate);

  useEffect(() => {
    if (immediate) {
      setShown(true);
      return;
    }
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
      { rootMargin: "-8% 0px -8% 0px", threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [immediate]);

  const Tag = as as "div";
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${shown ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
