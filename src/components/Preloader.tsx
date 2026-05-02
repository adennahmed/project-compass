import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
  onTransitionStart: () => void;
}

const SERVICE_STRINGS = [
  "internal_tools",
  "workflow_automation",
  "data_pipelines",
  "client_platforms",
  "mvp_engineering",
];

/**
 * Loader — per brief §4.5. Full-screen monospace counter ticking from
 * 00.0 → 100.0 in the bottom-left, with a rotating service-name string
 * above it cycling every 200ms. When 100 hits, the counter snaps
 * off-screen left and onComplete fires.
 *
 * No logo glyph, no shutter panels, no centre-screen branding. The
 * counter *is* the loader.
 */
const Preloader = ({ onComplete, onTransitionStart }: PreloaderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState("000.0");
  const [serviceIdx, setServiceIdx] = useState(0);
  const pctRef = useRef({ value: 0 });

  useEffect(() => {
    document.documentElement.classList.add("is-loading");

    // Rotating service string — every 200ms while counter ticks
    const rotate = setInterval(() => {
      setServiceIdx((i) => (i + 1) % SERVICE_STRINGS.length);
    }, 200);

    const ctx = gsap.context(() => {
      // Counter tick — ease lets the early decimals fly past, settling at 100
      gsap.to(pctRef.current, {
        value: 100,
        duration: 2.4,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = pctRef.current.value;
          const integer = Math.floor(v).toString().padStart(3, "0");
          const decimal = Math.floor((v - Math.floor(v)) * 10);
          setPct(`${integer}.${decimal}`);
        },
      });

      // Tail timeline — at +2.5s, snap counter off-screen left, then exit.
      gsap
        .timeline({
          delay: 2.5,
          onStart: onTransitionStart,
          onComplete: () => {
            document.documentElement.classList.remove("is-loading");
            clearInterval(rotate);
            onComplete();
          },
        })
        // Counter snaps off-screen left — single hard motion, not a fade
        .to(".kz-loader__counter", {
          xPercent: -120,
          duration: 0.5,
          ease: "power4.in",
        })
        .to(".kz-loader__service", {
          xPercent: -120,
          duration: 0.45,
          ease: "power4.in",
        }, "<0.05")
        // Then the whole loader fades the field — quick, no shutters.
        .to(".kz-loader__field", {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        }, "+=0.05");
    }, rootRef);

    return () => {
      document.documentElement.classList.remove("is-loading");
      clearInterval(rotate);
      ctx.revert();
    };
  }, [onComplete, onTransitionStart]);

  return (
    <div
      ref={rootRef}
      className="kz-loader__field fixed inset-0 z-[999999] bg-ink"
    >
      {/* Top-right marker — system identifier */}
      <div className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute md:right-12 md:top-8">
        kz · 2026
      </div>

      {/* Bottom-left stack — service rotator + counter */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-12">
        <div className="kz-loader__service mb-3 font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
          {`> ${SERVICE_STRINGS[serviceIdx]}`}
        </div>
        <div
          className="kz-loader__counter font-mono font-medium text-bone"
          style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)", lineHeight: "0.9", letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}
        >
          {pct}
        </div>
      </div>

      {/* Bottom-right marker — geographic anchor */}
      <div className="absolute bottom-10 right-6 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute md:bottom-12 md:right-12">
        43.6532° N · 79.3832° W
      </div>
    </div>
  );
};

export default Preloader;
