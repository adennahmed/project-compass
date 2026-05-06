import { useEffect, useState } from "react";

/**
 * Operations — first room. Monospace headline that types out as a stack
 * of terminal-style lines, plus the subline and meta strip pinned to the
 * viewport edge (per brief §4.6 / §5.4).
 *
 * The headline isn't a display-font reveal — it's command output, one
 * line at a time, with a blinking cursor at the active line.
 */

const HEADLINE_LINES = [
  "we don't sell software.",
  "we solve the problem",
  "behind the problem.",
];

interface OperationsRoomProps {
  /** True when this room's overlay opacity is meaningful (>0). Drives the typeout start. */
  active: boolean;
  onContactClick?: () => void;
}

const OperationsRoom = ({ active, onContactClick }: OperationsRoomProps) => {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [activeChars, setActiveChars] = useState(0);
  const [doneLines, setDoneLines] = useState<string[]>([]);

  // Trigger the typeout sequence the first time `active` flips true.
  useEffect(() => {
    if (active && activeIdx === -1) {
      setActiveIdx(0);
    }
  }, [active, activeIdx]);

  // Drive the typing — one character at a time, then a gap between lines.
  useEffect(() => {
    if (activeIdx < 0 || activeIdx >= HEADLINE_LINES.length) return;
    const line = HEADLINE_LINES[activeIdx];
    if (activeChars < line.length) {
      const t = window.setTimeout(() => setActiveChars((c) => c + 1), 28);
      return () => window.clearTimeout(t);
    }
    // Line complete — pause then advance
    const t = window.setTimeout(() => {
      setDoneLines((d) => [...d, line]);
      setActiveChars(0);
      setActiveIdx((i) => i + 1);
    }, 220);
    return () => window.clearTimeout(t);
  }, [activeIdx, activeChars]);

  return (
    <div className="absolute inset-0 z-10 flex h-full w-full flex-col px-6 pt-20 pb-24 md:px-12 md:pt-24 md:pb-28">
      {/* Top — eyebrow */}
      <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
        [ 01 / OPERATIONS ]
        <span className="mx-3 text-bone/30">·</span>
        kozai console — spring 2026
      </div>

      {/* Centre — typeout block, sits over the top of the trading-floor panel */}
      <div className="mt-auto max-w-[820px]">
        <div
          className="font-mono"
          style={{
            fontSize: "clamp(1.6rem, 3.6vw, 3rem)",
            lineHeight: "1.2",
            letterSpacing: "-0.01em",
          }}
        >
          {doneLines.map((line, i) => (
            <div key={`done-${i}`} className="text-bone/85">
              <span style={{ color: "rgb(var(--signal))" }}>&gt;&nbsp;</span>
              {line}
            </div>
          ))}
          {activeIdx >= 0 && activeIdx < HEADLINE_LINES.length && (
            <div className="text-bone">
              <span style={{ color: "rgb(var(--signal))" }}>&gt;&nbsp;</span>
              {HEADLINE_LINES[activeIdx].slice(0, activeChars)}
              <span className="kz-cursor">_</span>
            </div>
          )}
          {activeIdx >= HEADLINE_LINES.length && (
            <div className="mt-1 text-bone/55">
              <span style={{ color: "rgb(var(--signal))" }}>&gt;&nbsp;</span>
              <span className="kz-cursor">_</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom strip — subline + meta + CTA */}
      <div className="mt-10 grid w-full grid-cols-1 gap-8 md:mt-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <p className="max-w-[460px] text-sm leading-relaxed text-bone/65 md:text-[15px]">
            Kozai is a software studio designing and building the internal tools,
            dashboards, and platforms that small teams and enterprise operators
            rely on every day.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-x-6 md:col-span-5 md:gap-x-10">
          <MetaCell label="Studio" value="Toronto · Remote" />
          <MetaCell label="Focus" value="Tools & platforms" />
          <MetaCell label="Stack" value="TS · Go · Rust · SQL" />
        </div>

        <div className="md:col-span-2 flex md:items-end md:justify-end">
          <button
            type="button"
            onClick={onContactClick}
            className="group inline-flex items-center gap-3 border border-bone/15 bg-ink-rise/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.32em] text-bone transition-colors hover-target"
            style={{ backdropFilter: "blur(2px)" }}
            data-cursor-label="Begin"
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "rgb(var(--signal))" }}
            />
            <span>start a project</span>
            <span className="text-bone/40 transition-colors group-hover:text-bone">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const MetaCell = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">
      {label}
    </div>
    <div className="mt-2 text-sm text-bone/85">{value}</div>
  </div>
);

export default OperationsRoom;
