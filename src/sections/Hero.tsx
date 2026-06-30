import { useEffect, useRef } from "react";
import DecodeHeading from "@/components/DecodeHeading";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import { useMagnetic } from "@/hooks/useMagnetic";

interface HeroProps {
  onContactClick: () => void;
}

const Hero = ({ onContactClick }: HeroProps) => {
  const linesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useMagnetic<HTMLButtonElement>(0.4, 100);
  const workRef = useMagnetic<HTMLAnchorElement>(0.25, 70);

  // Subtle counter-parallax — hero text drifts upward as the user scrolls past.
  useEffect(() => {
    const el = linesRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        // Slow lift — 0.18 of scroll
        el.style.transform = `translate3d(0, ${-y * 0.18}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="top"
      data-snap
      className="relative flex min-h-[100svh] items-end px-6 pt-28 pb-12 md:px-10 md:pt-32 md:pb-16"
    >
      <div className="container-wide">
        {/* Eyebrow row */}
        <Reveal immediate delay={140}>
          <div className="flex items-center justify-between gap-6">
            <div className="label flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
              <ScrambleText text="Software studio · Toronto · est. 2025" trigger="mount" duration={1100} />
            </div>
            <div className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:block">
              [ index — 01 / 06 ]
            </div>
          </div>
        </Reveal>

        {/* Kinetic headline — three lines, italic word in the middle */}
        <div ref={linesRef} className="mt-8 will-change-transform">
          <h1
            className="display max-w-[18ch] text-ink"
            style={{
              fontSize: "clamp(2.6rem, 7.4vw, 7rem)",
              fontWeight: 600,
              letterSpacing: "-0.045em",
              lineHeight: "0.96",
            }}
          >
            <span className="block kinetic-line">
              <DecodeHeading text="We build" stagger={26} delay={300} immediate hover />
            </span>
            <span className="block kinetic-line">
              <DecodeHeading text="the operational" stagger={24} delay={520} immediate hover />
            </span>
            <span className="block kinetic-line">
              <span className="italic-editorial mr-3 text-signal">
                <DecodeHeading text="software" stagger={30} delay={760} immediate hover />
              </span>
              <DecodeHeading text="serious teams depend on." stagger={22} delay={1080} immediate hover />
            </span>
          </h1>
        </div>

        {/* Hairline + sub + CTA + operator panel */}
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          {/* Left: copy + actions */}
          <div className="md:col-span-6">
            <Reveal immediate delay={1300}>
              <div className="hairline-draw mb-7 h-px w-full bg-ink/25" />
              <p className="max-w-[40ch] text-[16px] leading-[1.55] text-ink/75 md:text-[17px]">
                Kozai designs and builds the internal tools, dashboards, and platforms that
                operations teams actually rely on. We don't sell software — we solve the problem
                behind the problem.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <button
                  ref={ctaRef}
                  type="button"
                  onClick={onContactClick}
                  className="btn-slot bg-ink px-6 py-4 text-[14px] font-medium text-paper"
                >
                  <span className="btn-slot__label">
                    Start a project <span aria-hidden>↘</span>
                  </span>
                  <span className="btn-slot__label--hover bg-signal">
                    Let's build <span aria-hidden>↘</span>
                  </span>
                </button>
                <a
                  ref={workRef}
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="link-wipe inline-block text-[14px] font-medium text-mute hover:text-ink"
                >
                  See selected work →
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right: studio facts — the dashboards moved to their own section below */}
          <Reveal immediate delay={1500} className="md:col-span-6 md:flex md:items-end md:justify-end">
            <dl className="w-full border-t border-hairline/15 md:max-w-[340px]">
              {[
                ["Studio", "Toronto, CA"],
                ["Founded", "2025"],
                ["Discipline", "Operational software"],
                ["Response", "Under 48 hours"],
                ["Engagements", "Senior-only, no handoffs"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="group flex items-center justify-between gap-4 border-b border-hairline/15 py-3 transition-colors hover:bg-paper-2/40"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute transition-colors group-hover:text-signal">
                    {k}
                  </dt>
                  <dd className="text-right font-mono text-[12px] text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Hero;
