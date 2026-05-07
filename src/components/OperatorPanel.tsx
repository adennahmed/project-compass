import { useEffect, useRef, useState } from "react";

/**
 * OperatorPanel — Deploy Console.
 *
 * Pipeline animation is CSS-driven: state only updates on stage transitions
 * (every 2.4s), never per-frame. Each fill bar has a unique `key` so the
 * CSS animation always starts from scaleX(0) — buttery smooth, zero jank.
 */

const STAGES = [
  { id: "build",   label: "Build",   detail: "compile · bundle" },
  { id: "test",    label: "Test",    detail: "unit · integration" },
  { id: "deploy",  label: "Deploy",  detail: "rollout · verify" },
  { id: "monitor", label: "Monitor", detail: "health · alerts" },
];

const STAGE_DURATION = 2.4; // seconds per stage
const TOTAL_CYCLE = STAGE_DURATION * STAGES.length; // 9.6s

type Event = { id: number; ts: string; text: string };

const EVENT_TEMPLATES = [
  "Build complete · meridian-dashboard@v2.4.7",
  "1,247 tests passed · 0 failed · 4.2s",
  "Deploy verified · 12 regions · 247ms p95",
  "Health check passed · 99.98% uptime",
];

const formatTs = (d: Date) =>
  `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}:${d.getSeconds().toString().padStart(2,"0")}`;

const OperatorPanel = ({ className = "" }: { className?: string }) => {
  const startRef    = useRef(performance.now());
  const lastIdxRef  = useRef(0);
  const eventIdRef  = useRef(5);
  const cycleRef    = useRef(0);

  // pipeline: activeIdx drives bar state; fillKeys[i] increments when bar i
  // starts filling — changing the key re-mounts the div so CSS anim restarts.
  const [pipeline, setPipeline] = useState({ activeIdx: 0, fillKeys: [0,0,0,0] });

  const [events, setEvents] = useState<Event[]>([
    { id: 1, ts: "11:42:18", text: "Health check passed · 99.98% uptime" },
    { id: 2, ts: "11:41:54", text: "Deploy verified · 12 regions · 247ms p95" },
    { id: 3, ts: "11:41:31", text: "1,247 tests passed · 0 failed · 4.2s" },
    { id: 4, ts: "11:41:09", text: "Build complete · meridian-dashboard@v2.4.7" },
  ]);
  const [stats, setStats] = useState({
    builds: 247, uptime: "99.98%", deploys: 34, p95: "142ms",
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const idx = Math.min(STAGES.length - 1, Math.floor((elapsed % TOTAL_CYCLE) / STAGE_DURATION));

      if (idx !== lastIdxRef.current) {
        const done = lastIdxRef.current;
        lastIdxRef.current = idx;

        // Emit event for the just-completed stage
        const id = eventIdRef.current++;
        setEvents(prev => [
          { id, ts: formatTs(new Date()), text: EVENT_TEMPLATES[done] },
          ...prev.slice(0, 5),
        ]);

        // Stats when full cycle completes (monitor → build handoff)
        if (done === STAGES.length - 1) {
          cycleRef.current += 1;
          setStats(s => ({
            ...s,
            builds: s.builds + 1,
            deploys: cycleRef.current % 2 === 0 ? s.deploys + 1 : s.deploys,
          }));
        }
        // Latency fluctuates on deploy completion
        if (done === 2) {
          const ms = Math.floor(Math.random() * 40) + 128;
          setStats(s => ({ ...s, p95: `${ms}ms` }));
        }

        // Advance pipeline — increment fillKey for the new active bar so its
        // fill div re-mounts and the CSS animation starts from zero.
        setPipeline(p => ({
          activeIdx: idx,
          fillKeys: p.fillKeys.map((k, i) => i === idx ? k + 1 : k),
        }));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { activeIdx, fillKeys } = pipeline;

  return (
    <div className={`kz-panel ${className}`}>
      {/* Header */}
      <header className="flex items-center justify-between border-b border-hairline/15 px-5 py-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
            ops · meridian-dashboard
          </span>
        </div>
        <div className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-mute md:block">
          live · cycle 04 / 04
        </div>
      </header>

      {/* Pipeline */}
      <div className="px-5 py-6">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            Continuous deploy pipeline
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
            {STAGES[activeIdx].label.toUpperCase()} · {STAGES[activeIdx].detail}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {STAGES.map((s, i) => {
            const status = i < activeIdx ? "done" : i === activeIdx ? "filling" : "pending";
            const isActive = i === activeIdx;
            return (
              <div key={s.id} className="flex flex-col gap-1.5">
                <div className="relative h-1.5 overflow-hidden bg-paper-3">
                  {/* key changes when this bar starts a new fill — forces CSS anim restart */}
                  <div
                    key={fillKeys[i]}
                    className={`pipeline-fill absolute inset-y-0 left-0 w-full bg-ink ${status}`}
                  />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em]">
                  <span
                    className={isActive ? "pipeline-glow inline-flex items-center gap-[0.3em]" : ""}
                    style={{ color: isActive ? "rgb(var(--signal))" : "rgb(var(--mute))" }}
                  >
                    {isActive && <span aria-hidden className="stage-dot">●</span>}
                    {String(i + 1).padStart(2, "0")} {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event log */}
      <div className="border-t border-hairline/15 bg-paper px-5 py-4">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          <span>Event stream</span>
          <span>↘ live</span>
        </div>
        <ul className="font-mono text-[12px]">
          {events.slice(0, 4).map((e, i) => (
            <li
              key={e.id}
              className="event-row flex items-baseline gap-3 py-1 pl-2"
              style={{
                opacity: 1 - i * 0.18,
                borderLeft: i === 0
                  ? "1px solid rgb(var(--signal))"
                  : "1px solid transparent",
              }}
            >
              <span className="w-[68px] shrink-0 text-[10px] uppercase tracking-[0.18em] text-mute">
                {e.ts}
              </span>
              <span aria-hidden className="text-signal">✓</span>
              <span className="text-ink">{e.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 border-t border-hairline/15 sm:grid-cols-4">
        <Stat label="Builds today" value={stats.builds.toString()} live />
        <Stat label="Uptime · 30d"  value={stats.uptime}            accent />
        <Stat label="Deploys · wk"  value={stats.deploys.toString()} />
        <Stat label="Latency · p95" value={stats.p95} />
      </div>
    </div>
  );
};

const Stat = ({ label, value, accent, live }: {
  label: string; value: string; accent?: boolean; live?: boolean;
}) => (
  <div className="border-l border-hairline/15 px-5 py-4 first:border-l-0">
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
      {label}
      {live && <span aria-hidden className="inline-block h-1 w-1 animate-pulse rounded-full bg-signal" />}
    </div>
    <div className={`mt-2 font-mono text-[20px] font-medium tabular-nums ${accent ? "text-signal" : "text-ink"}`}>
      {value}
    </div>
  </div>
);

export default OperatorPanel;
