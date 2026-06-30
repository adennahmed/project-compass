import { useEffect, useRef, useState } from "react";

/**
 * InfraPanel — "Sentinel Mesh" infrastructure dashboard. Placeholder data only.
 * A live request-throughput histogram shifts left each tick (heights ease via
 * CSS), node events stream in, and req/s + p99 drift — same construction as the
 * other consoles.
 */

const BARS = 24;
const INFRA_EVENTS = [
  "Autoscaled +2 instances · us-east-2",
  "Cache hit ratio 98.7%",
  "Node us-west-1 · healthy",
  "Failover drill passed · 1.2s",
  "TLS rotated · 14 services",
  "Backpressure cleared · queue 0",
];

const fmtTs = (d: Date) =>
  `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;

type Ev = { id: number; ts: string; text: string };

const InfraPanel = ({ className = "" }: { className?: string }) => {
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: BARS }, (_, i) => 0.35 + Math.sin(i * 0.6) * 0.18 + Math.random() * 0.3),
  );
  const [events, setEvents] = useState<Ev[]>([
    { id: 1, ts: "11:42:09", text: "Cache hit ratio 98.7%" },
    { id: 2, ts: "11:41:52", text: "Autoscaled +2 instances · us-east-2" },
    { id: 3, ts: "11:41:30", text: "Node us-west-1 · healthy" },
    { id: 4, ts: "11:41:08", text: "Failover drill passed · 1.2s" },
  ]);
  const [stats, setStats] = useState({ rps: "3,481", err: "0.02%", nodes: "18", p99: "96ms" });
  const idRef = useRef(10);
  const tickRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      setBars((b) => [...b.slice(1), 0.28 + Math.random() * 0.72]);
      setStats((s) => ({
        ...s,
        rps: (3100 + Math.floor(Math.random() * 900)).toLocaleString(),
        p99: `${90 + Math.floor(Math.random() * 22)}ms`,
      }));
      tickRef.current += 1;
      if (tickRef.current % 3 === 0) {
        const text = INFRA_EVENTS[(Math.random() * INFRA_EVENTS.length) | 0];
        const id = idRef.current++;
        setEvents((prev) => [{ id, ts: fmtTs(new Date()), text }, ...prev.slice(0, 5)]);
      }
    }, 900);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className={`kz-panel ${className}`}>
      <header className="flex items-center justify-between border-b border-hairline/15 px-5 py-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
            infra · sentinel-mesh
          </span>
        </div>
        <div className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-mute md:block">
          live · 18 nodes
        </div>
      </header>

      {/* Throughput histogram */}
      <div className="px-5 py-6">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            Request throughput · req/s
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
            {stats.rps} now
          </span>
        </div>
        <div className="flex h-[88px] items-end gap-[3px]">
          {bars.map((v, i) => {
            const last = i === bars.length - 1;
            return (
              <div
                key={i}
                className="flex-1"
                style={{
                  height: `${Math.min(100, v * 100)}%`,
                  background: last ? "rgb(var(--signal))" : "rgb(var(--ink) / 0.65)",
                  transition: "height 0.8s cubic-bezier(0.65,0,0.35,1)",
                }}
              />
            );
          })}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-mute/70">
          <span>−60s</span>
          <span>−30s</span>
          <span>now</span>
        </div>
      </div>

      {/* Node events */}
      <div className="border-t border-hairline/15 bg-paper px-5 py-4">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          <span>Node events</span>
          <span>↘ live</span>
        </div>
        <ul className="font-mono text-[12px]">
          {events.slice(0, 4).map((e, i) => (
            <li
              key={e.id}
              className="event-row flex items-baseline gap-3 py-1 pl-2"
              style={{
                opacity: 1 - i * 0.18,
                borderLeft: i === 0 ? "1px solid rgb(var(--signal))" : "1px solid transparent",
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
        <Stat label="Req/s" value={stats.rps} live />
        <Stat label="Error · 24h" value={stats.err} accent />
        <Stat label="Nodes" value={stats.nodes} />
        <Stat label="Latency · p99" value={stats.p99} />
      </div>
    </div>
  );
};

const Stat = ({ label, value, accent, live }: { label: string; value: string; accent?: boolean; live?: boolean }) => (
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

export default InfraPanel;
