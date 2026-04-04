import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "./LinkText";
import adenPhoto from "@/assets/aden-ahmed.png";
import mohammedPhoto from "@/assets/mohammed-khan.jpg";
import lalaPhoto from "@/assets/lala-malik.jpg";

gsap.registerPlugin(ScrollTrigger);

const STRIP_H = 120;
const EXPANDED_H = 580;

interface TeamMember {
  name: string;
  role: string;
  title: string;
  photo: string;
  eyePct: number; // objectPosition % for collapsed eye-line
  expandedPct: string; // objectPosition for expanded portrait
  bio: string;
}

const members: TeamMember[] = [
  {
    name: "Mohammed Khan",
    role: "Chief Technology Officer",
    title: "Technology",
    photo: mohammedPhoto,
    eyePct: 28,
    expandedPct: "center 15%",
    bio: "Seasoned technologist with deep expertise in cloud architecture, machine learning pipelines, and enterprise platform engineering. Transforms complex technical challenges into scalable, production-grade systems.",
  },
  {
    name: "Aden Ahmed",
    role: "Founder & Principal Engineer",
    title: "Leadership",
    photo: adenPhoto,
    eyePct: 28,
    expandedPct: "center 15%",
    bio: "Full-stack engineer and founder with deep expertise in systems architecture, AI integration, and revenue technology. Building infrastructure that scales companies from ambition to market dominance.",
  },
  {
    name: "Lala Malik",
    role: "Chief Compliance & Strategy Officer",
    title: "Compliance & Strategy",
    photo: lalaPhoto,
    eyePct: 20,
    expandedPct: "center 15%",
    bio: "Regulatory strategist and commercial operator with extensive experience in governance frameworks, risk management, and go-to-market execution. Ensures every growth lever is built on a foundation of compliance and trust.",
  },
];

const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".team-headline", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".team-headline", start: "top 82%" },
      });
      gsap.from(".team-strip-row", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".team-strip-row", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleToggle = (idx: number) => {
    const el = stripRefs.current[idx];
    if (!el) return;

    const isClosing = expandedIdx === idx;
    // Close previously expanded
    if (expandedIdx !== null && expandedIdx !== idx) {
      const prev = stripRefs.current[expandedIdx];
      if (prev) gsap.to(prev, { height: STRIP_H, duration: 0.6, ease: "power3.inOut" });
    }

    setExpandedIdx(isClosing ? null : idx);
    gsap.to(el, {
      height: isClosing ? STRIP_H : EXPANDED_H,
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
          A focused team with deep experience in technology delivery, commercial strategy, and systems architecture. The
          people who built what's now, helping you build what's next.
        </p>
        <a href="#contact" className="relative inline-block px-5 py-3 hover-target group">
          <span
            className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
          />
          <span
            className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
          />
          <span
            className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
          />
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
          />
          <span className="text-[12px] uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.6)" }}>
            <LinkText>Meet the Team</LinkText>
          </span>
        </a>
      </div>

      {/* 3-up eye strip row */}
      <div className="team-strip-row mx-auto mt-16 flex gap-3" style={{ maxWidth: "calc(100% - 48px)" }}>
        {members.map((m, idx) => {
          const isExpanded = expandedIdx === idx;
          return (
            <div key={m.name} className="flex-1 min-w-0">
              {/* Image strip */}
              <div
                ref={(el) => {
                  stripRefs.current[idx] = el;
                }}
                className="relative cursor-pointer overflow-hidden"
                style={{ height: STRIP_H, borderRadius: "4px" }}
                onClick={() => handleToggle(idx)}
              >
                <img
                  src={m.photo}
                  alt={m.name}
                  draggable={false}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full select-none"
                  style={{
                    objectFit: "cover",
                    objectPosition: isExpanded ? m.expandedPct : `center ${m.eyePct}%`,
                    transform: isExpanded ? "scale(1)" : "scale(2.2)",
                    transition:
                      "object-position 0.7s cubic-bezier(0.76, 0, 0.24, 1), transform 0.7s cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                />

                {/* Edge fades */}
                <div
                  className="absolute inset-x-0 top-0 pointer-events-none"
                  style={{
                    height: "35%",
                    background: "linear-gradient(to bottom, #080808, transparent)",
                    opacity: isExpanded ? 0 : 1,
                    transition: "opacity 0.5s ease",
                  }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 pointer-events-none"
                  style={{
                    height: "35%",
                    background: "linear-gradient(to top, #080808, transparent)",
                    opacity: isExpanded ? 0 : 1,
                    transition: "opacity 0.5s ease",
                  }}
                />
                <div
                  className="absolute inset-y-0 left-0 pointer-events-none"
                  style={{
                    width: "18%",
                    background: "linear-gradient(to right, #080808, transparent)",
                    opacity: isExpanded ? 0 : 1,
                    transition: "opacity 0.5s ease",
                  }}
                />
                <div
                  className="absolute inset-y-0 right-0 pointer-events-none"
                  style={{
                    width: "18%",
                    background: "linear-gradient(to left, #080808, transparent)",
                    opacity: isExpanded ? 0 : 1,
                    transition: "opacity 0.5s ease",
                  }}
                />

                {/* Role label on expanded */}
                <div
                  className="absolute bottom-[16px] left-[16px] flex items-center gap-2 pointer-events-none"
                  style={{
                    opacity: isExpanded ? 1 : 0,
                    transform: isExpanded ? "translateY(0)" : "translateY(8px)",
                    transition: "opacity 0.4s ease 0.35s, transform 0.4s ease 0.35s",
                    background: "rgba(0,0,0,0.55)",
                    padding: "5px 10px",
                    borderRadius: "3px",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />
                  <span className="text-[8px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {m.role}
                  </span>
                </div>
              </div>

              {/* Info bar */}
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="text-[10px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {String(idx + 1).padStart(2, "0")} / {String(members.length).padStart(2, "0")}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {m.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {m.title}
                  </span>
                </div>
              </div>

              {/* Expanded details */}
              <div
                className="overflow-hidden"
                style={{
                  maxHeight: isExpanded ? "200px" : "0px",
                  opacity: isExpanded ? 1 : 0,
                  transition: "max-height 0.6s cubic-bezier(0.76,0,0.24,1), opacity 0.5s ease 0.15s",
                }}
              >
                <div className="mt-3 px-1">
                  <p
                    className="text-[10px] uppercase tracking-[0.06em] leading-[1.7] mb-3"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {m.bio}
                  </p>
                  <div className="flex items-center gap-3">
                    <a href="#" className="flex items-center gap-2 hover-target">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="2"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                    <a href="#" className="relative inline-block px-3 py-1.5 hover-target group">
                      <span
                        className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l"
                        style={{ borderColor: "rgba(255,255,255,0.2)" }}
                      />
                      <span
                        className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r"
                        style={{ borderColor: "rgba(255,255,255,0.2)" }}
                      />
                      <span
                        className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l"
                        style={{ borderColor: "rgba(255,255,255,0.2)" }}
                      />
                      <span
                        className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r"
                        style={{ borderColor: "rgba(255,255,255,0.2)" }}
                      />
                      <span
                        className="text-[9px] uppercase tracking-[0.12em]"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        Connect
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TeamSection;
