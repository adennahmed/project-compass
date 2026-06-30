import { useEffect, useRef, useState } from "react";

/**
 * RevenuePanel — "Atlas Pipeline" revenue-ops dashboard. Placeholder data only;
 * the funnel bars ease on each tick, deal events stream in, and the headline
 * metrics drift — same construction approach as the Deploy Console.
 */

const STAGES = [
  { id: "leads", label: "Leads" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "won", label: "Won" },
];

const DEAL_EVENTS = [
  "Deal won · Northgate Dist. · $48.2k",
  "Proposal sent · Atrium Partners",
  "New lead · Harlan Foods",
  "Deal won · Ironwood Mfg · $31.5k",
  "Qualified · Merrick Medical",
  "Deal won · Fairlane Freight · $27.9k",
];

const fmtTs = (d: Date) =>
  `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;

type Ev = { id: number; ts: string; text: string };

const RevenuePanel = ({ className = "" }: { className?: string }) => {
  const [counts, setCounts] = useState([1240, 486, 158, 61]);
  const [events, setEvents] = useState<Ev[]>([
    { id: 1, ts: "11:42:02", text: "Deal won · Ironwood Mfg · $31.5k" },
    { id: 2, ts: "11:41:38", text: "Proposal sent · Atrium Partners" },
    { id: 3, ts: "11:41:12", text: "New lead · Harlan Foods" },
    { id: 4, ts: "11:40:47", text: "Deal won · Northgate Dist. · $48.2k" },
  ]);
  const [stats, setStats] = useState({ mrr: "$412k", pipeline: "$1.94M", win: "39%", cycle: "21d" });
  const idRef = useRef(10);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      setCounts((c) => c.map((v, i) => v + Math.floor(Math.random() * (4 - i) + (i === 0 ? 2 : 0))));
      const text = DEAL_EVENTS[(Math.random() * DEAL_EVENTS.length) | 0];
      const id = idRef.current++;
      setEvents((prev) => [{ id, ts: fmtTs(new Date()), text }, ...prev.slice(0, 5)]);
      setStats((s) => ({
        ...s,
        mrr: `$${(410 + Math.floor(Math.random() * 9)).toString()}k`,
        win: `${37 + Math.floor(Math.random() * 5)}%`,
      }));
    }, 2400);
    return () => window.clearInterval(t);
  }, []);

  const max = counts[0];

  return (
    <div className={`kz-panel ${className}`}>
      <header className="flex items-center justify-between border-b border-hairline/15 px-5 py-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
            rev · atlas-pipeline
          </span>
        </div>
        <div className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-mute md:block">
          live · Q3 / FY25
        </div>
      </header>

      {/* Funnel */}
      <div className="px-5 py-6">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            Pipeline funnel · this quarter
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
            {stats.win} win rate
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {STAGES.map((s, i) => {
            const w = Math.max(6, Math.round((counts[i] / max) * 100));
            const isWon = i === STAGES.length - 1;
            return (
              <div key={s.id} className="flex items-center gap-3">
                <span className="w-[70px] shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                  {s.label}
                </span>
                <div className="relative h-3 flex-1 overflow-hidden bg-paper-3">
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${w}%`,
                      background: isWon ? "rgb(var(--signal))" : "rgb(var(--ink))",
                      transition: "width 0.8s cubic-bezier(0.65,0,0.35,1)",
                    }}
                  />
                </div>
                <span className="w-[52px] shrink-0 text-right font-mono text-[12px] tabular-nums text-ink">
                  {counts[i].toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deal stream */}
      <div className="border-t border-hairline/15 bg-paper px-5 py-4">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          <span>Deal stream</span>
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
              <span aria-hidden className="text-signal">▸</span>
              <span className="text-ink">{e.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 border-t border-hairline/15 sm:grid-cols-4">
        <Stat label="MRR · net" value={stats.mrr} accent live />
        <Stat label="Pipeline" value={stats.pipeline} />
        <Stat label="Win rate" value={stats.win} />
        <Stat label="Avg cycle" value={stats.cycle} />
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

export default RevenuePanel;
