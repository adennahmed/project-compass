import { useEffect, useRef } from "react";
import DecodeHeading from "@/components/DecodeHeading";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import { useMagnetic } from "@/hooks/useMagnetic";

const focusRows = [
  ["Mode", "Independent builds"],
  ["Current lens", "Systems + product"],
  ["Interested in", "Complex, useful software"],
  ["Base", "Toronto, Canada"],
];

const Hero = () => {
  const linesRef = useRef<HTMLDivElement>(null);
  const projectsRef = useMagnetic<HTMLAnchorElement>(0.35, 90);
  const contactRef = useMagnetic<HTMLAnchorElement>(0.25, 70);

  useEffect(() => {
    const el = linesRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(0, ${-window.scrollY * 0.16}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="top" data-snap className="relative flex min-h-[100svh] items-end overflow-hidden px-6 pb-12 pt-28 md:px-10 md:pb-16 md:pt-32">
      <div className="container-wide">
        <Reveal immediate delay={120}>
          <div className="flex items-center justify-between gap-6">
            <div className="label flex items-center gap-3"><span className="h-1.5 w-1.5 bg-signal" aria-hidden /><ScrambleText text="Aden Ahmed · software engineer · Toronto" trigger="mount" duration={1100} /></div>
            <div className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-mute md:block">[ Portfolio · 2026 ]</div>
          </div>
        </Reveal>

        <div ref={linesRef} className="mt-8 will-change-transform">
          <h1 className="display max-w-[17ch] text-ink" style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)", fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.92 }}>
            <span className="block kinetic-line"><DecodeHeading text="I turn complex" stagger={23} delay={260} immediate hover /></span>
            <span className="block kinetic-line"><DecodeHeading text="systems into" stagger={25} delay={500} immediate hover /></span>
            <span className="block kinetic-line"><span className="italic-editorial mr-3 text-signal"><DecodeHeading text="usable" stagger={31} delay={720} immediate hover /></span><DecodeHeading text="software." stagger={27} delay={900} immediate hover /></span>
          </h1>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-12">
          <Reveal immediate delay={1200} className="md:col-span-7">
            <div className="hairline-draw mb-7 h-px w-full bg-ink/25" />
            <p className="max-w-[52ch] text-[16px] leading-[1.65] text-ink/72 md:text-[18px]">
              I design and engineer data-heavy products, operational interfaces, and resilient systems. This portfolio is a collection of independent builds, technical prototypes, and the ideas I am actively pushing forward.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a ref={projectsRef} href="#projects" className="btn-slot bg-ink px-6 py-4 text-[14px] font-medium text-paper"><span className="btn-slot__label">Explore the systems <span aria-hidden>↘</span></span><span className="btn-slot__label--hover bg-signal">Open project atlas <span aria-hidden>↘</span></span></a>
              <a ref={contactRef} href="#contact" className="link-wipe text-[14px] font-medium text-mute hover:text-ink">Start a conversation →</a>
            </div>
          </Reveal>

          <Reveal immediate delay={1420} className="md:col-span-5 md:flex md:justify-end">
            <dl className="w-full border-t border-hairline/15 md:max-w-[400px]">
              {focusRows.map(([label, value], i) => (
                <div key={label} className="group relative flex items-center justify-between gap-5 border-b border-hairline/15 py-3.5 transition-colors hover:bg-paper-2/35">
                  <span className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-signal transition-transform duration-500 group-hover:scale-y-100" />
                  <dt className="pl-3 font-mono text-[9px] uppercase tracking-[0.2em] text-mute group-hover:text-signal">0{i + 1} · {label}</dt>
                  <dd className="text-right font-mono text-[10px] text-ink md:text-[11px]">{value}</dd>
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
