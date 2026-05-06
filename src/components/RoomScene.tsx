import { ReactNode, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SceneController, { ROOM_PANELS } from "./SceneController";
import OperationsRoom from "./rooms/OperationsRoom";
import ApproachRoom from "./rooms/ApproachRoom";
import BuildRoom from "./rooms/BuildRoom";
import WorkRoom from "./rooms/WorkRoom";
import StudioRoom from "./rooms/StudioRoom";
import ContactRoom from "./rooms/ContactRoom";
import RoomTransitionGlitch from "./RoomTransitionGlitch";

gsap.registerPlugin(ScrollTrigger);

/**
 * Room sequence — the horizontal-pinned dolly.
 *
 * The outer section is `ROOM_COUNT * 100vh` tall — that's the scroll
 * budget. The inner stage is pinned to the viewport while the user
 * scrolls through, and the SceneController moves the camera laterally
 * along its spline based on scroll progress.
 *
 * Each panel gets its own overlay component. RoomSlot is a thin wrapper
 * that handles the fade-in/out based on the panel's slice of progress
 * and exposes an `active` flag that overlay components can use to
 * trigger their internal animations (e.g. typeout sequences).
 */

interface RoomSceneProps {
  onContactClick?: () => void;
}

// All six rooms now have their own overlay components. The placeholder
// fallback below renders only if a panel id is ever added without a
// matching overlay — defensive scaffolding.
const ROOM_PLACEHOLDER_LABELS: Record<string, { eyebrow: string; label: string }> = {};

const RoomScene = ({ onContactClick }: RoomSceneProps) => {
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
      <div
        ref={stageRef}
        className="kz-stage relative h-screen w-full overflow-hidden bg-ink"
      >
        {/* WebGL canvas — sits behind everything */}
        <SceneController pinSelector=".kz-pinned" />

        {/* Persistent UI frame */}
        <Frame />

        {/* Per-room overlays */}
        {ROOM_PANELS.map((p, i) => (
          <RoomSlot key={p.id} panelId={p.id} slice={i} total={roomCount}>
            {(active) => {
              if (p.id === "operations") {
                return <OperationsRoom active={active} onContactClick={onContactClick} />;
              }
              if (p.id === "approach") {
                return <ApproachRoom active={active} />;
              }
              if (p.id === "build") {
                return <BuildRoom active={active} />;
              }
              if (p.id === "work") {
                return <WorkRoom active={active} />;
              }
              if (p.id === "studio") {
                return <StudioRoom active={active} />;
              }
              if (p.id === "contact") {
                return <ContactRoom active={active} onContactClick={onContactClick} />;
              }
              const placeholder = ROOM_PLACEHOLDER_LABELS[p.id];
              return placeholder ? <PlaceholderRoom {...placeholder} /> : null;
            }}
          </RoomSlot>
        ))}

        {/* Progress marker */}
        <ProgressBar total={roomCount} />

        {/* Glitch overlay — fires on every room boundary crossing */}
        <RoomTransitionGlitch />
      </div>
    </section>
  );
};

const Frame = () => (
  <>
    <div className="absolute left-6 top-6 z-20 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute md:left-12 md:top-8">
      kozai · software studio
    </div>
    <div className="absolute right-6 top-6 z-20 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute md:right-12 md:top-8">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: "rgb(var(--signal-2))" }}
      />
      <span>live · spring 2026</span>
    </div>
  </>
);

const ROOM_LABELS: Record<string, string> = {
  operations: "OPERATIONS",
  approach: "APPROACH",
  build: "BUILD",
  work: "WORK",
  studio: "STUDIO",
  contact: "CONTACT",
};

const ProgressBar = ({ total }: { total: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

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
          setActiveIdx(idx);
          const idxLabel = ref.current?.querySelector<HTMLSpanElement>(".kz-progress__idx");
          if (idxLabel) idxLabel.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
        },
      });
    });
    return () => ctx.revert();
  }, [total]);

  // Jump to room by scrolling the page to the panel's slice.
  const jumpTo = (i: number) => {
    const pinned = document.querySelector<HTMLElement>(".kz-pinned");
    if (!pinned) return;
    const rect = pinned.getBoundingClientRect();
    const docTop = window.scrollY + rect.top;
    const sectionH = pinned.offsetHeight;
    const target = docTop + (sectionH * i) / total + 4;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (v: number, o?: object) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.2 });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={ref}
      className="absolute bottom-6 left-1/2 z-20 flex w-[min(92vw,720px)] -translate-x-1/2 flex-col items-stretch gap-3 md:bottom-10"
    >
      {/* Room dots — click to jump */}
      <div className="flex items-center justify-between">
        {ROOM_PANELS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => jumpTo(i)}
            className="hover-target group relative flex flex-1 cursor-none items-center justify-center py-2"
            aria-label={`Jump to ${ROOM_LABELS[p.id] ?? p.id}`}
          >
            <span
              className="font-mono text-[9px] uppercase tracking-[0.32em] transition-colors duration-300"
              style={{
                color:
                  activeIdx === i
                    ? "rgb(var(--bone))"
                    : "rgb(var(--bone-mute) / 0.55)",
                opacity: activeIdx === i ? 1 : 0.7,
              }}
            >
              {ROOM_LABELS[p.id] ?? p.id}
            </span>
            <span
              className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-px transition-colors duration-300 group-hover:bg-bone/60"
              style={{
                backgroundColor:
                  activeIdx === i
                    ? "rgb(var(--signal))"
                    : "rgb(var(--bone) / 0.0)",
              }}
            />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <span
          className="kz-progress__idx font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
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
    </div>
  );
};

interface RoomSlotProps {
  panelId: string;
  slice: number;
  total: number;
  children: (active: boolean) => ReactNode;
}

const RoomSlot = ({ panelId, slice, total, children }: RoomSlotProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const start = slice / total;
    const end = (slice + 1) / total;
    const fadeIn = start + 0.04;
    const fadeOut = end - 0.04;
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
          // active ⇄ once the room becomes meaningfully visible.
          // Latch on so room-internal animations (e.g. typeouts) only run once.
          if (opacity > 0.2 && !active) setActive(true);
        },
      });
    }, el);
    return () => ctx.revert();
    // We want the trigger to be set up once per slot; `active` is intentionally
    // not in deps because it only ratchets in one direction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slice, total]);

  return (
    <div
      ref={overlayRef}
      id={panelId}
      className="kz-room-overlay absolute inset-0 z-10"
      style={{ opacity: 0 }}
    >
      {children(active)}
    </div>
  );
};

const PlaceholderRoom = ({ eyebrow, label }: { eyebrow: string; label: string }) => (
  <div className="absolute inset-0 z-10 flex items-end px-6 pb-24 md:px-12 md:pb-28">
    <div className="w-full max-w-[1280px]">
      <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
        {eyebrow}
      </div>
      <h2
        className="display-headline mt-3 text-bone"
        style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)", lineHeight: "0.96" }}
      >
        {label}
      </h2>
    </div>
  </div>
);

export default RoomScene;
