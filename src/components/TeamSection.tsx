import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "./LinkText";

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    name: "Your Name",
    title: "Founder & CEO",
    linkedin: "#",
  },
  {
    name: "[Name]",
    title: "Head of Technology",
    linkedin: "#",
  },
  {
    name: "[Name]",
    title: "Head of Client Solutions",
    linkedin: "#",
  },
];

const TeamSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(".team-headline", {
      y: 45,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: { trigger: ".team-headline", start: "top 82%" },
    });
  }, []);

  const navigate = (dir: number) => {
    const next = Math.max(0, Math.min(team.length - 1, currentIndex + dir));
    setCurrentIndex(next);
    if (sliderRef.current) {
      gsap.to(sliderRef.current, {
        x: -next * 340,
        duration: 0.6,
        ease: "power3.inOut",
      });
    }
  };

  return (
    <section id="team" className="py-32 md:py-40 px-6 md:px-12 max-w-[1200px] mx-auto">
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
        strategy, and systems architecture. People who have operated inside the
        exact problems we solve.
      </p>
      <a
        href="#"
        className="text-[14px] hover-target mb-16 inline-block"
        style={{ color: "#C8A96E" }}
      >
        <LinkText>Meet the Team →</LinkText>
      </a>

      {/* Cards */}
      <div className="overflow-hidden">
        <div ref={sliderRef} className="flex gap-8">
          {team.map((member, i) => (
            <div key={i} className="flex-shrink-0 w-[300px]">
              <div
                className="portrait-card w-full aspect-[2/3] mb-6 flex items-center justify-center"
                style={{
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "3px",
                }}
              >
                <span
                  className="text-[64px] font-light"
                  style={{ color: "rgba(255,255,255,0.06)" }}
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
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6 mt-10">
        <button
          onClick={() => navigate(-1)}
          className="text-[20px] hover-target"
          style={{ color: currentIndex === 0 ? "#444444" : "#ffffff" }}
        >
          ←
        </button>
        <span className="text-[13px]" style={{ color: "#444444" }}>
          0{currentIndex + 1} / 0{team.length}
        </span>
        <button
          onClick={() => navigate(1)}
          className="text-[20px] hover-target"
          style={{
            color: currentIndex === team.length - 1 ? "#444444" : "#ffffff",
          }}
        >
          →
        </button>
      </div>
    </section>
  );
};

export default TeamSection;
