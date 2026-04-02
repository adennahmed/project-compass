import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const solutions = [
  {
    tab: "Revenue Technology",
    num: "01",
    body: "CRM architecture, sales automation, pipeline visibility platforms, and customer journey infrastructure. Built so your team closes more, retains more, and operates with commercial precision from day one.",
    outcomes:
      "Faster pipeline velocity, reduced sales cycle length, improved retention rates, full funnel visibility for leadership.",
  },
  {
    tab: "Operational Infrastructure",
    num: "02",
    body: "Workflow automation, system integration, reporting platforms, and process modernization. We eliminate the operational friction that bleeds margin, slows decision-making, and stalls your growth trajectory.",
    outcomes:
      "Reduced manual overhead, connected systems, faster internal reporting, measurable reduction in process cost.",
  },
  {
    tab: "Digital Transformation",
    num: "03",
    body: "Legacy system migration, full-stack modernization, platform consolidation, and technology roadmapping. We rebuild the operating foundation your next stage of growth demands — without disrupting what's already working.",
    outcomes:
      "Modernized infrastructure, reduced technical debt, consolidated platforms, faster deployment of new capabilities.",
  },
  {
    tab: "Data & Intelligence",
    num: "04",
    body: "Business intelligence dashboards, reporting architecture, KPI frameworks, and decision-support systems. We turn data from a background byproduct into a leadership tool that drives clarity and faster execution.",
    outcomes:
      "Real-time reporting, executive dashboards, KPI alignment, data-driven decision velocity across all business functions.",
  },
];

const SolutionsSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    gsap.from(".solutions-eyebrow", {
      y: 25,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: ".solutions-eyebrow", start: "top 84%" },
    });
    gsap.from(".solutions-headline", {
      y: 45,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: { trigger: ".solutions-headline", start: "top 82%" },
    });
  }, []);

  return (
    <section id="solutions" className="py-32 md:py-40 px-6 md:px-12 max-w-[1200px] mx-auto">
      <div
        className="solutions-eyebrow text-[11px] uppercase tracking-[0.18em] mb-6"
        style={{ color: "#444444" }}
      >
        WHAT WE BUILD
      </div>
      <h2 className="solutions-headline text-[36px] md:text-[48px] lg:text-[56px] font-light leading-[1.1] mb-16 max-w-[700px]">
        Software and Systems Engineered for Revenue.
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-12">
        {solutions.map((s, i) => (
          <button
            key={i}
            className="text-[13px] px-5 py-2.5 transition-all duration-200 hover-target"
            style={{
              background: activeTab === i ? "#111111" : "transparent",
              border:
                activeTab === i
                  ? "1px solid rgba(255,255,255,0.12)"
                  : "1px solid rgba(255,255,255,0.07)",
              color: activeTab === i ? "#C8A96E" : "#888888",
              borderRadius: "2px",
            }}
            onClick={() => setActiveTab(i)}
          >
            <span className="mr-2" style={{ color: "#444444" }}>
              {s.num}
            </span>
            {s.tab}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div
        className="p-8 md:p-12"
        style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "3px",
        }}
      >
        <h3 className="text-[24px] md:text-[30px] font-normal mb-6">
          {solutions[activeTab].tab}
        </h3>
        <p
          className="text-[16px] leading-[1.75] mb-8 max-w-[640px]"
          style={{ color: "#888888" }}
        >
          {solutions[activeTab].body}
        </p>
        <div>
          <span
            className="text-[11px] uppercase tracking-[0.18em] block mb-3"
            style={{ color: "#444444" }}
          >
            KEY OUTCOMES
          </span>
          <p className="text-[15px] leading-[1.75]" style={{ color: "#C8A96E" }}>
            {solutions[activeTab].outcomes}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
