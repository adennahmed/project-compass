import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import LinkText from "./LinkText";
import HeroParticleSphere from "./HeroParticleSphere";

interface HeroSectionProps {
  animate: boolean;
  onOpenSidebar?: () => void;
}

const getInwardOffset = () => {
  if (typeof window === "undefined") return 0;
  const w = window.innerWidth;
  if (w < 480) return 0;
  if (w < 640) return Math.max(w * 0.06, 15);
  if (w < 1100) return Math.min(w * 0.12, 120);
  return Math.min(Math.max(w * 0.16, 150), 340);
};

const HeroSection = ({ animate, onOpenSidebar }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useLayoutEffect(() => {
    if (!animate || hasAnimated.current || !sectionRef.current) return;
    hasAnimated.current = true;

    const offset = getInwardOffset();

    const ctx = gsap.context(() => {
      gsap.set(".hero-half-left", { x: offset });
      gsap.set(".hero-half-right", { x: -offset });
      gsap.set(".scroll-indicator, .hero-bottom-left, .hero-bottom-right, .hero-logo-watermark", { opacity: 0 });

      gsap
        .timeline()
        .to(".hero-half-left", {
          x: 0,
          duration: 0.95,
          ease: "power3.inOut",
        })
        .to(
          ".hero-half-right",
          {
            x: 0,
            duration: 0.95,
            ease: "power3.inOut",
          },
          "<"
        )
        .to(".hero-bottom-left", { opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.15")
        .to(".hero-bottom-right", { opacity: 1, duration: 0.4, ease: "power2.out" }, "<0.05")
        .to(".hero-logo-watermark", { opacity: 1, duration: 0.4, ease: "power2.out" }, "<")
        .to(".scroll-indicator", { opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, [animate]);

  return (
    <section
      ref={sectionRef}
      aria-label="Hero — Building the Systems That Drive Growth"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      <h1 className="sr-only">Building the Systems That Drive Growth.</h1>

      <div className="hero-sphere absolute inset-0 flex items-center justify-center pointer-events-auto">
        <HeroParticleSphere />
      </div>

      <div aria-hidden="true" className="hero-split-container relative z-10 flex flex-col sm:flex-row min-h-[30vh] sm:min-h-[58vh] w-full items-center justify-center gap-0">
        <div className="hero-half-left will-change-transform sm:w-1/2 px-4 sm:px-6 md:px-12">
          <p
            className="whitespace-nowrap text-center sm:text-left text-[7vw] sm:text-[clamp(1.6rem,4.9vw,5.3rem)] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-foreground"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            BUILDING THE
            <br />
            SYSTEMS
          </p>
        </div>
        <div className="hero-half-right will-change-transform sm:w-1/2 px-4 sm:px-6 md:px-12">
          <p
            className="whitespace-nowrap text-center sm:text-right text-[7vw] sm:text-[clamp(1.6rem,4.9vw,5.3rem)] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-foreground"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            THAT
            <br />
            DRIVE GROWTH.
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-4 sm:left-6 md:left-12 right-4 sm:right-6 md:right-12 flex items-end justify-between z-10">
        <div className="hero-bottom-left">
          <button onClick={onOpenSidebar} className="relative inline-block px-5 py-3 hover-target group">
            <span className="absolute top-0 left-0 h-2.5 w-2.5 border-l border-t transition-all duration-300 group-hover:h-3.5 group-hover:w-3.5" style={{ borderColor: "hsl(var(--foreground) / 0.25)" }} />
            <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t transition-all duration-300 group-hover:h-3.5 group-hover:w-3.5" style={{ borderColor: "hsl(var(--foreground) / 0.25)" }} />
            <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l transition-all duration-300 group-hover:h-3.5 group-hover:w-3.5" style={{ borderColor: "hsl(var(--foreground) / 0.25)" }} />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r transition-all duration-300 group-hover:h-3.5 group-hover:w-3.5" style={{ borderColor: "hsl(var(--foreground) / 0.25)" }} />
            <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "hsl(var(--foreground) / 0.65)" }}>
              <LinkText>Contact Us</LinkText>
            </span>
          </button>
        </div>
        <div className="hero-bottom-right max-w-[480px] hidden md:block">
          <p
            className="text-[12px] leading-[1.7] uppercase tracking-[0.04em]"
            style={{ color: "hsl(var(--foreground) / 0.4)", fontFamily: "'Inter', sans-serif" }}
          >
            Kozai turns software and technology into measurable revenue performance
            — for growing companies, mid-market organizations, and enterprise
            environments that demand precision.
          </p>
        </div>
      </div>

      {/* Scroll indicator with gold shimmer */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-[50px] w-[1px] overflow-hidden" style={{ background: "hsl(var(--foreground) / 0.08)" }}>
            <div className="animate-scroll-line absolute left-0 top-0 h-[15px] w-full" style={{ background: "linear-gradient(to bottom, transparent, #C8A96E, transparent)" }} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-4 sm:right-6 md:right-12 z-10 hero-logo-watermark hidden sm:block">
        <img src="/kozai-logo-white.svg" alt="" className="h-8 opacity-20" />
      </div>

      <style>{`
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .animate-scroll-line {
          animation: scroll-line 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
