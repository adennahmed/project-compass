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
 *   1. integrated — resting state at the top of the hero.
 *   2. pill — appears immediately after the first scroll movement.
 *   3. hidden — only after the pill has had room to settle, then slides away on down-scroll.
 *
 * The shell stays full-width in CSS so integrated → pill is a real morph,
 * not a layout jump between fixed positioning models.
 */
const Navigation = ({ onContactClick }: NavigationProps) => {
  const [mode, setMode] = useState<NavMode>("integrated");

  useEffect(() => {
    const TOP_LOCK = 6;
    const HIDE_AFTER = 420;
    let prevY = window.scrollY;
    let lastMode: NavMode = prevY <= TOP_LOCK ? "integrated" : "pill";
    let pillSettledAt = lastMode === "pill" ? performance.now() : 0;
    let rafId: number;

    const set = (m: NavMode) => {
      if (m !== lastMode) {
        lastMode = m;
        if (m === "pill") pillSettledAt = performance.now();
        setMode(m);
      }
    };

    const tick = () => {
      const y = window.scrollY;
      const dy = y - prevY;

      if (y <= TOP_LOCK) {
        set("integrated");
      } else if (y < HIDE_AFTER || lastMode === "integrated") {
        // First scroll movement always morphs the top bar into the floating pill.
        set("pill");
      } else if (dy > 0.8 && performance.now() - pillSettledAt > 900) {
        set("hidden");
      } else if (dy < -0.8) {
        set("pill");
      }

      prevY = y;

      rafId = requestAnimationFrame(tick);
    };

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
