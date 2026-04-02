import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "./LinkText";

gsap.registerPlugin(ScrollTrigger);

const solutions = [
  {
    num: "01 / 04",
    title: "REVENUE\nTECHNOLOGY",
    body: "CRM ARCHITECTURE, SALES AUTOMATION, AND PIPELINE INFRASTRUCTURE ENGINEERED TO CLOSE MORE AND SCALE FASTER.",
    color: "#1a1a1a",
    textColor: "#ffffff",
    accentColor: "#C8A96E",
  },
  {
    num: "02 / 04",
    title: "OPERATIONAL\nINFRASTRUCTURE",
    body: "WORKFLOW AUTOMATION, SYSTEM INTEGRATION, AND PROCESS MODERNIZATION. WE ELIMINATE THE FRICTION THAT STALLS GROWTH.",
    color: "#7BA3A8",
    textColor: "#1a1a1a",
    accentColor: "#1a1a1a",
  },
  {
    num: "03 / 04",
    title: "DIGITAL\nTRANSFORMATION",
    body: "LEGACY MIGRATION, FULL-STACK MODERNIZATION, AND PLATFORM CONSOLIDATION FOR YOUR NEXT STAGE.",
    color: "#D4764E",
    textColor: "#1a1a1a",
    accentColor: "#1a1a1a",
  },
  {
    num: "04 / 04",
    title: "DATA &\nINTELLIGENCE",
    body: "BI DASHBOARDS, KPI FRAMEWORKS, AND DECISION-SUPPORT SYSTEMS THAT DRIVE CLARITY AND FASTER EXECUTION.",
    color: "#EEEAE4",
    textColor: "#1a1a1a",
    accentColor: "#444444",
  },
];

const SolutionsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".solutions-eyebrow", {
        y: 25, opacity: 0, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ".solutions-eyebrow", start: "top 84%" },
      });
      gsap.from(".solutions-headline", {
        y: 45, opacity: 0, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: ".solutions-headline", start: "top 82%" },
      });

      // Horizontal slide reveal from dark to light
      if (revealRef.current) {
        gsap.set(revealRef.current, { xPercent: 100 });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 70%",
          onEnter: () => {
            gsap.to(revealRef.current, {
              xPercent: 0,
              duration: 0.9,
              ease: "power3.inOut",
            });
          },
          once: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="solutions"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Light background that slides in */}
      <div
        ref={revealRef}
        className="absolute inset-0"
        style={{ background: "#EEEAE4", zIndex: 0 }}
      />

      <div className="relative z-10 py-32 md:py-40">
        {/* Header area */}
        <div className="px-6 md:px-12 max-w-[1200px] mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div
                className="solutions-eyebrow text-[11px] uppercase tracking-[0.18em] mb-6"
                style={{ color: "#C8A96E" }}
              >
                OUR ETHOS
              </div>
              <h2
                className="solutions-headline text-[36px] md:text-[48px] font-light leading-[1.1] max-w-[500px]"
                style={{ color: "#1a1a1a" }}
              >
                Vision Matters. Velocity Wins.
              </h2>
            </div>
            <div className="flex flex-col justify-end">
              <p
                className="text-[15px] leading-[1.75] mb-6 max-w-[480px]"
                style={{ color: "#666666" }}
              >
                Our comprehensive technology platform shifts the odds. With infrastructure
                that works. With experts who've been there. With the right pressure — pushing
                you forward, not under.
              </p>
              <a href="#contact" className="relative inline-block px-5 py-3 hover-target group self-start">
                <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.25)" }} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.25)" }} />
                <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.25)" }} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.25)" }} />
                <span className="text-[12px] uppercase tracking-[0.12em]" style={{ color: "rgba(30,30,30,0.75)" }}>
                  <LinkText>Join Us</LinkText>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Cards deck */}
        <div
          className="flex overflow-x-auto gap-0 px-0 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {solutions.map((s, i) => (
            <div
              key={i}
              className="flex-shrink-0 snap-start relative flex flex-col justify-between cursor-pointer overflow-hidden"
              style={{
                width: expandedIndex === i ? "50vw" : expandedIndex !== null ? "16.67vw" : "25vw",
                minWidth: expandedIndex === i ? "500px" : expandedIndex !== null ? "140px" : "200px",
                height: "640px",
                background: s.color,
                transition: "width 0.6s cubic-bezier(0.76, 0, 0.24, 1), min-width 0.6s cubic-bezier(0.76, 0, 0.24, 1)",
                padding: "40px",
                borderRadius: "4px",
              }}
              onMouseEnter={() => setExpandedIndex(i)}
              onMouseLeave={() => setExpandedIndex(null)}
            >
              <h3
                className="text-[24px] md:text-[32px] font-bold uppercase leading-[1.1] whitespace-pre-line transition-opacity duration-300"
                style={{ color: s.textColor }}
              >
                {s.title}
              </h3>

              <div
                className="flex-1 flex items-center justify-center transition-opacity duration-500"
                style={{ opacity: expandedIndex === i ? 1 : 0.6 }}
              >
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ opacity: 0.3 }}
                >
                  {i === 0 && (
                    <>
                      {Array.from({ length: 12 }).map((_, j) => (
                        <line key={j} x1="100" y1="20" x2={100 + Math.cos((j * 30 * Math.PI) / 180) * 80} y2={100 + Math.sin((j * 30 * Math.PI) / 180) * 80} stroke={s.textColor} strokeWidth="0.5" strokeDasharray="2 3" />
                      ))}
                    </>
                  )}
                  {i === 1 && (
                    <>
                      {Array.from({ length: 20 }).map((_, j) => (
                        <path key={j} d={`M ${60 + j * 4} 180 Q ${60 + j * 4} ${100 - Math.sin((j / 19) * Math.PI) * 80} ${60 + j * 4} 20`} stroke={s.textColor} strokeWidth="0.5" fill="none" />
                      ))}
                    </>
                  )}
                  {i === 2 && (
                    <>
                      {Array.from({ length: 8 }).map((_, j) => {
                        const angle = (j / 8) * Math.PI * 2;
                        const cx = 100 + Math.cos(angle) * 60;
                        const cy = 100 + Math.sin(angle) * 60;
                        return (
                          <g key={j}>
                            <circle cx={cx} cy={cy} r="4" stroke={s.textColor} strokeWidth="0.5" fill="none" />
                            <line x1="100" y1="100" x2={cx} y2={cy} stroke={s.textColor} strokeWidth="0.3" strokeDasharray="2 2" />
                            {j < 7 && (
                              <line
                                x1={cx} y1={cy}
                                x2={100 + Math.cos(((j + 1) / 8) * Math.PI * 2) * 60}
                                y2={100 + Math.sin(((j + 1) / 8) * Math.PI * 2) * 60}
                                stroke={s.textColor} strokeWidth="0.3"
                              />
                            )}
                          </g>
                        );
                      })}
                      <circle cx="100" cy="100" r="6" stroke={s.textColor} strokeWidth="0.5" fill="none" />
                      <circle cx="100" cy="100" r="60" stroke={s.textColor} strokeWidth="0.3" fill="none" strokeDasharray="3 4" />
                    </>
                  )}
                  {i === 3 && (
                    <>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <ellipse key={j} cx="100" cy="100" rx={20 + j * 10} ry={60 + j * 5} stroke={s.textColor} strokeWidth="0.5" fill="none" transform={`rotate(${j * 22.5} 100 100)`} />
                      ))}
                    </>
                  )}
                </svg>
              </div>

              <div>
                <div className="text-[12px] uppercase tracking-[0.12em] mb-4" style={{ color: s.accentColor, opacity: 0.6 }}>
                  {s.num}
                </div>
                <p
                  className="text-[12px] uppercase tracking-[0.06em] leading-[1.6] transition-all duration-500"
                  style={{
                    color: s.textColor,
                    opacity: expandedIndex === i ? 0.7 : 0,
                    maxHeight: expandedIndex === i ? "200px" : "0px",
                    overflow: "hidden",
                  }}
                >
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
