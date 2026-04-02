import { useEffect, useRef } from "react";
import gsap from "gsap";
import LinkText from "./LinkText";

interface HeroSectionProps {
  animate: boolean;
}

const HeroSection = ({ animate }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animate || hasAnimated.current) return;
    hasAnimated.current = true;

    const headline = sectionRef.current?.querySelector(".hero-headline");
    if (!headline) return;

    // Manual word splitting since SplitText may not be available
    const text = headline.textContent || "";
    const words = text.split(" ").map((word) => {
      const span = document.createElement("span");
      span.style.display = "inline-block";
      span.style.marginRight = "0.3em";
      span.textContent = word;
      return span;
    });
    headline.textContent = "";
    words.forEach((w) => headline.appendChild(w));

    const tl = gsap.timeline();
    tl.from(words, {
      y: 65,
      opacity: 0,
      stagger: 0.055,
      duration: 0.95,
      ease: "power3.out",
    })
      .from(
        ".hero-subheadline",
        { y: 22, opacity: 0, duration: 0.7, ease: "power2.out" },
        "-=0.45"
      )
      .from(
        ".hero-ctas",
        { y: 18, opacity: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .from(
        ".scroll-indicator",
        { opacity: 0, duration: 0.5 },
        "-=0.2"
      );
  }, [animate]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12"
    >
      {/* Eyebrow */}
      <div
        className="absolute top-24 left-6 md:left-12 text-[11px] uppercase tracking-[0.18em]"
        style={{ color: "#444444" }}
      >
        KOZAI — EST. 2024
      </div>

      {/* Main Content */}
      <div className="text-center max-w-[1000px] mx-auto">
        <h1
          className="hero-headline text-[40px] md:text-[72px] lg:text-[96px] font-light leading-[1.05] mb-8"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
        >
          Building the Systems That Drive Growth.
        </h1>
        <p
          className="hero-subheadline text-[16px] md:text-[18px] leading-[1.75] max-w-[560px] mx-auto mb-10"
          style={{ color: "#888888" }}
        >
          Kozai turns software and technology into measurable revenue performance
          — for growing companies, mid-market organizations, and enterprise
          environments that demand precision.
        </p>
        <div className="hero-ctas flex items-center justify-center gap-6 flex-wrap">
          <a
            href="#contact"
            className="text-[14px] tracking-[0.02em] px-7 py-3 hover-target"
            style={{
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#ffffff",
              borderRadius: "2px",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#C8A96E")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)")
            }
          >
            <LinkText>Work With Us →</LinkText>
          </a>
          <a
            href="#solutions"
            className="text-[14px] hover-target"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            <LinkText>Explore Our Solutions</LinkText>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-8 left-6 md:left-12 flex items-end gap-3">
        <div className="flex flex-col items-center">
          <div
            className="w-[2px] h-[80px] relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <div
              className="absolute top-0 left-0 w-full h-[20px] animate-scroll-line"
              style={{ background: "rgba(255,255,255,0.5)" }}
            />
          </div>
        </div>
        <span
          className="text-[11px] uppercase tracking-[0.18em] -rotate-90 origin-bottom-left mb-2"
          style={{ color: "#444444" }}
        >
          Scroll
        </span>
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
