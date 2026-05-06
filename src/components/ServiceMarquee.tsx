import { Fragment } from "react";

interface ServiceMarqueeProps {
  items: string[];
  /** Visual variant. "ink" = dark band on paper. "paper" = mono on paper. */
  variant?: "ink" | "paper";
}

/**
 * Infinite mono-text ticker. Two copies of the content track side-by-side,
 * the first translates -50% then the second takes its place — seamless loop.
 */
const ServiceMarquee = ({ items, variant = "paper" }: ServiceMarqueeProps) => {
  const isInk = variant === "ink";
  return (
    <div
      className={`kz-marquee relative w-full overflow-hidden border-y py-5 ${
        isInk
          ? "border-ink/0 bg-ink text-paper"
          : "border-hairline/15 bg-paper-2/40 text-ink"
      }`}
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
                <span aria-hidden className={`ml-12 ${isInk ? "text-paper/40" : "text-ink/40"}`}>
                  ◆
                </span>
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ServiceMarquee;
