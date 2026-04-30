import { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const dot = cursor.querySelector("#cursor-dot") as HTMLElement;
    const ring = cursor.querySelector("#cursor-ring") as HTMLElement;
    const label = cursor.querySelector("#cursor-label") as HTMLElement;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.18, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.18, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3" });
    const labelX = gsap.quickTo(label, "x", { duration: 0.42, ease: "power3" });
    const labelY = gsap.quickTo(label, "y", { duration: 0.42, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      labelX(e.clientX);
      labelY(e.clientY);
    };

    const setLabel = (text: string) => {
      if (label) label.textContent = text;
    };

    const bind = () => {
      const hoverables = document.querySelectorAll<HTMLElement>(
        'a, button, [role="button"], input, textarea, .hover-target, [data-cursor]'
      );
      hoverables.forEach((el) => {
        if (el.dataset.cursorBound === "1") return;
        el.dataset.cursorBound = "1";
        const mode = el.dataset.cursor;
        const labelText = el.dataset.cursorLabel;
        el.addEventListener("mouseenter", () => {
          if (mode === "view") cursor.classList.add("view");
          else if (mode === "drag") cursor.classList.add("drag");
          else cursor.classList.add("hover");
          if (labelText) setLabel(labelText);
          else if (mode === "view") setLabel("View");
          else if (mode === "drag") setLabel("Drag");
        });
        el.addEventListener("mouseleave", () => {
          cursor.classList.remove("hover", "view", "drag");
          setLabel("");
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
      <div id="cursor-label" />
    </div>
  );
};

export default CustomCursor;
