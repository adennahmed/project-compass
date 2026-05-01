import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Logo from "./Logo";

interface NavigationProps {
  ready?: boolean;
  onContactClick?: () => void;
}

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Studio", href: "#studio" },
  { label: "Contact", href: "#contact" },
];

const Navigation = ({ ready = true, onContactClick }: NavigationProps) => {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ready || !navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
    );
  }, [ready]);

  const onAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (x: HTMLElement, opts?: object) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(el as HTMLElement, { offset: -20, duration: 1.4 });
    } else {
      (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 px-6 py-5 transition-all duration-500 md:px-12"
      style={{
        opacity: ready ? undefined : 0,
        background: scrolled ? "rgba(8,8,9,0.72)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(234,232,226,0.06)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        <a
          href="#home"
          onClick={(e) => onAnchor(e, "#home")}
          className="inline-flex items-center gap-3 text-bone hover-target"
          aria-label="Kozai — Home"
        >
          <Logo variant="full" className="h-7 w-auto" />
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          {navItems.map((item, i) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={(e) => onAnchor(e, item.href)}
                className="group inline-flex items-baseline gap-2 text-sm text-bone hover-target"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-bone-mute">
                  0{i + 1}
                </span>
                <span className="label-stack text-[13px] uppercase tracking-[0.18em]">
                  <span>{item.label}</span>
                  <span className="text-signal">{item.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onContactClick}
          className="group hidden items-center gap-3 border border-bone/15 px-4 py-2 text-bone transition-colors duration-300 hover:border-signal md:inline-flex hover-target"
        >
          <span className="block h-1.5 w-1.5 rounded-full bg-signal" />
          <span className="label-stack font-mono text-[11px] uppercase tracking-[0.24em]">
            <span>Start a project</span>
            <span className="text-signal">Let&rsquo;s talk</span>
          </span>
        </button>

        <button
          type="button"
          onClick={onContactClick}
          className="inline-flex md:hidden"
          aria-label="Open contact"
        >
          <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-bone">Talk</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
