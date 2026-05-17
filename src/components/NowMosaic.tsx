/**
 * NowMosaic — 3-tile horizontal grid for Studio. Labeled "Now".
 * One sketch tile, one code tile, one editorial caption tile.
 * No images. Reads "real team, real week."
 */
const NowMosaic = () => {
  return (
    <div className="mt-14 border-t border-paper/10 pt-10">
      <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
        [ ✦ — Now ]
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Tile 1 — sketch */}
        <div className="flex flex-col border border-paper/12 bg-ink/40 p-5">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
            sketch · screen-02
          </div>
          <div className="flex flex-1 items-center justify-center py-4">
            <svg
              viewBox="0 0 180 110"
              width="100%"
              height="auto"
              fill="none"
              stroke="rgb(241,238,229)"
              strokeOpacity="0.55"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M3 4 Q4 3, 6 3 L174 4 Q177 4, 177 7 L177 105 Q176 107, 173 107 L6 106 Q3 106, 3 103 Z" />
              <path d="M4 18 L176 17" />
              <circle cx="11" cy="11" r="1.6" />
              <circle cx="18" cy="11" r="1.6" />
              <path d="M10 28 L60 28" />
              <path d="M10 34 L46 34" />
              <path d="M10 50 Q10 48, 12 48 L80 48 Q82 48, 82 50 L82 80 Q82 82, 80 82 L12 82 Q10 82, 10 80 Z" />
              <path d="M14 56 L60 56 M14 64 L70 64 M14 72 L52 72" />
              <path d="M92 50 L168 50 M92 58 L168 58 M92 66 L160 66 M92 74 L168 74 M92 82 L140 82" />
              <path d="M10 94 Q10 92, 12 92 L42 92 Q44 92, 44 94 L44 100 Q44 102, 42 102 L12 102 Q10 102, 10 100 Z" />
            </svg>
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
            fig.a — dispatch console v2
          </div>
        </div>

        {/* Tile 2 — code */}
        <div className="flex flex-col border border-paper/12 bg-ink/40 p-5">
          <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
            <span>types.ts</span>
            <span className="text-signal">●</span>
          </div>
          <pre className="flex-1 overflow-hidden font-mono text-[11.5px] leading-[1.7] text-paper/80">
{`type OperatorAction =
  | { kind: "dispatch"; route: RouteId }
  | { kind: "hold";     reason: string }
  | { kind: "release";  at: ISODate };

const apply = (a: OperatorAction) =>
  log.write({ at: now(), ...a });`}
          </pre>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
            fig.b — operator.action union
          </div>
        </div>

        {/* Tile 3 — caption */}
        <div className="flex flex-col border border-paper/12 bg-ink/40 p-5">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
            log · this week
          </div>
          <p className="flex-1 text-[14px] leading-[1.6] text-paper/85">
            <span className="italic-editorial text-signal">May 2026</span> — engaging with a
            Hamilton-area distributor on dispatch automation. Three weeks in, two screens
            prototyped, one of them already in front of a dispatcher.
          </p>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
            fig.c — current engagement
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowMosaic;
