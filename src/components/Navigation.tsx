import { useEffect, useState } from "react";
import { Logo } from "./Logo";

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
    const top = el.getBoundingClientRect().top + window.scrollY - 32;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300"
      style={{
        backgroundColor: scrolled ? "rgb(var(--paper) / 0.85)" : "transparent",
        backdropFilter: scrolled ? "saturate(140%) blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid rgb(var(--hairline) / 0.10)" : "1px solid transparent",
      }}
    >
      <div className="container-wide flex h-16 items-center justify-between md:h-20">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-ink transition-colors hover:text-signal"
          aria-label="Kozai — home"
        >
          <Logo variant="compact" size={26} />
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleAnchor(e, item.href)}
              className="text-[13px] font-medium tracking-tight text-mute transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={onContactClick}
          className="group inline-flex items-center gap-2 border border-ink/15 bg-transparent px-4 py-2 text-[13px] font-medium text-ink transition-all hover:border-ink hover:bg-ink hover:text-paper"
        >
          <span>Start a project</span>
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">↘</span>
        </button>
      </div>
    </header>
  );
};

export default Navigation;
