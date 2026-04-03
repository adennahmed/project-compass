import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const industries = [
  { name: "ARTIFICIAL INTELLIGENCE", desc: "Custom models, automation pipelines, and intelligent systems built for real business outcomes." },
  { name: "REVENUE TECHNOLOGY", desc: "CRM architecture, sales automation, and pipeline infrastructure engineered to close more." },
  { name: "BLOCKCHAIN & WEB3", desc: "Smart contracts, tokenization frameworks, and decentralized application development." },
  { name: "DATA & INTELLIGENCE", desc: "Business intelligence platforms, KPI dashboards, and decision-support systems for leadership." },
  { name: "OPERATIONAL INFRASTRUCTURE", desc: "Workflow automation, system integration, and process modernization that removes friction." },
  { name: "DIGITAL TRANSFORMATION", desc: "Full-stack modernization, legacy migration, and platform consolidation for the next stage." },
  { name: "ENTERPRISE SOFTWARE", desc: "Scalable, secure, and governance-aligned platforms built for complex organizational environments." },
  { name: "FINANCIAL TECHNOLOGY", desc: "Payment systems, investment platforms, and financial data infrastructure built for precision." },
];

const IndustriesMarquee = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const bracketRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafLoopRef = useRef<number | null>(null);

  const setItemRef = useCallback((el: HTMLDivElement | null, i: number) => {
    itemRefs.current[i] = el;
  }, []);

  useEffect(() => {
    gsap.from(".industries-title", {
      y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".industries-title", start: "top 85%" },
    });
  }, []);

  // Continuously track bracket position using RAF loop for perfectly synced animation
  useEffect(() => {
    const bracket = bracketRef.current;
    if (!bracket) return;

    // Cancel any existing loop
    if (rafLoopRef.current) {
      cancelAnimationFrame(rafLoopRef.current);
      rafLoopRef.current = null;
    }

    if (hoveredIndex === null) {
      gsap.to(bracket, { opacity: 0, duration: 0.2, ease: "power2.out" });
      return;
    }

    // Show bracket immediately
    gsap.set(bracket, { opacity: 1 });

    const startTime = performance.now();
    const trackDuration = 600; // track for duration of CSS transition

    const updatePosition = () => {
      const item = itemRefs.current[hoveredIndex];
      const container = itemsContainerRef.current;
      if (!item || !container) return;

      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const padX = 28;
      const padY = 14;
      const top = itemRect.top - containerRect.top - padY;
      const left = itemRect.left - containerRect.left - padX;
      const width = itemRect.width + padX * 2;
      const height = itemRect.height + padY * 2;

      // Direct style set for zero-lag tracking
      bracket.style.top = `${top}px`;
      bracket.style.left = `${left}px`;
      bracket.style.width = `${width}px`;
      bracket.style.height = `${height}px`;

      // Keep looping during the CSS transition
      if (performance.now() - startTime < trackDuration) {
        rafLoopRef.current = requestAnimationFrame(updatePosition);
      }
    };

    rafLoopRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (rafLoopRef.current) {
        cancelAnimationFrame(rafLoopRef.current);
        rafLoopRef.current = null;
      }
    };
  }, [hoveredIndex]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: "transparent" }}
    >
      <div className="relative z-10">
        <div
          className="industries-title text-[11px] uppercase tracking-[0.18em] text-center mb-16"
          style={{ color: "#444444" }}
        >
          INDUSTRIES WE SERVE
        </div>

        <div ref={itemsContainerRef} className="relative flex flex-col items-center gap-2 md:gap-3 px-6">
          {/* Animated bracket indicator */}
          <div
            ref={bracketRef}
            className="absolute pointer-events-none"
            style={{ opacity: 0, zIndex: 5 }}
          >
            <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
            <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
            <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
            <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
          </div>

          {industries.map((industry, i) => (
            <div
              key={i}
              ref={(el) => setItemRef(el, i)}
              className="relative text-center cursor-pointer py-2"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="uppercase leading-[1.1] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: hoveredIndex === i ? "56px" : "34px",
                  fontWeight: hoveredIndex === i ? 700 : 300,
                  color: hoveredIndex === i
                    ? "rgba(30,30,30,0.95)"
                    : hoveredIndex !== null
                      ? "rgba(30,30,30,0.12)"
                      : "rgba(30,30,30,0.4)",
                  letterSpacing: hoveredIndex === i ? "-0.02em" : "0",
                }}
              >
                {industry.name}
              </div>

              {/* Description on hover */}
              <div
                className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{
                  maxHeight: hoveredIndex === i ? "80px" : "0px",
                  opacity: hoveredIndex === i ? 1 : 0,
                }}
              >
                <p
                  className="text-[13px] leading-[1.6] max-w-[500px] mx-auto mt-2"
                  style={{ color: "rgba(30,30,30,0.55)" }}
                >
                  {industry.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p
          className="text-center text-[15px] mt-16 px-6"
          style={{ color: "rgba(30,30,30,0.5)" }}
        >
          Every industry has a different shape. The standard of execution never changes.
        </p>

        <div className="flex justify-center mt-12">
          <img src="/kozai-logo-black.svg" alt="Kozai" className="h-5 opacity-30" />
        </div>
      </div>
    </section>
  );
};

export default IndustriesMarquee;
