import { useEffect, useState } from "react";

/**
 * IntroCurtain — community entry intro.
 *
 * Phases (total ~2700ms):
 *   • drop     0–400ms   — cream panel slides down from top.
 *   • title  400–1100ms  — mono label types in + thin line draws.
 *   • word  1100–2000ms  — split text lines fade up.
 *   • split 2000–2700ms  — top half (with top text) translates UP,
 *                         bottom half (with bottom text) translates DOWN.
 *                         Text never fades — it leaves the viewport
 *                         because its parent half moves.
 *
 * Plays once per CommunityRoot mount. Skippable on click / Esc.
 * Reduced-motion: skips entirely.
 */

const LABEL = "[ ✦ — Entering community ]";
const TOP_LINE = "A small room for —";
const BOTTOM_LINE = "the people who build the boring software that runs the world.";

type Phase = "drop" | "title" | "word" | "split" | "done";

const IntroCurtain = () => {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("drop");
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const t1 = window.setTimeout(() => setPhase("title"), 400);
    const t2 = window.setTimeout(() => setPhase("word"), 1100);
    const t3 = window.setTimeout(() => setPhase("split"), 2000);
    const t4 = window.setTimeout(() => setPhase("done"), 2700);
    return () => {
      [t1, t2, t3, t4].forEach((id) => window.clearTimeout(id));
    };
  }, [active]);

  // typewriter for the label
  useEffect(() => {
    if (!active || phase !== "title") return;
    let i = 0;
    const tick = () => {
      i += 1;
      setTyped(i);
      if (i < LABEL.length) {
        window.setTimeout(tick, 22);
      }
    };
    tick();
  }, [active, phase]);

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

  const splitting = phase === "split";
  const showText = phase === "word" || phase === "split";

  // Shared transition for both halves so they leave together.
  const halfTransition = "transform 0.7s cubic-bezier(0.16,1,0.3,1)";

  return (
    <div
      className="fixed inset-0 z-[2000]"
      role="presentation"
      onClick={skip}
      aria-hidden
    >
      {/* TOP HALF — cream panel that holds the mono label, divider, and the
          top text line. On split, this whole half (and its children) slides up. */}
      <div
        className="absolute left-0 right-0 top-0 h-1/2 overflow-hidden bg-paper"
        style={{
          transform: splitting ? "translateY(-100%)" : "translateY(0)",
          transition: halfTransition,
          animation:
            phase === "drop"
              ? "kz-curtain-drop 0.4s cubic-bezier(0.16,1,0.3,1)"
              : undefined,
        }}
      >
        {/* Anchored to bottom edge so content sits near the viewport centerline. */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-6 text-ink">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-mute">
            {LABEL.slice(0, typed)}
            {phase === "title" && typed < LABEL.length && (
              <span
                className="ml-0.5 inline-block w-[6px] animate-pulse bg-ink/60"
                style={{ height: "0.9em" }}
              />
            )}
          </div>
          <div
            className="mt-5 h-px w-[180px] origin-left bg-ink/30"
            style={{
              transform: phase === "drop" ? "scaleX(0)" : "scaleX(1)",
              transition:
                "transform 0.35s cubic-bezier(0.16,1,0.3,1) 0.05s",
            }}
          />
          <h2
            className="display mt-7 text-ink"
            style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              opacity: showText ? 1 : 0,
              transform: showText ? "translateY(0)" : "translateY(10px)",
              transition:
                "opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {TOP_LINE}
          </h2>
        </div>
      </div>

      {/* BOTTOM HALF — holds the italic bottom line. Slides down on split. */}
      <div
        className="absolute left-0 right-0 bottom-0 h-1/2 overflow-hidden bg-paper"
        style={{
          transform: splitting ? "translateY(100%)" : "translateY(0)",
          transition: halfTransition,
          animation:
            phase === "drop"
              ? "kz-curtain-drop 0.4s cubic-bezier(0.16,1,0.3,1)"
              : undefined,
        }}
      >
        {/* Anchored to top edge so content sits near the viewport centerline. */}
        <div className="absolute inset-x-0 top-0 flex flex-col items-center pt-7 text-ink">
          <h2
            className="display italic-editorial max-w-[26ch] text-center text-ink"
            style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              opacity: showText ? 1 : 0,
              transform: showText ? "translateY(0)" : "translateY(10px)",
              transition:
                "opacity 0.55s cubic-bezier(0.16,1,0.3,1) 0.08s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.08s",
            }}
          >
            {BOTTOM_LINE}
          </h2>
          <div
            className="mt-12 font-mono text-[10px] uppercase tracking-[0.28em] text-mute/60"
            style={{
              opacity: showText && !splitting ? 1 : 0,
              transition: "opacity 0.3s ease",
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
