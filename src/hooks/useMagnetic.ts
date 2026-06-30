import { useEffect, useRef } from "react";

/**
 * useMagnetic — gives an element a magnetic pull toward the cursor when the
 * pointer enters its proximity radius, easing back to rest on exit. Returns a
 * ref to attach to the target. Honours prefers-reduced-motion.
 *
 *   const ref = useMagnetic<HTMLButtonElement>();
 *   <button ref={ref}>…</button>
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.32, radius = 90) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.style.transition = "transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)";
    el.style.willChange = "transform";

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(r.width, r.height) / 2 + radius;
      if (dist < reach) {
        const falloff = 1 - dist / reach;
        el.style.transform = `translate(${dx * strength * falloff}px, ${dy * strength * falloff}px)`;
      } else if (el.style.transform) {
        el.style.transform = "";
      }
    };
    const reset = () => {
      el.style.transform = "";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, [strength, radius]);

  return ref;
}

export default useMagnetic;
