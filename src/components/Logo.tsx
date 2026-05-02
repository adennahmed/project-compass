interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
  color?: string;
}

/**
 * Kozai wordmark — "KOZAI" full caps, display weight, with a single
 * horizontal hairline crossing the entire wordmark below the baseline.
 * Like a strikethrough that *under*lines instead. The hairline extends
 * a few units past the wordmark on each side, suggesting a measurement
 * bar or a spec sheet. (Per brief §4.3.)
 *
 * Mark variant — for favicon and tight contexts — is just two horizontal
 * hairlines stacked: the wordmark's bottom edge + the underline rule.
 * Abstract enough to read at 16×16, recognizable enough to be the mark.
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
        {/* Two horizontal hairlines stacked — abstract reduction of the wordmark */}
        <line
          x1="4"
          y1="20"
          x2="36"
          y2="20"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="square"
        />
        <line
          x1="2"
          y1="26"
          x2="38"
          y2="26"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      </svg>
    );
  }

  // Full wordmark — KOZAI in display weight + hairline underline that extends
  // past the wordmark on both sides.
  return (
    <svg
      className={className}
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Kozai"
    >
      <text
        x="0"
        y="26"
        fontFamily="'Space Grotesk', system-ui, sans-serif"
        fontWeight="500"
        fontSize="22"
        letterSpacing="0.06em"
        fill={color}
      >
        KOZAI
      </text>
      {/* Hairline underline — extends past the wordmark on both sides
          (~4 units left, ~12 units right), suggesting a measurement rule. */}
      <line
        x1="-4"
        y1="34"
        x2="98"
        y2="34"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
};

export default Logo;
