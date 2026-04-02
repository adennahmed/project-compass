import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "./LinkText";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: "Why Kozai", href: "#why-kozai" },
  { label: "Solutions", href: "#solutions" },
  { label: "Clients", href: "#clients" },
  { label: "Team", href: "#team" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileLinksRef = useRef<HTMLUListElement>(null);
  const lastScrollY = useRef(0);
  const navVisible = useRef(true);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        const scrollY = self.scroll();
        const direction = scrollY > lastScrollY.current ? "down" : "up";
        lastScrollY.current = scrollY;

        if (scrollY < 100) {
          if (!navVisible.current) {
            gsap.to(nav, { y: 0, duration: 0.4, ease: "power3.out" });
            navVisible.current = true;
          }
          nav.classList.remove("nav-scrolled");
          return;
        }

        nav.classList.add("nav-scrolled");

        if (direction === "down" && navVisible.current) {
          gsap.to(nav, { y: -100, duration: 0.4, ease: "power3.out" });
          navVisible.current = false;
        } else if (direction === "up" && !navVisible.current) {
          gsap.to(nav, { y: 0, duration: 0.4, ease: "power3.out" });
          navVisible.current = true;
        }
      },
    });
  }, []);

  const openMobile = () => {
    setMobileOpen(true);
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      if (mobileLinksRef.current) {
        gsap.from(mobileLinksRef.current.querySelectorAll("li"), {
          y: 30, opacity: 0, stagger: 0.07, duration: 0.55, ease: "power3.out",
        });
      }
    }, 50);
  };

  const closeMobile = () => {
    if (mobileLinksRef.current) {
      gsap.to(mobileLinksRef.current.querySelectorAll("li"), {
        y: -20, opacity: 0, stagger: 0.04, duration: 0.3, ease: "power2.in",
        onComplete: () => { setMobileOpen(false); document.body.style.overflow = ""; },
      });
    }
  };

  const scrollTo = (href: string) => {
    closeMobile();
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-8 px-8 h-[52px] transition-colors duration-300"
        style={{
          background: "rgba(8, 8, 8, 0.85)",
          backdropFilter: "blur(18px) saturate(180%)",
          WebkitBackdropFilter: "blur(18px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "100px",
        }}
      >
        <style>{`
          nav.nav-scrolled {
            background: rgba(8, 8, 8, 0.92) !important;
            border-color: rgba(255,255,255,0.1) !important;
          }
        `}</style>

        <a href="#" className="flex items-center mr-4">
          <img src="/kozai-logo-white.svg" alt="Kozai" className="h-5 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[12px] uppercase tracking-[0.08em] hover-target"
              style={{ color: "rgba(255,255,255,0.65)" }}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
            >
              <LinkText>{link.label}</LinkText>
            </a>
          ))}
        </div>

        <button className="md:hidden flex flex-col gap-[4px] p-2" onClick={openMobile} aria-label="Open menu">
          <span className="block w-4 h-[1.5px] bg-white" />
          <span className="block w-4 h-[1.5px] bg-white" />
          <span className="block w-4 h-[1.5px] bg-white" />
        </button>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center" style={{ background: "#080808" }}>
          <button className="absolute top-6 right-6 text-white text-3xl transition-transform duration-300 hover:rotate-90" onClick={closeMobile} aria-label="Close menu">✕</button>
          <ul ref={mobileLinksRef} className="flex flex-col gap-6 text-center">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-[48px] font-light text-white hover-target" onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}>
                  <LinkText>{link.label}</LinkText>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navigation;
