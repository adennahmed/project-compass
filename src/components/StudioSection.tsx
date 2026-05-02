import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import adenImg from "@/assets/aden-ahmed.png";
 import muhammadImg from "@/assets/mohammed-khan.jpg";

gsap.registerPlugin(ScrollTrigger);

interface Member {
  name: string;
  role: string;
  src: string;
  bio: string;
  detail: string;
  initials: string;
}

const members: Member[] = [
  {
    name: "Aden Ahmed",
    role: "Principal Engineer & Founder",
    src: adenImg,
    initials: "AA",
    bio: "Builds the operational platforms mid-market and enterprise teams depend on. Background spans data infrastructure, distributed services, and the interfaces operators rely on every day.",
    detail: "Specializes in turning ambiguous requirements into systems that hold up under production load.",
  },
  {
    name: "Muhammad Khan",
    role: "Senior Systems Engineer",
    src: muhammadImg,
    initials: "MK",
    bio: "Distributed systems and reliability engineering. Deep experience with high-availability architectures, observability, and the edge cases that determine whether a system can be trusted under load.",
    detail: "Focuses on resilience engineering — building systems that fail gracefully and recover predictably.",
  },
];

const StudioSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".studio-meta",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="studio"
      className="relative w-full overflow-hidden bg-ink py-32 md:py-44"
      aria-label="The studio"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="studio-meta md:col-span-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
              [ 05 ] — Studio
            </span>
            <h2
              className="display-headline mt-6 text-bone"
              style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
            >
              Senior engineers.<br />
              <span className="text-bone/55">Direct access.</span>
            </h2>
            <p className="mt-8 max-w-[360px] text-sm leading-relaxed text-bone/65">
              Kozai is a software studio working at the intersection of engineering and operations.
              You work directly with the engineers building your system — every call, every commit,
              every release. No intermediaries between you and the people writing the code.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Founded</div>
                <div className="mt-1 text-xl text-bone" style={{ fontVariantNumeric: "tabular-nums" }}>2022</div>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Location</div>
                <div className="mt-1 text-xl text-bone">Toronto, CA</div>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Practice</div>
                <div className="mt-1 text-xl text-bone">Independent</div>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Stack</div>
                <div className="mt-1 text-xl text-bone">TS · Go · Rust · SQL</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {members.map((m) => (
                <article key={m.name} className="studio-meta group">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-rise">
                    <img
                      src={m.src}
                      alt={m.name}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale-[20%]"
                    />
                  </div>
                  <div className="mt-6 flex items-baseline justify-between">
                    <h3 className="text-2xl font-medium text-bone" style={{ letterSpacing: "-0.02em" }}>
                      {m.name}
                    </h3>
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-signal">{m.initials}</span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.24em] text-bone-mute">
                    {m.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-bone/70">{m.bio}</p>
                  <p className="mt-3 text-sm italic leading-relaxed text-bone/45">{m.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioSection;
