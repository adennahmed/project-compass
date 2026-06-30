import { useEffect, useState } from "react";

/**
 * BackgroundDrift — scroll-driven background with directional depth.
 *
 * No blobs. No dots. Two angular washes on the near-black base create depth
 * without calling attention to themselves:
 *
 *  1. Near-black base that lifts a touch toward charcoal as you scroll.
 *  2. A narrow cool-grey wedge raking from the top-left at 22° — a faint,
 *     colourless architectural sheen. Fades as you scroll deeper.
 *  3. A cool blue-slate wedge from the bottom-right — counter-direction
 *     shadow. Grows slightly with scroll.
 *
 * Both washes are linear (not radial) and kept extremely subtle so the
 * film grain stays the hero.
 */
const BackgroundDrift = () => {
  const [tint, setTint] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const t = Math.max(0, Math.min(1, window.scrollY / Math.max(1, docH)));
      setTint(t);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const stops = [
    { r: 9, g: 11, b: 15 },   // paper (cool near-black base)
    { r: 13, g: 15, b: 21 },  // a touch toward cool charcoal
    { r: 18, g: 21, b: 28 },  // deeper cool charcoal
  ];
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const stopT = tint * (stops.length - 1);
  const i = Math.floor(stopT);
  const f = stopT - i;
  const a = stops[i] ?? stops[stops.length - 1];
  const b = stops[i + 1] ?? a;
  const r = Math.round(lerp(a.r, b.r, f));
  const g = Math.round(lerp(a.g, b.g, f));
  const bl = Math.round(lerp(a.b, b.b, f));

  // Cool-grey rake — top-left, 22° angle, fades as you scroll down
  const warmOpacity = lerp(0.06, 0.02, tint);
  // Cool slate wash — bottom-right, 202° angle, grows slightly with scroll
  const coolOpacity = lerp(0.05, 0.09, tint);

  return (
    <>
      {/* Base layer — warm paper that drifts with scroll */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 transition-colors duration-700"
        style={{ backgroundColor: `rgb(${r}, ${g}, ${bl})` }}
      />

      {/* Cool-grey rake — top-left, rakes across at 22°, colourless sheen */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-19"
        style={{
          background: `linear-gradient(22deg, rgba(150, 156, 170, ${warmOpacity}) 0%, transparent 52%)`,
          transition: "opacity 0.8s ease",
        }}
      />

      {/* Cool slate wedge — bottom-right, 202° counter-direction */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-18"
        style={{
          background: `linear-gradient(202deg, rgba(90, 110, 140, ${coolOpacity}) 0%, transparent 50%)`,
          transition: "opacity 0.8s ease",
        }}
      />
    </>
  );
};

export default BackgroundDrift;
