import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "./LinkText";
import adenPhoto from "@/assets/aden-ahmed.png";

gsap.registerPlugin(ScrollTrigger);

const COLLAPSED_H = 140;
const EXPANDED_H = 600;
const EXPANDED_W = 520;
/* Eyes sit at ~35% from the top of the 1030px-tall source image */
const EYE_CENTER_PCT = 36.5;

const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".team-headline", {
        y: 60, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".team-headline", start: "top 82%" },
      });
      gsap.from(".team-strip", {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".team-strip", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleToggle = () => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const next = !expanded;
    setExpanded(next);

    gsap.to(el, {
      height: next ? EXPANDED_H : COLLAPSED_H,
      maxWidth: next ? EXPANDED_W : 1200,
      duration: 0.7,
      ease: "power3.inOut",
    });
  };

  return (
    <section ref={sectionRef} id="team" className="py-32 md:py-40 px-6 md:px-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-[11px] uppercase tracking-[0.18em] mb-4" style={{ color: "#444444" }}>
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
        <a href="#contact" className="relative inline-block px-5 py-3 hover-target group">
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
          ref={containerRef}
          className="relative cursor-pointer overflow-hidden mx-auto"
          style={{
            maxWidth: 1200,
            height: COLLAPSED_H,
            borderRadius: "4px",
          }}
          onClick={handleToggle}
        >
          {/* Photo – covers full container, object-position shifts between eye-line and portrait */}
          <img
            src={adenPhoto}
            alt="Aden Ahmed"
            draggable={false}
            className="absolute inset-0 w-full h-full select-none"
            style={{
              objectFit: "cover",
              objectPosition: expanded ? "center 15%" : `center ${EYE_CENTER_PCT}%`,
              transition: "object-position 0.7s cubic-bezier(0.76, 0, 0.24, 1)",
            }}
          />

          {/* Edge fade overlays – fade out when expanded */}
          <div
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              height: "35%",
              background: "linear-gradient(to bottom, #080808, transparent)",
              opacity: expanded ? 0 : 1,
              transition: "opacity 0.5s ease",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: "35%",
              background: "linear-gradient(to top, #080808, transparent)",
              opacity: expanded ? 0 : 1,
              transition: "opacity 0.5s ease",
            }}
          />
          <div
            className="absolute inset-y-0 left-0 pointer-events-none"
            style={{
              width: "12%",
              background: "linear-gradient(to right, #080808, transparent)",
              opacity: expanded ? 0 : 1,
              transition: "opacity 0.5s ease",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 pointer-events-none"
            style={{
              width: "12%",
              background: "linear-gradient(to left, #080808, transparent)",
              opacity: expanded ? 0 : 1,
              transition: "opacity 0.5s ease",
            }}
          />

          {/* Role label – fades in when expanded, bottom-left with backdrop */}
          <div
            className="absolute bottom-[24px] left-[24px] flex items-center gap-2 pointer-events-none"
            style={{
              opacity: expanded ? 1 : 0,
              transform: expanded ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease 0.35s, transform 0.4s ease 0.35s",
              background: "rgba(0,0,0,0.55)",
              padding: "6px 12px",
              borderRadius: "3px",
              backdropFilter: "blur(4px)",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />
            <span className="text-[9px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.75)" }}>
              FOUNDER & PRINCIPAL ENGINEER
            </span>
          </div>
        </div>

        {/* Info bar */}
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
          className="overflow-hidden"
          style={{
            maxHeight: expanded ? "200px" : "0px",
            opacity: expanded ? 1 : 0,
            transition: "max-height 0.6s cubic-bezier(0.76,0,0.24,1), opacity 0.5s ease 0.15s",
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
