import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ROOM_PANELS } from "../SceneController";

gsap.registerPlugin(ScrollTrigger);

/**
 * Work room — four project case studies. Each project has a thematic
 * shader panel in the 3D scene; this overlay shows the metadata
 * (client / year / outcome / one-liner / body) for the active project.
 *
 * Per brief §5.7: project data preserved verbatim from existing site.
 */

interface ProjectDef {
  n: string;
  client: string;
  year: string;
  name: string;
  metric: string;
  one: string;
  body: string;
  stack: string[];
}

const PROJECTS: ProjectDef[] = [
  {
    n: "01",
    client: "Meridian Logistics",
    year: "2025",
    name: "Real-time fleet console",
    metric: "−83% incidents",
    one: "A real-time fleet tracking dashboard that replaced four separate tools.",
    body:
      "We rebuilt Meridian's dispatch operations on a single Postgres-backed platform " +
      "with live vehicle telemetry, exception alerts, and shift planning. Their dispatch " +
      "team went from four browser tabs to one, and from twelve daily incidents to two.",
    stack: ["Postgres", "Next.js", "Mapbox", "TypeScript"],
  },
  {
    n: "02",
    client: "Kindred Health",
    year: "2024",
    name: "Clinician charting suite",
    metric: "−78% charting time",
    one: "Charting that lets clinicians finish notes before the patient leaves the room.",
    body:
      "An EHR companion built for a 40-clinician practice that turned a 14-minute charting " +
      "flow into a 3-minute one. Voice capture, smart templates, and a queue that knows " +
      "what's next.",
    stack: ["Rust", "SQLite", "Whisper", "React"],
  },
  {
    n: "03",
    client: "Tessera Capital",
    year: "2024",
    name: "Deal flow operating system",
    metric: "+41% reply rate",
    one: "A bespoke CRM that knows what a partner means by 'follow up next week'.",
    body:
      "Replaced a sprawl of spreadsheets and a generic CRM with an opinionated deal-flow " +
      "tool: each partner has a queue, every meeting writes back to the pipeline, and " +
      "reporting falls out of the data instead of being assembled by hand.",
    stack: ["Postgres", "Remix", "Inngest", "Resend"],
  },
  {
    n: "04",
    client: "Lumen Studios",
    year: "2025",
    name: "Render pipeline & client portal",
    metric: "−6 days / project",
    one: "From file dropbox to a portal that knows what shot is in revision and why.",
    body:
      "A production-tracking platform for an independent animation studio: brief intake, " +
      "shot status, version comments, and an automated render queue that bills back to " +
      "the project. Built so the studio's producer could ship a project without opening " +
      "a single spreadsheet.",
    stack: ["Go", "Postgres", "S3", "Svelte"],
  },
];

interface WorkRoomProps {
  active: boolean;
}

const WorkRoom = ({ active }: WorkRoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollIdx, setScrollIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Active = hovered (locks the active project) or scroll-driven
  const activeIdx = hoveredIdx !== null ? hoveredIdx : scrollIdx;

  useEffect(() => {
    if (!containerRef.current) return;
    const idx = ROOM_PANELS.findIndex((p) => p.id === "work");
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
          const next = Math.min(PROJECTS.length - 1, Math.floor(sliceP * PROJECTS.length));
          setScrollIdx(next);
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
        [ 04 / SELECTED WORK ]
        <span className="mx-3 text-bone/30">·</span>
        case studies
      </div>

      {/* Project stack */}
      <div className="relative mt-auto" style={{ minHeight: "clamp(280px, 40vh, 420px)" }}>
        {PROJECTS.map((p, i) => (
          <ProjectPanel key={p.n} project={p} isVisible={active && activeIdx === i} />
        ))}
      </div>

      {/* Tab strip — hover-to-lock */}
      <div className="mt-8 grid grid-cols-4 gap-3 md:mt-10 md:gap-6">
        {PROJECTS.map((p, i) => (
          <button
            key={p.n}
            type="button"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            onFocus={() => setHoveredIdx(i)}
            onBlur={() => setHoveredIdx(null)}
            className="hover-target group cursor-none border-t pt-3 text-left transition-colors duration-300"
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
              {p.n} · {p.year}
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
              {compactClient(p.client)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const compactClient = (name: string) => {
  const map: Record<string, string> = {
    "Meridian Logistics": "MERIDIAN",
    "Kindred Health": "KINDRED",
    "Tessera Capital": "TESSERA",
    "Lumen Studios": "LUMEN",
  };
  return map[name] || name.toUpperCase();
};

const ProjectPanel = ({ project, isVisible }: { project: ProjectDef; isVisible: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const root = ref.current;
    if (!root || !isVisible || playedRef.current) return;
    playedRef.current = true;

    const num    = root.querySelector<HTMLDivElement>(".kz-pj-n");
    const client = root.querySelector<HTMLDivElement>(".kz-pj-client");
    const name   = root.querySelector<HTMLDivElement>(".kz-pj-name");
    const metric = root.querySelector<HTMLDivElement>(".kz-pj-metric");
    const one    = root.querySelector<HTMLParagraphElement>(".kz-pj-one");
    const body   = root.querySelector<HTMLParagraphElement>(".kz-pj-body");
    const stack  = root.querySelectorAll<HTMLLIElement>(".kz-pj-stack > li");

    gsap.fromTo(num,    { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
    gsap.fromTo(client, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", delay: 0.05 });
    gsap.fromTo(name,   { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: 0.12 });
    gsap.fromTo(metric, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.22 });
    gsap.fromTo(one,    { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.3 });
    gsap.fromTo(body,   { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.4 });
    gsap.fromTo(stack,  { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out", delay: 0.55, stagger: 0.05 });
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 grid grid-cols-1 gap-x-12 gap-y-6 transition-opacity duration-300 md:grid-cols-12"
      style={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? "auto" : "none" }}
    >
      <div className="md:col-span-7">
        <div
          className="kz-pj-n font-mono text-[11px] uppercase tracking-[0.32em] opacity-0"
          style={{ color: "rgb(var(--signal))" }}
        >
          / {project.n}
        </div>
        <div
          className="kz-pj-client mt-3 font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute opacity-0"
        >
          {project.client} · {project.year}
        </div>
        <h3
          className="kz-pj-name display-headline mt-2 text-bone opacity-0"
          style={{ fontSize: "clamp(1.75rem, 4.6vw, 3.6rem)", lineHeight: "1.0" }}
        >
          {project.name}
        </h3>
        <p
          className="kz-pj-one mt-5 max-w-[520px] font-mono text-base opacity-0"
          style={{ color: "rgb(var(--signal))" }}
        >
          {project.one}
        </p>
      </div>

      <div className="md:col-span-5">
        <div
          className="kz-pj-metric font-mono opacity-0"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.6rem)",
            color: "rgb(var(--bone))",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          {project.metric}
        </div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">
          outcome
        </div>
        <p className="kz-pj-body mt-5 max-w-[460px] text-sm leading-relaxed text-bone/65 opacity-0 md:text-[15px]">
          {project.body}
        </p>
        <ul className="kz-pj-stack mt-5 flex flex-wrap gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/55">
          {project.stack.map((s) => (
            <li
              key={s}
              className="border border-bone/15 px-2 py-1 opacity-0"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkRoom;
