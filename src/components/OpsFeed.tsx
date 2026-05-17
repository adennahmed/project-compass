import { useEffect, useRef, useState } from "react";

/**
 * OpsFeed — synthetic operator-software log strip. Terminal-style horizontal
 * scroll of plausible event lines. Labeled "Live (synthetic)" so it never
 * reads as deceptive real data.
 *
 * Performance: rAF-driven push interval, paused via IntersectionObserver when
 * off-screen. Reduced-motion: shows a static snapshot, no streaming.
 */

const EVENTS = [
  "invoice.print.queued",
  "pick-list.generated",
  "inventory.sync.completed",
  "dispatch.route.optimized",
  "payroll.batch.processed",
  "audit.entry.written",
  "webhook.delivered",
  "report.snapshot.captured",
  "customer.note.attached",
  "shipment.label.printed",
  "stock.threshold.tripped",
  "ticket.assigned",
  "ticket.escalated",
  "import.csv.validated",
  "export.scheduled",
  "user.session.opened",
  "permission.scope.changed",
  "backup.snapshot.archived",
  "schedule.shift.published",
  "rate.card.applied",
  "po.line.received",
  "return.authorized",
  "freight.quote.requested",
  "invoice.payment.reconciled",
  "ledger.entry.posted",
  "cache.warmed",
  "queue.drained",
  "alert.resolved",
  "dispatch.driver.checked-in",
  "stocktake.variance.flagged",
];

const CLIENTS = [
  "northgate-distrib",
  "merrick-medical",
  "tessera-capital",
  "kindred-health",
  "lumen-studios",
  "meridian-logistics",
  "harlan-foods",
  "ironwood-mfg",
  "atrium-partners",
  "fairlane-freight",
];

interface Line {
  id: number;
  t: string;
  verb: string;
  client: string;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function buildTimestamp(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeLine(id: number): Line {
  // Stagger timestamps backward so the strip looks like a continuous stream
  // rather than every line stamped "now."
  const offset = Math.floor(Math.random() * 6);
  const d = new Date(Date.now() - offset * 1000);
  return {
    id,
    t: buildTimestamp(d),
    verb: pick(EVENTS),
    client: pick(CLIENTS),
  };
}

const MAX = 7;
const SEED_ID = { v: 1 };

const OpsFeed = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>(() => {
    const seed: Line[] = [];
    for (let i = 0; i < MAX; i++) seed.push(makeLine(SEED_ID.v++));
    return seed;
  });
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setActive(e.isIntersecting);
      },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let cancelled = false;
    let timer: number;

    const schedule = () => {
      const delay = 1400 + Math.random() * 800;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setLines((prev) => {
          const next = [...prev.slice(1), makeLine(SEED_ID.v++)];
          return next;
        });
        schedule();
      }, delay);
    };
    schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [active]);

  return (
    <div className="container-wide">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
        <span>[ ✦ — Live (synthetic) ]</span>
        <span className="hidden md:inline">ops.stream · last-7</span>
      </div>
      <div
        ref={containerRef}
        className="relative h-[100px] overflow-hidden border border-hairline/15 bg-paper-2/40"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 24%, #000 76%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 24%, #000 76%, transparent 100%)",
        }}
        aria-hidden
      >
        <ul className="flex flex-col px-4 py-2 font-mono text-[11px] leading-[1.55]">
          {lines.map((l, i) => (
            <li
              key={l.id}
              className="ops-feed-line whitespace-nowrap"
              style={{
                opacity: 0.35 + (i / (lines.length - 1)) * 0.6,
              }}
            >
              <span style={{ color: "rgba(15,15,18,0.55)" }}>{l.t}</span>
              <span style={{ color: "rgba(15,15,18,0.30)" }}> · </span>
              <span style={{ color: "rgba(15,15,18,0.85)" }}>{l.verb}</span>
              <span style={{ color: "rgba(15,15,18,0.30)" }}> · client=</span>
              <span style={{ color: "rgb(245,128,62)" }}>{l.client}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OpsFeed;
