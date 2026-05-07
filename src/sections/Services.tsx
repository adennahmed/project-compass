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

/**
 * ServiceRow — scroll-driven reveal. As each row enters the viewport its
 * body content expands smoothly (max-height + opacity) via the
 * `.row-reveal` / `.row-reveal__body` CSS transitions.
 *
 * No hover dim/lift. Hover affects only the small ↘ glyph in the corner.
 */
const ServiceRow = ({ service, index }: { service: Service; index: number }) => {
  const ref = useRef<HTMLLIElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: "-12% 0px -12% 0px", threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className={`row-reveal block border-b border-hairline/15 ${shown ? "is-in" : ""}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="grid grid-cols-12 items-baseline gap-4 py-10 md:gap-8 md:py-14">
        {/* Number */}
        <div className="col-span-2 md:col-span-1">
          <span className="font-mono text-[12px] tracking-[0.18em] text-mute">{service.n}</span>
        </div>

        {/* Title + one-liner — visible immediately on row reveal */}
        <div className="col-span-10 md:col-span-7">
          <h3
            className="display text-ink"
            style={{ fontSize: "clamp(1.65rem, 3vw, 2.5rem)" }}
          >
            {service.title}
          </h3>
          <p className="mt-3 text-[15px] leading-[1.55] md:text-[16px]">
            <span className="italic-editorial text-ink/70">{service.oneLiner}</span>
          </p>
        </div>

        {/* Right corner glyph — increments slightly on hover */}
        <div className="col-span-12 md:col-span-4 md:flex md:justify-end">
          <div className="hidden md:block">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
              ↘ scroll for more
            </span>
          </div>
        </div>

        {/* Body content — expanded by .row-reveal.is-in via CSS */}
        <div className="col-span-12 md:col-span-1" />
        <div className="row-reveal__body col-span-12 md:col-span-7 md:col-start-2">
          <p className="max-w-[58ch] pt-2 text-[15px] leading-[1.65] text-mute md:text-[16px]">
            {service.blurb}
          </p>
        </div>
        <div className="row-reveal__body col-span-12 md:col-span-4">
          <div className="flex flex-wrap gap-1.5 pt-2 md:justify-end">
            {service.meta.map((m) => (
              <span
                key={m}
                className="border border-hairline/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
};

const Services = () => {
  return (
    <section
      id="services"
      className="relative px-6 py-32 md:px-10 md:py-40"
    >
      <div className="container-wide">
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

        <ul className="border-t border-hairline/15">
          {SERVICES.map((s, i) => (
            <ServiceRow key={s.n} service={s} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Services;
