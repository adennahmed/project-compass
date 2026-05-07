import { useEffect, useState } from "react";

/**
 * BackgroundDrift — scroll-driven background with directional color temperature.
 *
 * No blobs. No dots. Instead, two angular color temperature washes at
 * precise, non-obvious angles create depth without calling attention to
 * themselves:
 *
 *  1. Warm paper base that darkens subtly as you scroll.
 *  2. A narrow amber/ochre wedge from the top-left corner — like morning
 *     light raking across the page at 22°. Fades as you scroll deeper.
 *  3. A cool blue-slate wedge from the bottom-right — architectural,
 *     like shadow falling the opposite direction. Grows slightly with scroll.
 *
 * Both washes are linear (not radial) to read as directional light, not
 * as glows. Together they give the warm paper a sense of time and place.
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

  // Warm amber wash — top-left, 22° angle, fades as you scroll down
  const warmOpacity = lerp(0.10, 0.04, tint);
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

      {/* Warm amber wedge — top-left, rakes across at 22° like morning light */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-19"
        style={{
          background: `linear-gradient(22deg, rgba(210, 130, 40, ${warmOpacity}) 0%, transparent 52%)`,
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
