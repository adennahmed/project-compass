import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─── Mockup 1 — Revenue desk (pipeline board) ───────────────────────────── */
const PIPE: Array<[string, string[]]> = [
  ["New", ["Northgate · $48k", "Harlan · $31k", "Atrium · $27k"]],
  ["Qualified", ["Merrick · $62k", "Ironwood · $19k"]],
  ["Won", ["Fairlane · $44k", "Vaughan · $38k", "Cedar · $22k"]],
];
const PipelineBoard = () => {
  const [won, setWon] = useState(412);
  useEffect(() => {
    if (reduced()) return;
    const t = window.setInterval(() => setWon((w) => w + Math.floor(Math.random() * 7) + 1), 1900);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
        <span className="text-mute">Pipeline · ${won}k won</span>
        <span className="text-signal">▲ live</span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {PIPE.map(([col, cards], ci) => (
          <div key={col} className="flex flex-col gap-2 border border-hairline/12 bg-paper-3/40 p-2">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-mute">{col}</div>
            {cards.map((card, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-1 border border-hairline/12 bg-paper-2 px-2 py-1.5 text-[10px] text-ink/85"
              >
                <span className="truncate">{card}</span>
                {ci === 2 && idx === 0 && (
                  <span aria-hidden className="stage-dot text-signal">●</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Mockup 2 — Stock radar (inventory grid) ────────────────────────────── */
const StockRadar = () => {
  const low = new Set([5, 18]);
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
        <span className="text-mute">Inventory radar · 1,284 SKUs</span>
        <span className="text-signal">2 low</span>
      </div>
      <div className="relative flex-1 overflow-hidden border border-hairline/12 bg-paper-3/30 p-2">
        <div className="grid h-full grid-cols-8 grid-rows-4 gap-1.5">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className={`border ${
                low.has(i)
                  ? "border-signal/50 bg-signal/25"
                  : "border-hairline/10 bg-paper-2"
              }`}
              style={
                low.has(i)
                  ? { animation: "kz-dot-pulse 1.6s ease-in-out infinite" }
                  : undefined
              }
            />
          ))}
        </div>
        {/* sweeping scan line */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-2 w-[8%] bg-signal/20"
          style={{ animation: reduced() ? undefined : "kz-radar-scan 3.4s linear infinite" }}
        />
      </div>
    </div>
  );
};

/* ─── Mockup 3 — Approvals queue ─────────────────────────────────────────── */
const QUEUE = ["INV-2841 · Refund", "PO-1190 · Vendor", "EXP-552 · Travel", "TKT-908 · Access", "INV-2839 · Credit"];
const ApprovalsQueue = () => {
  const [approved, setApproved] = useState<boolean[]>(() => QUEUE.map(() => false));
  useEffect(() => {
    if (reduced()) return;
    let i = 0;
    const t = window.setInterval(() => {
      setApproved((prev) => {
        if (i >= QUEUE.length) {
          i = 0;
          return QUEUE.map(() => false);
        }
        const next = [...prev];
        next[i] = true;
        i += 1;
        return next;
      });
    }, 1200);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
        <span className="text-mute">Approvals queue</span>
        <span className="text-signal">{approved.filter((a) => !a).length} pending</span>
      </div>
      <ul className="flex flex-1 flex-col gap-1.5">
        {QUEUE.map((r, i) => (
          <li
            key={r}
            className="flex items-center justify-between border border-hairline/12 bg-paper-2 px-3 text-[11px] text-ink/85"
            style={{ flex: "1 1 0" }}
          >
            <span className="font-mono text-[10px] tracking-[0.04em]">{r}</span>
            <span
              className="font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: approved[i] ? "#3FA46B" : "rgb(var(--mute))" }}
            >
              {approved[i] ? "✓ Approved" : "Pending"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ─── Mockup 4 — Field dispatch (map) ────────────────────────────────────── */
const FieldMap = () => {
  const playing = !reduced();
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
        <span className="text-mute">Field dispatch · 6 units</span>
        <span className="text-signal">▲ moving</span>
      </div>
      <div className="relative flex-1 overflow-hidden border border-hairline/12 bg-paper-3/30">
        <svg viewBox="0 0 300 170" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
          <g stroke="#ECECEE" strokeOpacity="0.06" strokeWidth="0.6">
            {[34, 68, 102, 136].map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} />
            ))}
            {[50, 100, 150, 200, 250].map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="170" />
            ))}
          </g>
          {[
            { id: "r1", d: "M 20 140 Q 90 60, 150 110 T 280 30", dur: "5s" },
            { id: "r2", d: "M 24 30 Q 120 120, 200 70 T 285 140", dur: "6.2s" },
          ].map((r) => (
            <g key={r.id}>
              <path id={r.id} d={r.d} fill="none" stroke="#F4313A" strokeOpacity="0.4" strokeWidth="1.3" strokeDasharray="4 3" strokeLinecap="round" />
              {/* destination */}
              <circle cx={r.id === "r1" ? 280 : 285} cy={r.id === "r1" ? 30 : 140} r="3.2" fill="#F4313A">
                {playing && <animate attributeName="r" values="3.2;4.6;3.2" dur="1.8s" repeatCount="indefinite" />}
              </circle>
              {playing && (
                <polygon points="-3,-2.4 4,0 -3,2.4 -1,0" fill="#F4313A" stroke="#0B0B0D" strokeWidth="0.5">
                  <animateMotion dur={r.dur} repeatCount="indefinite" rotate="auto">
                    <mpath href={`#${r.id}`} />
                  </animateMotion>
                </polygon>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

interface Build {
  name: string;
  slug: string;
  tag: string;
  blurb: string;
  Mock: React.ComponentType;
}

const BUILDS: Build[] = [
  {
    name: "Revenue desk",
    slug: "revenue",
    tag: "CRM · pipeline",
    blurb: "Every deal, stage, and number in one board your sales lead actually trusts — no more eight-tab reconciliation before the Monday call.",
    Mock: PipelineBoard,
  },
  {
    name: "Stock radar",
    slug: "inventory",
    tag: "Inventory · alerts",
    blurb: "Live stock health across every SKU and location, with low-stock flags that fire before a line goes empty — not after the angry email.",
    Mock: StockRadar,
  },
  {
    name: "Approvals",
    slug: "approvals",
    tag: "Workflow · queue",
    blurb: "Refunds, POs, expenses, and access requests in a single queue with the policy baked in — approve from your phone, audit trail for free.",
    Mock: ApprovalsQueue,
  },
  {
    name: "Field dispatch",
    slug: "dispatch",
    tag: "Logistics · routing",
    blurb: "Routes, ETAs, and proof-of-delivery on one map — dispatchers stop calling drivers to ask where they are.",
    Mock: FieldMap,
  },
];

const BuildShowcase = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced()) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % BUILDS.length), 5400);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section id="builds" data-snap className="relative px-6 py-24 md:px-10 md:py-28">
      <div className="container-wide">
        <Reveal>
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="label mb-4">
                <ScrambleText text="[ ✦ — Things we'd build for you ]" />
              </div>
              <h2 className="display max-w-[20ch] text-ink" style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}>
                Pick a problem. Picture the screen.
              </h2>
            </div>
            <p className="max-w-[42ch] text-[15px] leading-[1.6] text-mute md:text-right md:text-[16px]">
              Not a portfolio of logos — a sense of the surfaces we'd ship for an operation like yours. Hover a build to bring it forward.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
            {/* Selector list */}
            <div className="md:col-span-4">
              <ul className="border-t border-hairline/15">
                {BUILDS.map((b, i) => {
                  const on = i === active;
                  return (
                    <li key={b.slug}>
                      <button
                        type="button"
                        onClick={() => setActive(i)}
                        onMouseEnter={() => setActive(i)}
                        aria-current={on}
                        className="group relative block w-full border-b border-hairline/15 py-5 text-left transition-colors hover:bg-paper-2/40"
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-0 h-full w-px origin-top bg-signal transition-transform duration-500"
                          style={{ transform: on ? "scaleY(1)" : "scaleY(0)" }}
                        />
                        <div className="flex items-baseline justify-between gap-3 pl-4">
                          <span
                            className="display text-ink transition-colors"
                            style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)", color: on ? undefined : undefined }}
                          >
                            {b.name}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
                            0{i + 1}
                          </span>
                        </div>
                        <div
                          className="grid pl-4 transition-all duration-500"
                          style={{
                            gridTemplateRows: on ? "1fr" : "0fr",
                            opacity: on ? 1 : 0,
                          }}
                        >
                          <div className="overflow-hidden">
                            <p className="pt-2 text-[13px] leading-[1.55] text-mute">{b.blurb}</p>
                            <span className="mt-2 inline-block font-mono text-[9px] uppercase tracking-[0.22em] text-signal">
                              {b.tag}
                            </span>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Mockup frame */}
            <div className="md:col-span-8">
              <div className="kz-panel overflow-hidden">
                {/* browser chrome */}
                <div className="flex items-center gap-3 border-b border-hairline/15 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-signal/70" />
                  </div>
                  <div className="flex-1 truncate border border-hairline/12 bg-paper-3/50 px-3 py-1 font-mono text-[10px] text-mute">
                    kozai.app/{BUILDS[active].slug}
                  </div>
                  <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-mute sm:inline">
                    Mockup
                  </span>
                </div>

                {/* stacked mockups, crossfade */}
                <div className="relative h-[360px] md:h-[440px]">
                  {BUILDS.map((b, i) => {
                    const on = i === active;
                    const Mock = b.Mock;
                    return (
                      <div
                        key={b.slug}
                        aria-hidden={!on}
                        className="absolute inset-0"
                        style={{
                          opacity: on ? 1 : 0,
                          transform: on ? "translateY(0) scale(1)" : "translateY(14px) scale(0.985)",
                          pointerEvents: on ? "auto" : "none",
                          transition: "opacity 0.5s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                        }}
                      >
                        <Mock />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* progress dots */}
              <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                <span>fig.0{active + 1} — {BUILDS[active].name}</span>
                <div className="flex items-center gap-1.5">
                  {BUILDS.map((b, i) => (
                    <button
                      key={b.slug}
                      type="button"
                      aria-label={`Show ${b.name}`}
                      onClick={() => setActive(i)}
                      className="h-1.5 transition-all duration-300"
                      style={{
                        width: i === active ? 16 : 6,
                        background: i === active ? "rgb(var(--signal))" : "rgb(var(--mute) / 0.4)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default BuildShowcase;
