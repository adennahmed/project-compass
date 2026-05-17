import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import DashboardDiagram from "@/components/diagrams/DashboardDiagram";
import WorkflowDiagram from "@/components/diagrams/WorkflowDiagram";
import PlatformDiagram from "@/components/diagrams/PlatformDiagram";
import AnalyticsDiagram from "@/components/diagrams/AnalyticsDiagram";

interface Service {
  n: string;
  title: string;
  oneLiner: string;
  blurb: string;
  meta: string[];
  detail: string;
  steps: [string, string, string, string];
  Diagram: React.ComponentType<{ playing: boolean }>;
}

const SERVICES: Service[] = [
  {
    n: "01",
    title: "Internal tools & dashboards",
    oneLiner: "Your ops team stops copy-pasting between spreadsheets.",
    blurb:
      "Custom admin panels, KPI dashboards, and operations consoles built on the data you already have. Replace four browser tabs with one screen your team actually wants to open.",
    meta: ["Admin", "Reporting", "Console"],
    detail:
      "We sit with the operators using the existing tools, watch what slows them down, and build the single screen that consolidates the work. Outcome is measured in shifts saved, not features shipped.",
    steps: [
      "Shadow the ops team — find the daily friction.",
      "Sketch the consolidated screen, on paper.",
      "Ship a working console against real data.",
      "Iterate weekly with the people using it.",
    ],
    Diagram: DashboardDiagram,
  },
  {
    n: "02",
    title: "Workflow automation",
    oneLiner: "The job that took an afternoon now runs while you sleep.",
    blurb:
      "Pipelines that connect the systems your business runs on — CRM, billing, support, fulfilment. Reliable, observable, debuggable in plain English.",
    meta: ["Pipelines", "Glue", "Jobs"],
    detail:
      "We map the existing manual hand-offs end to end, then write the smallest amount of code that can replace them — with logging the operators can read.",
    steps: [
      "Trace the manual workflow, person by person.",
      "Identify the steps software can own.",
      "Build the pipeline, with observability first.",
      "Hand off the on-call doc to the ops lead.",
    ],
    Diagram: WorkflowDiagram,
  },
  {
    n: "03",
    title: "Client-facing platforms",
    oneLiner: "From whiteboard to first paying user.",
    blurb:
      "Production-grade web apps for product teams: auth, billing, multi-tenancy, the lot. Designed for launch day and the messier days that follow.",
    meta: ["SaaS", "Web", "Mobile"],
    detail:
      "We treat day-100 problems as day-one decisions: auth, billing, tenant isolation, observability. The platform you launch is the platform you can still operate at year two.",
    steps: [
      "Pin down the smallest credible v1.",
      "Stand up auth, billing, infra on day one.",
      "Ship the product behind a real onboarding.",
      "Stay on retainer for the messy quarter after.",
    ],
    Diagram: PlatformDiagram,
  },
  {
    n: "04",
    title: "Data & decision support",
    oneLiner: "Stop arguing about what the number is.",
    blurb:
      "Single-source-of-truth pipelines that feed reporting, ML, and the C-suite alike. We build the warehouse, the models, and the dashboards your operators trust.",
    meta: ["Warehouse", "ML", "Insights"],
    detail:
      "One number, one definition, one place to find it. We resolve the contradictions across systems, then ship the warehouse and models the operators can actually defend.",
    steps: [
      "Inventory every system that holds the truth.",
      "Define one set of metrics, in writing.",
      "Build the warehouse — and the lineage docs.",
      "Wire it into the dashboards people already read.",
    ],
    Diagram: AnalyticsDiagram,
  },
];

interface ServiceRowProps {
  service: Service;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onContact: (subject: string) => void;
}

const ServiceRow = ({ service, index, isOpen, onToggle, onContact }: ServiceRowProps) => {
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
      className={`row-reveal block border-b transition-colors ${
        shown ? "is-in" : ""
      } ${isOpen ? "border-signal" : "border-hairline/15"}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full text-left"
      >
        <div className="grid grid-cols-12 items-baseline gap-4 py-10 md:gap-8 md:py-14">
          <div className="col-span-2 md:col-span-1">
            <span className="font-mono text-[12px] tracking-[0.18em] text-mute">{service.n}</span>
          </div>

          <div className="col-span-9 md:col-span-7">
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

          <div className="col-span-1 md:col-span-4 md:flex md:items-baseline md:justify-end">
            <span
              aria-hidden
              className="inline-block font-mono text-[18px] leading-none text-mute transition-transform duration-500"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ↓
            </span>
          </div>

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
      </button>

      <div className={`kz-service-expand ${isOpen ? "is-open" : ""}`}>
        <div className="grid grid-cols-12 gap-4 pb-12 md:gap-8">
          <div className="col-span-12 md:col-span-1" />
          <div className="col-span-12 md:col-span-6">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
              [ ✦ — Detail ]
            </div>
            <p className="max-w-[58ch] text-[15px] leading-[1.65] text-ink/80 md:text-[16px]">
              {service.detail}
            </p>
            <div className="mt-7">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
                Typical arc
              </div>
              <ol className="flex flex-col gap-2.5">
                {service.steps.map((step, si) => (
                  <li key={si} className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-signal">
                      [{String(si + 1).padStart(2, "0")}]
                    </span>
                    <span className="text-[14px] leading-[1.55] text-ink/80">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onContact(service.title);
              }}
              className="link-wipe mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink hover:text-signal"
            >
              Talk to us about this <span aria-hidden>→</span>
            </button>
          </div>
          <div className="col-span-12 flex items-start justify-end pt-2 text-ink/55 md:col-span-5">
            <div className="w-full border border-hairline/15 bg-paper-2/40 p-5">
              <service.Diagram playing={isOpen} />
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                fig. {service.n} — typical shape
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

interface ServicesProps {
  onContactClick?: (subject?: string) => void;
}

const Services = ({ onContactClick }: ServicesProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="services"
      data-snap
      className="relative px-6 py-24 md:px-10 md:py-28"
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
            <ServiceRow
              key={s.n}
              service={s}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
              onContact={(subject) => onContactClick?.(subject)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Services;
