import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "./LinkText";

gsap.registerPlugin(ScrollTrigger);

const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".team-headline", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".team-headline", start: "top 82%" },
      });

      gsap.from(".team-strip", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".team-strip", start: "top 85%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="team" className="py-32 md:py-40 px-6 md:px-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="text-[11px] uppercase tracking-[0.18em] mb-4"
          style={{ color: "#444444" }}
        >
          OUR LEADERSHIP TEAM
        </div>
        <p
          className="team-headline text-[13px] uppercase tracking-[0.1em] leading-[1.8] max-w-[500px] mx-auto mb-8"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          A focused team with deep experience in technology delivery,
          commercial strategy, and systems architecture. The people who built
          what's now, helping you build what's next.
        </p>
        <a
          href="#contact"
          className="relative inline-block px-5 py-3 hover-target group"
        >
          <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(255,255,255,0.25)" }} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(255,255,255,0.25)" }} />
          <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(255,255,255,0.25)" }} />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(255,255,255,0.25)" }} />
          <span className="text-[12px] uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.6)" }}>
            <LinkText>Meet the Team</LinkText>
          </span>
        </a>
      </div>

      {/* Eye strip / Expanded portrait */}
      <div className="team-strip max-w-[1200px] mx-auto mt-16">
        <div
          ref={imageRef}
          className="relative w-full cursor-pointer overflow-hidden mx-auto"
          style={{
            maxWidth: expanded ? "700px" : "100%",
            height: expanded ? "600px" : "140px",
            background: "#111111",
            borderRadius: "4px",
            transition: "all 0.7s cubic-bezier(0.76, 0, 0.24, 1)",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {/* Placeholder silhouette - eye strip when collapsed, portrait when expanded */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: expanded
                ? "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 40%, #111 100%)"
                : "linear-gradient(180deg, #0e0e0e 0%, #151515 50%, #0e0e0e 100%)",
            }}
          >
            {!expanded && (
              <div className="flex items-center gap-16 w-full justify-center">
                {/* Left eye */}
                <div
                  className="w-[120px] h-[60px] rounded-[2px] overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #1a1a1a, #252525)" }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full" style={{ background: "radial-gradient(circle, #333 30%, #1a1a1a 70%)" }} />
                  </div>
                </div>
                {/* Right eye */}
                <div
                  className="w-[120px] h-[60px] rounded-[2px] overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #1a1a1a, #252525)" }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full" style={{ background: "radial-gradient(circle, #333 30%, #1a1a1a 70%)" }} />
                  </div>
                </div>
              </div>
            )}

            {expanded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Large face silhouette */}
                <div
                  className="w-[200px] h-[240px] rounded-t-[100px] rounded-b-[40px]"
                  style={{
                    background: "linear-gradient(180deg, #2a2a2a 0%, #1e1e1e 60%, #151515 100%)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="flex items-center justify-center gap-10 pt-16">
                    <div className="w-6 h-6 rounded-full" style={{ background: "radial-gradient(circle, #444 30%, #222 70%)" }} />
                    <div className="w-6 h-6 rounded-full" style={{ background: "radial-gradient(circle, #444 30%, #222 70%)" }} />
                  </div>
                </div>
                {/* Role label */}
                <div
                  className="absolute bottom-[100px] right-[60px] flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
                  <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    FOUNDER
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info bar below */}
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-[11px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.35)" }}>
            01 / 01
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[12px] uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.7)" }}>
              Aden Ahmed
            </span>
            <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.35)" }}>
              Leadership
            </span>
          </div>
        </div>

        {/* Expanded details */}
        <div
          className="overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{
            maxHeight: expanded ? "200px" : "0px",
            opacity: expanded ? 1 : 0,
          }}
        >
          <div className="flex items-start justify-between mt-4 px-2">
            <div className="flex items-center gap-4">
              <a href="#" className="flex items-center gap-2 hover-target">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" className="relative inline-block px-4 py-2 hover-target group">
                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: "rgba(255,255,255,0.2)" }} />
                <span className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: "rgba(255,255,255,0.2)" }} />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l" style={{ borderColor: "rgba(255,255,255,0.2)" }} />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: "rgba(255,255,255,0.2)" }} />
                <span className="text-[10px] uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Connect with Aden
                </span>
              </a>
              <a href="#" className="relative inline-block px-4 py-2 hover-target group">
                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: "rgba(255,255,255,0.2)" }} />
                <span className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: "rgba(255,255,255,0.2)" }} />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l" style={{ borderColor: "rgba(255,255,255,0.2)" }} />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: "rgba(255,255,255,0.2)" }} />
                <span className="text-[10px] uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Full Bio
                </span>
              </a>
            </div>
            <p
              className="text-[11px] uppercase tracking-[0.06em] leading-[1.7] max-w-[500px] text-right"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Full-stack engineer and founder with deep expertise in systems architecture,
              AI integration, and revenue technology. Building infrastructure that
              scales companies from ambition to market dominance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
