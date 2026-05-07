import { useEffect, useState } from "react";

/**
 * BackgroundDrift — a scroll-driven body background tint.
 *
 * Reads the scroll progress (0 → 1 across the doc) and crossfades through
 * a small palette of warm-paper tones, while sections that opt-in to dark
 * (Approach, Studio, Footer) override locally with their own bg-color.
 *
 * The drift adds depth to the otherwise-static paper backdrop without
 * fighting the section-level color blocks.
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

  // Three-stop palette (warm-light → warm-mid → warm-deep). Sections with
  // their own opaque background simply paint over this layer.
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

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 transition-colors duration-700"
      style={{
        background: `radial-gradient(140% 80% at 30% 10%, rgba(232,79,27,0.04) 0%, transparent 60%), rgb(${r}, ${g}, ${bl})`,
      }}
    />
  );
};

export default BackgroundDrift;
