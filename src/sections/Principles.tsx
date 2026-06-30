import { useEffect, useRef } from "react";
import Reveal from "@/components/Reveal";
import CharReveal from "@/components/CharReveal";
import DecodeHeading from "@/components/DecodeHeading";
import ScrambleText from "@/components/ScrambleText";
import { useMagnetic } from "@/hooks/useMagnetic";

interface PrinciplesProps {
  onContactClick?: () => void;
}

const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Operators before features",
    body: "We design for the person who opens the tool at 7am, not the buyer who signs the cheque. If a shift doesn't get shorter, nothing shipped.",
  },
  {
    title: "Senior hands, start to finish",
    body: "The people who scope the work write the work. No junior bench learning on your budget, no handoff to a team you've never met.",
  },
  {
    title: "Boring on purpose",
    body: "We pick the stack that's still debuggable at 2am in year three. Novelty is a cost, and we don't quietly pass it to you.",
  },
  {
    title: "Shipped beats perfect",
    body: "Weekly demos against real data, every engagement. Momentum compounds; roadmaps rot in a drawer nobody opens.",
  },
  {
    title: "We leave the lights on",
    body: "Observability, runbooks, and an on-call doc handed to your team. You should be able to own what we built without us in the room.",
  },
];

const Principles = ({ onContactClick }: PrinciplesProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useMagnetic<HTMLButtonElement>(0.35, 90);

  // Scroll-linked vertical rail — fills as the section moves through view.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height * 0.9)));
        if (railRef.current) railRef.current.style.transform = `scaleY(${p.toFixed(3)})`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="standard"
      data-snap
      className="relative px-6 py-24 md:px-10 md:py-32"
    >
      <div className="container-wide">
        {/* Header */}
        <Reveal>
          <div className="mb-14 grid grid-cols-1 gap-8 md:mb-20 md:grid-cols-12 md:items-end md:gap-12">
            <div className="md:col-span-4">
              <div className="label">
                <ScrambleText text="[ ✦ — The Kozai standard ]" />
              </div>
            </div>
            <div className="md:col-span-8">
              <h2
                className="display text-ink"
                style={{ fontSize: "clamp(2rem, 5.4vw, 4.2rem)", letterSpacing: "-0.04em" }}
              >
                <DecodeHeading text="We don't sell software." stagger={18} hover />
                <span className="text-mute">
                  {" "}
                  <DecodeHeading text="We remove the reason you needed it." stagger={14} delay={120} hover />
                </span>
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Intro */}
        <Reveal delay={120}>
          <p className="mb-16 max-w-[68ch] text-[16px] leading-[1.7] text-ink/75 md:mb-24 md:text-[18px]">
            Kozai is a Toronto operational-software studio. We embed with the teams who actually run
            the business, find the work software should be doing, and build the smallest system that
            makes a shift shorter — then hand it back, documented, so your people can run it without
            us. No bench. No offshore relay. No roadmap theater.
          </p>
        </Reveal>

        {/* Principles list with scroll rail */}
        <div className="relative">
          <span aria-hidden className="absolute left-0 top-0 hidden h-full w-px bg-hairline/15 md:block">
            <span
              ref={railRef}
              className="absolute left-0 top-0 block h-full w-px origin-top bg-signal"
              style={{ transform: "scaleY(0)" }}
            />
          </span>

          <div className="border-t border-hairline/15 md:pl-10">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="group relative grid grid-cols-12 items-baseline gap-4 border-b border-hairline/15 py-8 transition-colors hover:bg-paper-2/30 md:gap-8 md:py-10">
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-signal transition-transform duration-500 group-hover:scale-y-100 md:-left-10"
                  />
                  <div className="col-span-12 md:col-span-2">
                    <span className="font-mono text-[12px] tracking-[0.2em] text-mute transition-colors group-hover:text-signal">
                      <ScrambleText text={`P-0${i + 1}`} />
                    </span>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <h3
                      className="display text-ink transition-transform duration-500 group-hover:translate-x-1"
                      style={{ fontSize: "clamp(1.4rem, 2.4vw, 2rem)" }}
                    >
                      {p.title}
                    </h3>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <p className="max-w-[54ch] text-[15px] leading-[1.65] text-mute md:text-[16px]">
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Closing line + CTA */}
        <Reveal delay={150}>
          <div className="mt-24 flex flex-col items-start justify-between gap-8 border-t border-hairline/15 pt-12 md:mt-32 md:flex-row md:items-center">
            <h3
              className="display max-w-[20ch] text-ink"
              style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.6rem)" }}
            >
              <CharReveal stagger={16} splitBy="word">
                Have a process that should be software?
              </CharReveal>
            </h3>
            <button
              ref={ctaRef}
              type="button"
              onClick={() => onContactClick?.()}
              className="btn-slot shrink-0 bg-ink px-7 py-5 text-[14px] font-medium text-paper"
            >
              <span className="btn-slot__label">
                Start a project <span aria-hidden>↘</span>
              </span>
              <span className="btn-slot__label--hover bg-signal">
                Let's build <span aria-hidden>↘</span>
              </span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Principles;
