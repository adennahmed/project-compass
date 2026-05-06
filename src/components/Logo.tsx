import { CSSProperties } from "react";

/**
 * Kozai mark — abstract K composed of three rounded pills + a single dot accent.
 *
 *   ▌    ╲     ← upper arm (angled up-right)
 *   ▌  •
 *   ▌    ╱     ← lower arm (angled down-right)
 *
 * Inspired by the WorldQuant Foundry mark — geometric, single-color, calm.
 *
 * The pills carry the `.logo-pill` class so the loader can stagger their
 * entrance via a single CSS keyframe with per-element delays.
 */

interface LogoMarkProps {
  size?: number;
  /** Override fill colour. Defaults to currentColor — inherits ink. */
  color?: string;
  /** When true, the pills enter with a stagger animation. */
  animate?: boolean;
  className?: string;
}

export const LogoMark = ({
  size = 40,
  color = "currentColor",
  animate = false,
  className,
}: LogoMarkProps) => {
  // viewBox 100×100. Geometry chosen so the K reads at 24px and below.
  // Pill widths are uniform (14 units). Spine is full height; arms are short
  // diagonals meeting just below the visual midpoint.
  const pill = (key: string, d: string, delay: number, fromX: number, fromY: number): JSX.Element => (
    <path
      key={key}
      d={d}
      fill={color}
      className={animate ? "logo-pill" : undefined}
      style={animate ? ({
        animationDelay: `${delay}ms`,
        ["--from-x"]: `${fromX}px`,
        ["--from-y"]: `${fromY}px`,
      } as CSSProperties) : undefined}
    />
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Kozai"
      role="img"
    >
      {/* Spine — vertical pill, x:18-32, y:8-92, fully rounded */}
      {pill(
        "spine",
        "M 18 15 a 7 7 0 0 1 14 0 V 85 a 7 7 0 0 1 -14 0 Z",
        0,
        -10,
        0,
      )}

      {/* Upper arm — diagonal pill, leans up-right from near spine top
          Bounding line from (40,52) to (82,18), 14 wide. */}
      {pill(
        "upper",
        "M 41.7 47.6 L 75.7 13.6 a 7 7 0 0 1 9.9 9.9 L 51.6 57.5 a 7 7 0 0 1 -9.9 -9.9 Z",
        220,
        12,
        -10,
      )}

      {/* Lower arm — diagonal pill, leans down-right symmetrically.
          Bounding line from (40,48) to (82,82). */}
      {pill(
        "lower",
        "M 51.6 42.5 L 85.6 76.5 a 7 7 0 0 1 -9.9 9.9 L 41.7 52.4 a 7 7 0 0 1 9.9 -9.9 Z",
        320,
        12,
        10,
      )}

      {/* Dot accent — small circle floating top-right, the rhythm note */}
      {pill(
        "dot",
        "M 84 36 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 Z",
        500,
        0,
        -8,
      )}
    </svg>
  );
};

interface WordmarkProps {
  /** "compact" = mark + KOZAI inline. "stack" = mark above KOZAI. "mark" = mark only. */
  variant?: "compact" | "stack" | "mark";
  size?: number;
  className?: string;
  color?: string;
  animate?: boolean;
}

export const Logo = ({
  variant = "compact",
  size = 28,
  className = "",
  color = "currentColor",
  animate = false,
}: WordmarkProps) => {
  if (variant === "mark") {
    return <LogoMark size={size} color={color} animate={animate} className={className} />;
  }

  const wordmarkSize = size * 0.62;
  const wordSpacing = size * 0.42;

  if (variant === "stack") {
    return (
      <span className={`inline-flex flex-col items-center gap-2 ${className}`} style={{ color }}>
        <LogoMark size={size} color={color} animate={animate} />
        <span
          className="font-sans font-semibold tracking-[0.22em]"
          style={{ fontSize: wordmarkSize, color }}
        >
          KOZAI
        </span>
      </span>
    );
  }

  // compact
  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ color, gap: wordSpacing }}
    >
      <LogoMark size={size} color={color} animate={animate} />
      <span
        className="font-sans font-semibold tracking-[0.18em]"
        style={{ fontSize: wordmarkSize }}
      >
        KOZAI
      </span>
    </span>
  );
};

export default Logo;
