import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const segments = [
  {
    num: "01",
    title: "Small Business",
    subtitle: "Professionalizing Growth",
    body: "Early-stage and smaller companies face a consistent challenge: meaningful opportunities exist, but the systems aren't built to capture them efficiently. Kozai implements the software foundation that makes growth repeatable rather than chaotic.",
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
    body: "Mid-market businesses have proven product and real revenue — but legacy tools and disconnected systems create drag. Kozai reengineers the operating layer so growth continues with precision and less friction.",
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
    body: "Large organizations need more than software — they need governance, interoperability, and strategic alignment across multiple functions and stakeholders. Kozai operates as a trusted technology partner capable of supporting scale with discipline.",
    items: [
      "Enterprise platform architecture",
      "Cross-functional system alignment",
      "Executive-level reporting and intelligence",
    ],
  },
];

const WhoWeServeSection = () => {
  useEffect(() => {
    gsap.from(".serve-headline", {
      y: 45,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: { trigger: ".serve-headline", start: "top 82%" },
    });

    document.querySelectorAll(".segment-panel").forEach((panel) => {
      const el = panel as HTMLElement;
      el.addEventListener("mouseenter", () => {
        gsap.to(el, {
          backgroundColor: "#111111",
          borderColor: "rgba(255,255,255,0.16)",
          duration: 0.3,
        });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, {
          backgroundColor: "transparent",
          borderColor: "rgba(255,255,255,0.07)",
          duration: 0.3,
        });
      });
    });
  }, []);

  return (
    <section className="py-32 md:py-40 px-6 md:px-12 max-w-[1200px] mx-auto">
      <div
        className="text-[11px] uppercase tracking-[0.18em] mb-6"
        style={{ color: "#444444" }}
      >
        WHO WE SERVE
      </div>
      <h2 className="serve-headline text-[36px] md:text-[48px] font-light leading-[1.1] mb-16 max-w-[700px]">
        One Operating Standard. Three Stages of Growth.
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {segments.map((seg) => (
          <div
            key={seg.num}
            className="segment-panel p-8"
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "3px",
              transition: "background-color 0.3s, border-color 0.3s",
            }}
          >
            <span
              className="text-[13px] block mb-4"
              style={{ color: "#444444" }}
            >
              {seg.num}
            </span>
            <h3 className="text-[24px] font-medium mb-1">{seg.title}</h3>
            <p
              className="text-[14px] mb-6"
              style={{ color: "#C8A96E" }}
            >
              {seg.subtitle}
            </p>
            <p
              className="text-[15px] leading-[1.75] mb-6"
              style={{ color: "#888888" }}
            >
              {seg.body}
            </p>
            <ul className="space-y-2">
              {seg.items.map((item, i) => (
                <li
                  key={i}
                  className="text-[14px] flex items-start gap-2"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  <span style={{ color: "#C8A96E" }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhoWeServeSection;
