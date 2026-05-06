import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ROOM_PANELS } from "../SceneController";

gsap.registerPlugin(ScrollTrigger);

/**
 * Approach room — three "panels" of three-word triads with body copy
 * (per brief §4.6 / §5.5). LOUD's editorial signature: extreme
 * compression of positioning into haiku-length statements.
 *
 * Within the approach slice of global scroll, three sub-states cycle.
 * Each triad word reveals via stagger when its panel becomes active.
 */

interface TriadDef {
  n: string;
  words: string[];
  body: string;
  italic?: number;  // index of word to render in editorial italic (per brief §4.2)
}

const TRIADS: TriadDef[] = [
  {
    n: "01",
    words: ["SCOPED.", "OPINIONATED.", "SHIPPED."],
    body:
      "We ship the smallest tool that solves the real problem, then iterate. " +
      "No platform-shaped roadmaps for two-feature problems.",
  },
  {
    n: "02",
    words: ["ENGINEERS.", "NOT", "VENDORS."],
    italic: 1,
    body:
      "You communicate directly with the engineers building your system. " +
      "Clear technical discussion in place of account managers and project intermediaries.",
  },
  {
    n: "03",
    words: ["BUILT.", "TO.", "OWN."],
    body:
      "Clean code, plain stack, real documentation. When we hand off, your team " +
      "can pick it up the same day.",
  },
];

interface ApproachRoomProps {
  active: boolean;
}

const ApproachRoom = ({ active }: ApproachRoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTriad, setActiveTriad] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const idx = ROOM_PANELS.findIndex((p) => p.id === "approach");
    const total = ROOM_PANELS.length;
    const sliceStart = idx / total;
    const sliceEnd = (idx + 1) / total;
    const sliceLen = sliceEnd - sliceStart;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".kz-pinned",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < sliceStart - 0.02 || p > sliceEnd + 0.02) return;
          const sliceP = Math.max(0, Math.min(0.999, (p - sliceStart) / sliceLen));
          const next = Math.min(TRIADS.length - 1, Math.floor(sliceP * TRIADS.length));
          setActiveTriad(next);
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 flex h-full w-full flex-col px-6 pt-20 pb-24 md:px-12 md:pt-24 md:pb-28"
    >
      {/* Eyebrow */}
      <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
        [ 02 / APPROACH ]
        <span className="mx-3 text-bone/30">·</span>
        principles
      </div>

      {/* Triad stack — absolute-positioned slots, only one visible at a time */}
      <div className="relative mt-auto" style={{ minHeight: "clamp(280px, 38vh, 420px)" }}>
        {TRIADS.map((triad, i) => (
          <Triad
            key={i}
            triad={triad}
            isVisible={active && activeTriad === i}
          />
        ))}
      </div>

      {/* Counter — bottom indicator showing active triad */}
      <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute md:mt-10">
        {TRIADS.map((_, i) => (
          <span
            key={i}
            className="transition-colors duration-200"
            style={{
              color:
                activeTriad === i
                  ? "rgb(var(--signal))"
                  : "rgb(var(--bone-mute) / 0.45)",
            }}
          >
            0{i + 1}
          </span>
        ))}
        <span className="ml-2 text-bone/30">/ 03</span>
      </div>
    </div>
  );
};

const Triad = ({ triad, isVisible }: { triad: TriadDef; isVisible: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const root = ref.current;
    if (!root || !isVisible || playedRef.current) return;
    playedRef.current = true;

    const num = root.querySelector<HTMLDivElement>(".kz-tn");
    const wordSpans = root.querySelectorAll<HTMLSpanElement>(".kz-tw > span");
    const body = root.querySelector<HTMLParagraphElement>(".kz-tb");

    gsap.fromTo(
      num,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
    );
    gsap.fromTo(
      wordSpans,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.7, ease: "power3.out", stagger: 0.1, delay: 0.15 },
    );
    gsap.fromTo(
      body,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: 0.55 },
    );
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 transition-opacity duration-300 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <div
        className="kz-tn font-mono text-[11px] uppercase tracking-[0.32em] opacity-0"
        style={{ color: "rgb(var(--signal))" }}
      >
        / {triad.n}
      </div>
      <h3
        className="display-headline mt-4 flex flex-wrap items-baseline gap-x-3 text-bone md:gap-x-5"
        style={{
          fontSize: "clamp(2rem, 6.5vw, 5.5rem)",
          lineHeight: "1.02",
          letterSpacing: "-0.04em",
        }}
      >
        {triad.words.map((w, j) => (
          <span key={j} className="kz-tw inline-block overflow-hidden">
            <span
              className="inline-block"
              style={{
                transform: "translateY(110%)",
                fontStyle: triad.italic === j ? "italic" : "normal",
                fontFamily:
                  triad.italic === j
                    ? "'Times New Roman', Georgia, serif"
                    : undefined,
                fontWeight: triad.italic === j ? 400 : undefined,
              }}
            >
              {w}
            </span>
          </span>
        ))}
      </h3>
      <p className="kz-tb mt-6 max-w-[560px] text-sm leading-relaxed text-bone/65 opacity-0 md:text-base">
        {triad.body}
      </p>
    </div>
  );
};

export default ApproachRoom;
