import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "./LinkText";
import ContactSidebar from "./ContactSidebar";

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Particle wave canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement?.offsetWidth || window.innerWidth;
    const h = canvas.parentElement?.offsetHeight || window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const cols = 60;
    const rows = 30;
    const spacingX = w / cols;
    const spacingY = h / rows;
    let frame = 0;
    let animId = 0;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      frame += 0.008;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacingX + spacingX / 2;
          const baseY = j * spacingY + spacingY / 2;
          const wave = Math.sin(i * 0.15 + frame * 3) * 25 + Math.cos(j * 0.12 + frame * 2) * 15;
          const y = baseY + wave;

          const dist = Math.sqrt((x - w * 0.65) ** 2 + (y - h * 0.45) ** 2);
          const maxDist = Math.sqrt(w * w + h * h) * 0.5;
          const alpha = Math.max(0, 0.6 - (dist / maxDist) * 0.5);
          const size = 1 + alpha * 1.5;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const cleanup = initCanvas();
    const handleResize = () => {
      cleanup?.();
      initCanvas();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cleanup?.();
      window.removeEventListener("resize", handleResize);
    };
  }, [initCanvas]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-eyebrow", {
        y: 20, opacity: 0, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ".contact-eyebrow", start: "top 85%" },
      });
      gsap.from(".contact-headline", {
        y: 40, opacity: 0, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: ".contact-headline", start: "top 82%" },
      });
      gsap.from(".contact-body", {
        y: 25, opacity: 0, duration: 0.7, delay: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: ".contact-body", start: "top 84%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        id="contact"
        ref={sectionRef}
        className="relative min-h-[80vh] flex items-center overflow-hidden"
        style={{ background: "#080808" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        />

        <div className="relative z-10 px-6 md:px-12 max-w-[600px] py-32 md:py-40">
          <div
            className="contact-eyebrow text-[11px] uppercase tracking-[0.18em] mb-6"
            style={{ color: "#C8A96E" }}
          >
            PARTNERS
          </div>
          <h2
            className="contact-headline text-[28px] md:text-[40px] font-bold uppercase leading-[1.1] mb-6"
            style={{ color: "#ffffff" }}
          >
            Partner at the Edge of What's Possible
          </h2>
          <div
            className="w-[200px] h-[1px] mb-6"
            style={{ background: "rgba(255,255,255,0.15)" }}
          />
          <p
            className="contact-body text-[13px] uppercase tracking-[0.04em] leading-[1.7] mb-10 max-w-[380px]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Join forces with the ventures that are creating new markets. Partner early, transform fast, own the edge.
          </p>
          <button
            onClick={() => setSidebarOpen(true)}
            className="relative inline-block px-6 py-3 hover-target group"
          >
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(255,255,255,0.25)" }} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(255,255,255,0.25)" }} />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(255,255,255,0.25)" }} />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(255,255,255,0.25)" }} />
            <span className="text-[12px] uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.75)" }}>
              <LinkText>Partner With Us</LinkText>
            </span>
          </button>
        </div>
      </section>

      <ContactSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default ContactSection;
