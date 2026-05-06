import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** Target number to ramp to. */
  to: number;
  /** Optional prefix (e.g. "−", "+", "$") */
  prefix?: string;
  /** Optional suffix (e.g. "%") */
  suffix?: string;
  /** Decimal places to show. */
  decimals?: number;
  /** Animation duration in ms. */
  duration?: number;
  className?: string;
}

/**
 * IntersectionObserver-triggered counter ramp. Counts from 0 → `to` once,
 * the first time it scrolls into view. Tabular nums + ease-out cubic.
 */
const CountUp = ({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
  className = "",
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const playedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !playedRef.current) {
            playedRef.current = true;
            const start = performance.now();
            let raf = 0;
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(eased * to);
              if (t < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            return () => cancelAnimationFrame(raf);
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()}
      {suffix}
    </span>
  );
};

export default CountUp;
