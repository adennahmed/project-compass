import { CSSProperties } from "react";
import logoBlack from "@/assets/kozai-logo-black.png";
import logoWhite from "@/assets/kozai-logo-white.png";

interface LogoProps {
  /** Pixel height. Width scales by intrinsic aspect. */
  size?: number;
  className?: string;
  /** Accepted for backwards compatibility; image logo does not animate. */
  animate?: boolean;
  style?: CSSProperties;
  variant?: "black" | "white";
}

const Logo = ({ size = 28, className = "", style, variant = "black" }: LogoProps) => {
  const src = variant === "white" ? logoWhite : logoBlack;
  return (
    <img
      src={src}
      alt="Kozai"
      height={size}
      style={{ height: size, width: "auto", maxWidth: "none", display: "block", ...style }}
      className={className}
    />
  );
};

export default Logo;
