import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ManifestoSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      // Word-by-word reveal as the section enters
      const text = document.querySelector(".manifesto-body");
      if (text) {
        const words = (text.textContent ?? "").trim().split(/\s+/);
        text.innerHTML = words
          .map((w) => `<span class="m-word inline-block opacity-20" style="will-change:opacity">${w}&nbsp;</span>`)
          .join("");
        gsap.to(".m-word", {
          opacity: 1,
          ease: "none",
          stagger: 0.018,
          scrollTrigger: {
            trigger: ".manifesto-body",
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        });
      }

      gsap.fromTo(
        ".manifesto-meta",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        }
      );

      gsap.fromTo(
        ".manifesto-rule",
        { scaleX: 0, transformOrigin: "0 50%" },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="approach"
      className="relative w-full overflow-hidden bg-ink py-32 md:py-48"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="manifesto-meta md:col-span-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
              [ 02 ] — Approach
            </span>
            <div className="manifesto-rule mt-6 h-px w-[80px] bg-signal" />
          </div>

          <div className="md:col-span-9">
            <p
              className="manifesto-body display-headline text-bone"
              style={{ fontSize: "clamp(1.75rem, 3.6vw, 3.4rem)", lineHeight: "1.18" }}
            >
              Most software fails before the first line of code. Wrong scope, wrong stack,
              wrong assumption. We start by asking what your team is actually doing — the
              copy-paste, the spreadsheet, the four-tool workaround — and design from
              there. Small surfaces. Sharp edges. Things that ship.
            </p>

            <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  k: "01",
                  title: "Scoped, not scaffolded.",
                  body: "We ship the smallest tool that solves the real problem, then iterate. No platform-shaped roadmaps for two-feature problems.",
                },
                {
                  k: "02",
                  title: "Engineers, not vendors.",
                  body: "You talk to the people writing the code. No project managers as middlemen, no ticket triage, no handoff theatre.",
                },
                {
                  k: "03",
                  title: "Built to be owned.",
                  body: "Clean code, plain stack, real documentation. When we hand off, your team can pick it up the same day.",
                },
              ].map((it) => (
                <div key={it.k} className="manifesto-meta">
                  <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-signal">
                    {it.k}
                  </div>
                  <h3 className="mt-4 text-xl font-medium text-bone md:text-2xl" style={{ letterSpacing: "-0.02em" }}>
                    {it.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone/60">{it.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
