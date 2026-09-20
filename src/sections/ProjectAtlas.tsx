import { useEffect, useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import { PORTFOLIO_PROJECTS, type PortfolioProject } from "@/data/portfolio";

type View = "interface" | "system" | "decisions";

const Metric = ({ label, value, signal = false }: { label: string; value: string; signal?: boolean }) => (
  <div className="border border-hairline/15 bg-paper-2/60 p-3">
    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">{label}</div>
    <div className={`mt-2 font-mono text-[18px] tracking-[-0.04em] ${signal ? "text-signal" : "text-ink"}`}>
      {value}
    </div>
  </div>
);

const MeridianSurface = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setTick((v) => v + 1), 1800);
    return () => window.clearInterval(id);
  }, []);
  const events = [
    ["SLA risk", "North route · 18m", "Dispatch"],
    ["Approval", "Refund 00841", "Finance"],
    ["Mismatch", "PO-1190 · 3 lines", "Receiving"],
    ["Threshold", "SKU-443 · 8 left", "Inventory"],
  ];
  return (
    <div className="grid h-full grid-cols-12 gap-3 p-3 md:p-5">
      <div className="col-span-12 grid grid-cols-3 gap-2 md:col-span-4 md:grid-cols-1">
        <Metric label="Open signals" value={String(14 + (tick % 3)).padStart(2, "0")} signal />
        <Metric label="Median action" value={`${21 - (tick % 4)}m`} />
        <Metric label="Automated" value="68%" />
      </div>
      <div className="col-span-12 flex min-h-0 flex-col border border-hairline/15 bg-paper-3/35 md:col-span-8">
        <div className="flex items-center justify-between border-b border-hairline/15 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-mute">
          <span>Live decision queue</span>
          <span className="text-signal">● ingesting</span>
        </div>
        <div className="flex-1 divide-y divide-hairline/10">
          {events.map(([kind, detail, owner], i) => (
            <div
              key={kind}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3 transition-colors hover:bg-signal/5"
              style={{ opacity: i === tick % events.length ? 1 : 0.72 }}
            >
              <span className={`h-2 w-2 ${i === tick % events.length ? "bg-signal" : "border border-ink/30"}`} />
              <div>
                <div className="text-[12px] text-ink">{kind}</div>
                <div className="font-mono text-[9px] text-mute">{detail}</div>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-mute">{owner}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-12 items-end gap-1 border-t border-hairline/15 px-3 py-3">
          {[32, 48, 28, 70, 52, 82, 46, 62, 88, 57, 74, 94].map((h, i) => (
            <span
              key={i}
              className="block origin-bottom bg-ink/20 transition-all duration-700"
              style={{ height: `${Math.max(12, h - ((tick + i) % 4) * 5)}px`, background: i === 11 ? "rgb(var(--signal))" : undefined }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const AegisSurface = () => {
  const [active, setActive] = useState(1);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((v) => (v + 1) % 5), 1400);
    return () => window.clearInterval(id);
  }, []);
  const nodes = [
    [55, 80, "Claim"], [132, 42, "Report"], [210, 88, "Entity"], [125, 135, "Source"], [260, 145, "Conflict"],
  ] as const;
  return (
    <div className="grid h-full grid-cols-12 gap-3 p-3 md:p-5">
      <div className="col-span-12 border border-hairline/15 bg-paper-2/60 px-3 py-2 font-mono text-[10px] text-ink md:col-span-12">
        <span className="text-signal">query /</span> Which evidence supports the capacity forecast—and where do sources disagree?
      </div>
      <div className="relative col-span-12 min-h-[220px] overflow-hidden border border-hairline/15 bg-paper-3/35 md:col-span-7">
        <svg viewBox="0 0 320 190" className="h-full w-full" aria-hidden>
          <g stroke="rgb(var(--ink))" strokeOpacity="0.14" strokeWidth="1">
            <line x1="55" y1="80" x2="132" y2="42" />
            <line x1="55" y1="80" x2="125" y2="135" />
            <line x1="132" y1="42" x2="210" y2="88" />
            <line x1="125" y1="135" x2="210" y2="88" />
            <line x1="210" y1="88" x2="260" y2="145" />
          </g>
          {nodes.map(([x, y, label], i) => (
            <g key={label} style={{ transition: "opacity 400ms ease" }} opacity={i === active ? 1 : 0.5}>
              <circle cx={x} cy={y} r={i === active ? 11 : 8} fill={i === active ? "#F4313A" : "#171A21"} stroke={i === active ? "#F4313A" : "#ECECEE"} strokeOpacity="0.65" />
              <text x={x} y={y + 22} textAnchor="middle" fill="#ECECEE" fillOpacity="0.65" fontFamily="Martian Mono" fontSize="7">{label}</text>
            </g>
          ))}
        </svg>
        <div className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.18em] text-mute">Evidence graph · 148 claims</div>
      </div>
      <div className="col-span-12 flex flex-col gap-2 md:col-span-5">
        {[
          ["0.92", "Supported", "Capacity increases after Q3"],
          ["0.67", "Conflict", "Lead-time assumptions diverge"],
          ["0.84", "Supported", "Two sources share primary data"],
        ].map(([score, state, text], i) => (
          <div key={text} className="flex flex-1 gap-3 border border-hairline/15 bg-paper-2/55 p-3">
            <span className={`font-mono text-[11px] ${i === 1 ? "text-signal" : "text-ink"}`}>{score}</span>
            <div>
              <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-mute">{state}</div>
              <div className="mt-1 text-[11px] leading-[1.45] text-ink/80">{text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RelaySurface = () => (
  <div className="grid h-full grid-cols-12 gap-3 p-3 md:p-5">
    <div className="relative col-span-12 min-h-[250px] overflow-hidden border border-hairline/15 bg-paper-3/35 md:col-span-8">
      <svg viewBox="0 0 420 260" className="h-full w-full" aria-hidden>
        <defs>
          <pattern id="relay-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="#ECECEE" strokeOpacity="0.055" strokeWidth="1" /></pattern>
        </defs>
        <rect width="420" height="260" fill="url(#relay-grid)" />
        <path id="relay-a" d="M28 212 C88 182 94 70 178 84 S274 190 386 42" fill="none" stroke="#F4313A" strokeWidth="2" strokeDasharray="6 5" opacity="0.75" />
        <path d="M42 34 C120 110 212 32 370 202" fill="none" stroke="#ECECEE" strokeWidth="1" strokeDasharray="4 6" opacity="0.22" />
        <circle cx="386" cy="42" r="5" fill="#F4313A"><animate attributeName="r" values="4;7;4" dur="1.8s" repeatCount="indefinite" /></circle>
        <polygon points="-5,-4 7,0 -5,4 -2,0" fill="#F4313A"><animateMotion dur="6s" repeatCount="indefinite" rotate="auto"><mpath href="#relay-a" /></animateMotion></polygon>
        {[[28,212],[178,84],[370,202],[42,34]].map(([x,y], i)=><circle key={i} cx={x} cy={y} r="4" fill="#0B0D12" stroke="#ECECEE" strokeOpacity="0.6" />)}
      </svg>
      <div className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.18em] text-mute">Offline route journal · zone 04</div>
      <div className="absolute bottom-3 left-3 border border-signal/35 bg-paper/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-signal">sync deferred · 12 ops local</div>
    </div>
    <div className="col-span-12 flex flex-col gap-2 md:col-span-4">
      {[
        ["UNIT-14", "offline", "12 queued"],
        ["UNIT-08", "syncing", "3 / 18"],
        ["UNIT-22", "online", "clean"],
        ["UNIT-31", "online", "clean"],
      ].map(([unit, state, detail], i) => (
        <div key={unit} className="flex flex-1 items-center justify-between border border-hairline/15 bg-paper-2/55 p-3">
          <div><div className="font-mono text-[10px] text-ink">{unit}</div><div className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-mute">{detail}</div></div>
          <span className={`font-mono text-[8px] uppercase tracking-[0.16em] ${i < 2 ? "text-signal" : "text-ink/60"}`}>{state}</span>
        </div>
      ))}
    </div>
  </div>
);

const KozaiSurface = () => (
  <div className="grid h-full grid-cols-12 gap-3 p-3 md:p-5">
    <div className="col-span-12 flex flex-col justify-between border border-hairline/15 bg-paper-3/35 p-5 md:col-span-5">
      <div>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-signal">Archived chapter · 2025—26</span>
        <div className="display mt-4 text-[42px] tracking-[-0.06em] text-ink md:text-[58px]">KOZAI</div>
      </div>
      <p className="max-w-[31ch] text-[12px] leading-[1.6] text-mute">A studio experiment that became a laboratory for operational interfaces, systems thinking, and product craft.</p>
    </div>
    <div className="col-span-12 grid grid-cols-2 gap-3 md:col-span-7">
      {[
        ["Interface system", "A complete brutalist product language"],
        ["Community", "Auth, profiles, resources, moderation"],
        ["Ops prototypes", "Dispatch, deploy, revenue, inventory"],
        ["Studio thesis", "Operators before features"],
      ].map(([title, detail], i) => (
        <div key={title} className="group relative overflow-hidden border border-hairline/15 bg-paper-2/55 p-4">
          <span className="font-mono text-[9px] text-signal">0{i + 1}</span>
          <div className="mt-8 text-[13px] text-ink">{title}</div>
          <div className="mt-1 text-[10px] leading-[1.45] text-mute">{detail}</div>
          <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100" />
        </div>
      ))}
    </div>
  </div>
);

const interfaces: Record<string, React.ComponentType> = {
  meridian: MeridianSurface,
  aegis: AegisSurface,
  relay: RelaySurface,
  kozai: KozaiSurface,
};

const ArchitectureView = ({ project }: { project: PortfolioProject }) => (
  <div className="flex h-full flex-col justify-center p-5 md:p-8">
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      {project.architecture.map((node, i) => (
        <div key={node.label} className="relative border border-hairline/15 bg-paper-2/55 p-4">
          <span className="font-mono text-[9px] text-signal">0{i + 1}</span>
          <div className="mt-8 text-[14px] text-ink">{node.label}</div>
          <p className="mt-2 text-[11px] leading-[1.55] text-mute">{node.detail}</p>
          {i < project.architecture.length - 1 && <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 font-mono text-signal md:block">→</span>}
        </div>
      ))}
    </div>
    <div className="mt-6 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-mute">
      <span className="h-px flex-1 bg-hairline/15" />
      <span>one observable path · no hidden handoffs</span>
      <span className="h-px flex-1 bg-hairline/15" />
    </div>
  </div>
);

const DecisionsView = ({ project }: { project: PortfolioProject }) => (
  <div className="grid h-full grid-cols-1 content-center gap-3 p-5 sm:grid-cols-2 md:p-8">
    {project.decisions.map((d, i) => (
      <div key={d.label} className="group flex items-end justify-between border border-hairline/15 bg-paper-2/55 p-5 transition-colors hover:border-signal/50">
        <div><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-mute">D-0{i + 1} · {d.label}</span><div className="display mt-8 text-[24px] text-ink md:text-[30px]">{d.value}</div></div>
        <span className="text-signal opacity-0 transition-opacity group-hover:opacity-100">↗</span>
      </div>
    ))}
  </div>
);

const ProjectAtlas = () => {
  const [active, setActive] = useState(0);
  const [view, setView] = useState<View>("interface");
  const project = PORTFOLIO_PROJECTS[active];
  const Surface = useMemo(() => interfaces[project.id], [project.id]);

  return (
    <section id="projects" data-snap className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="container-wide">
        <Reveal>
          <div className="mb-12 grid grid-cols-1 gap-8 md:mb-16 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <div className="label mb-5"><ScrambleText text="[ 01 — Selected systems ]" /></div>
              <h2 className="display max-w-[15ch] text-ink" style={{ fontSize: "clamp(2.5rem, 6vw, 5.25rem)" }}>Built to make complex work feel obvious.</h2>
            </div>
            <p className="max-w-[44ch] text-[15px] leading-[1.65] text-mute md:col-span-5 md:justify-self-end md:text-[16px]">
              Independent builds and systems prototypes spanning operations, evidence, offline coordination, and the earlier Kozai studio chapter. Select a project, then inspect its interface, system, and decisions.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <div className="border-t border-hairline/15">
              {PORTFOLIO_PROJECTS.map((p, i) => {
                const on = i === active;
                return (
                  <button key={p.id} type="button" onClick={() => { setActive(i); setView("interface"); }} className="group relative w-full border-b border-hairline/15 py-5 pr-3 text-left">
                    <span className="absolute left-0 top-0 h-full w-px origin-top bg-signal transition-transform duration-500" style={{ transform: on ? "scaleY(1)" : "scaleY(0)" }} />
                    <div className="flex items-start gap-4 pl-4">
                      <span className={`mt-1 font-mono text-[9px] ${on ? "text-signal" : "text-mute"}`}>{p.number}</span>
                      <div className="min-w-0 flex-1">
                        <div className={`display text-[25px] transition-transform duration-500 ${on ? "translate-x-1 text-ink" : "text-ink/55 group-hover:text-ink"}`}>{p.name}</div>
                        <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-mute">{p.status} · {p.year}</div>
                        <div className="grid transition-all duration-500" style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0 }}><div className="overflow-hidden"><p className="pt-3 text-[12px] leading-[1.55] text-mute">{p.strap}</p></div></div>
                      </div>
                      <span className={`mt-1 text-signal transition-transform ${on ? "rotate-45" : ""}`}>+</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-8">
            <div className="overflow-hidden border border-hairline/15 bg-paper-2/25">
              <div className="border-b border-hairline/15 p-4 md:p-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div><div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-signal"><span className="h-1.5 w-1.5 bg-signal" />{project.status}</div><h3 className="display mt-3 text-[32px] text-ink md:text-[44px]">{project.name}</h3><p className="mt-2 max-w-[58ch] text-[12px] leading-[1.55] text-mute md:text-[13px]">{project.summary}</p></div>
                  <div className="flex shrink-0 gap-1 border border-hairline/15 p-1">
                    {(["interface", "system", "decisions"] as View[]).map((tab) => <button key={tab} type="button" onClick={() => setView(tab)} className={`px-3 py-2 font-mono text-[8px] uppercase tracking-[0.16em] transition-colors ${view === tab ? "bg-signal text-paper" : "text-mute hover:text-ink"}`}>{tab}</button>)}
                  </div>
                </div>
              </div>
              <div className="h-[390px] overflow-hidden md:h-[470px]" key={`${project.id}-${view}`} style={{ animation: "kz-project-enter 0.65s cubic-bezier(0.16,1,0.3,1)" }}>
                {view === "interface" && <Surface />}
                {view === "system" && <ArchitectureView project={project} />}
                {view === "decisions" && <DecisionsView project={project} />}
              </div>
              <div className="flex flex-wrap gap-1.5 border-t border-hairline/15 p-4">
                {project.stack.map((item) => <span key={item} className="border border-hairline/15 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-mute">{item}</span>)}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ProjectAtlas;
