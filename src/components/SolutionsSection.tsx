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
    color: "hsl(0 0% 7%)",
    textColor: "hsl(0 0% 100%)",
    accentColor: "hsl(0 0% 100%)",
    bodyWidth: 290,
  },
  {
    num: "02 / 04",
    title: "OPERATIONAL\nINFRASTRUCTURE",
    body: "WORKFLOW AUTOMATION, SYSTEM INTEGRATION, AND PROCESS MODERNIZATION. WE ELIMINATE THE FRICTION THAT STALLS GROWTH.",
    color: "hsl(190 30% 58%)",
    textColor: "hsl(0 0% 0%)",
    accentColor: "hsl(0 0% 0%)",
    bodyWidth: 290,
  },
  {
    num: "03 / 04",
    title: "DIGITAL\nTRANSFORMATION",
    body: "LEGACY MIGRATION, FULL-STACK MODERNIZATION, AND PLATFORM CONSOLIDATION FOR YOUR NEXT STAGE.",
    color: "hsl(16 84% 61%)",
    textColor: "hsl(0 0% 0%)",
    accentColor: "hsl(0 0% 0%)",
    bodyWidth: 290,
  },
  {
    num: "04 / 04",
    title: "DATA &\nINTELLIGENCE",
    body: "BI DASHBOARDS, KPI FRAMEWORKS, AND DECISION-SUPPORT SYSTEMS THAT DRIVE CLARITY AND FASTER EXECUTION.",
    color: "hsl(0 0% 100%)",
    textColor: "hsl(0 0% 0%)",
    accentColor: "hsl(0 0% 0%)",
    bodyWidth: 290,
  },
];

interface SolutionsSectionProps {
  onOpenSidebar?: () => void;
}

