import { Fragment, useEffect, useRef, useState } from "react";

// Calm glyph pool — no katakana, no punctuation storms. Just enough to read
// as "resolving from noise" without the chaotic flicker of the old approach.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01<>/[]=*#".split("");

interface DecodeCharProps {
  ch: string;
  delay: number;
  shown: boolean;
  hover: boolean;
}

/**
 * One headline character. Slides up on reveal (reusing `.char-reveal`) and, in
 * the same beat, briefly resolves from a couple of random glyphs into its real
 * letter — a quiet terminal "decode". No colour flash, short window, so a whole
 * headline boots in cleanly instead of glitching constantly.
 */
const DecodeChar = ({ ch, delay, shown, hover }: DecodeCharProps) => {
  const [disp, setDisp] = useState(ch);
  const raf = useRef(0);
  const started = useRef(false);

  const decode = (dur: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisp(ch);
      return;
    }
    cancelAnimationFrame(raf.current);
    const begin = performance.now();
    let last = 0;
    const tick = (now: number) => {
      if (now - begin >= dur) {
        setDisp(ch);
        return;
      }
      if (now - last > 48) {
        setDisp(GLYPHS[(Math.random() * GLYPHS.length) | 0]);
        last = now;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!shown) {
      started.current = false;
      setDisp(ch);
      return;
    }
    if (started.current) return;
    started.current = true;
    const t = window.setTimeout(() => decode(340), delay);
    return () => window.clearTimeout(t);
  }, [shown, ch, delay]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <span className={`char-reveal ${shown ? "is-in" : "is-out"}`}>
      <span
        style={{ transitionDelay: `${delay}ms` }}
        onMouseEnter={hover ? () => decode(240) : undefined}
      >
        {disp}
      </span>
    </span>
  );
};

interface DecodeHeadingProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Fire immediately (hero) vs. when scrolled into view (sections). */
  immediate?: boolean;
  /** Re-decode each time it re-enters the viewport. */
  replay?: boolean;
  /** Allow a gentle single-letter re-decode on hover. */
  hover?: boolean;
}

/**
 * DecodeHeading — drop-in headline renderer. Reveals letter-by-letter with a
 * brief decode, grouped by word so nothing breaks mid-word, no layout reflow
 * (each glyph sits in a fixed inline-block slot).
 */
const DecodeHeading = ({
  text,
  className = "",
  delay = 0,
  stagger = 24,
  immediate = false,
  replay = true,
  hover = false,
}: DecodeHeadingProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setShown(true);
          else if (replay) setShown(false);
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [immediate, replay]);

  const words = text.split(" ");
  let gi = 0;
  return (
    <span ref={ref} className={className}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {Array.from(word).map((c, ci) => (
              <DecodeChar key={ci} ch={c} delay={delay + gi++ * stagger} shown={shown} hover={hover} />
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
};

export default DecodeHeading;
