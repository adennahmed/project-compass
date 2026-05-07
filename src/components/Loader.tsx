import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

interface LoaderProps {
  /** Called the moment the loader begins its exit animation —
   *  the page should reveal itself underneath at this instant. */
  onExitStart: () => void;
  /** Called once the loader has fully unmounted. */
  onComplete: () => void;
}

const SERVICE_STRINGS = [
  "internal_tools",
  "workflow_automation",
  "data_pipelines",
  "client_platforms",
  "mvp_engineering",
];

const TICK_DURATION = 2200;
const HOLD_BEFORE_MORPH = 220;
const MORPH_DURATION = 750;
const HOLD_BEFORE_LIFT = 480;
const LIFT_DURATION = 1100;

/**
 * Loader — counter ticks → wordmark morph → curtain lift.
 *
 * The whole field translates UP off-screen with a stiff cubic-bezier when
 * exiting, revealing the page beneath. The page is mounted and animated
 * into place concurrently (page-settle in Index), so the two motions
 * dovetail rather than fade through black.
 */
const Loader = ({ onExitStart, onComplete }: LoaderProps) => {
  const [pct, setPct] = useState("000.0");
  const [serviceIdx, setServiceIdx] = useState(0);
  const [phase, setPhase] = useState<"running" | "morphing" | "lifting">("running");
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

    const liftTimer = window.setTimeout(() => {
      setPhase("lifting");
      onExitStart();
    }, TICK_DURATION + HOLD_BEFORE_MORPH + MORPH_DURATION + HOLD_BEFORE_LIFT);

    const unmountTimer = window.setTimeout(() => {
      document.documentElement.classList.remove("is-loading");
      onComplete();
    }, TICK_DURATION + HOLD_BEFORE_MORPH + MORPH_DURATION + HOLD_BEFORE_LIFT + LIFT_DURATION);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(rotate);
      window.clearTimeout(morphTimer);
      window.clearTimeout(liftTimer);
      window.clearTimeout(unmountTimer);
      document.documentElement.classList.remove("is-loading");
    };
  }, [onExitStart, onComplete]);

  return (
    <div
      className={`loader-curtain fixed inset-0 z-[999999] flex items-center justify-center bg-paper ${
        phase === "lifting" ? "is-leaving" : ""
      }`}
      aria-hidden={phase === "lifting"}
    >
      {/* Top corners — system identifiers */}
      <div className="absolute left-6 top-6 font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:left-10 md:top-8">
        kozai · studio · est. 2026
      </div>
      {/* Hidden on mobile — not enough room alongside left label */}
      <div className="absolute right-6 top-6 hidden font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:block md:right-10 md:top-8">
        © 2026 — toronto, ca
      </div>

      {/* Vertical hairlines drawing across the screen — adds depth */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/4 w-px bg-ink/5"
        style={{
          transformOrigin: "top",
          transform: phase === "running" ? "scaleY(1)" : "scaleY(1)",
          transition: "opacity 600ms ease",
          opacity: phase === "lifting" ? 0 : 1,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 right-1/4 w-px bg-ink/5"
        style={{ opacity: phase === "lifting" ? 0 : 1, transition: "opacity 600ms ease" }}
      />

      {/* Bottom-left stage — counter morphs into wordmark */}
      <div className="absolute left-6 bottom-6 md:bottom-12 md:left-10">
        {phase === "running" && (
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
            {`> ${SERVICE_STRINGS[serviceIdx]}`}
          </div>
        )}

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
            <div
              className="loader-counter-exit absolute inset-0 font-mono font-medium text-ink"
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
          {(phase === "morphing" || phase === "lifting") && (
            <div className="loader-wordmark-enter text-ink">
              <Logo size={64} animate />
            </div>
          )}
        </div>
      </div>

      {/* Bottom-right: studio coordinates — hidden on mobile to avoid
          overlapping with the wide wordmark in the bottom-left */}
      <div className="absolute bottom-12 right-6 hidden text-right font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:block md:bottom-14 md:right-10">
        43.6532° N · 79.3832° W
        <div className="mt-1 text-ink/40">building tools serious teams depend on</div>
      </div>
    </div>
  );
};

export default Loader;
