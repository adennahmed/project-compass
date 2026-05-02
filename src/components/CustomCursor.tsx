import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Minimal custom cursor — vermilion 4px dot, 32px outline ring on hover,
 * `+` crosshair when over a panel. No labels. (Per brief §4.8.)
 *
 * Interactive elements pick up the .hover state via standard selectors.
 * Panel registration: any element with [data-cursor="panel"] flips to crosshair.
 */
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const dot = cursor.querySelector("#cursor-dot") as HTMLElement;
    const ring = cursor.querySelector("#cursor-ring") as HTMLElement;
    const cross = cursor.querySelector("#cursor-cross") as HTMLElement;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.16, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.16, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.36, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.36, ease: "power3" });
    const crossX = gsap.quickTo(cross, "x", { duration: 0.18, ease: "power3" });
    const crossY = gsap.quickTo(cross, "y", { duration: 0.18, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      crossX(e.clientX);
      crossY(e.clientY);
    };

    const bind = () => {
      const hoverables = document.querySelectorAll<HTMLElement>(
        'a, button, [role="button"], input, textarea, .hover-target, [data-cursor]'
      );
      hoverables.forEach((el) => {
        if (el.dataset.cursorBound === "1") return;
        el.dataset.cursorBound = "1";
        const mode = el.dataset.cursor;
        el.addEventListener("mouseenter", () => {
          if (mode === "panel") cursor.classList.add("panel");
          else cursor.classList.add("hover");
        });
        el.addEventListener("mouseleave", () => {
          cursor.classList.remove("hover", "panel");
        });
      });
    };

    bind();
    const observer = new MutationObserver(bind);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", onMove);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div id="cursor" ref={cursorRef} aria-hidden>
      <div id="cursor-ring" />
      <div id="cursor-dot" />
      <div id="cursor-cross" />
    </div>
  );
};

export default CustomCursor;
