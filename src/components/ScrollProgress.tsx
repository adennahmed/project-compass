import { useEffect, useState } from "react";
import Lenis from "lenis";

interface ScrollProgressProps {
  /** Section IDs in scroll order. */
  sections: string[];
}

/**
 * Right-side scroll progress dot rail. Each dot maps to a section. The
 * active dot is the section currently nearest the viewport centre. Click
 * a dot to scroll to that section (uses Lenis if available).
 */
const ScrollProgress = ({ sections }: ScrollProgressProps) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.4;
      let nearest = 0;
      let nearestDist = Infinity;
      sections.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const d = Math.abs(top - mid);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = i;
        }
      });
      setActive(nearest);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -40, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="kz-progress-rail" aria-label="Section progress">
      {sections.map((id, i) => (
        <button
          key={id}
          type="button"
          onClick={() => jump(id)}
          className={`kz-progress-rail__dot ${active === i ? "is-active" : ""}`}
          aria-label={`Section ${i + 1}: ${id}`}
        />
      ))}
    </nav>
  );
};

export default ScrollProgress;
