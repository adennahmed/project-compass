import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import OperatorPanel from "./OperatorPanel";
import RevenuePanel from "./dashboards/RevenuePanel";
import InfraPanel from "./dashboards/InfraPanel";

const PANELS = [
  { name: "deploy console", el: <OperatorPanel /> },
  { name: "revenue ops", el: <RevenuePanel /> },
  { name: "infra mesh", el: <InfraPanel /> },
];

const SCALE_SIDE = 0.85;
const OPACITY_SIDE = 0.45;

/**
 * DashboardSlider — full-width coverflow carousel. The active dashboard sits
 * centered and crisp; the previous/next panels flank it, scaled down, dimmed
 * and blurred so focus stays on the middle. Every panel is locked to the same
 * (tallest) height so paging never nudges the page. Arrows live outside the
 * clipping viewport so they're never cut off. Arrows, dots, the side panels,
 * and ←/→ keys all page; the active card tilts subtly toward the cursor.
 */
const DashboardSlider = () => {
  const n = PANELS.length;
  const [active, setActive] = useState(0);
  const [vw, setVw] = useState(0);
  const [maxH, setMaxH] = useState<number | undefined>(undefined);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);

  const go = useCallback((dir: number) => setActive((a) => (a + dir + n) % n), [n]);

  // Track viewport width so card width / offsets scale responsively.
  // Window resize listener as well as the ResizeObserver — covers phone
  // rotation and environments where the RO misses emulated viewport changes.
  useLayoutEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const mw = () => setVw(vp.clientWidth);
    mw();
    const ro = new ResizeObserver(mw);
    ro.observe(vp);
    window.addEventListener("resize", mw);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", mw);
    };
  }, []);

  // Lock every card to the tallest height so nothing jumps on page.
  const measureH = useCallback(() => {
    const hs = cardRefs.current.map((el) => (el ? el.offsetHeight : 0));
    const m = Math.max(0, ...hs);
    if (m) setMaxH(m);
  }, []);
  useLayoutEffect(() => {
    measureH();
  }, [measureH, vw]);
  useEffect(() => {
    const ros = cardRefs.current.map((el) => {
      if (!el) return null;
      const ro = new ResizeObserver(measureH);
      ro.observe(el);
      return ro;
    });
    window.addEventListener("resize", measureH);
    return () => {
      ros.forEach((r) => r?.disconnect());
      window.removeEventListener("resize", measureH);
    };
  }, [measureH]);

  // Mobile: the coverflow math collapses at phone widths — give the active
  // card nearly the whole viewport and push neighbours almost fully offscreen
  // (a thin peek strip remains on each edge).
  const isNarrow = vw > 0 && vw < 640;
  const cardW = vw ? (isNarrow ? Math.round(vw * 0.94) : Math.min(Math.round(vw * 0.6), 760)) : 0;
  const offset = cardW * (isNarrow ? 0.97 : 0.52);

  // shortest signed distance from active for n=3 (wraps to -1 / 0 / +1)
  const relOf = (i: number) => {
    let r = i - active;
    if (r > n / 2) r -= n;
    if (r < -n / 2) r += n;
    return r;
  };

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Product dashboards"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      className="relative outline-none"
    >
      {/* Arrow wrapper — overflow visible so the straddling arrows aren't clipped */}
      <div className="relative">
        <div
          ref={viewportRef}
          className="relative overflow-hidden"
          style={{ height: maxH, transition: "height 0.5s cubic-bezier(0.65,0,0.35,1)" }}
        >
          {PANELS.map((p, i) => {
            const rel = relOf(i);
            const isActive = rel === 0;
            const isSide = Math.abs(rel) === 1;
            return (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                aria-hidden={!isActive}
                onClick={() => !isActive && isSide && go(rel)}
                onMouseMove={(e) => {
                  if (!isActive) return;
                  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                  const tilt = tiltRefs.current[i];
                  const host = cardRefs.current[i];
                  if (!tilt || !host) return;
                  const r = host.getBoundingClientRect();
                  const px = (e.clientX - r.left) / r.width - 0.5;
                  const py = (e.clientY - r.top) / r.height - 0.5;
                  tilt.style.transform = `rotateY(${px * 5}deg) rotateX(${-py * 5}deg)`;
                }}
                onMouseLeave={() => {
                  const tilt = tiltRefs.current[i];
                  if (tilt) tilt.style.transform = "";
                }}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: cardW || "82%",
                  perspective: "1300px",
                  transform: `translate(-50%, -50%) translateX(${rel * offset}px) scale(${isActive ? 1 : SCALE_SIDE})`,
                  opacity: isActive ? 1 : isSide ? OPACITY_SIDE : 0,
                  zIndex: isActive ? 30 : 20 - Math.abs(rel),
                  filter: isActive ? "none" : "blur(3px)",
                  pointerEvents: isActive ? "auto" : isSide ? "auto" : "none",
                  cursor: isSide ? "pointer" : "default",
                  transition:
                    "transform 0.6s cubic-bezier(0.65,0,0.35,1), opacity 0.6s ease, filter 0.6s ease",
                  willChange: "transform, opacity",
                }}
              >
                <div
                  ref={(el) => (tiltRefs.current[i] = el)}
                  style={{ transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)", transformStyle: "preserve-3d" }}
                >
                  {p.el}
                </div>
              </div>
            );
          })}
        </div>

        {/* Side arrows — straddle the viewport edges, never clipped */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous dashboard"
          className="kz-dash-arrow absolute left-0 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next dashboard"
          className="kz-dash-arrow absolute right-0 top-1/2 z-40 -translate-y-1/2 translate-x-1/2"
        >
          ›
        </button>
      </div>

      {/* Caption + dots + index */}
      <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
        <span>
          fig.0{active + 1} — {PANELS[active].name}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {PANELS.map((p, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show ${p.name}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
                className="h-1.5 transition-all duration-300"
                style={{
                  width: i === active ? 16 : 6,
                  background: i === active ? "rgb(var(--signal))" : "rgb(var(--mute) / 0.4)",
                }}
              />
            ))}
          </div>
          <span className="text-mute/70">
            0{active + 1} / 0{n}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSlider;
