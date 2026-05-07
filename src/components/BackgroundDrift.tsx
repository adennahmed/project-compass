import { useEffect, useState } from "react";

/**
 * BackgroundDrift — scroll-driven background with a subtle technical grid.
 *
 * Layers:
 *  1. Warm paper base that drifts slightly deeper as you scroll
 *  2. A very faint dot grid (engineering paper feel) — precise and intentional
 *  3. A soft top-left signal-tinted radial for warmth
 *
 * Sections with their own opaque bg (Approach, Studio, Footer) paint over this.
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
    { r: 245, g: 242, b: 236 }, // paper
    { r: 240, g: 235, b: 226 }, // paper-2
    { r: 234, g: 228, b: 218 }, // paper-3
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

  // Dot grid: 1px ink-coloured dots on a 32px grid.
  // Opacity is kept very low (6–7%) so it's a texture, not a distraction.
  // The dot colour is derived from the current paper tone so it scales
  // naturally as the background darkens with scroll.
  const dotAlpha = 0.07 + tint * 0.03; // 7% → 10% as page deepens
  const dotColor = `rgba(${r - 40}, ${g - 40}, ${bl - 40}, ${dotAlpha})`;
  const dotGrid = `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`;

  return (
    <>
      {/* Base layer — warm paper that drifts with scroll */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 transition-colors duration-700"
        style={{ backgroundColor: `rgb(${r}, ${g}, ${bl})` }}
      />

      {/* Dot grid overlay — subtle engineering-paper texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-19"
        style={{
          backgroundImage: dotGrid,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Warm accent — very soft top-left bloom, ties to the signal palette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-18"
        style={{
          background: `radial-gradient(120% 55% at 8% 0%, rgba(232,79,27,0.05) 0%, transparent 65%)`,
        }}
      />
    </>
  );
};

export default BackgroundDrift;
