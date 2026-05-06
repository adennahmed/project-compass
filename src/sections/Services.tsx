import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

interface Service {
  n: string;
  title: string;
  oneLiner: string;
  blurb: string;
  meta: string[];
}

const SERVICES: Service[] = [
  {
    n: "01",
    title: "Internal tools & dashboards",
    oneLiner: "Your ops team stops copy-pasting between spreadsheets.",
    blurb:
      "Custom admin panels, KPI dashboards, and operations consoles built on the data you already have. Replace four browser tabs with one screen your team actually wants to open.",
    meta: ["Admin", "Reporting", "Console"],
  },
  {
    n: "02",
    title: "Workflow automation",
    oneLiner: "The job that took an afternoon now runs while you sleep.",
    blurb:
      "Pipelines that connect the systems your business runs on — CRM, billing, support, fulfilment. Reliable, observable, debuggable in plain English.",
    meta: ["Pipelines", "Glue", "Jobs"],
  },
  {
    n: "03",
    title: "Client-facing platforms",
    oneLiner: "From whiteboard to first paying user.",
    blurb:
      "Production-grade web apps for product teams: auth, billing, multi-tenancy, the lot. Designed for launch day and the messier days that follow.",
    meta: ["SaaS", "Web", "Mobile"],
  },
  {
    n: "04",
    title: "Data & decision support",
    oneLiner: "Stop arguing about what the number is.",
    blurb:
      "Single-source-of-truth pipelines that feed reporting, ML, and the C-suite alike. We build the warehouse, the models, and the dashboards your operators trust.",
    meta: ["Warehouse", "ML", "Insights"],
  },
];

const Services = () => {
  const [hover, setHover] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle bg tint shift on enter
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          el.style.background = e.isIntersecting
            ? "rgb(var(--paper))"
            : "rgb(var(--paper))";
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative px-6 py-32 md:px-10 md:py-40"
    >
      <div className="container-wide">
        {/* Section header */}
        <Reveal>
          <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-12">
            <div className="md:col-span-3">
              <div className="label">[ 01 — What we build ]</div>
            </div>
            <div className="md:col-span-9">
              <h2
                className="display max-w-[24ch] text-ink"
                style={{ fontSize: "clamp(2rem, 5.2vw, 4rem)" }}
              >
                Four kinds of work.
                <span className="text-mute"> We don't take on the rest.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Service rows */}
        <ul className="border-t border-hairline/15">
          {SERVICES.map((s, i) => {
            const isHovered = hover === i;
            const isDimmed = hover !== null && hover !== i;
            return (
              <Reveal key={s.n} delay={i * 70} as="li" className="block">
                <article
                  data-magnetic
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  className="group relative grid cursor-default grid-cols-12 items-baseline gap-4 border-b border-hairline/15 py-10 transition-opacity duration-500 md:gap-8 md:py-14"
                  style={{ opacity: isDimmed ? 0.35 : 1 }}
                >
                  {/* Number */}
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-mono text-[12px] tracking-[0.18em] text-mute">{s.n}</span>
                  </div>

                  {/* Title */}
                  <div className="col-span-10 md:col-span-6">
                    <h3
                      className="display text-ink transition-transform duration-500"
                      style={{
                        fontSize: "clamp(1.65rem, 3vw, 2.5rem)",
                        transform: isHovered ? "translateX(8px)" : "translateX(0)",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.55] text-mute md:text-[16px]">
                      <span className="italic-editorial text-ink/70">{s.oneLiner}</span>
                    </p>
                    {/* Mobile blurb */}
                    <p className="mt-4 max-w-[48ch] text-[14px] leading-[1.55] text-mute md:hidden">
                      {s.blurb}
                    </p>
                  </div>

                  {/* Right rail — blurb (desktop) + meta */}
                  <div className="col-span-12 mt-4 md:col-span-5 md:mt-0">
                    <p className="hidden max-w-[44ch] text-[14px] leading-[1.55] text-mute md:block">
                      {s.blurb}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {s.meta.map((m) => (
                        <span
                          key={m}
                          className="border border-hairline/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mute"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Services;
