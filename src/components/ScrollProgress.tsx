import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

const LABELS: Record<string, string> = {
  top: "ORIGIN",
  projects: "SYSTEMS",
  playground: "PLAY",
  method: "METHOD",
  kozai: "ARCHIVE",
  about: "ABOUT",
  console: "CONSOLE",
  contact: "CONTACT",
};

const ScrollProgress = ({ sections }: { sections: string[] }) => {
  const [active, setActive] = useState(0);
  const fillRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const velocityRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    let velocityTimer = 0;
    let lastY = window.scrollY;
    let displayedVelocity = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, y / max));
      const targetVelocity = Math.max(-99, Math.min(99, y - lastY));
      displayedVelocity += (targetVelocity - displayedVelocity) * 0.38;
      lastY = y;

      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress.toFixed(4)})`;
      if (percentRef.current) percentRef.current.textContent = String(Math.round(progress * 100)).padStart(3, "0");
      if (velocityRef.current) {
        const velocityHeight = 2 + Math.min(1, Math.abs(displayedVelocity) / 42) * 8;
        velocityRef.current.style.setProperty("--velocity", `${velocityHeight.toFixed(2)}px`);
        window.clearTimeout(velocityTimer);
        velocityTimer = window.setTimeout(() => {
          velocityRef.current?.style.setProperty("--velocity", "2px");
        }, 140);
      }

      const sample = y + window.innerHeight * 0.42;
      let next = 0;
      sections.forEach((id, index) => {
        const element = document.getElementById(id);
        if (!element) return;
        const top = element.getBoundingClientRect().top + y;
        if (top <= sample) next = index;
      });
      setActive((current) => current === next ? current : next);
    };

    const requestUpdate = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(velocityTimer);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [sections]);

  const jump = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(element, { offset: -24, duration: 1.25 });
    else element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="kz-progress-rail" aria-label="Section progress">
      <div className="kz-progress-rail__readout" aria-hidden>
        <span ref={percentRef}>000</span><small>%</small>
      </div>
      <div className="kz-progress-rail__track" aria-hidden><span ref={fillRef} /></div>
      <div className="kz-progress-rail__nodes">
        {sections.map((id, index) => (
          <button
            key={id}
            type="button"
            onClick={() => jump(id)}
            className={`kz-progress-rail__node ${active === index ? "is-active" : ""}`}
            aria-label={`Go to ${LABELS[id] ?? id}`}
            aria-current={active === index ? "location" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <i />
            <b>{LABELS[id] ?? id}</b>
          </button>
        ))}
      </div>
      <span ref={velocityRef} className="kz-progress-rail__velocity" aria-hidden><i /><i /><i /></span>
    </nav>
  );
};

export default ScrollProgress;