const SolutionsSection = ({ onOpenSidebar }: SolutionsSectionProps) => {
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

      if (revealRef.current) {
        gsap.set(revealRef.current, { xPercent: 100 });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 70%",
          onEnter: () => {
            gsap.to(revealRef.current, { xPercent: 0, duration: 0.9, ease: "power3.inOut" });
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
      style={{ background: "hsl(0 0% 3%)" }}
    >
      <div
        ref={revealRef}
        className="absolute inset-0"
        style={{ background: "hsl(32 22% 93%)", zIndex: 0 }}
      />

      <div className="relative z-10 py-24 md:py-40">
        <div className="px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto mb-12 md:mb-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <div
                className="solutions-eyebrow text-[11px] uppercase tracking-[0.18em] mb-6"
                style={{ color: "hsl(37 40% 61%)" }}
              >
                OUR ETHOS
              </div>
              <h2
                className="solutions-headline text-[28px] sm:text-[36px] md:text-[48px] font-light leading-[1.1] max-w-[500px]"
                style={{ color: "hsl(0 0% 10%)" }}
              >
                Vision Matters. Velocity Wins.
              </h2>
            </div>
            <div className="flex flex-col justify-end">
              <p
                className="text-[14px] md:text-[15px] leading-[1.75] mb-6 max-w-[480px]"
                style={{ color: "hsl(0 0% 40%)" }}
              >
                Our comprehensive technology platform shifts the odds. With infrastructure
                that works. With experts who&apos;ve been there. With the right pressure — pushing
                you forward, not under.
              </p>
              <button onClick={onOpenSidebar} className="relative inline-block px-5 py-3 hover-target group self-start">
                <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "hsl(0 0% 12% / 0.25)" }} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "hsl(0 0% 12% / 0.25)" }} />
                <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "hsl(0 0% 12% / 0.25)" }} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "hsl(0 0% 12% / 0.25)" }} />
                <span className="text-[12px] uppercase tracking-[0.12em]" style={{ color: "hsl(0 0% 12% / 0.75)" }}>
                  <LinkText>Join Us</LinkText>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: vertical stack, Desktop: horizontal row */}
        <div className="flex flex-col md:flex-row gap-2 px-4 sm:px-6 md:px-8" style={{ scrollbarWidth: "none" }}>
          {solutions.map((s, i) => {
            const isExpanded = expandedIndex === i;
            const hasExpanded = expandedIndex !== null;
            const flexValue = isExpanded ? 1.14 : hasExpanded ? 0.96 : 1;

            return (
              <div
                key={i}
                className="relative cursor-pointer overflow-hidden md:min-w-0"
                style={{
                  flex: `${flexValue} 1 0%`,
                  height: "auto",
                  minHeight: "320px",
                  background: s.color,
                  transition: "flex 0.55s cubic-bezier(0.76, 0, 0.24, 1)",
                  padding: "24px 22px 28px",
                  borderRadius: "18px",
                }}
                onMouseEnter={() => setExpandedIndex(i)}
                onMouseLeave={() => setExpandedIndex(null)}
              >
                <style>{`
                  @media (min-width: 768px) {
                    .solutions-card { height: 560px !important; min-height: 560px !important; }
                  }
                `}</style>
                <div className={`flex h-full flex-col items-center text-center solutions-card`}>
                  <h3
                    className="text-[18px] md:text-[24px] font-bold uppercase leading-[1.15] whitespace-pre-line"
                    style={{ color: s.textColor }}
                  >
                    {s.title}
                  </h3>

                  <div className="hidden md:flex flex-1 w-full items-center justify-center" style={{ padding: "18px 0 148px" }}>
                    <svg
                      width="240"
                      height="240"
                      viewBox="0 0 200 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ maxWidth: "72%", height: "auto" }}
                    >
                      {i === 0 && (
                        <>
                          {Array.from({ length: 16 }).map((_, j) => {
                            const angle = (j * 22.5 * Math.PI) / 180;
                            return (
                              <g key={j}>
                                {Array.from({ length: 8 }).map((_, k) => {
                                  const r = 15 + k * 10;
                                  return (
                                    <circle key={k} cx={100 + Math.cos(angle) * r} cy={100 + Math.sin(angle) * r} r="2.2" fill="#ffffff" />
                                  );
                                })}
                              </g>
                            );
                          })}
                        </>
                      )}
                      {i === 1 && (
                        <>
                          {Array.from({ length: 30 }).map((_, j) => {
                            const t = j / 29;
                            const spread = Math.sin(t * Math.PI) * 70;
                            return (
                              <path key={j} d={`M ${100 - spread} ${30 + j * 5} Q 100 ${30 + j * 5 - spread * 0.3} ${100 + spread} ${30 + j * 5}`} stroke="#000000" strokeWidth="1.4" fill="none" />
                            );
                          })}
                        </>
                      )}
                      {i === 2 && (
                        <>
                          {Array.from({ length: 24 }).map((_, j) => {
                            const angle = (j / 24) * Math.PI * 2;
                            const r = 75;
                            return (
                              <line key={j} x1="100" y1="100" x2={100 + Math.cos(angle) * r} y2={100 + Math.sin(angle) * r} stroke="#000000" strokeWidth="1.2" />
                            );
                          })}
                          {[20, 40, 60, 80].map((r) => (
                            <circle key={r} cx="100" cy="100" r={r} stroke="#000000" strokeWidth="0.8" fill="none" opacity="0.6" strokeDasharray="2 3" />
                          ))}
                        </>
                      )}
                      {i === 3 && (
                        <>
                          {Array.from({ length: 12 }).map((_, j) => (
                            <ellipse key={j} cx="100" cy="100" rx={15 + j * 7} ry={50 + j * 4} stroke="#000000" strokeWidth="1" fill="none" transform={`rotate(${j * 15} 100 100)`} />
                          ))}
                        </>
                      )}
                    </svg>
                  </div>

                  <div
                    className="mt-auto md:absolute md:left-1/2 md:bottom-[34px] md:-translate-x-1/2 text-center pt-4 md:pt-0"
                    style={{ width: "100%", maxWidth: `${s.bodyWidth}px` }}
                  >
                    <div className="text-[11px] uppercase tracking-[0.15em] mb-3 md:mb-5" style={{ color: s.accentColor }}>
                      {s.num}
                    </div>
                    <p
                      className="text-[9.5px] md:text-[10px] uppercase tracking-[0.08em] leading-[1.38] [text-wrap:balance] font-medium"
                      style={{ color: s.textColor }}
                    >
                      {s.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
