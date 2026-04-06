import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/use-mobile";

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

const BRACKET_PAD_X = 28;
const BRACKET_PAD_Y = 14;

const IndustriesMarquee = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const bracketRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafIdRef = useRef<number | null>(null);

  const setItemRef = useCallback((el: HTMLDivElement | null, i: number) => {
    itemRefs.current[i] = el;
  }, []);

  useEffect(() => {
    gsap.from(".industries-title", {
      y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".industries-title", start: "top 85%" },
    });
  }, []);

  const updateBracket = useCallback(() => {
    const bracket = bracketRef.current;
    const container = itemsContainerRef.current;
    if (!bracket || !container || hoveredIndex === null) return;

    const item = itemRefs.current[hoveredIndex];
    if (!item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    bracket.style.top = `${itemRect.top - containerRect.top - BRACKET_PAD_Y}px`;
    bracket.style.left = `${itemRect.left - containerRect.left - BRACKET_PAD_X}px`;
    bracket.style.width = `${itemRect.width + BRACKET_PAD_X * 2}px`;
    bracket.style.height = `${itemRect.height + BRACKET_PAD_Y * 2}px`;
  }, [hoveredIndex]);

  // RAF loop that continuously repositions the bracket every frame
  useEffect(() => {
    const bracket = bracketRef.current;
    if (!bracket) return;

    if (hoveredIndex === null) {
      bracket.style.opacity = "0";
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      return;
    }

    bracket.style.opacity = "1";
    const startTime = performance.now();

    const loop = () => {
      updateBracket();
      // Keep tracking for 700ms (longer than CSS transition)
      if (performance.now() - startTime < 700) {
        rafIdRef.current = requestAnimationFrame(loop);
      }
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [hoveredIndex, updateBracket]);

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
          {/* Animated bracket — uses transition for smooth visual but position is set via RAF */}
          <div
            ref={bracketRef}
            className="absolute pointer-events-none"
            style={{
              opacity: 0,
              zIndex: 5,
              transition: "opacity 0.2s ease",
            }}
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
                  fontSize: hoveredIndex === i
                    ? (window.innerWidth < 768 ? "28px" : "56px")
                    : (window.innerWidth < 768 ? "18px" : "34px"),
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
