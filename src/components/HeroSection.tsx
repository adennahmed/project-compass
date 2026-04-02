import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import LinkText from "./LinkText";

interface HeroSectionProps {
  animate: boolean;
}

const ParticleSphere = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animFrameRef = useRef<number>(0);

  const initSphere = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(window.innerWidth * 0.45, 600);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.38;
    const numPoints = 1200;

    const points: { theta: number; phi: number }[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < numPoints; i++) {
      const theta = Math.acos(1 - (2 * (i + 0.5)) / numPoints);
      const phi = (2 * Math.PI * i) / goldenRatio;
      points.push({ theta, phi });
    }

    let rotationX = 0;
    let rotationY = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      const targetRotX = (mouseRef.current.y - 0.5) * 0.8;
      const targetRotY = (mouseRef.current.x - 0.5) * 0.8;
      rotationX += (targetRotX - rotationX) * 0.03;
      rotationY += (targetRotY - rotationY) * 0.03;

      const time = Date.now() * 0.0003;

      for (let i = 0; i < numPoints; i++) {
        const { theta, phi } = points[i];
        let x = Math.sin(theta) * Math.cos(phi + time);
        let y = Math.cos(theta);
        let z = Math.sin(theta) * Math.sin(phi + time);

        const cosRX = Math.cos(rotationX);
        const sinRX = Math.sin(rotationX);
        const cosRY = Math.cos(rotationY);
        const sinRY = Math.sin(rotationY);

        const y1 = y * cosRX - z * sinRX;
        const z1 = y * sinRX + z * cosRX;
        const x1 = x * cosRY + z1 * sinRY;
        const z2 = -x * sinRY + z1 * cosRY;

        const scale = 1 / (1 + z2 * 0.3);
        const px = cx + x1 * radius * scale;
        const py = cy + y1 * radius * scale;

        const depth = (z2 + 1) / 2;
        const dotSize = 0.5 + depth * 2;
        const alpha = 0.05 + depth * 0.5;

        ctx.beginPath();
        ctx.arc(px, py, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  useEffect(() => {
    const cleanup = initSphere();
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handleMouseMove);
    const handleResize = () => {
      cancelAnimationFrame(animFrameRef.current);
      initSphere();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cleanup?.();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [initSphere]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

const HeroSection = ({ animate }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animate || hasAnimated.current) return;
    hasAnimated.current = true;

    const tl = gsap.timeline();

    // Initial states - text starts centered (combined)
    gsap.set(".hero-left-text", { opacity: 0 });
    gsap.set(".hero-right-text", { opacity: 0 });
    gsap.set(".hero-combined-text", { opacity: 0, scale: 0.97 });
    gsap.set(".hero-sphere", { opacity: 0, scale: 0.9 });
    gsap.set(".scroll-indicator", { opacity: 0 });
    gsap.set(".hero-bottom-left", { opacity: 0 });
    gsap.set(".hero-bottom-right", { opacity: 0 });
    gsap.set(".hero-logo-watermark", { opacity: 0 });

    // 1. Fade in sphere
    tl.to(".hero-sphere", { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" })
      // 2. Show combined centered text
      .to(".hero-combined-text", { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }, "-=0.5")
      // 3. Hold for a beat, then split
      .to(".hero-combined-text", { opacity: 0, duration: 0.3, ease: "power2.in" }, "+=0.4")
      // 4. Show split text
      .to(".hero-left-text", { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.1")
      .to(".hero-right-text", { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.4")
      // 5. Bottom elements
      .to(".hero-bottom-left", { opacity: 1, duration: 0.5 }, "-=0.2")
      .to(".hero-bottom-right", { opacity: 1, duration: 0.5 }, "-=0.4")
      .to(".hero-logo-watermark", { opacity: 1, duration: 0.5 }, "-=0.4")
      .to(".scroll-indicator", { opacity: 1, duration: 0.5 }, "-=0.3");
  }, [animate]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 overflow-hidden"
    >
      {/* Interactive particle sphere */}
      <div className="hero-sphere absolute inset-0 flex items-center justify-center pointer-events-auto">
        <ParticleSphere />
      </div>

      {/* Combined centered text (visible first, then fades out) */}
      <div className="hero-combined-text absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <h1
          className="text-[28px] md:text-[44px] lg:text-[56px] font-bold uppercase leading-[1.15] tracking-[0.06em] text-center"
          style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em" }}
        >
          BUILDING THE SYSTEMS
          <br />
          THAT DRIVE GROWTH
        </h1>
      </div>

      {/* Split headline */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex items-center justify-between min-h-[60vh]">
        <div className="hero-left-text max-w-[400px]">
          <h1
            className="text-[36px] md:text-[56px] lg:text-[72px] font-bold uppercase leading-[0.95] tracking-[-0.02em]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            BUILDING
            <br />
            THE
            <br />
            SYSTEMS
            <br />
            THAT
          </h1>
        </div>
        <div className="hero-right-text max-w-[500px] text-right">
          <h1
            className="text-[36px] md:text-[56px] lg:text-[72px] font-bold uppercase leading-[0.95] tracking-[-0.02em]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            DRIVE
            <br />
            GROWTH.
          </h1>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-8 left-6 md:left-12 right-6 md:right-12 flex items-end justify-between z-10">
        <div className="hero-bottom-left">
          <a href="#contact" className="relative inline-block px-5 py-3 hover-target group">
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(255,255,255,0.25)" }} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(255,255,255,0.25)" }} />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(255,255,255,0.25)" }} />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(255,255,255,0.25)" }} />
            <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.65)" }}>
              <LinkText>Contact Us</LinkText>
            </span>
          </a>
        </div>
        <div className="hero-bottom-right max-w-[480px] hidden md:block">
          <p
            className="text-[12px] leading-[1.7] uppercase tracking-[0.04em]"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}
          >
            Kozai turns software and technology into measurable revenue performance
            — for growing companies, mid-market organizations, and enterprise
            environments that demand precision.
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-[1px] h-[50px] relative overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="absolute top-0 left-0 w-full h-[15px] animate-scroll-line" style={{ background: "rgba(255,255,255,0.4)" }} />
          </div>
        </div>
      </div>

      {/* Kozai logo watermark */}
      <div className="absolute bottom-8 right-6 md:right-12 z-10 hero-logo-watermark">
        <img src="/kozai-logo-white.svg" alt="" className="h-8 opacity-20" />
      </div>

      <style>{`
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .animate-scroll-line {
          animation: scroll-line 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
