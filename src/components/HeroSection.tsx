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

    // animate=true fires at preloader transition start (~2.85s).
    // The shutters take ~1.2s to peel. Adding base = 1.2s pushes all
    // visible animation onset to ~4.05s — the moment shutters fully clear.
    const base = 1.2;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-eyebrow",
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: base, stagger: 0.08 }
      );
      gsap.fromTo(
        ".hero-tag",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: base + 0.2 }
      );
      gsap.fromTo(
        ".hero-headline .reveal-line > span",
        { yPercent: 105 },
        { yPercent: 0, duration: 1.05, ease: "power3.out", stagger: 0.1, delay: base + 0.4 }
      );
      gsap.fromTo(
        ".hero-rule",
        { scaleX: 0, transformOrigin: "0 50%" },
        { scaleX: 1, duration: 1.2, ease: "power3.out", delay: base + 0.95 }
      );
      gsap.fromTo(
        ".hero-sub",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: base + 1.2 }
      );
      gsap.fromTo(
        ".hero-meta-item",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", stagger: 0.09, delay: base + 1.45 }
      );
      gsap.fromTo(
        ".hero-foot",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: base + 1.75 }
      );
      gsap.fromTo(
        ".hero-scroll-cue",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out", delay: base + 2.0 }
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
      gsap.to(".hero-fade-on-scroll", {
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
      aria-label="Hero — Software studio"
    >
      <HeroScene active={animate} />

      {/* Top frame — eyebrow row */}
      <div className="relative z-10 flex w-full items-center justify-between px-6 pt-24 md:px-12 md:pt-28 lg:pt-32">
        <div className="hero-eyebrow inline-flex overflow-hidden">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
            <span className="text-signal">●</span>&nbsp;&nbsp;Accepting new projects · Spring 2026
          </span>
        </div>
        <div className="hero-eyebrow hidden font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute md:inline-flex">
          <span>Studio · Toronto / Remote</span>
        </div>
      </div>

      {/* Center stack — tag, headline, rule, subline */}
      <div className="relative z-10 flex flex-1 flex-col px-6 md:px-12">
        <div className="my-auto w-full max-w-[1280px]">
          <div className="hero-tag mb-5 font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute md:mb-7">
            <span className="text-bone/55">[ </span>
            Software studio · Est. 2022
            <span className="text-bone/55"> ]</span>
          </div>

          <h1
            className="hero-headline display-headline text-bone"
            style={{ fontSize: "clamp(2.25rem, 7.5vw, 7.5rem)", lineHeight: "0.98" }}
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

          <div className="hero-rule mt-7 h-px w-[160px] bg-bone/30 md:mt-10" />

          <p className="hero-sub mt-5 max-w-[620px] text-base leading-relaxed text-bone/70 md:mt-6 md:text-lg">
            Kozai is a software studio that designs and builds the internal tools, dashboards,
            and platforms operators rely on every day. Small surfaces. Sharp edges. Things that ship.
          </p>
        </div>
      </div>

      {/* Bottom strip — meta grid on left, CTA on right */}
      <div className="hero-fade-on-scroll relative z-10 flex w-full flex-col items-stretch gap-8 px-6 pb-10 md:flex-row md:items-end md:justify-between md:gap-12 md:px-12 md:pb-14">
        <div className="grid grid-cols-3 gap-x-6 md:gap-x-10 lg:gap-x-14">
          <div className="hero-meta-item">
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">Studio</div>
            <div className="mt-2 text-sm text-bone/85">Toronto · Remote</div>
          </div>
          <div className="hero-meta-item">
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">Focus</div>
            <div className="mt-2 text-sm text-bone/85">Tools & platforms</div>
          </div>
          <div className="hero-meta-item">
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">Stack</div>
            <div className="mt-2 text-sm text-bone/85">TS · Go · Rust · SQL</div>
          </div>
        </div>

        <div className="hero-foot flex items-end justify-start md:justify-end">
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
      <div className="hero-scroll-cue hero-fade-on-scroll pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 md:block">
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
