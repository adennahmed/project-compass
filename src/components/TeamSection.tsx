import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "./LinkText";

gsap.registerPlugin(ScrollTrigger);

const team = [
  { name: "Your Name", title: "Founder & CEO", linkedin: "#" },
  { name: "[Name]", title: "Head of Technology", linkedin: "#" },
  { name: "[Name]", title: "Head of Client Solutions", linkedin: "#" },
];

const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".team-headline", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".team-headline", start: "top 82%" },
      });

      gsap.from(".team-card", {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".team-card", start: "top 80%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="team" className="py-32 md:py-40 px-6 md:px-12 max-w-[1200px] mx-auto">
      <div
        className="text-[11px] uppercase tracking-[0.18em] mb-6"
        style={{ color: "#444444" }}
      >
        OUR LEADERSHIP
      </div>
      <h2 className="team-headline text-[36px] md:text-[48px] font-light leading-[1.1] mb-6 max-w-[600px]">
        We Build What Others Can't See Yet.
      </h2>
      <p
        className="text-[15px] leading-[1.75] mb-8 max-w-[560px]"
        style={{ color: "#888888" }}
      >
        A focused team with deep experience in technology delivery, commercial
        strategy, and systems architecture.
      </p>
      <a
        href="#"
        className="text-[14px] hover-target mb-16 inline-block"
        style={{ color: "#C8A96E" }}
      >
        <LinkText>Meet the Team →</LinkText>
      </a>

      <div className="grid md:grid-cols-3 gap-8">
        {team.map((member, i) => (
          <div key={i} className="team-card">
            <div
              className="w-full aspect-[2/3] mb-6 flex items-center justify-center transition-all duration-300"
              style={{
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "3px",
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  borderColor: "rgba(255,255,255,0.16)",
                  y: -4,
                  duration: 0.3,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  borderColor: "rgba(255,255,255,0.07)",
                  y: 0,
                  duration: 0.3,
                });
              }}
            >
              <span
                className="text-[64px] font-light"
                style={{ color: "rgba(255,255,255,0.04)" }}
              >
                {member.name.charAt(0)}
              </span>
            </div>
            <h3 className="text-[20px] font-medium mb-1">{member.name}</h3>
            <p className="text-[14px] mb-3" style={{ color: "#888888" }}>
              {member.title}
            </p>
            <a
              href={member.linkedin}
              className="text-[13px] hover-target"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <LinkText>LinkedIn ↗</LinkText>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
