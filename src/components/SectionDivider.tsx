import { useEffect, useState } from "react";

interface SectionDividerProps {
  /** Optional mono label centered above the divider, e.g. "02 / 06". */
  label?: string;
  /** 1-based position out of total (used to default the label). */
  index?: number;
  total?: number;
}

/**
 * SectionDivider — thin line spanning full width, with a 5px orange dot whose
 * horizontal position tracks the user's overall page scroll progress.
 *
 * The dot moves across the *entire* viewport width as the user scrolls through
 * the *entire* page. Each divider therefore shows the same global dot at
 * different moments — a unified "you are here" sense.
 */
const SectionDivider = ({ label, index, total }: SectionDividerProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollEl = document.documentElement;
        const max = scrollEl.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
        setProgress(p);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  const resolvedLabel =
    label ?? (index && total ? `[ ✦ — ${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")} ]` : null);

  return (
    <div className="relative w-full" aria-hidden>
      <div className="container-wide">
        {resolvedLabel && (
          <div className="flex justify-center pt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-mute/70">
            {resolvedLabel}
          </div>
        )}
        <div className="relative my-5 h-px w-full bg-ink/10">
          <span
            className="absolute -top-[2px] block h-[5px] w-[5px] rounded-full bg-signal"
            style={{
              left: `calc(${progress * 100}% - 2.5px)`,
              transition: "left 0.18s linear",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionDivider;
