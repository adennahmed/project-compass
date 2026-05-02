interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
  color?: string;
}

/**
 * Kozai wordmark — lowercase "kozai" with a precision horizontal strike through
 * the z (the signature element, evoking ƶ / a struck reference mark on a gauge).
 * The strike is the only ornament — everything else is restrained typography.
 *
 * Mark variant uses just a stylized "k" for favicon and tight contexts.
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
        {/* Stylized "k" — vertical bar + two thin diagonals */}
        <line x1="9" y1="7" x2="9" y2="33" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        <line x1="9" y1="20" x2="22" y2="8" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        <line x1="9" y1="20" x2="24" y2="33" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        {/* Precision strike — calls back to the strike through the wordmark "z" */}
        <line x1="28" y1="20" x2="33" y2="20" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  // Full wordmark — set in Space Grotesk with a custom strike through the z.
  // Position constants tuned to Space Grotesk Medium at fontSize 34.
  return (
    <svg
      className={className}
      viewBox="0 0 130 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Kozai"
    >
      <text
        x="0"
        y="30"
        fontFamily="'Space Grotesk', system-ui, sans-serif"
        fontWeight="500"
        fontSize="34"
        letterSpacing="-1.2"
        fill={color}
      >
        kozai
      </text>
      {/* Strike through the z — the wordmark's only ornament */}
      <line
        x1="55"
        y1="20.5"
        x2="69"
        y2="20.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;
