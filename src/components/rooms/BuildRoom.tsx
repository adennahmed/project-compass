import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ROOM_PANELS } from "../SceneController";

gsap.registerPlugin(ScrollTrigger);

/**
 * Build room — four data-vis panels with thematic shaders, one per
 * service. The 3D shader panels live in the SceneController scene
 * and "light up" via uActive based on global scroll progress within
 * the build slice. This component owns the HTML overlay: title, body,
 * deliverables, and a 4-tab indicator.
 *
 * Per brief §4.6 / §5.6.
 */

interface ServiceDef {
  n: string;
  title: string;
  line: string;
  body: string;
  deliverables: string[];
}

const SERVICES: ServiceDef[] = [
  {
    n: "01",
    title: "Internal tools & dashboards",
    line: "Your ops team stops copy-pasting between spreadsheets.",
    body:
      "Custom admin panels, KPI dashboards, and operations consoles built on the data " +
      "you already have. Replace four browser tabs with one screen your team actually wants to open.",
    deliverables: ["Admin consoles", "Reporting dashboards", "Internal CRMs", "Approval workflows"],
  },
  {
    n: "02",
    title: "Workflow automation",
    line: "The job that took an afternoon now runs while you sleep.",
    body:
      "Pipelines that connect the systems your business runs on — CRM, billing, support, " +
      "fulfilment — and remove the human babysitting. Reliable, observable, debuggable in plain English.",
    deliverables: ["ETL & data pipelines", "Cross-system sync", "Scheduled jobs", "Webhook orchestration"],
  },
  {
    n: "03",
    title: "Client-facing platforms",
    line: "From whiteboard to first paying user.",
    body:
      "Production-grade web apps for startups and product teams: auth, billing, multi-tenancy, " +
      "the lot. We design for launch day and the messier days that follow.",
    deliverables: ["MVPs for founders", "Customer portals", "Marketplaces", "Embedded SaaS"],
  },
  {
    n: "04",
    title: "Data & decision support",
    line: "Stop arguing about what the number is.",
    body:
      "Single-source-of-truth pipelines that feed reporting, ML, and the C-suite alike. " +
      "We build the warehouse, the models, and the dashboards your operators trust.",
    deliverables: ["Warehouses & marts", "BI dashboards", "Forecasting models", "Decision systems"],
  },
];

interface BuildRoomProps {
  active: boolean;
}

const BuildRoom = ({ active }: BuildRoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const idx = ROOM_PANELS.findIndex((p) => p.id === "build");
    const total = ROOM_PANELS.length;
    const sliceStart = idx / total;
    const sliceEnd = (idx + 1) / total;
    const sliceLen = sliceEnd - sliceStart;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".kz-pinned",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < sliceStart - 0.02 || p > sliceEnd + 0.02) return;
          const sliceP = Math.max(0, Math.min(0.999, (p - sliceStart) / sliceLen));
          const next = Math.min(SERVICES.length - 1, Math.floor(sliceP * SERVICES.length));
          setActiveIdx(next);
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 flex h-full w-full flex-col px-6 pt-20 pb-24 md:px-12 md:pt-24 md:pb-28"
    >
      {/* Eyebrow */}
      <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
        [ 03 / WHAT WE BUILD ]
        <span className="mx-3 text-bone/30">·</span>
        services
      </div>

      {/* Service stack — absolutely positioned, only one visible at a time */}
      <div className="relative mt-auto" style={{ minHeight: "clamp(260px, 36vh, 380px)" }}>
        {SERVICES.map((s, i) => (
          <ServicePanel key={s.n} service={s} isVisible={active && activeIdx === i} />
        ))}
      </div>

      {/* Tab strip — shows which service is active */}
      <div className="mt-8 grid grid-cols-4 gap-3 md:mt-10 md:gap-6">
        {SERVICES.map((s, i) => (
          <div
            key={s.n}
            className="border-t pt-3 transition-colors duration-300"
            style={{
              borderColor:
                activeIdx === i
                  ? "rgb(var(--signal))"
                  : "rgb(var(--ink-edge))",
            }}
          >
            <div
              className="font-mono text-[10px] uppercase tracking-[0.32em] transition-colors duration-300"
              style={{
                color:
                  activeIdx === i
                    ? "rgb(var(--signal))"
                    : "rgb(var(--bone-mute))",
              }}
            >
              {s.n}
            </div>
            <div
              className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 md:text-[11px]"
              style={{
                color:
                  activeIdx === i
                    ? "rgb(var(--bone))"
                    : "rgb(var(--bone-mute) / 0.6)",
              }}
            >
              {tabLabel(s.title)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const tabLabel = (title: string): string => {
  // Compact label for the tab strip
  const map: Record<string, string> = {
    "Internal tools & dashboards": "DASHBOARDS",
    "Workflow automation": "AUTOMATION",
    "Client-facing platforms": "PLATFORMS",
    "Data & decision support": "DATA",
  };
  return map[title] || title;
};

const ServicePanel = ({ service, isVisible }: { service: ServiceDef; isVisible: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const root = ref.current;
    if (!root || !isVisible || playedRef.current) return;
    playedRef.current = true;

    const num = root.querySelector<HTMLDivElement>(".kz-svc-n");
    const title = root.querySelector<HTMLDivElement>(".kz-svc-title");
    const line = root.querySelector<HTMLDivElement>(".kz-svc-line");
    const body = root.querySelector<HTMLParagraphElement>(".kz-svc-body");
    const dels = root.querySelectorAll<HTMLLIElement>(".kz-svc-del > li");

    gsap.fromTo(num,   { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
    gsap.fromTo(title, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: 0.05 });
    gsap.fromTo(line,  { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.18 });
    gsap.fromTo(body,  { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.28 });
    gsap.fromTo(dels,  { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out", delay: 0.42, stagger: 0.05 });
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 grid grid-cols-1 gap-x-12 gap-y-6 transition-opacity duration-300 md:grid-cols-12"
      style={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? "auto" : "none" }}
    >
      <div className="md:col-span-7">
        <div
          className="kz-svc-n font-mono text-[11px] uppercase tracking-[0.32em] opacity-0"
          style={{ color: "rgb(var(--signal))" }}
        >
          / {service.n}
        </div>
        <h3
          className="kz-svc-title display-headline mt-3 text-bone opacity-0"
          style={{ fontSize: "clamp(2rem, 5.5vw, 4.4rem)", lineHeight: "1.0" }}
        >
          {service.title}
        </h3>
        <p
          className="kz-svc-line mt-5 max-w-[520px] font-mono text-base opacity-0"
          style={{ color: "rgb(var(--signal))" }}
        >
          {service.line}
        </p>
      </div>

      <div className="md:col-span-5">
        <p className="kz-svc-body max-w-[480px] text-sm leading-relaxed text-bone/65 opacity-0 md:text-[15px]">
          {service.body}
        </p>
        <ul className="kz-svc-del mt-6 grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/55">
          {service.deliverables.map((d) => (
            <li
              key={d}
              className="border-t border-bone/15 pt-2 opacity-0"
            >
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BuildRoom;
