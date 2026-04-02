import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
  onTransitionStart: () => void;
}

const Preloader = ({ onComplete, onTransitionStart }: PreloaderProps) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);
  const percentRef = useRef({ value: 0 });

  useEffect(() => {
    if (!preloaderRef.current) return;

    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.to(percentRef.current, {
        value: 100,
        duration: 3,
        ease: "power2.inOut",
        onUpdate: () => {
          setPercent(Math.round(percentRef.current.value));
        },
      });

      gsap.fromTo(
        "#preloader-logo-white",
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 3, ease: "power2.inOut" }
      );

      gsap
        .timeline({
          delay: 3.25,
          onStart: onTransitionStart,
          onComplete: () => {
            document.body.style.overflow = "";
            onComplete();
          },
        })
        .to(
          "#preloader-content",
          {
            opacity: 0,
            scale: 0.98,
            duration: 0.3,
            ease: "power2.in",
          },
          0
        )
        .to("#preloader-panel-top", { yPercent: -100, duration: 0.82, ease: "power4.inOut" }, 0.08)
        .to("#preloader-panel-bottom", { yPercent: 100, duration: 0.82, ease: "power4.inOut" }, 0.08);
    }, preloaderRef);

    return () => {
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, [onComplete, onTransitionStart]);

  return (
    <div
      ref={preloaderRef}
      id="preloader"
      style={{ position: "fixed", inset: 0, zIndex: 999999, pointerEvents: "all", overflow: "hidden" }}
    >
      <div id="preloader-panel-top" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "hsl(var(--background))" }} />
      <div id="preloader-panel-bottom" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "hsl(var(--background))" }} />
      <div
        id="preloader-content"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        {/* Logo */}
        <div style={{ position: "relative", width: "180px", height: "48px" }}>
          <img
            src="/kozai-logo-white.svg"
            alt=""
            style={{ width: "180px", height: "auto", position: "absolute", top: 0, left: 0, opacity: 0.15, filter: "brightness(0.3)" }}
          />
          <img
            id="preloader-logo-white"
            src="/kozai-logo-white.svg"
            alt="Kozai"
            style={{ width: "180px", height: "auto", position: "absolute", top: 0, left: 0, clipPath: "inset(100% 0 0 0)" }}
          />
        </div>

        {/* Percentage - positioned below the logo with margin */}
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            fontWeight: 300,
            letterSpacing: "0.2em",
            color: "hsl(var(--foreground) / 0.35)",
            marginTop: "92px",
          }}
        >
          {String(percent).padStart(3, "0")}
        </div>
      </div>
    </div>
  );
};

export default Preloader;
