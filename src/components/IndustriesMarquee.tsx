import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const industries = [
  "REVENUE TECHNOLOGY",
  "OPERATIONAL INFRASTRUCTURE",
  "DIGITAL TRANSFORMATION",
  "DATA & INTELLIGENCE",
  "FINANCIAL SERVICES",
  "HEALTHCARE TECHNOLOGY",
  "PROFESSIONAL SERVICES",
  "RETAIL & E-COMMERCE",
  "MANUFACTURING & OPERATIONS",
  "ENTERPRISE SOFTWARE",
  "INVESTMENT & FINANCE",
  "REAL ESTATE TECHNOLOGY",
];

const IndustriesMarquee = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const updateItems = () => {
      const vh = window.innerHeight;
      const center = vh / 2;

      itemsRef.current.forEach((item) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenter - center);
        const maxDist = vh * 0.52;
        const proximity = Math.max(0, 1 - distance / maxDist);
        const eased = Math.pow(proximity, 1.4);

        const opacity = 0.14 + eased * 0.86;
        const weight = Math.round(200 + eased * 500);
        const size = 36 + eased * 44;

        gsap.set(item, {
          opacity,
          fontWeight: weight,
          fontSize: size + "px",
          color: `rgba(30,30,30,${0.2 + eased * 0.8})`,
        });
      });
    };

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: updateItems,
    });

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="marquee-section py-20 md:py-32"
      style={{ background: "#EEEAE4" }}
    >
      <div
        className="text-[11px] uppercase tracking-[0.18em] text-center mb-16"
        style={{ color: "#444444" }}
      >
        INDUSTRIES WE SERVE
      </div>

      <div className="flex flex-col items-center gap-4 md:gap-6 px-6">
        {industries.map((name, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) itemsRef.current[i] = el;
            }}
            className="marquee-item text-center uppercase leading-[1.1] transition-none"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "rgba(30,30,30,0.2)",
              fontSize: "36px",
              fontWeight: 200,
            }}
          >
            {name}
          </div>
        ))}
      </div>

      <p
        className="text-center text-[15px] mt-16 px-6"
        style={{ color: "rgba(30,30,30,0.5)" }}
      >
        Every industry has a different shape. The standard of execution never
        changes.
      </p>

      {/* Black logo for light section */}
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
