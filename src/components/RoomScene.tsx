import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SceneController, { ROOM_PANELS } from "./SceneController";

gsap.registerPlugin(ScrollTrigger);

/**
 * Room sequence — the horizontal-pinned dolly.
 *
 * The outer section is `ROOM_COUNT * 100vh` tall — that's the scroll
 * budget. The inner stage is pinned to the viewport while the user
 * scrolls through, and the SceneController moves the camera laterally
 * along its spline based on scroll progress.
 *
 * HTML overlays for each room sit on top of the WebGL canvas. Each
 * overlay fades in/out based on its slice of the global scroll
 * progress (per room = 1/ROOM_COUNT of the budget).
 *
 * For step 3 the overlays are placeholder labels — steps 4-9 fill
 * each room with its actual content.
 */

interface RoomSceneProps {
  onContactClick?: () => void;
}

const ROOM_LABELS: Record<string, { eyebrow: string; index: string; label: string }> = {
  operations: { eyebrow: "[ 01 / OPERATIONS ]",     index: "01", label: "Operations" },
  approach:   { eyebrow: "[ 02 / APPROACH ]",       index: "02", label: "Approach" },
  build:      { eyebrow: "[ 03 / BUILD ]",          index: "03", label: "What we build" },
  work:       { eyebrow: "[ 04 / SELECTED WORK ]",  index: "04", label: "Selected work" },
  studio:     { eyebrow: "[ 05 / THE STUDIO ]",     index: "05", label: "The studio" },
  contact:    { eyebrow: "[ 06 / CONTACT ]",        index: "06", label: "Contact" },
};

const RoomScene = ({ onContactClick: _onContactClick }: RoomSceneProps) => {
  const pinnedRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinnedRef.current || !stageRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinnedRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: stageRef.current,
        pinSpacing: false,
      });
    }, pinnedRef);
    return () => ctx.revert();
  }, []);

  const roomCount = ROOM_PANELS.length;

  return (
    <section
      ref={pinnedRef}
      className="kz-pinned relative w-full"
      style={{ height: `${roomCount * 100}vh` }}
      aria-label="Kozai — operations console"
    >
      {/* Stage — pinned to the viewport for the duration of the section */}
      <div
        ref={stageRef}
        className="kz-stage relative h-screen w-full overflow-hidden bg-ink"
      >
        {/* WebGL canvas — sits behind everything */}
        <SceneController pinSelector=".kz-pinned" />

        {/* Persistent UI frame — always-visible corners */}
        <Frame />

        {/* Per-room HTML overlays */}
        {ROOM_PANELS.map((p, i) => (
          <RoomOverlay
            key={p.id}
            panelId={p.id}
            slice={i}
            total={roomCount}
            content={ROOM_LABELS[p.id]}
          />
        ))}

        {/* Progress marker — bottom-centre dot strip */}
        <ProgressBar total={roomCount} />
      </div>
    </section>
  );
};

const Frame = () => (
  <>
    {/* Top-left: studio label */}
    <div className="absolute left-6 top-6 z-20 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute md:left-12 md:top-8">
      kozai · software studio
    </div>
    {/* Top-right: live indicator */}
    <div className="absolute right-6 top-6 z-20 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute md:right-12 md:top-8">
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "rgb(var(--signal-2))" }} />
      <span>live · spring 2026</span>
    </div>
  </>
);

const ProgressBar = ({ total }: { total: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".kz-pinned",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          const fill = ref.current?.querySelector<HTMLDivElement>(".kz-progress__fill");
          if (fill) fill.style.width = `${self.progress * 100}%`;
          const idx = Math.min(total - 1, Math.floor(self.progress * total));
          const idxLabel = ref.current?.querySelector<HTMLSpanElement>(".kz-progress__idx");
          if (idxLabel) idxLabel.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
        },
      });
    });
    return () => ctx.revert();
  }, [total]);

  return (
    <div
      ref={ref}
      className="absolute bottom-6 left-1/2 z-20 flex w-[min(92vw,520px)] -translate-x-1/2 items-center gap-4 md:bottom-10"
    >
      <span className="kz-progress__idx font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute" style={{ fontVariantNumeric: "tabular-nums" }}>
        01 / {String(total).padStart(2, "0")}
      </span>
      <div className="relative h-px flex-1 bg-bone/15">
        <div
          className="kz-progress__fill absolute left-0 top-0 h-full"
          style={{ width: "0%", backgroundColor: "rgb(var(--signal))" }}
        />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">
        scroll →
      </span>
    </div>
  );
};

const RoomOverlay = ({
  panelId,
  slice,
  total,
  content,
}: {
  panelId: string;
  slice: number;
  total: number;
  content: { eyebrow: string; index: string; label: string };
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const start = slice / total;
    const end = (slice + 1) / total;
    const fadeIn = start + 0.05;
    const fadeOut = end - 0.05;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".kz-pinned",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          let opacity = 0;
          if (p > start && p < fadeIn) opacity = (p - start) / (fadeIn - start);
          else if (p >= fadeIn && p <= fadeOut) opacity = 1;
          else if (p > fadeOut && p < end) opacity = 1 - (p - fadeOut) / (end - fadeOut);
          el.style.opacity = String(opacity);
          el.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
        },
      });
    }, el);
    return () => ctx.revert();
  }, [slice, total]);

  return (
    <div
      ref={overlayRef}
      id={panelId}
      className="kz-room-overlay absolute inset-0 z-10 flex items-end px-6 pb-24 md:px-12 md:pb-28"
      style={{ opacity: 0 }}
    >
      <div className="w-full max-w-[1280px]">
        <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
          {content.eyebrow}
        </div>
        <h2
          className="display-headline mt-3 text-bone"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)", lineHeight: "0.96" }}
        >
          {content.label}
        </h2>
      </div>
    </div>
  );
};

export default RoomScene;
