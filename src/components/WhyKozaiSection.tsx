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
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".why-headline", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".why-headline", start: "top 82%" },
      });

      rows.forEach((row, i) => {
        const rowSel = `.why-row-${i}`;

        // Animate number counting up
        const numEl = numRefs.current[i];
        if (numEl) {
          const target = parseInt(row.num, 10);
          ScrollTrigger.create({
            trigger: rowSel,
            start: "top 80%",
            once: true,
            onEnter: () => {
              const obj = { val: 0 };
              gsap.to(obj, {
                val: target,
                duration: 1.2,
                ease: "power2.out",
                onUpdate: () => {
                  if (numEl) numEl.textContent = String(Math.round(obj.val)).padStart(2, "0");
                },
              });
            },
          });
        }

        gsap.from(`${rowSel} .why-title`, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: rowSel, start: "top 80%" },
        });
        gsap.from(`${rowSel} .why-body`, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          delay: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: rowSel, start: "top 78%" },
        });
        // Draw-on SVG + gold pulse
        gsap.from(`${rowSel} svg path, ${rowSel} svg circle, ${rowSel} svg line, ${rowSel} svg ellipse`, {
          strokeDashoffset: 400,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: `${rowSel} svg`, start: "top 78%" },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="why-kozai" className="py-24 md:py-40 px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto">
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
            className={`why-row-${i} grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-4 md:gap-12 items-start py-8 md:py-12 group`}
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <span
              ref={(el) => { numRefs.current[i] = el; }}
              className="why-num text-[48px] md:text-[64px] font-extralight transition-colors duration-700"
              style={{ color: "rgba(255,255,255,0.06)" }}
            >
              00
            </span>
            <div>
              <h3 className="why-title text-[24px] md:text-[30px] font-normal mb-4">
                {row.title}
              </h3>
              {/* Gold accent line */}
              <div
                className="h-[1px] w-0 mb-4 transition-all duration-700 ease-out group-hover:w-16"
                style={{ background: "#C8A96E" }}
              />
              <p
                className="why-body text-[15px] leading-[1.75]"
                style={{ color: "#888888" }}
              >
                {row.body}
              </p>
            </div>
            <div className="why-visual hidden md:flex items-center justify-center">
              <svg
                width="160"
                height="160"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-[8deg]"
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
