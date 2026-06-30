import { Fragment, useEffect, useRef } from "react";

interface ServiceMarqueeProps {
  items: string[];
  /** "ink" = solid dark band. "paper" = mono on the dark page. "signal" = red fill. */
  variant?: "ink" | "paper" | "signal";
}

const ServiceMarquee = ({ items, variant = "paper" }: ServiceMarqueeProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll-velocity skew — the band leans into the scroll direction and eases
  // back upright when motion settles. Skews the (non-animated) outer container
  // so it never fights the track's translate animation.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = window.scrollY;
    let vel = 0;
    let cur = 0;
    let raf = 0;
    const onScroll = () => {
      const y = window.scrollY;
      vel = y - last;
      last = y;
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const target = Math.max(-7, Math.min(7, vel * 0.25));
      cur += (target - cur) * 0.1;
      vel *= 0.86;
      el.style.transform = `skewX(${cur.toFixed(2)}deg)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const tone =
    variant === "ink"
      ? "bg-ink text-paper border-ink/0"
      : variant === "signal"
        ? "bg-signal text-paper border-signal/0"
        : "bg-paper-2/40 text-ink border-hairline/15";

  // The ink/signal bands carry light type on a dark/red fill, so they run in
  // the inverted token scope; the default paper band rides the dark page.
  const invert = variant === "ink" || variant === "signal";
  const dot = variant === "paper" ? "text-ink/40" : "text-paper/45";

  return (
    <div
      ref={ref}
      className={`kz-marquee relative w-full overflow-hidden border-y py-5 will-change-transform ${invert ? "theme-invert " : ""}${tone}`}
      aria-hidden
    >
      <div className="kz-marquee-track">
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {items.map((item, i) => (
              <span
                key={`${copy}-${i}`}
                className="font-mono text-[12px] uppercase tracking-[0.32em]"
              >
                {item}
                <span aria-hidden className={`ml-12 ${dot}`}>◆</span>
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ServiceMarquee;
