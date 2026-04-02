import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "./LinkText";

gsap.registerPlugin(ScrollTrigger);

const clients = [
  {
    name: "Meridian Partners",
    industry: "FINANCIAL SERVICES",
    desc: "CRM architecture and revenue pipeline modernization.",
    stat: "↑ 34% increase in pipeline velocity within 90 days.",
  },
  {
    name: "Northbridge Group",
    industry: "PROFESSIONAL SERVICES",
    desc: "Full operational audit and workflow automation implementation.",
    stat: "↓ 40% reduction in manual reporting overhead.",
  },
  {
    name: "Vantage Retail Co.",
    industry: "RETAIL & E-COMMERCE",
    desc: "E-commerce platform integration and customer data infrastructure.",
    stat: "↑ 22% improvement in repeat customer retention rate.",
  },
  {
    name: "Harlow Industries",
    industry: "MANUFACTURING & OPERATIONS",
    desc: "ERP integration and operational dashboard deployment.",
    stat: "Unified data across 4 business units for the first time.",
  },
  {
    name: "Clearview Health",
    industry: "HEALTHCARE TECHNOLOGY",
    desc: "Patient engagement platform and back-office automation build.",
    stat: "↓ 60% reduction in administrative processing time.",
  },
  {
    name: "Stratum Capital",
    industry: "INVESTMENT & FINANCE",
    desc: "Portfolio reporting platform and investor communication systems.",
    stat: "Real-time reporting delivered to 12 investment partners.",
  },
];

const ClientsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimating = useRef(false);

  const navigateTo = (index: number) => {
    if (isAnimating.current || index === activeIndex || index < 0 || index >= clients.length) return;
    isAnimating.current = true;

    const card = document.querySelector('.client-active-card');
    if (card) {
      gsap.to(card, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(index);
          gsap.fromTo(card, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", onComplete: () => { isAnimating.current = false; } }
          );
        },
      });
    } else {
      setActiveIndex(index);
      isAnimating.current = false;
    }
  };

  useEffect(() => {
    gsap.from(".clients-headline", {
      y: 45,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: { trigger: ".clients-headline", start: "top 82%" },
    });
  }, []);

  const client = clients[activeIndex];

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="py-32 md:py-40"
      style={{ background: "#EEEAE4" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-4">
          <div
            className="text-[11px] uppercase tracking-[0.18em] mb-6"
            style={{ color: "#444444" }}
          >
            OUR PORTFOLIO
          </div>
          <h2
            className="clients-headline text-[32px] md:text-[44px] font-light leading-[1.1] mb-6 max-w-[700px] mx-auto"
            style={{ color: "#1a1a1a" }}
          >
            Companies We've Strengthened.
          </h2>
        </div>

        {/* CTA bracket button */}
        <div className="flex justify-center mb-16">
          <a href="#contact" className="relative inline-block px-6 py-3 hover-target group">
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
            <span className="text-[12px] uppercase tracking-[0.12em]" style={{ color: "#1a1a1a" }}>
              Explore All Work
            </span>
          </a>
        </div>

        {/* Featured Client Card - centered */}
        <div className="flex justify-center items-start gap-8">
          {/* Side indicators - prev */}
          <div className="hidden md:flex flex-col items-end justify-center gap-4 min-w-[160px] pt-20">
            {activeIndex > 0 && (
              <button
                onClick={() => navigateTo(activeIndex - 1)}
                className="text-right hover-target opacity-40 hover:opacity-70 transition-opacity"
              >
                <div className="text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: "#1a1a1a" }}>
                  {clients[activeIndex - 1].name}
                </div>
              </button>
            )}
          </div>

          {/* Main card */}
          <div
            className="client-active-card relative flex flex-col items-center text-center p-10 md:p-14 w-full max-w-[480px]"
            style={{
              background: "#f5f2ed",
              borderRadius: "4px",
              minHeight: "520px",
            }}
          >
            {/* Corner brackets */}
            <span className="absolute top-4 left-4 w-4 h-4 border-t border-l" style={{ borderColor: "rgba(30,30,30,0.15)" }} />
            <span className="absolute top-4 right-4 w-4 h-4 border-t border-r" style={{ borderColor: "rgba(30,30,30,0.15)" }} />
            <span className="absolute bottom-4 left-4 w-4 h-4 border-b border-l" style={{ borderColor: "rgba(30,30,30,0.15)" }} />
            <span className="absolute bottom-4 right-4 w-4 h-4 border-b border-r" style={{ borderColor: "rgba(30,30,30,0.15)" }} />

            <h3
              className="text-[22px] md:text-[26px] font-semibold uppercase tracking-[0.04em] mb-8 mt-6"
              style={{ color: "#1a1a1a" }}
            >
              {client.name}
            </h3>

            <div
              className="text-[11px] uppercase tracking-[0.18em] mb-4"
              style={{ color: "rgba(30,30,30,0.4)" }}
            >
              {client.industry}
            </div>

            <p
              className="text-[13px] leading-[1.6] mb-6 max-w-[320px]"
              style={{ color: "rgba(30,30,30,0.55)" }}
            >
              {client.desc}
            </p>

            <p
              className="text-[13px] font-medium mb-auto"
              style={{ color: "#C8A96E" }}
            >
              {client.stat}
            </p>

            {/* Bottom link */}
            <div className="mt-8">
              <a href="#" className="relative inline-block px-5 py-2.5 hover-target group">
                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l transition-all duration-300 group-hover:w-3 group-hover:h-3" style={{ borderColor: "rgba(30,30,30,0.2)" }} />
                <span className="absolute top-0 right-0 w-2 h-2 border-t border-r transition-all duration-300 group-hover:w-3 group-hover:h-3" style={{ borderColor: "rgba(30,30,30,0.2)" }} />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-all duration-300 group-hover:w-3 group-hover:h-3" style={{ borderColor: "rgba(30,30,30,0.2)" }} />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-all duration-300 group-hover:w-3 group-hover:h-3" style={{ borderColor: "rgba(30,30,30,0.2)" }} />
                <span className="text-[11px] uppercase tracking-[0.12em]" style={{ color: "rgba(30,30,30,0.6)" }}>
                  View Case
                </span>
              </a>
            </div>
          </div>

          {/* Side indicators - next */}
          <div className="hidden md:flex flex-col items-start justify-center gap-4 min-w-[160px] pt-20">
            {activeIndex < clients.length - 1 && (
              <button
                onClick={() => navigateTo(activeIndex + 1)}
                className="text-left hover-target opacity-40 hover:opacity-70 transition-opacity"
              >
                <div className="text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: "#1a1a1a" }}>
                  {clients[activeIndex + 1].name}
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-3 mt-10">
          {clients.map((_, i) => (
            <button
              key={i}
              onClick={() => navigateTo(i)}
              className="w-2 h-2 rounded-full transition-all duration-300 hover-target"
              style={{
                background: i === activeIndex ? "#1a1a1a" : "rgba(30,30,30,0.2)",
                transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="text-center mt-4">
          <span className="text-[13px]" style={{ color: "rgba(30,30,30,0.35)" }}>
            0{activeIndex + 1} / 0{clients.length}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
