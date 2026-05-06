import { CSSProperties } from "react";

/**
 * Kozai wordmark.
 *
 * Reproduces the supplied logo: the word "Kozai" set in a clean geometric
 * sans, with a horizontal hairline crossing through the top of the letter
 * forms — replacing the K's upper arm and crossing the i's dot. The
 * hairline extends a few units past the wordmark on each side, suggesting
 * a measurement bar.
 *
 * Built from primitive shapes (no font dependency) so it renders identically
 * across systems and animates cleanly. The hairline can draw-in on mount.
 */

interface LogoProps {
  /** Pixel height of the wordmark cap-line. The full SVG scales accordingly. */
  size?: number;
  /** Tailwind text color class (e.g. "text-ink"). Defaults to currentColor. */
  className?: string;
  /** When true, the hairline draws from left to right on mount. */
  animate?: boolean;
  style?: CSSProperties;
}

const Logo = ({ size = 28, className = "", animate = false, style }: LogoProps) => {
  // Source viewBox: 200 wide × 56 tall. Cap height ~44 (top 12 left for hairline overhang).
  const aspect = 200 / 56;
  const width = size * aspect;

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 200 56"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      style={style}
      aria-label="Kozai"
      role="img"
    >
      {/* Letter forms — built from rect/path primitives. Cap line at y=12,
          baseline at y=52. Stroke widths ~3.5 for crisp rendering. */}
      <g>
        {/* K — vertical spine + lower diagonal. Upper diagonal is replaced
            by the hairline overlay below. */}
        <rect x="6" y="12" width="3.6" height="40" />
        <path d="M 9.2 32.5 L 26 52 L 30.5 52 L 13 32 Z" />

        {/* o — circle (rounded) */}
        <path
          d="M 47 26
             a 12 12 0 0 1 0 24
             a 12 12 0 0 1 0 -24 Z
             M 47 29
             a 9 9 0 0 0 0 18
             a 9 9 0 0 0 0 -18 Z"
          fillRule="evenodd"
        />

        {/* z — top bar, diagonal, bottom bar */}
        <path d="M 75 26 L 95 26 L 95 29 L 79 49 L 95 49 L 95 52 L 73 52 L 73 49 L 89 29 L 75 29 Z" />

        {/* a — circle with right vertical stem */}
        <path
          d="M 113 26
             a 12 12 0 0 1 0 24
             a 12 12 0 0 1 0 -24 Z
             M 113 29
             a 9 9 0 0 0 0 18
             a 9 9 0 0 0 0 -18 Z"
          fillRule="evenodd"
        />
        <rect x="121.5" y="26" width="3.5" height="26" />

        {/* i — vertical stem only (the dot is replaced by the hairline). */}
        <rect x="135" y="26" width="3.6" height="26" />
      </g>

      {/* The hairline — runs through the top of the letterforms.
          Extends ~10 units past the wordmark on each side. */}
      <rect
        x="0"
        y="14.5"
        width="155"
        height="2.4"
        rx="1.2"
        className={animate ? "hairline-draw" : undefined}
      />
    </svg>
  );
};

export default Logo;
