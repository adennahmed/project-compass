interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
  color?: string;
}

/**
 * Kozai mark — a constructed glyph: a rotated square (the "kozai timber" beam)
 * intersected by a horizontal stroke. Reads as a building/joinery element and
 * scales cleanly between mark and wordmark forms.
 */
const Logo = ({ className = "", variant = "full", color = "currentColor" }: LogoProps) => {
  if (variant === "mark") {
    return (
      <svg
        className={className}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect x="6" y="6" width="28" height="28" stroke={color} strokeWidth="1.4" transform="rotate(45 20 20)" />
        <line x1="2" y1="20" x2="38" y2="20" stroke={color} strokeWidth="1.4" />
        <circle cx="20" cy="20" r="2.4" fill={color} />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Kozai"
    >
      {/* Mark */}
      <g>
        <rect x="6" y="6" width="28" height="28" stroke={color} strokeWidth="1.4" transform="rotate(45 20 20)" />
        <line x1="2" y1="20" x2="38" y2="20" stroke={color} strokeWidth="1.4" />
        <circle cx="20" cy="20" r="2.4" fill={color} />
      </g>
      {/* Wordmark — geometric, condensed */}
      <g fill={color} transform="translate(54 0)">
        <text
          x="0"
          y="27"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="600"
          fontSize="22"
          letterSpacing="0.04em"
          fill={color}
        >
          KOZAI
        </text>
      </g>
    </svg>
  );
};

export default Logo;
