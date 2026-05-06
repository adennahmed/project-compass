import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ROOM_PANELS } from "./SceneController";

gsap.registerPlugin(ScrollTrigger);

/**
 * Per brief §4.7 — between rooms the camera does a *hard cut*, not a
 * smooth crossfade. This component renders the visual punctuation:
 * a 1-frame full-bleed flash followed by a 200ms decaying scanline
 * sweep + RGB-shift veil. It listens to the global pinned scroll
 * progress and fires on every room-boundary crossing.
 *
 * The "1-frame cut" is implemented as a 16ms full-opacity flash, then
 * the rest of the budget (~220ms) decays the streaks/scanlines.
 */
const RoomTransitionGlitch = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lastIdxRef = useRef(0);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const total = ROOM_PANELS.length;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".kz-pinned",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          const idx = Math.min(total - 1, Math.floor(p * total));
          if (idx !== lastIdxRef.current) {
            lastIdxRef.current = idx;
            triggerFlash(el);
          }
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={overlayRef}
      className="kz-glitch pointer-events-none absolute inset-0 z-30"
      aria-hidden
    >
      <div className="kz-glitch__bands" />
      <div className="kz-glitch__sweep" />
    </div>
  );
};

const triggerFlash = (el: HTMLElement) => {
  // Re-trigger CSS animations: remove the class, force reflow, add it back.
  el.classList.remove("is-cut");
  void el.offsetWidth;
  el.classList.add("is-cut");
};

export default RoomTransitionGlitch;
