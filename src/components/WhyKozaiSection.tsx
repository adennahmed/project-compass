import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rows = [
  {
    num: "01",
    title: "We Build. We Don't Just Advise.",
    body: "Kozai is defined by delivery. Where others produce presentations, we produce systems, platforms, and infrastructure that exist inside your business long after our engagement ends.",
  },
  {
    num: "02",
    title: "Technology as a Revenue Asset.",
    body: "Most organizations treat software as a cost center. Kozai treats it as a lever. Every system we design is evaluated against a commercial objective — faster sales cycles, reduced operational drag, stronger retention.",
  },
  {
    num: "03",
    title: "Designed for the Stage You're In.",
    body: "Growth looks different at every level of organizational maturity. Our engagement model adjusts to serve businesses from early-stage through enterprise — without lowering the standard of execution.",
  },
];

const WhyKozaiSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".why-headline", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".why-headline", start: "top 82%" },
      });

      rows.forEach((_, i) => {
        const row = `.why-row-${i}`;
        gsap.from(`${row} .why-num`, {
          x: -30,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 80%" },
        });
        gsap.from(`${row} .why-title`, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 80%" },
        });
        gsap.from(`${row} .why-body`, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          delay: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 78%" },
        });
        // Draw-on SVG
        gsap.from(`${row} svg path, ${row} svg circle, ${row} svg line`, {
          strokeDashoffset: 400,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: `${row} svg`, start: "top 78%" },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="why-kozai" className="py-32 md:py-40 px-6 md:px-12 max-w-[1200px] mx-auto">
      <div
        className="text-[11px] uppercase tracking-[0.18em] mb-6"
        style={{ color: "#444444" }}
      >
        WHY KOZAI
      </div>
      <h2 className="why-headline text-[36px] md:text-[48px] font-light leading-[1.1] mb-20 max-w-[600px]">
        Execution Is the Differentiator.
      </h2>

      <div className="space-y-0">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`why-row-${i} grid md:grid-cols-[80px_1fr_1fr] gap-8 md:gap-12 items-start py-12`}
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <span
              className="why-num text-[48px] md:text-[64px] font-extralight"
              style={{ color: "rgba(255,255,255,0.06)" }}
            >
              {row.num}
            </span>
            <div>
              <h3 className="why-title text-[24px] md:text-[30px] font-normal mb-4">
                {row.title}
              </h3>
              <p
                className="why-body text-[15px] leading-[1.75]"
                style={{ color: "#888888" }}
              >
                {row.body}
              </p>
            </div>
            <div className="why-visual flex items-center justify-center">
              <svg
                width="160"
                height="160"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {i === 0 && (
                  <path
                    d="M40 160 L100 40 L160 160 Z"
                    stroke="#C8A96E"
                    strokeWidth="1"
                    strokeDasharray="400"
                    strokeDashoffset="0"
                    fill="none"
                  />
                )}
                {i === 1 && (
                  <>
                    <circle cx="100" cy="100" r="60" stroke="#C8A96E" strokeWidth="1" strokeDasharray="400" strokeDashoffset="0" />
                    <circle cx="100" cy="100" r="30" stroke="#C8A96E" strokeWidth="0.5" strokeDasharray="400" strokeDashoffset="0" />
                  </>
                )}
                {i === 2 && (
                  <path
                    d="M60 40 L140 40 L160 100 L140 160 L60 160 L40 100 Z"
                    stroke="#C8A96E"
                    strokeWidth="1"
                    strokeDasharray="400"
                    strokeDashoffset="0"
                    fill="none"
                  />
                )}
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyKozaiSection;
