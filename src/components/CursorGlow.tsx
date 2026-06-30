import { useEffect, useRef } from "react";

/**
 * CursorGlow — a brutalist square cursor. A thin ring lags toward the pointer
 * while a signal-red dot tracks it tightly; the ring grows and turns red over
 * interactive elements. Desktop pointers only; disabled for touch and for
 * prefers-reduced-motion (the native cursor is always kept as a fallback).
 */
const CursorGlow = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let dx = mx;
    let dy = my;
    let scale = 1;
    let targetScale = 1;
    let shown = false;
    let raf = 0;

    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element &&
      !!t.closest('a,button,[role="button"],input,textarea,select,label,summary,.cursor-target');

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        shown = true;
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }
      const hot = isInteractive(e.target);
      targetScale = hot ? 1.9 : 1;
      ring.classList.toggle("is-hot", hot);
    };
    const onLeave = () => {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
      shown = false;
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dx += (mx - dx) * 0.42;
      dy += (my - dy) * 0.42;
      scale += (targetScale - scale) * 0.2;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${scale.toFixed(3)})`;
      dot.style.transform = `translate3d(${dx}px,${dy}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="kz-cursor-ring" aria-hidden />
      <div ref={dotRef} className="kz-cursor-dot" aria-hidden />
    </>
  );
};

export default CursorGlow;
