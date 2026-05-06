import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./Logo";

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

const TICK_DURATION = 2200; // counter run from 000.0 → 100.0
const HOLD_BEFORE_EXIT = 350; // hold at 100.0
const EXIT_DURATION = 700; // fade out

/**
 * Loader — quiet operator edition.
 *
 *   · bottom-left: rotating service-string + 3-digit decimal counter
 *   · centre: animated logo mark — three pills assemble in sequence
 *   · bottom-right: studio coordinates
 *
 * The exit is a single soft cross-fade — no snap, no flash. When complete,
 * the loader unmounts and the page underneath takes over.
 */
const Loader = ({ onComplete }: LoaderProps) => {
  const [pct, setPct] = useState("000.0");
  const [serviceIdx, setServiceIdx] = useState(0);
  const [phase, setPhase] = useState<"running" | "exiting">("running");
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("is-loading");

    // Rotating service string — cycles every 220ms while counter ticks
    const rotate = window.setInterval(() => {
      setServiceIdx((i) => (i + 1) % SERVICE_STRINGS.length);
    }, 220);

    // Counter tick via rAF for buttery-smooth update
    let raf = 0;
    const tick = (now: number) => {
      if (startedAt.current == null) startedAt.current = now;
      const elapsed = now - startedAt.current;
      const t = Math.min(1, elapsed / TICK_DURATION);
      // ease-in-out cubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const v = eased * 100;
      const integer = Math.floor(v).toString().padStart(3, "0");
      const decimal = Math.floor((v - Math.floor(v)) * 10);
      setPct(`${integer}.${decimal}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // After the counter finishes + hold, trigger exit fade then unmount
    const exitTimer = window.setTimeout(() => {
      window.clearInterval(rotate);
      setPhase("exiting");
    }, TICK_DURATION + HOLD_BEFORE_EXIT);

    const unmountTimer = window.setTimeout(() => {
      document.documentElement.classList.remove("is-loading");
      onComplete();
    }, TICK_DURATION + HOLD_BEFORE_EXIT + EXIT_DURATION);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(rotate);
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
      {/* Top-left wordmark — system identifier */}
      <div className="absolute left-6 top-6 font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:left-10 md:top-8">
        kozai · studio
      </div>

      {/* Top-right marker — year */}
      <div className="absolute right-6 top-6 font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:right-10 md:top-8">
        © 2026
      </div>

      {/* Centred logo mark — pills assemble in stagger */}
      <div className="text-signal" style={{ transform: "translateY(-2vh)" }}>
        <LogoMark size={88} animate />
      </div>

      {/* Bottom-left: service rotator + counter */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
          {`> ${SERVICE_STRINGS[serviceIdx]}`}
        </div>
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
      </div>

      {/* Bottom-right: studio coordinates */}
      <div className="absolute bottom-10 right-6 text-right font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:bottom-12 md:right-10">
        43.6532° N · 79.3832° W
        <div className="mt-1 text-ink/40">toronto · ca</div>
      </div>
    </div>
  );
};

export default Loader;
