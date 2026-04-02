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
];

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileLinksRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    ScrollTrigger.create({
      start: "top -72",
      onEnter: () => navRef.current?.classList.add("scrolled"),
      onLeaveBack: () => navRef.current?.classList.remove("scrolled"),
    });
  }, []);

  const openMobile = () => {
    setMobileOpen(true);
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      if (mobileLinksRef.current) {
        gsap.from(mobileLinksRef.current.querySelectorAll("li"), {
          y: 30,
          opacity: 0,
          stagger: 0.07,
          duration: 0.55,
          ease: "power3.out",
        });
      }
    }, 50);
  };

  const closeMobile = () => {
    if (mobileLinksRef.current) {
      gsap.to(mobileLinksRef.current.querySelectorAll("li"), {
        y: -20,
        opacity: 0,
        stagger: 0.04,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setMobileOpen(false);
          document.body.style.overflow = "";
        },
      });
    }
  };

  const scrollTo = (href: string) => {
    closeMobile();
    setTimeout(() => {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-6 md:px-12 h-[72px] transition-all duration-300"
        style={{
          background: "transparent",
          borderBottom: "1px solid transparent",
        }}
      >
        <style>{`
          nav.scrolled {
            background: rgba(8, 8, 8, 0.88) !important;
            backdrop-filter: blur(18px) saturate(180%);
            -webkit-backdrop-filter: blur(18px) saturate(180%);
            border-bottom-color: rgba(255,255,255,0.06) !important;
          }
        `}</style>

        <a href="#" className="flex items-center">
          <img
            src="/kozai-logo-white.svg"
            alt="Kozai"
            className="h-6 md:h-7 w-auto"
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] tracking-[0.02em] hover-target"
              style={{ color: "rgba(255,255,255,0.65)" }}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.href);
              }}
            >
              <LinkText>{link.label}</LinkText>
            </a>
          ))}
          <a
            href="#contact"
            className="text-[13px] tracking-[0.02em] px-5 py-2 hover-target"
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.85)",
              borderRadius: "2px",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#C8A96E")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")
            }
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#contact");
            }}
          >
            <LinkText>Contact →</LinkText>
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={openMobile}
          aria-label="Open menu"
        >
          <span className="block w-5 h-[1.5px] bg-white" />
          <span className="block w-5 h-[1.5px] bg-white" />
          <span className="block w-5 h-[1.5px] bg-white" />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
          style={{ background: "#080808" }}
        >
          <button
            className="absolute top-6 right-6 text-white text-3xl transition-transform duration-300 hover:rotate-90"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            ✕
          </button>
          <ul ref={mobileLinksRef} className="flex flex-col gap-6 text-center">
            {[...navLinks, { label: "Contact", href: "#contact" }].map(
              (link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[48px] font-light text-white hover-target"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                  >
                    <LinkText>{link.label}</LinkText>
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navigation;
