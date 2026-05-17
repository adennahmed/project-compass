import { useEffect, useState } from "react";
import Logo from "@/components/Logo";

/**
 * IntroCurtain — community entry intro.
 *
 * Cream panel is full-bleed from the very first paint (no drop-in,
 * so the community page never shows underneath while the curtain
 * arrives). Inside: Kozai logo · mono label "KOZAI COMMUNITY" ·
 * thin orange rule that draws · short phrase with one orange-italic
 * accent. After a hold, the whole panel translates upward off-screen
 * as one piece, text riding with it.
 *
 * Phases (~2700ms total):
 *   • 0–200ms       — instant render; nothing has appeared yet inside.
 *   • 200–700ms     — logo fades in + drifts up 6px.
 *   • 700–1100ms    — mono label "KOZAI COMMUNITY" fades in.
 *   • 1100–1500ms   — thin orange rule draws left→right.
 *   • 1500–2100ms   — phrase fades up.
 *   • 2100–2700ms   — whole panel lifts up off-screen.
 *
 * Skippable on click / Esc. Reduced-motion: skipped entirely.
 */

type Phase = "init" | "logo" | "label" | "rule" | "phrase" | "hold" | "lift" | "done";

const IntroCurtain = () => {
  const [active, setActive] = useState(true);
  const [phase, setPhase] = useState<Phase>("init");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setActive(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const t1 = window.setTimeout(() => setPhase("logo"), 200);
    const t2 = window.setTimeout(() => setPhase("label"), 700);
    const t3 = window.setTimeout(() => setPhase("rule"), 1100);
    const t4 = window.setTimeout(() => setPhase("phrase"), 1500);
    const t5 = window.setTimeout(() => setPhase("hold"), 2100);
    const t6 = window.setTimeout(() => setPhase("lift"), 2400);
    const t7 = window.setTimeout(() => setPhase("done"), 3000);
    return () => {
      [t1, t2, t3, t4, t5, t6, t7].forEach((id) => window.clearTimeout(id));
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

  const logoIn = phase !== "init";
  const labelIn = phase === "label" || phase === "rule" || phase === "phrase" || phase === "hold" || phase === "lift";
  const ruleIn = phase === "rule" || phase === "phrase" || phase === "hold" || phase === "lift";
  const phraseIn = phase === "phrase" || phase === "hold" || phase === "lift";
  const lifting = phase === "lift";

  return (
    <div
      className="fixed inset-0 z-[2000]"
      role="presentation"
      onClick={skip}
      aria-hidden
    >
      <div
        className="absolute inset-0 bg-paper"
        style={{
          transform: lifting ? "translateY(-100%)" : "translateY(0)",
          transition: lifting
            ? "transform 0.6s cubic-bezier(0.65,0,0.35,1)"
            : undefined,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-ink">
          {/* Kozai logo */}
          <div
            style={{
              opacity: logoIn ? 1 : 0,
              transform: logoIn ? "translateY(0)" : "translateY(6px)",
              transition:
                "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <Logo size={42} variant="black" />
          </div>

          {/* Mono label */}
          <div
            className="mt-7 font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55"
            style={{
              opacity: labelIn ? 1 : 0,
              transform: labelIn ? "translateY(0)" : "translateY(6px)",
              transition:
                "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            [ ✦ — KOZAI COMMUNITY ]
          </div>

          {/* Thin orange rule — draws left-to-right */}
          <div
            className="mt-5 h-px w-[160px] origin-center"
            style={{
              backgroundColor: "#F5803E",
              transform: ruleIn ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}
          />

          {/* Phrase — single line, orange-italic accent word */}
          <h2
            className="display mt-10 text-center text-ink"
            style={{
              fontSize: "clamp(1.7rem, 3.6vw, 2.6rem)",
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

          {/* Skip hint */}
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
