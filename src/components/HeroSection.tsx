import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroScene from "./HeroScene";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  animate: boolean;
  onContactClick?: () => void;
}

const HeroSection = ({ animate, onContactClick }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const introDone = useRef(false);

  useEffect(() => {
    if (!animate || introDone.current || !sectionRef.current) return;
    introDone.current = true;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-eyebrow",
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo(
        ".hero-headline .reveal-line > span",
        { yPercent: 105 },
        { yPercent: 0, duration: 1.05, ease: "power3.out", stagger: 0.06, delay: 0.2 }
      );
      gsap.fromTo(
        ".hero-sub",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.85 }
      );
      gsap.fromTo(
        ".hero-foot",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 1.05, stagger: 0.08 }
      );
      gsap.fromTo(
        ".hero-rule",
        { scaleX: 0, transformOrigin: "0 50%" },
        { scaleX: 1, duration: 1.4, ease: "power3.out", delay: 0.5 }
      );

      // Subtle parallax on the headline as the user scrolls past hero
      gsap.to(".hero-headline", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      gsap.to(".hero-aux", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: 0.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [animate]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink"
      aria-label="Hero — Software that actually ships."
    >
      <HeroScene active={animate} />

      {/* Top frame — eyebrow */}
      <div className="relative z-10 flex w-full items-center justify-between px-6 pt-24 md:px-12 md:pt-28 lg:pt-32">
        <div className="hero-eyebrow inline-flex overflow-hidden">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
            <span className="text-signal">●</span>&nbsp;&nbsp;Available for new engagements — Spring 2026
          </span>
        </div>
        <div className="hero-eyebrow hidden font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute md:inline-flex">
          <span>Studio · Toronto / Remote</span>
        </div>
      </div>

      {/* Headline — pinned mid-screen, integrated with the 3D scene */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 md:px-12">
        <h1
          className="hero-headline display-headline w-full max-w-[1280px] text-bone"
          style={{ fontSize: "clamp(2.5rem, 9vw, 8.5rem)" }}
        >
          <span className="reveal-line block">
            <span>We don&rsquo;t sell software.</span>
          </span>
          <span className="reveal-line block">
            <span>We solve the problem</span>
          </span>
          <span className="reveal-line block">
            <span>
              <span className="text-signal">behind</span> the problem.
            </span>
          </span>
        </h1>
      </div>

      {/* Subline + meta + CTA */}
      <div className="hero-aux relative z-10 grid w-full grid-cols-1 gap-8 px-6 pb-12 md:grid-cols-12 md:px-12 md:pb-16">
        <div className="md:col-span-7">
          <div className="hero-rule mb-6 h-px w-[120px] bg-bone/30" />
          <p className="hero-sub max-w-[640px] text-base leading-relaxed text-bone/70 md:text-lg">
            Kozai is a software studio that designs and builds the internal tools, dashboards,
            and platforms that operators rely on every day. Small surfaces. Sharp edges. Things that ship.
          </p>
        </div>
        <div className="hero-foot flex items-end justify-start md:col-span-5 md:justify-end">
          <button
            type="button"
            onClick={onContactClick}
            className="group relative inline-flex items-center gap-3 py-2 text-bone hover-target"
            data-cursor-label="Talk to us"
          >
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute sm:inline">[ 01 ]</span>
            <span className="text-base md:text-lg">
              Have a project? <span className="text-signal">Let&rsquo;s talk.</span>
            </span>
            <span className="ml-1 inline-block h-px w-12 bg-bone transition-all duration-500 group-hover:w-20 group-hover:bg-signal" />
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-aux pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">Scroll</span>
          <div className="relative h-[40px] w-[1px] overflow-hidden bg-bone/15">
            <div className="absolute left-0 top-0 h-[14px] w-full animate-[scroll-line_1.8s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-signal to-transparent" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
