import { useEffect, useState } from "react";
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

  useEffect(() => {
    // rAF-based detection instead of scroll events.
    // Lenis animates scrollY per-frame and may not reliably fire window
    // "scroll" events, or fires them with tiny deltas that confuse
    // accumulator logic. Polling scrollY on every animation frame is
    // simpler, always accurate, and works regardless of scroll library.
    let prevY = window.scrollY;
    let accumDown = 0;
    let lastMode: NavMode = window.scrollY < 80 ? "integrated" : "pill";
    let rafId: number;

    const set = (m: NavMode) => {
      if (m !== lastMode) {
        lastMode = m;
        setMode(m);
      }
    };

    const tick = () => {
      const y = window.scrollY;
      const dy = y - prevY;
      prevY = y;

      if (y < 80) {
        // Hero zone — integrated header flush with page top.
        set("integrated");
        accumDown = 0;
      } else if (dy > 0) {
        // Actively scrolling down — accumulate and hide after 80 px.
        accumDown += dy;
        if (accumDown > 80) set("hidden");
      } else {
        // Stopped OR scrolling up — always show the pill immediately.
        // This fires when a snap settles (dy === 0 for N frames) so the
        // nav reappears the moment the page comes to rest between sections.
        accumDown = 0;
        set("pill");
      }

      rafId = requestAnimationFrame(tick);
    };

    // Initialise immediately so the correct mode shows on mount.
    set(lastMode);
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
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
          <Logo size={mode === "integrated" ? 22 : 16} variant={mode === "integrated" ? "black" : "white"} />
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
