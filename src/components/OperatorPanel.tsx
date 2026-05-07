import { useEffect, useRef, useState } from "react";

/**
 * OperatorPanel — Deploy Console.
 *
 * Replaces the abstract sparkline. Now shows what Kozai actually ships:
 * a continuous-deployment pipeline cycling through Build → Test → Deploy
 * → Monitor, with a live event log scrolling beneath. Every motion has
 * meaning — the active stage advances, an event is logged when it
 * completes, and the stat counters tick when relevant.
 */

const STAGES = [
  { id: "build",   label: "Build",   detail: "compile · bundle" },
  { id: "test",    label: "Test",    detail: "unit · integration" },
  { id: "deploy",  label: "Deploy",  detail: "rollout · verify" },
  { id: "monitor", label: "Monitor", detail: "health · alerts" },
];

const STAGE_DURATION = 2.4; // seconds per stage
const TOTAL_CYCLE = STAGE_DURATION * STAGES.length; // 9.6s

type Event = {
  id: number;
  ts: string;
  status: "ok" | "info" | "active";
  text: string;
};

const EVENT_TEMPLATES = [
  { stage: "build",   status: "ok" as const,     text: "Build complete · meridian-dashboard@v2.4.7" },
  { stage: "test",    status: "ok" as const,     text: "1,247 tests passed · 0 failed · 4.2s" },
  { stage: "deploy",  status: "ok" as const,     text: "Deploy verified · 12 regions · 247ms p95" },
  { stage: "monitor", status: "ok" as const,     text: "Health check passed · 99.98% uptime" },
];

const formatTs = (d: Date) =>
  `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;

interface OperatorPanelProps {
  className?: string;
}

const OperatorPanel = ({ className = "" }: OperatorPanelProps) => {
  const startRef = useRef(performance.now());
  // Combine activeIdx + stageProgress into one state to avoid double renders
  const [pipelineState, setPipelineState] = useState({ activeIdx: 0, stageProgress: 0 });
  const [events, setEvents] = useState<Event[]>(() => [
    { id: 1, ts: "11:42:18", status: "ok", text: "Health check passed · 99.98% uptime" },
    { id: 2, ts: "11:41:54", status: "ok", text: "Deploy verified · 12 regions · 247ms p95" },
    { id: 3, ts: "11:41:31", status: "ok", text: "1,247 tests passed · 0 failed · 4.2s" },
    { id: 4, ts: "11:41:09", status: "ok", text: "Build complete · meridian-dashboard@v2.4.7" },
  ]);
  const [stats, setStats] = useState({
    builds: 247,
    uptime: "99.98%",
    deploys: 34,
    p95: "142ms",
  });
  const lastStageRef = useRef(0);
  const eventIdRef = useRef(5);
  // Track full cycle completions (monitor stage completing) to increment deploys every 2nd cycle
  const cycleCountRef = useRef(0);

  // Tick the active stage and emit events on stage completion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const cycleT = (elapsed % TOTAL_CYCLE) / STAGE_DURATION;
      const idx = Math.min(STAGES.length - 1, Math.floor(cycleT));
      // stageProgress: 0→1 within the current active stage
      const progress = cycleT - Math.floor(cycleT);

      if (idx !== lastStageRef.current) {
        const completedIdx = lastStageRef.current;
        lastStageRef.current = idx;

        // Log the completion event for the stage that just finished
        const tmpl = EVENT_TEMPLATES[completedIdx];
        const id = eventIdRef.current++;
        setEvents((prev) => [
          { id, ts: formatTs(new Date()), status: tmpl.status, text: tmpl.text },
          ...prev.slice(0, 5),
        ]);

        // Stats updates on stage completion
        if (completedIdx === STAGES.length - 1) {
          // Monitor completed → full cycle done
          cycleCountRef.current += 1;
          setStats((s) => {
            const newBuilds = s.builds + 1;
            // Increment deploys every 2nd full cycle
            const newDeploys = cycleCountRef.current % 2 === 0 ? s.deploys + 1 : s.deploys;
            return { ...s, builds: newBuilds, deploys: newDeploys };
          });
        }

        if (completedIdx === 2) {
          // Deploy stage completed → randomize latency p95
          const val = Math.floor(Math.random() * 40) + 128;
          setStats((s) => ({ ...s, p95: `${val}ms` }));
        }
      }

      // Single setState call for both activeIdx and stageProgress
      setPipelineState({ activeIdx: idx, stageProgress: progress });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { activeIdx, stageProgress } = pipelineState;

  return (
    <div className={`kz-panel ${className}`}>
      {/* Header strip */}
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

      {/* Pipeline — 4 stages with JS-driven sequential fill */}
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
            // Compute fill scale: past stages full, active stage live, future empty
            let fillScale: number;
            if (i < activeIdx) {
              fillScale = 1;
            } else if (i === activeIdx) {
              fillScale = stageProgress;
            } else {
              fillScale = 0;
            }

            const isActive = i === activeIdx;

            return (
              <div key={s.id} className="flex flex-col gap-1.5">
                <div className="relative h-1.5 overflow-hidden bg-paper-3">
                  <div
                    className="pipeline-fill absolute inset-y-0 left-0 w-full bg-ink"
                    style={{
                      transform: `scaleX(${fillScale})`,
                      transformOrigin: "left center",
                      transition: "transform 0.1s linear",
                    }}
                  />
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
                  <span
                    className={isActive ? "pipeline-glow" : ""}
                    style={{
                      color: isActive ? "rgb(var(--signal))" : "rgb(var(--mute))",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3em",
                    }}
                  >
                    {isActive && (
                      <span
                        aria-hidden
                        className="stage-dot"
                        style={{ color: "rgb(var(--signal))" }}
                      >
                        ●
                      </span>
                    )}
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
              className="event-row flex items-baseline gap-3 py-1"
              style={{
                opacity: 1 - i * 0.18,
                // Accent left-border on most recent event only
                borderLeft: i === 0 ? "1px solid rgb(var(--signal))" : "1px solid transparent",
                paddingLeft: "0.5rem",
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

      {/* Stats row */}
      <div className="grid grid-cols-2 border-t border-hairline/15 sm:grid-cols-4">
        <Stat label="Builds today" value={stats.builds.toString()} live />
        <Stat label="Uptime · 30d" value={stats.uptime} accent />
        <Stat label="Deploys · wk" value={stats.deploys.toString()} />
        <Stat label="Latency · p95" value={stats.p95} />
      </div>
    </div>
  );
};

const Stat = ({
  label,
  value,
  accent,
  live,
}: {
  label: string;
  value: string;
  accent?: boolean;
  live?: boolean;
}) => (
  <div className="border-l border-hairline/15 px-5 py-4 first:border-l-0">
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
      {label}
      {live && (
        <span aria-hidden className="inline-block h-1 w-1 animate-pulse rounded-full bg-signal" />
      )}
    </div>
    <div
      className={`mt-2 font-mono text-[20px] font-medium tabular-nums ${
        accent ? "text-signal" : "text-ink"
      }`}
    >
      {value}
    </div>
  </div>
);

export default OperatorPanel;
