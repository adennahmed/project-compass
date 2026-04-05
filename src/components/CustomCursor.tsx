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

    const label = cursor.querySelector("#cursor-label") as HTMLElement;

    const addCursorListeners = () => {
      // Clickable elements — expand cursor with ring
      const clickables = document.querySelectorAll('a, button, [role="button"], input[type="submit"], .hover-target, [data-cursor="view"]');
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursor.classList.add("clickable");
        });
        el.addEventListener("mouseleave", () => {
          cursor.classList.remove("clickable");
        });
      });

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
          cursor.classList.add("view");
          if (label) label.textContent = "VIEW";
        });
        el.addEventListener("mouseleave", () => {
          cursor.classList.remove("view");
          if (label) label.textContent = "";
        });
      });
    };

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
