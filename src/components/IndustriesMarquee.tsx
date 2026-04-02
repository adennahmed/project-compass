import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const industries = [
  { name: "REVENUE TECHNOLOGY", desc: "CRM systems, sales automation, and pipeline infrastructure driving measurable growth." },
  { name: "OPERATIONAL INFRASTRUCTURE", desc: "Workflow automation, system integration, and process modernization at scale." },
  { name: "DIGITAL TRANSFORMATION", desc: "Legacy migration, platform consolidation, and full-stack modernization." },
  { name: "DATA & INTELLIGENCE", desc: "Business intelligence, reporting architecture, and decision-support systems." },
  { name: "FINANCIAL SERVICES", desc: "Portfolio platforms, compliance systems, and investor communication tools." },
  { name: "HEALTHCARE TECHNOLOGY", desc: "Patient engagement, back-office automation, and clinical data systems." },
  { name: "PROFESSIONAL SERVICES", desc: "Client management platforms and operational efficiency for service firms." },
  { name: "RETAIL & E-COMMERCE", desc: "E-commerce integration, customer data infrastructure, and retention systems." },
  { name: "MANUFACTURING & OPERATIONS", desc: "ERP integration, supply chain visibility, and operational dashboards." },
  { name: "ENTERPRISE SOFTWARE", desc: "Scalable platform architecture for complex organizational requirements." },
  { name: "INVESTMENT & FINANCE", desc: "Real-time reporting, portfolio analytics, and stakeholder communication." },
  { name: "REAL ESTATE TECHNOLOGY", desc: "Property management systems, deal flow platforms, and market intelligence." },
];

const IndustriesMarquee = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    gsap.from(".industries-title", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: ".industries-title", start: "top 85%" },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-36"
      style={{ background: "#EEEAE4" }}
    >
      <div
        className="industries-title text-[11px] uppercase tracking-[0.18em] text-center mb-16"
        style={{ color: "#444444" }}
      >
        INDUSTRIES WE SERVE
      </div>

      <div className="flex flex-col items-center gap-2 md:gap-3 px-6">
        {industries.map((industry, i) => (
          <div
            key={i}
            className="relative text-center cursor-pointer"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Industry name */}
            <div
              className="uppercase leading-[1.1] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: hoveredIndex === i ? "64px" : "36px",
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

            {/* Expand bracket + description on hover */}
            <div
              className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
              style={{
                maxHeight: hoveredIndex === i ? "120px" : "0px",
                opacity: hoveredIndex === i ? 1 : 0,
              }}
            >
              <div className="relative inline-block mt-3 mb-2 px-8 py-4">
                {/* Corner brackets */}
                <span className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
                <span className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
                <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
                <p
                  className="text-[13px] leading-[1.6] max-w-[440px]"
                  style={{ color: "rgba(30,30,30,0.55)" }}
                >
                  {industry.desc}
                </p>
              </div>
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
        <img
          src="/kozai-logo-black.svg"
          alt="Kozai"
          className="h-5 opacity-30"
        />
      </div>
    </section>
  );
};

export default IndustriesMarquee;
