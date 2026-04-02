import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rows = [
  {
    num: "01",
    title: "We Build. We Don't Just Advise.",
    body: "Kozai is defined by delivery. Where others produce presentations, we produce systems, platforms, and infrastructure that exist inside your business long after our engagement ends. Every project is benchmarked against the same standard: did the technology produce a measurable commercial outcome?",
  },
  {
    num: "02",
    title: "Technology as a Revenue Asset.",
    body: "Most organizations treat software as a cost center. Kozai treats it as a lever. Every system we design is evaluated against a commercial objective — faster sales cycles, reduced operational drag, stronger retention, or sharper decision-making.",
  },
  {
    num: "03",
    title: "Designed for the Stage You're In.",
    body: "Growth looks different at every level of organizational maturity. Our engagement model adjusts to serve businesses from early-stage through enterprise — without lowering the standard of execution, without over-engineering what doesn't need it, and without under-building what does.",
  },
];

const WhyKozaiSection = () => {
  useEffect(() => {
    rows.forEach((_, i) => {
      gsap.from(`.why-row-${i} .why-text`, {
        x: -50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: `.why-row-${i}`,
          start: "top 80%",
        },
      });
      gsap.from(`.why-row-${i} .why-visual`, {
        x: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: `.why-row-${i}`,
          start: "top 80%",
        },
      });
      // SVG draw-on
      gsap.from(`.why-row-${i} svg path`, {
        strokeDashoffset: 200,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: `.why-row-${i} svg`,
          start: "top 75%",
        },
      });
    });
  }, []);

  return (
    <section id="why-kozai" className="py-32 md:py-40 px-6 md:px-12 max-w-[1200px] mx-auto">
      <div
        className="text-[11px] uppercase tracking-[0.18em] mb-6"
        style={{ color: "#444444" }}
      >
        WHY KOZAI
      </div>
      <h2 className="text-[36px] md:text-[48px] font-light leading-[1.1] mb-20 max-w-[600px]">
        Execution Is the Differentiator.
      </h2>

      <div className="space-y-20">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`why-row-${i} grid md:grid-cols-2 gap-12 items-start`}
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "40px",
            }}
          >
            <div className="why-text">
              <span
                className="text-[13px] block mb-4"
                style={{ color: "#444444" }}
              >
                {row.num}
              </span>
              <h3 className="text-[24px] md:text-[30px] font-normal mb-6">
                {row.title}
              </h3>
              <p
                className="text-[15px] leading-[1.75]"
                style={{ color: "#888888" }}
              >
                {row.body}
              </p>
            </div>
            <div className="why-visual flex items-center justify-center">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {i === 0 && (
                  <path
                    d="M40 160 L100 40 L160 160"
                    stroke="#C8A96E"
                    strokeWidth="1.5"
                    strokeDasharray="200"
                    strokeDashoffset="0"
                  />
                )}
                {i === 1 && (
                  <path
                    d="M40 100 Q100 20 160 100 Q100 180 40 100"
                    stroke="#C8A96E"
                    strokeWidth="1.5"
                    strokeDasharray="200"
                    strokeDashoffset="0"
                  />
                )}
                {i === 2 && (
                  <path
                    d="M60 40 L140 40 L160 100 L140 160 L60 160 L40 100 Z"
                    stroke="#C8A96E"
                    strokeWidth="1.5"
                    strokeDasharray="200"
                    strokeDashoffset="0"
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
