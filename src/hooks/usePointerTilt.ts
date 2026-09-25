import { useEffect, useRef } from "react";

/** Adds a restrained, cursor-driven perspective response to a large surface. */
export function usePointerTilt<T extends HTMLElement>(degrees = 2.8) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let clientX = 0;
    let clientY = 0;

    const apply = () => {
      raf = 0;
      const bounds = element.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (clientY - bounds.top) / bounds.height));
      element.style.setProperty("--tilt-x", `${((x - 0.5) * degrees * 2).toFixed(3)}deg`);
      element.style.setProperty("--tilt-y", `${((0.5 - y) * degrees * 2).toFixed(3)}deg`);
    };

    const onMove = (event: PointerEvent) => {
      clientX = event.clientX;
      clientY = event.clientY;
      element.classList.add("is-tilting");
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      element.classList.remove("is-tilting");
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
    };

    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [degrees]);

  return ref;
}

export default usePointerTilt;
