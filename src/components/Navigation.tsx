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

type NavMode = "integrated" | "pill" | "hidden";

/**
 * Three-mode navigation:
 *   1. integrated — at the top of the hero, full-width, paper background,
 *      ink text. Visually part of the page header.
 *   2. pill — once scrolled past the hero, a centred dark pill. Appears
 *      when the user scrolls UP (intent to navigate).
 *   3. hidden — past hero, scrolling DOWN with intent. Slid off-screen.
 *
 * Mode resolution lives entirely in this component; the visual chrome
 * is owned by the .nav-shell.mode-* classes in index.css.
 */
const Navigation = ({ onContactClick }: NavigationProps) => {
  const [mode, setMode] = useState<NavMode>("integrated");
  const lastY = useRef(0);
  const accumDown = useRef(0);
  const accumUp = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      lastY.current = y;

      // Top of page → integrated
      if (y < 80) {
        setMode("integrated");
        accumDown.current = 0;
        accumUp.current = 0;
        return;
      }

      if (dy > 0) {
        accumDown.current += dy;
        accumUp.current = 0;
        if (accumDown.current > 40) setMode("hidden");
      } else if (dy < 0) {
        accumUp.current += Math.abs(dy);
        accumDown.current = 0;
        if (accumUp.current > 12) setMode("pill");
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
      className={`nav-shell mode-${mode}`}
      aria-hidden={mode === "hidden"}
    >
      <div className="nav-pill">
        <a
          href="#top"
          onClick={goTop}
          className={`flex items-center pr-2 transition-colors ${
            mode === "integrated" ? "text-ink hover:text-signal" : "text-paper hover:text-signal"
          }`}
          aria-label="Kozai — home"
        >
          <Logo size={mode === "integrated" ? 22 : 16} />
        </a>
        <span className="nav-pill__divider" aria-hidden />

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleAnchor(e, item.href)}
              className={`nav-item text-[12px] font-medium tracking-tight ${
                mode === "integrated"
                  ? "text-ink/85 hover:text-ink"
                  : "text-paper/85 hover:text-paper"
              }`}
            >
              <span
                className="nav-item__num"
                style={{
                  color:
                    mode === "integrated"
                      ? "rgb(var(--mute) / 0.7)"
                      : "rgb(var(--paper) / 0.45)",
                }}
              >
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
          className="nav-pill__cta"
        >
          Start a project ↘
        </button>
      </div>
    </header>
  );
};

export default Navigation;
