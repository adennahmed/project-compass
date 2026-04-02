import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const preloaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = preloaderRef.current;
    if (!el) return;

    document.body.style.overflow = "hidden";

    gsap.set("#preloader-logo", { scale: 0.92, opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        el.remove();
        document.body.style.overflow = "";
        onComplete();
      },
    });

    tl.to("#preloader-logo", {
      opacity: 1,
      scale: 1,
      duration: 0.85,
      ease: "power3.out",
    })
      .to({}, { duration: 0.55 })
      .to(
        "#preloader-panel-top",
        { yPercent: -100, duration: 0.75, ease: "power4.inOut" },
        "reveal"
      )
      .to(
        "#preloader-panel-bottom",
        { yPercent: 100, duration: 0.75, ease: "power4.inOut" },
        "reveal"
      )
      .to(
        "#preloader-logo",
        { opacity: 0, duration: 0.3, ease: "power2.in" },
        "reveal"
      );
  }, [onComplete]);

  return (
    <div
      ref={preloaderRef}
      id="preloader"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        pointerEvents: "all",
        overflow: "hidden",
      }}
    >
      <div
        id="preloader-panel-top"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "#080808",
        }}
      />
      <div
        id="preloader-panel-bottom"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "#080808",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <img
          id="preloader-logo"
          src="/kozai-logo-white.svg"
          alt="Kozai"
          style={{ width: "180px", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default Preloader;
