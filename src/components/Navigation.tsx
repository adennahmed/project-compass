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

const Navigation = ({ onContactClick }: NavigationProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) {
      lenis.scrollTo(el, { offset: -40, duration: 1.4 });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const goTop = (e: React.MouseEvent) => {
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300"
      style={{
        backgroundColor: scrolled ? "rgb(var(--paper) / 0.86)" : "transparent",
        backdropFilter: scrolled ? "saturate(140%) blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgb(var(--hairline) / 0.10)" : "1px solid transparent",
      }}
    >
      <div className="container-wide flex h-16 items-center justify-between md:h-20">
        <a

          href="#top"
          onClick={goTop}
          className="flex items-center text-ink transition-colors hover:text-signal"
          aria-label="Kozai — home"
        >
          <Logo size={22} />
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleAnchor(e, item.href)}
              className="nav-item text-[13px] font-medium tracking-tight text-ink/80 hover:text-ink"
            >
              <span className="nav-item__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="nav-item__label">{item.label}</span>
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={onContactClick}
          className="btn-fill border border-ink/20 bg-transparent px-4 py-2 text-[13px] font-medium text-ink"
        >
          <span className="inline-flex items-center gap-2">
            Start a project <span aria-hidden>↘</span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navigation;
