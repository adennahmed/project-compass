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
    color: "#E8704A",
    textColor: "#1a1a1a",
    accentColor: "#1a1a1a",
  },
  {
    num: "04 / 04",
    title: "DATA &\nINTELLIGENCE",
    body: "BI DASHBOARDS, KPI FRAMEWORKS, AND DECISION-SUPPORT SYSTEMS THAT DRIVE CLARITY AND FASTER EXECUTION.",
    color: "#C4B9A8",
    textColor: "#1a1a1a",
    accentColor: "#555555",
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
          className="flex gap-2 px-6 md:px-8"
          style={{ scrollbarWidth: "none" }}
        >
          {solutions.map((s, i) => {
            const isExpanded = expandedIndex === i;
            const hasExpanded = expandedIndex !== null;
            // Use flex-based sizing for smooth proportional distribution
            const flexValue = isExpanded ? 4 : hasExpanded ? 1 : 1;

            return (
              <div
                key={i}
                className="relative flex flex-col justify-between cursor-pointer overflow-hidden"
                style={{
                  flex: flexValue,
                  minWidth: 0,
                  height: "560px",
                  background: s.color,
                  transition: "flex 0.6s cubic-bezier(0.76, 0, 0.24, 1)",
                  padding: "40px 36px",
                  borderRadius: "12px",
                }}
                onMouseEnter={() => setExpandedIndex(i)}
                onMouseLeave={() => setExpandedIndex(null)}
              >
                <h3
                  className="text-[20px] md:text-[24px] font-bold uppercase leading-[1.15] whitespace-pre-line text-center transition-opacity duration-300"
                  style={{ color: s.textColor }}
                >
                  {s.title}
                </h3>

                <div
                  className="flex-1 flex items-center justify-center transition-opacity duration-500"
                  style={{ opacity: isExpanded ? 1 : 0.5 }}
                >
                  <svg
                    width="240"
                    height="240"
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ opacity: 0.6, maxWidth: "100%", height: "auto" }}
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
                                  <circle key={k} cx={100 + Math.cos(angle) * r} cy={100 + Math.sin(angle) * r} r="1.5" fill={s.textColor} opacity={0.6 - k * 0.05} />
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
                            <path key={j} d={`M ${100 - spread} ${30 + j * 5} Q 100 ${30 + j * 5 - spread * 0.3} ${100 + spread} ${30 + j * 5}`} stroke={s.textColor} strokeWidth="0.8" fill="none" opacity={0.5} />
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
                            <line key={j} x1="100" y1="100" x2={100 + Math.cos(angle) * r} y2={100 + Math.sin(angle) * r} stroke={s.textColor} strokeWidth="0.6" opacity={0.5} />
                          );
                        })}
                        {[20, 40, 60, 80].map((r) => (
                          <circle key={r} cx="100" cy="100" r={r} stroke={s.textColor} strokeWidth="0.4" fill="none" opacity={0.3} strokeDasharray="2 3" />
                        ))}
                      </>
                    )}
                    {i === 3 && (
                      <>
                        {Array.from({ length: 12 }).map((_, j) => (
                          <ellipse key={j} cx="100" cy="100" rx={15 + j * 7} ry={50 + j * 4} stroke={s.textColor} strokeWidth="0.6" fill="none" transform={`rotate(${j * 15} 100 100)`} opacity={0.45} />
                        ))}
                      </>
                    )}
                  </svg>
                </div>

                <div className="text-center">
                  <div className="text-[11px] uppercase tracking-[0.15em] mb-4" style={{ color: s.accentColor, opacity: 0.7 }}>
                    {s.num}
                  </div>
                  <p
                    className="text-[10px] md:text-[11px] uppercase tracking-[0.08em] leading-[1.7]"
                    style={{
                      color: s.textColor,
                      opacity: isExpanded ? 0.85 : 0.55,
                      transition: "opacity 0.5s cubic-bezier(0.76, 0, 0.24, 1)",
                    }}
                  >
                    {s.body}
                  </p>
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
