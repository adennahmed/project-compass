import { useEffect } from "react";
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

const PositioningSection = () => {
  useEffect(() => {
    gsap.from(".positioning-headline", {
      y: 45,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: { trigger: ".positioning-headline", start: "top 82%" },
    });

    gsap.from(".positioning-body", {
      y: 25,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: ".positioning-body", start: "top 84%" },
    });

    gsap.from(".positioning-tile", {
      y: 30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: ".positioning-tiles", start: "top 82%" },
    });
  }, []);

  return (
    <section className="py-32 md:py-40 px-6 md:px-12 max-w-[1200px] mx-auto">
      {/* Eyebrow */}
      <div
        className="text-[11px] uppercase tracking-[0.18em] mb-6"
        style={{ color: "#444444" }}
      >
        01 / OUR PREMISE
      </div>

      <h2
        className="positioning-headline text-[36px] md:text-[48px] lg:text-[64px] font-light leading-[1.1] mb-8 max-w-[800px]"
        style={{ fontWeight: 400 }}
      >
        Technology Is the Operating Engine of Modern Growth.
      </h2>

      <p
        className="positioning-body text-[16px] md:text-[18px] leading-[1.75] mb-20 max-w-[640px]"
        style={{ color: "#888888" }}
      >
        Kozai designs and delivers software and technology solutions that turn
        digital capability into commercial performance. We work at the
        intersection of software, operations, and commercial strategy — building
        systems that make businesses sell more effectively, operate more
        intelligently, and scale with greater precision.
      </p>

      <div className="positioning-tiles grid md:grid-cols-3 gap-8">
        {tiles.map((tile, i) => (
          <div
            key={i}
            className="positioning-tile p-8"
            style={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "3px",
            }}
          >
            <h3 className="text-[20px] md:text-[24px] font-medium mb-4 text-white">
              {tile.title}
            </h3>
            <p
              className="text-[15px] leading-[1.75]"
              style={{ color: "#888888" }}
            >
              {tile.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PositioningSection;
