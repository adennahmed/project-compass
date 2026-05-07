import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import Logo from "./Logo";

interface NavigationProps {
  onContactClick: () => void;
}

const NAV_ITEMS = [
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#studio" },
];

/**
 * Floating nav pill.
 *
 * Behaviour:
 *  · Hidden by default (translateY -130%, opacity 0).
 *  · Appears as a rounded ink pill when:
 *      a) the user is at the very top of the page, OR
 *      b) the user scrolls UPWARD by any amount (intent to navigate).
 *  · Hides again when the user scrolls down with intent.
 */
const Navigation = ({ onContactClick }: NavigationProps) => {
  const [visible, setVisible] = useState(false);
  const lastY = useRef(0);
  const accumDown = useRef(0);
  const accumUp = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      lastY.current = y;

      // At the very top — always visible.
      if (y < 80) {
        setVisible(true);
        accumDown.current = 0;
        accumUp.current = 0;
        return;
      }

      if (dy > 0) {
        // Scrolling down — accumulate, hide once threshold reached.
        accumDown.current += dy;
        accumUp.current = 0;
        if (accumDown.current > 30) setVisible(false);
      } else if (dy < 0) {
        // Scrolling up — accumulate, show once threshold reached.
        accumUp.current += Math.abs(dy);
        accumDown.current = 0;
        if (accumUp.current > 12) setVisible(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -40, duration: 1.2 });
    else {
      const top = el.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const goTop = (e: React.MouseEvent) => {
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`nav-shell ${visible ? "is-visible" : ""}`}
      aria-hidden={!visible}
    >
      <div className="nav-pill">
        <a
          href="#top"
          onClick={goTop}
          className="flex items-center pr-2 text-paper hover:text-signal"
          aria-label="Kozai — home"
        >
          <Logo size={16} />
        </a>
        <span className="nav-pill__divider" aria-hidden />

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleAnchor(e, item.href)}
              className="nav-item text-[12px] font-medium tracking-tight text-paper/85 hover:text-paper"
            >
              <span className="nav-item__num" style={{ color: "rgb(var(--paper) / 0.45)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="nav-item__label">{item.label}</span>
            </a>
          ))}
        </nav>

        <span className="nav-pill__divider" aria-hidden />
        <button
          type="button"
          onClick={onContactClick}
          className="rounded-full bg-paper px-4 py-1.5 text-[12px] font-medium text-ink transition-colors hover:bg-signal hover:text-paper"
        >
          Start a project ↘
        </button>
      </div>
    </header>
  );
};

export default Navigation;
