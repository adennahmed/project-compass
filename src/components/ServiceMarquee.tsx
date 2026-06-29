import { Fragment } from "react";

interface ServiceMarqueeProps {
  items: string[];
  /** "ink" = solid dark band. "paper" = mono on the dark page. "signal" = red fill. */
  variant?: "ink" | "paper" | "signal";
}

const ServiceMarquee = ({ items, variant = "paper" }: ServiceMarqueeProps) => {
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
      className={`kz-marquee relative w-full overflow-hidden border-y py-5 ${invert ? "theme-invert " : ""}${tone}`}
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
