import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  /** Re-plays each time the element re-enters the viewport. Defaults true. */
  replay?: boolean;
}

const CountUp = ({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
  className = "",
  replay = true,
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const animatingRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const animate = () => {
      if (animatingRef.current) return;
      animatingRef.current = true;
      const start = performance.now();
      setValue(0);
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(eased * to);
        if (t < 1) raf = requestAnimationFrame(tick);
        else animatingRef.current = false;
      };
      raf = requestAnimationFrame(tick);
    };

    const reset = () => {
      cancelAnimationFrame(raf);
      animatingRef.current = false;
      setValue(0);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) animate();
          else if (replay) reset();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration, replay]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()}
      {suffix}
    </span>
  );
};

export default CountUp;
