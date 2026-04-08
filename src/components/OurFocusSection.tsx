import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const OurFocusSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".focus-eyebrow", {
        y: 20, opacity: 0, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ".focus-eyebrow", start: "top 85%" },
      });
      gsap.from(".focus-headline", {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".focus-headline", start: "top 82%" },
      });
      gsap.from(".focus-body", {
        y: 25, opacity: 0, duration: 0.7, ease: "power2.out", delay: 0.2,
        scrollTrigger: { trigger: ".focus-body", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Our Focus — Precision-Built Technology"
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* No dot background here — shared from IndustriesMarquee wrapper */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div
          className="focus-eyebrow text-[11px] uppercase tracking-[0.22em] mb-8"
          style={{ color: "#888888" }}
        >
          OUR FOCUS
        </div>
        <h2
          className="focus-headline text-[42px] md:text-[64px] lg:text-[76px] font-bold uppercase leading-[1.05] max-w-[900px]"
          style={{
            color: "#1a1a1a",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          Precision-Built Technology.
          <br />
          Market-Defining Growth.
        </h2>
        <p
          className="focus-body text-[14px] md:text-[15px] leading-[1.75] max-w-[560px] mt-8"
          style={{ color: "rgba(30,30,30,0.55)" }}
        >
          CRM systems, automation pipelines, AI infrastructure, blockchain—these aren't incremental
          improvements. They're operational leaps that redefine how businesses compete.
          They move faster than convention. So do we.
        </p>
      </div>
    </section>
  );
};

export default OurFocusSection;
