import { useEffect, useRef } from "react";

/**
 * Magnetic cursor — quiet 8px ink dot. On `(hover: hover)` devices only.
 *
 * Behaviour:
 *  - Dot tracks the pointer with a tight spring (lerp 0.22).
 *  - When the pointer enters within ~80px of an element with `data-magnetic`,
 *    the dot drifts toward that element's centre and grows (`is-hover`).
 *  - Hidden on touch devices via CSS.
 *
 * No labels, no rings, no theatre. The mark of restraint.
 */
const MagneticCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let renderX = pointerX;
    let renderY = pointerY;
    let rafId = 0;
    let magneticTarget: HTMLElement | null = null;

    const onPointerMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      dot.classList.remove("is-hidden");
      // Find a magnetic target within range
      const candidates = document.querySelectorAll<HTMLElement>("[data-magnetic]");
      let nearest: HTMLElement | null = null;
      let nearestDist = Infinity;
      candidates.forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const range = Math.max(r.width, r.height) * 0.7 + 40;
        if (dist < range && dist < nearestDist) {
          nearest = el;
          nearestDist = dist;
        }
      });
      magneticTarget = nearest;
      dot.classList.toggle("is-hover", !!nearest);
    };

    const onPointerLeave = () => dot.classList.add("is-hidden");

    const tick = () => {
      let targetX = pointerX;
      let targetY = pointerY;
      if (magneticTarget) {
        const r = magneticTarget.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // Pull 30% toward element centre
        targetX = pointerX + (cx - pointerX) * 0.3;
        targetY = pointerY + (cy - pointerY) * 0.3;
      }
      renderX += (targetX - renderX) * 0.22;
      renderY += (targetY - renderY) * 0.22;
      dot.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <div ref={dotRef} className="kz-cursor-dot is-hidden" aria-hidden />;
};

export default MagneticCursor;
