import { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Cursor context states
    const label = cursor.querySelector("#cursor-label") as HTMLElement;

    const addCursorListeners = () => {
      document.querySelectorAll('[data-cursor="drag"]').forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursor.className = "drag";
          if (label) label.textContent = "DRAG";
        });
        el.addEventListener("mouseleave", () => {
          cursor.className = "";
          if (label) label.textContent = "";
        });
      });

      document.querySelectorAll('[data-cursor="view"]').forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursor.className = "view";
          if (label) label.textContent = "VIEW";
        });
        el.addEventListener("mouseleave", () => {
          cursor.className = "";
          if (label) label.textContent = "";
        });
      });
    };

    // Run initially and on DOM changes
    addCursorListeners();
    const observer = new MutationObserver(addCursorListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div id="cursor" ref={cursorRef}>
      <div id="cursor-inner">
        <span id="cursor-label"></span>
      </div>
    </div>
  );
};

export default CustomCursor;
