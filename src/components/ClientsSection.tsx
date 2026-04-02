import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "./LinkText";

gsap.registerPlugin(ScrollTrigger);

const clients = [
  {
    industry: "FINANCIAL SERVICES",
    name: "Meridian Partners",
    desc: "CRM architecture and revenue pipeline modernization.",
    stat: "↑ 34% increase in pipeline velocity within 90 days.",
  },
  {
    industry: "PROFESSIONAL SERVICES",
    name: "Northbridge Group",
    desc: "Full operational audit and workflow automation implementation.",
    stat: "↓ 40% reduction in manual reporting overhead.",
  },
  {
    industry: "RETAIL & E-COMMERCE",
    name: "Vantage Retail Co.",
    desc: "E-commerce platform integration and customer data infrastructure.",
    stat: "↑ 22% improvement in repeat customer retention rate.",
  },
  {
    industry: "MANUFACTURING & OPERATIONS",
    name: "Harlow Industries",
    desc: "ERP integration and operational dashboard deployment.",
    stat: "Unified data across 4 business units for the first time.",
  },
  {
    industry: "HEALTHCARE TECHNOLOGY",
    name: "Clearview Health",
    desc: "Patient engagement platform and back-office automation build.",
    stat: "↓ 60% reduction in administrative processing time.",
  },
  {
    industry: "INVESTMENT & FINANCE",
    name: "Stratum Capital",
    desc: "Portfolio reporting platform and investor communication systems.",
    stat: "Real-time reporting delivered to 12 investment partners.",
  },
];

const ClientsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [counter, setCounter] = useState("01 / 06");

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -(100 - 100 / 6),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=400%",
          onUpdate: (self) => {
            const cardIndex = Math.min(
              Math.floor(self.progress * 6) + 1,
              6
            );
            setCounter(`0${cardIndex} / 06`);
          },
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: "100vh" }}
      data-cursor="drag"
    >
      <div className="flex h-full">
        {/* Left Static Column */}
        <div className="hidden md:flex flex-col justify-between w-[400px] flex-shrink-0 p-12 pt-24 pb-12">
          <div>
            <div
              className="text-[11px] uppercase tracking-[0.18em] mb-6"
              style={{ color: "#444444" }}
            >
              SELECTED CLIENTS
            </div>
            <h2 className="text-[36px] md:text-[42px] font-light leading-[1.1] mb-6">
              Companies We've Strengthened.
            </h2>
            <p
              className="text-[15px] leading-[1.75] mb-8"
              style={{ color: "#888888" }}
            >
              Our work spans industries and stages of growth. The standard is
              always the same: technology that produces measurable commercial
              outcomes.
            </p>
            <a
              href="#"
              className="text-[14px] hover-target"
              style={{ color: "#C8A96E" }}
            >
              <LinkText>Explore All Work →</LinkText>
            </a>
          </div>
          <div className="text-[13px]" style={{ color: "#444444" }}>
            {counter}
          </div>
        </div>

        {/* Cards Track */}
        <div
          ref={trackRef}
          className="flex items-center gap-6 pl-6 md:pl-0 pr-12"
        >
          {/* Mobile header card */}
          <div className="md:hidden flex-shrink-0 w-[300px] p-6">
            <div
              className="text-[11px] uppercase tracking-[0.18em] mb-4"
              style={{ color: "#444444" }}
            >
              SELECTED CLIENTS
            </div>
            <h2 className="text-[28px] font-light leading-[1.1] mb-4">
              Companies We've Strengthened.
            </h2>
            <div className="text-[13px]" style={{ color: "#444444" }}>
              {counter}
            </div>
          </div>

          {clients.map((client, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col justify-between"
              style={{
                width: "460px",
                height: "540px",
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "3px",
                padding: "40px",
              }}
              data-cursor="view"
            >
              <div>
                <span
                  className="text-[11px] uppercase tracking-[0.18em] block mb-6"
                  style={{ color: "#444444" }}
                >
                  {client.industry}
                </span>
                <h3 className="text-[28px] font-normal mb-4">{client.name}</h3>
                <p
                  className="text-[15px] leading-[1.75] mb-6"
                  style={{ color: "#888888" }}
                >
                  {client.desc}
                </p>
                <p className="text-[14px]" style={{ color: "#C8A96E" }}>
                  {client.stat}
                </p>
              </div>
              <a
                href="#"
                className="text-[14px] hover-target"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                <LinkText>View Case →</LinkText>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
