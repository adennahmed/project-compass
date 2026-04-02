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

// Dot background canvas
const DotBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.parentElement?.offsetWidth || window.innerWidth;
      const h = canvas.parentElement?.offsetHeight || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, w, h);
      const spacing = 28;
      for (let x = spacing; x < w; x += spacing) {
        for (let y = spacing; y < h; y += spacing) {
          // Radial fade from center
          const dx = x - w / 2;
          const dy = y - h / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2);
          const alpha = Math.max(0, 0.18 - (dist / maxDist) * 0.15);
          
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(60, 56, 50, ${alpha})`;
          ctx.fill();
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
};

const IndustriesMarquee = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const bracketRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setItemRef = useCallback((el: HTMLDivElement | null, i: number) => {
    itemRefs.current[i] = el;
  }, []);

  useEffect(() => {
    gsap.from(".industries-title", {
      y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".industries-title", start: "top 85%" },
    });
  }, []);

  // Animate bracket to hovered item
  useEffect(() => {
    const bracket = bracketRef.current;
    if (!bracket) return;

    if (hoveredIndex === null) {
      gsap.to(bracket, { opacity: 0, duration: 0.25, ease: "power2.out" });
      return;
    }

    const item = itemRefs.current[hoveredIndex];
    if (!item || !sectionRef.current) return;

    const sectionRect = sectionRef.current.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const top = itemRect.top - sectionRect.top - 12;
    const left = itemRect.left - sectionRect.left - 16;
    const width = itemRect.width + 32;
    const height = itemRect.height + 24;

    gsap.to(bracket, {
      top, left, width, height,
      opacity: 1,
      duration: 0.35,
      ease: "power3.out",
    });
  }, [hoveredIndex]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: "#EEEAE4" }}
    >
      <DotBackground />

      <div className="relative z-10">
        <div
          className="industries-title text-[11px] uppercase tracking-[0.18em] text-center mb-16"
          style={{ color: "#444444" }}
        >
          INDUSTRIES WE SERVE
        </div>

        <div className="relative flex flex-col items-center gap-2 md:gap-3 px-6">
          {/* Animated bracket indicator */}
          <div
            ref={bracketRef}
            className="absolute pointer-events-none"
            style={{ opacity: 0, zIndex: 5 }}
          >
            <span className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: "rgba(30,30,30,0.35)" }} />
            <span className="absolute top-0 right-0 w-4 h-4 border-t border-r" style={{ borderColor: "rgba(30,30,30,0.35)" }} />
            <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l" style={{ borderColor: "rgba(30,30,30,0.35)" }} />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r" style={{ borderColor: "rgba(30,30,30,0.35)" }} />
          </div>

          {industries.map((industry, i) => (
            <div
              key={i}
              ref={(el) => setItemRef(el, i)}
              className="relative text-center cursor-pointer py-1"
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
