import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tiles = [
  {
    title: "Growth begins with systems.",
    desc: "Revenue leaks where technology fails. Kozai closes the gap between what a business can achieve and what its current infrastructure allows.",
  },
  {
    title: "Built for every stage.",
    desc: "From growing companies seeking structure to enterprise organizations requiring strategic-grade architecture — we adjust without compromising our standard of execution.",
  },
  {
    title: "Execution, not theory.",
    desc: "Kozai is not a consultancy. We don't advise, broker, or package solutions. We build, implement, and deliver technology that produces measurable outcomes.",
  },
];

const TiltCard = ({ tile, index }: { tile: typeof tiles[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 8,
      rotateX: -y * 6,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        background: `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(200, 169, 110, 0.12), transparent 60%)`,
        opacity: 1,
        duration: 0.3,
        overwrite: true,
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      backgroundColor: "#161616",
      borderColor: "rgba(200, 169, 110, 0.25)",
      y: -4,
      duration: 0.3,
    });
    if (lineRef.current) {
      gsap.to(lineRef.current, { scaleX: 1, duration: 0.5, ease: "power3.out" });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      backgroundColor: "#111111",
      borderColor: "rgba(255,255,255,0.07)",
      y: 0,
      duration: 0.5,
      ease: "power3.out",
    });
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
    }
    if (lineRef.current) {
      gsap.to(lineRef.current, { scaleX: 0, duration: 0.4, ease: "power2.in" });
    }
  }, []);

  return (
    <div style={{ perspective: "800px" }}>
      <div
        ref={cardRef}
        className={`positioning-tile p-8 group relative overflow-hidden`}
        style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "3px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gold glow overlay */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0, borderRadius: "3px" }}
        />

        <h3 className="text-[20px] md:text-[24px] font-medium mb-2 text-white relative z-10">
          {tile.title}
        </h3>

        {/* Gold accent line */}
        <div
          ref={lineRef}
          className="h-[1px] w-12 mb-4 origin-left"
          style={{ background: "#C8A96E", transform: "scaleX(0)" }}
        />

        <p
          className="text-[15px] leading-[1.75] relative z-10"
          style={{ color: "#888888" }}
        >
          {tile.desc}
        </p>
      </div>
    </div>
  );
};

const PositioningSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".positioning-headline", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".positioning-headline", start: "top 82%" },
      });

      gsap.from(".positioning-body", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ".positioning-body", start: "top 84%" },
      });

      gsap.from(".positioning-tile", {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".positioning-tiles", start: "top 80%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto">
      <div
        className="text-[11px] uppercase tracking-[0.18em] mb-6"
        style={{ color: "#444444" }}
      >
        01 / OUR PREMISE
      </div>

      <h2
        className="positioning-headline text-[36px] md:text-[48px] lg:text-[64px] font-light leading-[1.05] mb-8 max-w-[800px]"
      >
        Technology Is the Operating Engine of Modern Growth.
      </h2>

      <p
        className="positioning-body text-[16px] md:text-[18px] leading-[1.75] mb-20 max-w-[640px]"
        style={{ color: "#888888" }}
      >
        Kozai designs and delivers software and technology solutions that turn
        digital capability into commercial performance. We work at the
        intersection of software, operations, and commercial strategy.
      </p>

      <div className="positioning-tiles grid md:grid-cols-3 gap-8">
        {tiles.map((tile, i) => (
          <TiltCard key={i} tile={tile} index={i} />
        ))}
      </div>
    </section>
  );
};

export default PositioningSection;
