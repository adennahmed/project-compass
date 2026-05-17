/**
 * NowMosaic — 3-tile editorial snapshot for Studio. Labeled "Now".
 * Tile 1: currently building. Tile 2: stack in rotation. Tile 3: output cadence.
 * Typography-led, no decorative SVG. Reads "intelligent, current, in motion."
 */

const STACK: Array<[string, string]> = [
  ["LANG", "TypeScript, Go"],
  ["DATA", "Postgres, pgvector"],
  ["INFRA", "Fly.io, Cloudflare"],
  ["FRONTEND", "React, Tailwind, Lenis"],
  ["DESIGN", "Figma, Linear, pen+paper"],
];

const CADENCE: Array<[string, string]> = [
  ["12", "deploys this week"],
  ["47", "operator interviews logged"],
  ["3", "engagements active"],
];

const NowMosaic = () => {
  return (
    <div className="mt-14 border-t border-paper/10 pt-10">
      <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
        [ ✦ — Now ]
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Tile 1 — Currently building */}
        <div className="flex flex-col border border-paper/12 px-6 py-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/55">
            [ ✦ — Currently building ]
          </div>
          <h3
            className="display mt-5 text-paper"
            style={{ fontSize: "clamp(1.25rem, 1.7vw, 1.6rem)", lineHeight: 1.15 }}
          >
            Dispatch automation —
            <br />
            <span className="text-paper/70">Hamilton-area distributor</span>
          </h3>
          <p className="mt-4 max-w-[34ch] text-[13.5px] leading-[1.6] text-paper/75">
            Three weeks in. Two screens prototyped, one already in front of a dispatcher.
            Targeting Q3 rollout.
          </p>
          <div className="mt-auto pt-6">
            <span className="inline-block border border-paper/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/70">
              Week 3 / 12 · On track
            </span>
          </div>
        </div>

        {/* Tile 2 — Stack in rotation */}
        <div className="flex flex-col border border-paper/12 px-6 py-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/55">
            [ ✦ — Stack ]
          </div>
          <ul className="mt-6 flex flex-col">
            {STACK.map(([label, value], i) => (
              <li
                key={label}
                className="flex items-baseline justify-between gap-4 py-2.5"
                style={{ borderTop: i === 0 ? undefined : "1px solid rgba(241,238,229,0.10)" }}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">
                  {label}
                </span>
                <span className="text-right text-[13px] text-paper/90">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tile 3 — Output cadence */}
        <div className="flex flex-col border border-paper/12 px-6 py-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/55">
            [ ✦ — Cadence · week 20 ]
          </div>
          <div className="mt-5 flex flex-col">
            {CADENCE.map(([num, label], i) => (
              <div
                key={label}
                className="flex items-baseline gap-4 py-3"
                style={{ borderTop: i === 0 ? undefined : "1px solid rgba(241,238,229,0.10)" }}
              >
                <span
                  className="display tabular-nums text-paper"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1, fontWeight: 600 }}
                >
                  {num}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowMosaic;
