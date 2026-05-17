import { useEffect, useState } from "react";

/**
 * IntroCurtain — community entry intro.
 *
 * Quiet, kozai-voice: a cream panel drops in, a small composition fades
 * in centered (mono label · thin orange rule · short phrase with one
 * orange-italic accent word), holds briefly, then the entire panel
 * translates up off-screen as a single piece. Text rides with the panel
 * so nothing fades awkwardly.
 *
 * Phases (total ~2400ms):
 *   • drop      0–350ms   — cream panel slides down from top.
 *   • label   350–700ms   — mono label fades in + thin orange rule draws.
 *   • phrase  700–1200ms  — phrase fades in below.
 *   • hold   1200–1800ms  — hold composition.
 *   • lift   1800–2400ms  — whole panel (and its text) slides up.
 *
 * Plays once per CommunityRoot mount. Skippable on click / Esc.
 * Reduced-motion: skipped entirely.
 */

const LABEL = "[ ✦ — ENTERING COMMUNITY ]";

type Phase = "drop" | "label" | "phrase" | "hold" | "lift" | "done";

const IntroCurtain = () => {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("drop");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const t1 = window.setTimeout(() => setPhase("label"), 350);
    const t2 = window.setTimeout(() => setPhase("phrase"), 700);
    const t3 = window.setTimeout(() => setPhase("hold"), 1200);
    const t4 = window.setTimeout(() => setPhase("lift"), 1800);
    const t5 = window.setTimeout(() => setPhase("done"), 2400);
    return () => {
      [t1, t2, t3, t4, t5].forEach((id) => window.clearTimeout(id));
    };
  }, [active]);

  const skip = () => setPhase("done");

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  if (!active || phase === "done") return null;

  const dropped = phase !== "drop";
  const labelIn = phase === "label" || phase === "phrase" || phase === "hold" || phase === "lift";
  const phraseIn = phase === "phrase" || phase === "hold" || phase === "lift";
  const lifting = phase === "lift";

  return (
    <div
      className="fixed inset-0 z-[2000]"
      role="presentation"
      onClick={skip}
      aria-hidden
    >
      {/* Single panel — drops in, holds, then lifts off as one piece.
          Text lives inside, so it travels with the panel on lift. */}
      <div
        className="absolute inset-0 bg-paper"
        style={{
          transform: lifting
            ? "translateY(-100%)"
            : dropped
              ? "translateY(0)"
              : "translateY(-100%)",
          transition: lifting
            ? "transform 0.6s cubic-bezier(0.65,0,0.35,1)"
            : "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-ink">
          {/* Mono label */}
          <div
            className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55"
            style={{
              opacity: labelIn ? 1 : 0,
              transform: labelIn ? "translateY(0)" : "translateY(6px)",
              transition:
                "opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {LABEL}
          </div>

          {/* Thin orange rule — draws left-to-right */}
          <div
            className="mt-5 h-px w-[160px] origin-center"
            style={{
              backgroundColor: "#F5803E",
              transform: labelIn ? "scaleX(1)" : "scaleX(0)",
              transition:
                "transform 0.45s cubic-bezier(0.16,1,0.3,1) 0.08s",
            }}
          />

          {/* Phrase — single line, orange-italic accent word */}
          <h2
            className="display mt-10 text-center text-ink"
            style={{
              fontSize: "clamp(1.9rem, 4.2vw, 3.1rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              opacity: phraseIn ? 1 : 0,
              transform: phraseIn ? "translateY(0)" : "translateY(10px)",
              transition:
                "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            Where the{" "}
            <span
              className="italic-editorial"
              style={{ color: "#F5803E" }}
            >
              quiet
            </span>{" "}
            work happens.
          </h2>

          {/* Skip hint — only while not lifting */}
          <div
            className="mt-16 font-mono text-[10px] uppercase tracking-[0.28em] text-ink/35"
            style={{
              opacity: phraseIn && !lifting ? 1 : 0,
              transition: "opacity 0.25s ease",
            }}
          >
            tap or press esc to skip
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroCurtain;
