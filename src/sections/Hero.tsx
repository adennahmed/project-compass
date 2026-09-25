import { useEffect, useRef } from "react";
import DecodeHeading from "@/components/DecodeHeading";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import { useMagnetic } from "@/hooks/useMagnetic";
import adenImg from "@/assets/aden-ahmed.png";

const focusRows = [
  ["Mode", "Independent builds"],
  ["Current lens", "Systems + product"],
  ["Interested in", "Complex, useful software"],
  ["Base", "Toronto, Canada"],
];

const Hero = ({ onOpenInquiry }: { onOpenInquiry: () => void }) => {
  const linesRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const projectsRef = useMagnetic<HTMLAnchorElement>(0.35, 90);
  const contactRef = useMagnetic<HTMLButtonElement>(0.25, 70);

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

  const scanPortrait = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const target = portraitRef.current;
    if (!target) return;
    const bounds = target.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    target.style.setProperty("--portrait-x", `${x.toFixed(2)}%`);
    target.style.setProperty("--portrait-y", `${y.toFixed(2)}%`);
    target.classList.add("is-scanning");
  };

  return (
    <section id="top" data-snap className="relative flex min-h-[100svh] items-end overflow-hidden px-6 pb-12 pt-28 md:px-10 md:pb-16 md:pt-32">
      <div className="container-wide">
        <Reveal immediate delay={120}>
          <div className="flex items-center justify-between gap-6">
            <div className="label flex items-center gap-3"><span className="h-1.5 w-1.5 bg-signal" aria-hidden /><ScrambleText text="Aden Ahmed · software engineer · Toronto" trigger="mount" duration={1100} /></div>
            <div className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-mute md:block">[ Portfolio · 2026 ]</div>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-8">
          <div ref={linesRef} className="order-2 will-change-transform md:order-1 md:col-span-8">
            <h1 className="display max-w-[13ch] text-ink" style={{ fontSize: "clamp(3rem, 7.2vw, 7.15rem)", fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.92 }}>
              <span className="block kinetic-line"><DecodeHeading text="I turn complex" stagger={23} delay={260} immediate hover /></span>
              <span className="block kinetic-line"><DecodeHeading text="systems into" stagger={25} delay={500} immediate hover /></span>
              <span className="block kinetic-line"><span className="italic-editorial mr-3 text-signal"><DecodeHeading text="usable" stagger={31} delay={720} immediate hover /></span><DecodeHeading text="software." stagger={27} delay={900} immediate hover /></span>
            </h1>
          </div>

          <Reveal immediate delay={420} className="order-1 md:order-2 md:col-span-4">
            <div
              ref={portraitRef}
              onPointerMove={scanPortrait}
              onPointerLeave={() => portraitRef.current?.classList.remove("is-scanning")}
              className="kz-portrait-scanner group relative ml-auto w-full max-w-[460px] overflow-hidden border border-hairline/20 bg-paper-2"
            >
              <img
                src={adenImg}
                alt="Portrait of Aden Ahmed"
                className="kz-portrait-base aspect-[16/11] w-full object-cover object-[50%_28%] grayscale transition duration-1000 ease-out group-hover:scale-[1.025] md:aspect-[4/5] md:object-[50%_26%]"
              />
              <img src={adenImg} alt="" aria-hidden className="kz-portrait-color absolute inset-0 h-full w-full object-cover object-[50%_28%] md:object-[50%_26%]" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-paper/65 via-transparent to-transparent" />
              <div aria-hidden className="absolute inset-0 bg-signal/0 mix-blend-screen transition-colors duration-700 group-hover:bg-signal/10" />
              <span aria-hidden className="absolute left-0 top-0 h-px w-full origin-left bg-signal" style={{ animation: "kz-scan-x 5.5s ease-in-out infinite" }} />
              <div aria-hidden className="kz-portrait-reticle"><span /><span /><i /></div>
              <div aria-hidden className="kz-portrait-readout">OPTICAL PASS / RGB</div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 font-mono text-[8px] uppercase tracking-[0.18em] text-ink md:p-5">
                <span>Aden Ahmed<br /><span className="text-mute">Portrait / 01</span></span>
                <span className="text-right text-signal">43.6532° N<br />79.3832° W</span>
              </div>
              <span aria-hidden className="absolute right-3 top-3 h-3 w-3 border border-signal transition-transform duration-700 group-hover:rotate-45 group-hover:bg-signal" />
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 md:mt-12 md:grid-cols-12 md:gap-12">
          <Reveal immediate delay={1200} className="md:col-span-7">
            <div className="hairline-draw mb-7 h-px w-full bg-ink/25" />
            <p className="max-w-[52ch] text-[16px] leading-[1.65] text-ink/72 md:text-[18px]">
              I design and engineer data-heavy products, operational interfaces, and resilient systems. This portfolio is a collection of independent builds, technical prototypes, and the ideas I am actively pushing forward.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a ref={projectsRef} href="#projects" className="btn-slot bg-ink px-6 py-4 text-[14px] font-medium text-paper"><span className="btn-slot__label">Explore the systems <span aria-hidden>↘</span></span><span className="btn-slot__label--hover bg-signal">Open project atlas <span aria-hidden>↘</span></span></a>
              <button ref={contactRef} type="button" onClick={onOpenInquiry} className="link-wipe text-[14px] font-medium text-mute hover:text-ink">Start a conversation →</button>
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
