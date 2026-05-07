import { CSSProperties } from "react";

/**
 * Kozai wordmark — reproduced from the supplied reference.
 *
 * Letters are drawn as **stroked paths** (not fills) with rounded line
 * caps, producing the geometric, almost monoline feel of the original.
 * A single horizontal hairline crosses the top of the letterforms,
 * replacing the K's upper arm and acting as the i's dot.
 *
 *   K  ─ vertical spine + lower diagonal arm only
 *   o  ─ rounded oval
 *   z  ─ angular zig-zag (top + diagonal + bottom)
 *   a  ─ rounded bowl + right vertical stem
 *   i  ─ vertical stem only
 *
 *   ──── horizontal hairline runs through the cap-line, extending past
 *        the wordmark on both sides
 */

interface LogoProps {
  /** Pixel height. Width scales by intrinsic aspect (~3.6:1). */
  size?: number;
  className?: string;
  /** When true, the hairline draws left → right on mount. */
  animate?: boolean;
  style?: CSSProperties;
}

const Logo = ({ size = 28, className = "", animate = false, style }: LogoProps) => {
  // ViewBox 220×60; cap-line at y=22, baseline at y=58.
  const aspect = 220 / 60;
  const width = size * aspect;

  const stroke = 5.2;

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 220 60"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className={className}
      style={style}
      aria-label="Kozai"
      role="img"
    >
      {/* The hairline — drawn first so letters can sit on top.
          x: 0 → 165 (extends past the i which ends ~158).
          y: 21.5 — sits at the cap-line. */}
      <line
        x1="0"
        y1="21.5"
        x2="165"
        y2="21.5"
        strokeWidth="3.2"
        className={animate ? "hairline-draw" : undefined}
      />

      {/* K — vertical spine + lower diagonal */}
      <line x1="11" y1="20" x2="11" y2="55" strokeWidth={stroke} />
      <line x1="13" y1="40" x2="34" y2="55" strokeWidth={stroke} />

      {/* o — rounded oval */}
      <ellipse cx="55" cy="42" rx="13" ry="14" strokeWidth={stroke} />

      {/* z — top, diagonal, bottom */}
      <path
        d="M 80 30 L 102 30 L 80 55 L 102 55"
        strokeWidth={stroke}
      />

      {/* a — bowl + right stem */}
      <ellipse cx="125" cy="42" rx="13" ry="14" strokeWidth={stroke} />
      <line x1="138" y1="28" x2="138" y2="55" strokeWidth={stroke} />

      {/* i — stem (the dot is the hairline above) */}
      <line x1="155" y1="28" x2="155" y2="55" strokeWidth={stroke} />
    </svg>
  );
};

export default Logo;
