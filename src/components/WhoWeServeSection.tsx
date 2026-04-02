import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const segments = [
  {
    num: "01",
    title: "Small Business",
    subtitle: "Professionalizing Growth",
    body: "Early-stage and smaller companies face a consistent challenge: meaningful opportunities exist, but the systems aren't built to capture them efficiently. Kozai implements the software foundation that makes growth repeatable.",
    items: [
      "CRM and pipeline setup",
      "Automation and reporting foundations",
      "Process structure for scale",
    ],
  },
  {
    num: "02",
    title: "Mid-Market",
    subtitle: "Converting Momentum to Leverage",
    body: "Mid-market businesses have proven product and real revenue — but legacy tools and disconnected systems create drag. Kozai reengineers the operating layer so growth continues with precision.",
    items: [
      "System integration and modernization",
      "Workflow re-engineering",
      "Data visibility and decision velocity",
    ],
  },
  {
    num: "03",
    title: "Enterprise",
    subtitle: "Scale With Architecture",
    body: "Large organizations need governance, interoperability, and strategic alignment across multiple functions. Kozai operates as a trusted technology partner capable of supporting scale with discipline.",
    items: [
      "Enterprise platform architecture",
      "Cross-functional system alignment",
      "Executive-level reporting and intelligence",
    ],
  },
];

const WhoWeServeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".serve-headline", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".serve-headline", start: "top 85%" },
      });

      gsap.from(".serve-card", {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".serve-cards", start: "top 82%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 md:py-40 px-6 md:px-12 max-w-[1200px] mx-auto">
      <div
        className="text-[11px] uppercase tracking-[0.18em] mb-6"
        style={{ color: "#C8A96E" }}
      >
        WHO WE SERVE
      </div>
      <h2 className="serve-headline text-[36px] md:text-[48px] font-light leading-[1.1] mb-20 max-w-[700px]">
        One Operating Standard. Three Stages of Growth.
      </h2>

      <div className="serve-cards grid md:grid-cols-3 gap-6">
        {segments.map((seg, i) => {
          const isHovered = hoveredIndex === i;
          const hasHover = hoveredIndex !== null;

          return (
            <div
              key={seg.num}
              className="serve-card relative p-8 md:p-10 flex flex-col cursor-default"
              style={{
                border: `1px solid ${isHovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "2px",
                background: isHovered ? "#111111" : "transparent",
                transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                opacity: hasHover && !isHovered ? 0.5 : 1,
                transition: "all 0.4s cubic-bezier(0.76, 0, 0.24, 1)",
                minHeight: "380px",
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span
                className="text-[13px] block mb-5"
                style={{ color: "#444444" }}
              >
                {seg.num}
              </span>
              <h3 className="text-[24px] font-medium mb-1">{seg.title}</h3>
              <p className="text-[14px] mb-6" style={{ color: "#C8A96E" }}>
                {seg.subtitle}
              </p>
              <p
                className="text-[15px] leading-[1.75] mb-6"
                style={{ color: "#888888" }}
              >
                {seg.body}
              </p>
              <ul className="space-y-2 mt-auto">
                {seg.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-[14px] flex items-start gap-2"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    <span style={{ color: "#C8A96E" }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhoWeServeSection;
