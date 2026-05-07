import { ReactNode, useEffect, useRef, useState } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  immediate?: boolean;
  /** When true (default), the reveal re-plays each time the element re-enters the viewport. */
  replay?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const Reveal = ({
  children,
  delay = 0,
  immediate = false,
  replay = true,
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
          } else if (replay) {
            setShown(false);
          }
        }
      },
      { rootMargin: "-8% 0px -8% 0px", threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [immediate, replay]);

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
