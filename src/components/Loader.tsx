import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

interface LoaderProps {
  onComplete: () => void;
}

const SERVICE_STRINGS = [
  "internal_tools",
  "workflow_automation",
  "data_pipelines",
  "client_platforms",
  "mvp_engineering",
];

const TICK_DURATION = 2400;
const HOLD_BEFORE_MORPH = 280;
const MORPH_DURATION = 800;
const HOLD_BEFORE_EXIT = 600;
const EXIT_DURATION = 700;

/**
 * Loader — the brand reveal.
 *
 *   Phase 1 (running):  bottom-left counter ticks 000.0 → 100.0 with the
 *                       service-string rotator above it.
 *   Phase 2 (morphing): the counter cross-fades & blurs out; the Kozai
 *                       wordmark — same position, same scale — fades & blurs
 *                       in, hairline drawing left-to-right.
 *   Phase 3 (exiting):  the entire field fades to reveal the page below.
 *
 * The loader IS the brand reveal. The wordmark is born from the counter.
 */
const Loader = ({ onComplete }: LoaderProps) => {
  const [pct, setPct] = useState("000.0");
  const [serviceIdx, setServiceIdx] = useState(0);
  const [phase, setPhase] = useState<"running" | "morphing" | "exiting">("running");
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("is-loading");

    const rotate = window.setInterval(() => {
      setServiceIdx((i) => (i + 1) % SERVICE_STRINGS.length);
    }, 220);

    let raf = 0;
    const tick = (now: number) => {
      if (startedAt.current == null) startedAt.current = now;
      const elapsed = now - startedAt.current;
      const t = Math.min(1, elapsed / TICK_DURATION);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const v = eased * 100;
      const integer = Math.floor(v).toString().padStart(3, "0");
      const decimal = Math.floor((v - Math.floor(v)) * 10);
      setPct(`${integer}.${decimal}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const morphTimer = window.setTimeout(() => {
      window.clearInterval(rotate);
      setPhase("morphing");
    }, TICK_DURATION + HOLD_BEFORE_MORPH);

    const exitTimer = window.setTimeout(() => {
      setPhase("exiting");
    }, TICK_DURATION + HOLD_BEFORE_MORPH + MORPH_DURATION + HOLD_BEFORE_EXIT);

    const unmountTimer = window.setTimeout(() => {
      document.documentElement.classList.remove("is-loading");
      onComplete();
    }, TICK_DURATION + HOLD_BEFORE_MORPH + MORPH_DURATION + HOLD_BEFORE_EXIT + EXIT_DURATION);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(rotate);
      window.clearTimeout(morphTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(unmountTimer);
      document.documentElement.classList.remove("is-loading");
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-paper"
      style={{
        opacity: phase === "exiting" ? 0 : 1,
        transition: `opacity ${EXIT_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        pointerEvents: phase === "exiting" ? "none" : "auto",
      }}
      aria-hidden={phase === "exiting"}
    >
      {/* Top-left: system identifier */}
      <div className="absolute left-6 top-6 font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:left-10 md:top-8">
        kozai · studio · est. 2026
      </div>

      {/* Top-right: year */}
      <div className="absolute right-6 top-6 font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:right-10 md:top-8">
        © 2026 — toronto, ca
      </div>

      {/* Centred stage — counter morphs into wordmark, both occupy the same space */}
      <div
        className="absolute left-6 bottom-6 md:bottom-12 md:left-10"
        style={{ minHeight: "clamp(3.25rem, 8.5vw, 7rem)" }}
      >
        {/* Service rotator — only visible in running phase */}
        {phase === "running" && (
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
            {`> ${SERVICE_STRINGS[serviceIdx]}`}
          </div>
        )}

        {/* Counter or wordmark — same anchor, the morph happens via cross-fade */}
        <div className="relative">
          {phase === "running" && (
            <div
              className="font-mono font-medium text-ink"
              style={{
                fontSize: "clamp(3.25rem, 8.5vw, 7rem)",
                lineHeight: "0.9",
                letterSpacing: "-0.04em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {pct}
            </div>
          )}
          {phase === "morphing" && (
            <div className="loader-counter-exit absolute inset-0 font-mono font-medium text-ink"
              style={{
                fontSize: "clamp(3.25rem, 8.5vw, 7rem)",
                lineHeight: "0.9",
                letterSpacing: "-0.04em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              100.0
            </div>
          )}
          {(phase === "morphing" || phase === "exiting") && (
            <div className="loader-wordmark-enter text-ink">
              <Logo size={64} animate />
            </div>
          )}
        </div>
      </div>

      {/* Bottom-right: studio coordinates */}
      <div className="absolute bottom-12 right-6 text-right font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:bottom-14 md:right-10">
        43.6532° N · 79.3832° W
        <div className="mt-1 text-ink/40">building tools serious teams depend on</div>
      </div>
    </div>
  );
};

export default Loader;
