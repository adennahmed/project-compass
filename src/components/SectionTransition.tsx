import { useEffect, useRef } from "react";

interface SectionTransitionProps {
  /** Big kinetic keyword that scrubs through the boundary. */
  word: string;
  index: number;
  total: number;
  /** Flip the slide + fill direction (alternate down the page for rhythm). */
  flip?: boolean;
}

const STREAM_GLYPHS = "01<>[]{}/\\|=+*#%·:abcdef".split("");

/**
 * SectionTransition — a scroll-scrubbed band placed between sections. Driven
 * frame-accurate to scroll, it runs in parallel:
 *   • an ASCII "data stream" backdrop whose columns flow with progress and
 *     wash brightest at mid-transition,
 *   • a huge outlined keyword with a signal-red clip-path fill wiping through,
 *   • a red scan line sweeping top→bottom, and
 *   • a mono index readout whose bar + percentage track progress.
 * Honours prefers-reduced-motion by resting at the mid frame.
 */
const SectionTransition = ({ word, index, total, flip = false }: SectionTransitionProps) => {
  const bandRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const pRef = useRef(0.5);

  // DOM scrub — cheap transform/clip updates on scroll.
  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;
    const dir = flip ? -1 : 1;

    const apply = (p: number) => {
      pRef.current = p;
      if (slideRef.current) slideRef.current.style.transform = `translate3d(${(p - 0.5) * 46 * dir}%,0,0)`;
      if (fillRef.current) {
        fillRef.current.style.clipPath = flip
          ? `inset(0 0 0 ${(1 - p) * 100}%)`
          : `inset(0 ${(1 - p) * 100}% 0 0)`;
      }
      if (scanRef.current) scanRef.current.style.top = `${p * 100}%`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
      if (pctRef.current) pctRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(0.5);
      return;
    }

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = band.getBoundingClientRect();
        const vh = window.innerHeight;
        apply(Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height))));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [flip]);

  // ASCII data-stream backdrop — its own rAF, gated to when the band is near
  // the viewport so off-screen bands cost nothing.
  useEffect(() => {
    const band = bandRef.current;
    const canvas = canvasRef.current;
    if (!band || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = getComputedStyle(document.documentElement);
    const ink = (root.getPropertyValue("--ink").trim() || "235 237 243").replace(/\s+/g, ",");
    const sig = (root.getPropertyValue("--signal").trim() || "244 49 58").replace(/\s+/g, ",");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let cell = 24;
    let cols = 0;
    let rows = 0;
    const seeds: number[] = [];
    const speeds: number[] = [];
    const resize = () => {
      const r = band.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.textBaseline = "top";
      cell = w < 640 ? 16 : 24;
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      for (let c = 0; c < cols; c++) {
        seeds[c] = Math.random() * 1000;
        speeds[c] = 0.4 + Math.random() * 1.1;
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(band);

    let inView = false;
    const io = new IntersectionObserver(
      (es) => {
        inView = es[0].isIntersecting;
        if (inView) start();
      },
      { rootMargin: "120px" },
    );
    io.observe(band);

    let raf = 0;
    const draw = () => {
      const p = pRef.current;
      const intensity = Math.sin(Math.max(0, Math.min(1, p)) * Math.PI); // 0→1→0
      const t = performance.now() * 0.001;
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${cell - 7}px "Martian Mono", ui-monospace, monospace`;
      const trail = 9;
      for (let c = 0; c < cols; c++) {
        // head position flows with scroll progress + a slow time drift
        const head = p * rows * 2.2 * speeds[c] + t * speeds[c] * 2 + seeds[c];
        for (let k = 0; k < trail; k++) {
          const row = (Math.floor(head) - k) % rows;
          const rr = row < 0 ? row + rows : row;
          let a = (1 - k / trail) * intensity * 0.5;
          if (a < 0.02) continue;
          const n = (c * 9277 + rr * 131 + Math.floor(head)) | 0;
          const red = k === 0 && (n % 11 === 0);
          if (k === 0) a = Math.min(1, a + 0.18); // bright head
          ctx.fillStyle = `rgba(${red ? sig : ink},${a.toFixed(3)})`;
          ctx.fillText(STREAM_GLYPHS[Math.abs(n) % STREAM_GLYPHS.length], c * cell, rr * cell);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    const loop = () => {
      if (!inView) {
        cancelAnimationFrame(raf);
        return;
      }
      draw();
    };
    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const tag = `[ ${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")} ]`;

  return (
    <div
      ref={bandRef}
      aria-hidden
      className="relative flex h-[44vh] w-full items-center overflow-hidden md:h-[52vh]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgb(var(--hairline) / 0.05) 0 1px, transparent 1px 84px)",
      }}
    >
      {/* ASCII data-stream backdrop */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 opacity-90" />

      {/* Kinetic keyword — outlined base + red wipe-fill overlay */}
      <div ref={slideRef} className="kz-tx-word relative will-change-transform" style={{ paddingInline: "6vw" }}>
        <span className="block" style={{ WebkitTextStroke: "1px rgb(var(--ink) / 0.22)", color: "transparent" }}>
          {word}
        </span>
        <span
          ref={fillRef}
          className="absolute inset-0 block"
          style={{
            paddingInline: "6vw",
            color: "rgb(var(--signal))",
            clipPath: flip ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
          }}
        >
          {word}
        </span>
      </div>

      {/* Sweeping red scan line */}
      <div
        ref={scanRef}
        className="pointer-events-none absolute left-0 right-0 h-px bg-signal/70"
        style={{ top: "50%", boxShadow: "0 0 12px rgb(var(--signal) / 0.5)" }}
      />

      {/* Index readout + progress bar */}
      <div className="container-wide pointer-events-none absolute inset-x-0 bottom-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
        <span>{tag}</span>
        <span className="relative h-px w-32 bg-hairline/15 md:w-56">
          <span ref={barRef} className="absolute inset-0 origin-left bg-signal" style={{ transform: "scaleX(0)" }} />
        </span>
        <span>
          <span ref={pctRef}>050</span>
          <span className="text-mute/50"> %</span>
        </span>
      </div>
    </div>
  );
};

export default SectionTransition;
