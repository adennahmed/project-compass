import { useEffect, useState } from "react";

/**
 * IntroCurtain — one-time community entry intro.
 *
 * Phases (total ~2500ms):
 *   • drop     0–400ms   — cream panel slides down from top.
 *   • title  400–1100ms  — mono label types in + thin line draws.
 *   • word  1100–1900ms  — "A room for operators." fades in.
 *   • split 1900–2500ms  — curtain halves slide apart, page revealed.
 *
 * Skippable on click / Esc. Persisted via sessionStorage. Reduced-motion:
 * skips entirely.
 */

const KEY = "kozai_community_intro_seen";
const LABEL = "[ ✦ — Entering community ]";

type Phase = "drop" | "title" | "word" | "split" | "done";

const IntroCurtain = () => {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("drop");
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(KEY) === "1";
    } catch {
      // sessionStorage may be unavailable (private mode) — skip the intro then.
      return;
    }
    if (seen) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      try {
        window.sessionStorage.setItem(KEY, "1");
      } catch { /* noop */ }
      return;
    }
    setActive(true);
    try {
      window.sessionStorage.setItem(KEY, "1");
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (!active) return;
    const t1 = window.setTimeout(() => setPhase("title"), 400);
    const t2 = window.setTimeout(() => setPhase("word"), 1100);
    const t3 = window.setTimeout(() => setPhase("split"), 1900);
    const t4 = window.setTimeout(() => setPhase("done"), 2500);
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

  return (
    <div
      className="fixed inset-0 z-[2000]"
      role="presentation"
      onClick={skip}
      aria-hidden
    >
      {/* Top half */}
      <div
        className="absolute left-0 right-0 top-0 h-1/2 bg-paper"
        style={{
          transform: splitting ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.65s cubic-bezier(0.16,1,0.3,1)",
          animation: phase === "drop" ? "kz-curtain-drop 0.4s cubic-bezier(0.16,1,0.3,1)" : undefined,
        }}
      />
      {/* Bottom half */}
      <div
        className="absolute left-0 right-0 bottom-0 h-1/2 bg-paper"
        style={{
          transform: splitting ? "translateY(100%)" : "translateY(0)",
          transition: "transform 0.65s cubic-bezier(0.16,1,0.3,1)",
          animation: phase === "drop" ? "kz-curtain-drop 0.4s cubic-bezier(0.16,1,0.3,1)" : undefined,
        }}
      />

      {/* Center content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-ink"
        style={{
          opacity: splitting ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-mute">
          {LABEL.slice(0, typed)}
          {phase === "title" && typed < LABEL.length && (
            <span className="ml-0.5 inline-block w-[6px] animate-pulse bg-ink/60" style={{ height: "0.9em" }} />
          )}
        </div>
        <div
          className="mt-5 h-px w-[180px] origin-left bg-ink/30"
          style={{
            transform: phase === "drop" ? "scaleX(0)" : "scaleX(1)",
            transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1) 0.05s",
          }}
        />
        <h2
          className="display mt-7 text-ink"
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            opacity: phase === "word" || phase === "split" ? 1 : 0,
            transform: phase === "word" || phase === "split" ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          A room for <span className="italic-editorial text-signal">operators.</span>
        </h2>
        <div className="mt-12 font-mono text-[10px] uppercase tracking-[0.28em] text-mute/60">
          tap or press esc to skip
        </div>
      </div>
    </div>
  );
};

export default IntroCurtain;
