import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Lenis from "lenis";
import Logo from "./Logo";

interface NavigationProps {
  onContactClick: () => void;
}

const NAV_ITEMS = [
  { label: "Services",  href: "#services" },
  { label: "Approach",  href: "#approach" },
  { label: "Work",      href: "#work" },
  { label: "Studio",    href: "#studio" },
  { label: "Community", href: "/community", external: true },
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
 *
 * Mobile (< md): desktop nav items hidden via Tailwind; replaced with a
 * small "Menu" trigger that opens a full-bleed overlay. Desktop layout
 * is untouched.
 */
const Navigation = ({ onContactClick }: NavigationProps) => {
  const [mode, setMode] = useState<NavMode>("integrated");
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

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

  const handleMobileAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
    // Defer scrollTo until after the menu animates out so the scroll position is correct.
    window.setTimeout(() => handleAnchor(e, href), 50);
    e.preventDefault();
  };

  return (
    <>
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
          <span className="nav-pill__divider hidden md:inline-block" aria-hidden />

          <nav className="hidden items-center gap-5 md:flex lg:gap-6">
            {NAV_ITEMS.map((item, i) => {
              const numStyle = {
                color:
                  mode === "integrated"
                    ? "rgb(var(--mute) / 0.7)"
                    : "rgb(var(--paper) / 0.45)",
              };
              const klass = `nav-item text-[12px] font-medium tracking-tight ${
                mode === "integrated"
                  ? "text-ink/85 hover:text-ink"
                  : "text-paper/85 hover:text-paper"
              }`;
              if ((item as { external?: boolean }).external) {
                return (
                  <Link key={item.href} to={item.href} className={klass}>
                    <span className="nav-item__num" style={numStyle}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="nav-item__label">{item.label}</span>
                  </Link>
                );
              }
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleAnchor(e, item.href)}
                  className={klass}
                >
                  <span className="nav-item__num" style={numStyle}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="nav-item__label">{item.label}</span>
                </a>
              );
            })}
          </nav>

          <span className="nav-pill__divider hidden md:inline-block" aria-hidden />

          {/* Desktop CTA */}
          <button
            type="button"
            onClick={onContactClick}
            className="nav-pill__cta hidden md:inline-flex"
          >
            Start a project ↘
          </button>

          {/* Mobile menu trigger — only visible < md */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className={`ml-auto inline-flex items-center gap-2 md:hidden font-mono text-[11px] uppercase tracking-[0.22em] transition-colors ${
              mode === "integrated" ? "text-ink/80 hover:text-ink" : "text-paper/80 hover:text-paper"
            }`}
          >
            <span
              aria-hidden
              className="flex flex-col gap-[4px]"
            >
              <span
                className="block h-px w-[18px]"
                style={{ background: mode === "integrated" ? "#0F0F12" : "#F1EEE5" }}
              />
              <span
                className="block h-px w-[18px]"
                style={{ background: mode === "integrated" ? "#0F0F12" : "#F1EEE5" }}
              />
            </span>
            Menu
          </button>
        </div>
      </header>

      {/* Mobile menu overlay — only mounted when open, full-bleed cream panel */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[1500] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div
            className="absolute inset-0 bg-paper text-ink"
            style={{
              animation: "kz-menu-in 0.32s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* Top bar inside the overlay */}
            <div className="flex items-center justify-between px-6 pt-6">
              <Logo size={22} variant="black" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/80 hover:text-ink"
              >
                Close
                <span aria-hidden className="relative inline-block h-3 w-3">
                  <span className="absolute inset-0 rotate-45 block h-px w-3 bg-ink translate-y-[5px]" />
                  <span className="absolute inset-0 -rotate-45 block h-px w-3 bg-ink translate-y-[5px]" />
                </span>
              </button>
            </div>

            {/* Section label */}
            <div className="mt-12 px-6 font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55">
              [ ✦ — Index ]
            </div>

            {/* Nav items */}
            <nav className="mt-4 flex flex-col px-6">
              {NAV_ITEMS.map((item, i) => {
                const external = (item as { external?: boolean }).external;
                const numLabel = String(i + 1).padStart(2, "0");
                const baseClass =
                  "flex items-baseline justify-between border-b border-ink/10 py-5 transition-colors hover:text-signal";
                const labelInner = (
                  <>
                    <span
                      style={{
                        fontSize: "clamp(1.75rem, 7vw, 2.3rem)",
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.05,
                      }}
                    >
                      {item.label}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/45">
                      {numLabel}
                    </span>
                  </>
                );
                if (external) {
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={baseClass}
                    >
                      {labelInner}
                    </Link>
                  );
                }
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleMobileAnchor(e, item.href)}
                    className={baseClass}
                  >
                    {labelInner}
                  </a>
                );
              })}
            </nav>

            {/* Bottom CTA */}
            <div className="mt-10 px-6">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  // Small delay so the overlay starts dismissing before the drawer mounts.
                  window.setTimeout(() => onContactClick(), 150);
                }}
                className="inline-flex w-full items-center justify-between border border-ink bg-ink px-5 py-4 text-paper transition-colors hover:bg-signal hover:border-signal"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
                  Start a project
                </span>
                <span aria-hidden>↘</span>
              </button>
            </div>

            {/* Footer marker */}
            <div className="absolute inset-x-0 bottom-6 px-6 font-mono text-[10px] uppercase tracking-[0.28em] text-ink/35">
              Kozai · Toronto, CA
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
