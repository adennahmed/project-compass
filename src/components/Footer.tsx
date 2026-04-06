import { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LinkText from "./LinkText";

const navLinks = [
  { label: "WHY KOZAI", href: "#why-kozai" },
  { label: "SOLUTIONS", href: "#solutions" },
  { label: "PORTFOLIO", href: "#clients" },
  { label: "TEAM", href: "#team" },
  { label: "INSIGHTS", href: "#insights" },
  { label: "CONTACT", href: "#contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms and Conditions", href: "/terms-and-conditions" },
];

interface FooterProps {
  onOpenSidebar?: () => void;
}

const FooterParticleArt = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement?.offsetWidth || 500;
    const h = canvas.parentElement?.offsetHeight || 600;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const numPoints = 800;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      time += 0.003;

      const cx = w * 0.5;
      const cy = h * 0.5;

      for (let i = 0; i < numPoints; i++) {
        const t = i / numPoints;
        const angle = t * Math.PI * 8 + time;
        const r = t * Math.min(w, h) * 0.38;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r * 0.7;
        const alpha = 0.15 + t * 0.55;
        const size = 1 + t * 2;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const cleanup = initCanvas();
    const handleResize = () => { cleanup?.(); initCanvas(); };
    window.addEventListener("resize", handleResize);
    return () => { cleanup?.(); window.removeEventListener("resize", handleResize); };
  }, [initCanvas]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
};

const Footer = ({ onOpenSidebar }: FooterProps) => {
  return (
    <footer className="relative overflow-hidden" style={{ background: "#080808" }}>
      <div className="grid md:grid-cols-2 min-h-[400px]">
        {/* Left - Particle Art */}
        <div className="relative hidden md:block">
          <FooterParticleArt />
        </div>

        {/* Right - Accent block */}
        <div
          className="relative flex flex-col justify-between p-8 sm:p-10 md:p-14"
          style={{ background: "#C8A96E", borderRadius: "16px 0 0 0" }}
        >
          <div>
            <h3
              className="text-[22px] sm:text-[24px] md:text-[32px] font-bold uppercase leading-[1.1] mb-4"
              style={{ color: "#1a1a1a" }}
            >
              Own What's Next.
            </h3>
            <p
              className="text-[12px] uppercase tracking-[0.04em] leading-[1.7] mb-8 max-w-[380px]"
              style={{ color: "rgba(30,30,30,0.6)" }}
            >
              Breakthrough founders. Pre-market investors. Transformative partners. Reach out, and let's move.
            </p>
            <button onClick={onOpenSidebar} className="relative inline-block px-6 py-3 hover-target group mb-12">
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
              <span className="text-[12px] uppercase tracking-[0.12em]" style={{ color: "rgba(30,30,30,0.85)" }}>
                <LinkText>Contact Us</LinkText>
              </span>
            </button>
          </div>

          <div>
            <div className="flex flex-wrap gap-x-5 md:gap-x-8 gap-y-2 mb-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[12px] md:text-[16px] font-bold uppercase hover-target"
                  style={{ color: "#1a1a1a" }}
                >
                  <LinkText>{link.label}</LinkText>
                </a>
              ))}
            </div>

            <div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6"
              style={{ borderTop: "1px solid rgba(30,30,30,0.15)" }}
            >
              <p className="text-[11px] uppercase tracking-[0.06em]" style={{ color: "rgba(30,30,30,0.45)" }}>
                © 2026 Kozai. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-4">
                {legalLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-[11px] uppercase tracking-[0.06em] hover-target"
                    style={{ color: "rgba(30,30,30,0.45)" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
