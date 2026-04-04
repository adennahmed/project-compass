import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "./LinkText";
import adenPhoto from "@/assets/aden-ahmed.png";
import mohammedPhoto from "@/assets/mohammed-khan.jpg";
import lalaPhoto from "@/assets/lala-malik.jpg";

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  name: string;
  role: string;
  title: string;
  photo: string;
  eyePct: number;
  expandedPct: string;
  bio: string;
}

const members: TeamMember[] = [
  {
    name: "Mohammed Khan",
    role: "Chief Technology Officer",
    title: "Technology",
    photo: mohammedPhoto,
    eyePct: 34,
    expandedPct: "center 20%",
    bio: "Seasoned technologist with deep expertise in cloud architecture, machine learning pipelines, and enterprise platform engineering. Transforms complex technical challenges into scalable, production-grade systems.",
  },
  {
    name: "Aden Ahmed",
    role: "Founder & Principal Engineer",
    title: "Leadership",
    photo: adenPhoto,
    eyePct: 31,
    expandedPct: "center 18%",
    bio: "Full-stack engineer and founder with deep expertise in systems architecture, AI integration, and revenue technology. Building infrastructure that scales companies from ambition to market dominance.",
  },
  {
    name: "Lala Malik",
    role: "Chief Compliance & Strategy Officer",
    title: "Compliance & Strategy",
    photo: lalaPhoto,
    eyePct: 25,
    expandedPct: "center 15%",
    bio: "Regulatory strategist and commercial operator with extensive experience in governance frameworks, risk management, and go-to-market execution. Ensures every growth lever is built on a foundation of compliance and trust.",
  },
];

const COLLAPSED_H = 100;
const EXPANDED_H = 520;
const ANIM_DURATION = 0.85;
const ANIM_EASE = "power4.inOut";

const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bioRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<number | null>(null);
  const animatingRef = useRef(false);
  const [, forceRender] = useState(0);

  // Set initial collapsed state for all cards
  useEffect(() => {
    members.forEach((member, idx) => {
      const strip = stripRefs.current[idx];
      const img = imgRefs.current[idx];
      if (!strip || !img) return;
      gsap.set(strip, { height: COLLAPSED_H });
      gsap.set(img, { 
        scale: 1.15, 
        objectPosition: `center ${member.eyePct}%` 
      });
    });
  }, []);

  // Scroll-triggered entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".team-header-content", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".team-header-content", start: "top 82%" },
      });
      gsap.from(".team-strips-container", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".team-strips-container", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleToggle = useCallback((idx: number) => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const prev = expandedRef.current;
    const isCollapsing = prev === idx;
    const next = isCollapsing ? null : idx;

    const tl = gsap.timeline({
      onComplete: () => {
        expandedRef.current = next;
        animatingRef.current = false;
        forceRender((n) => n + 1);
      },
    });

    // If something is currently expanded, collapse it first
    if (prev !== null) {
      const prevStrip = stripRefs.current[prev];
      const prevImg = imgRefs.current[prev];
      const prevOverlays = overlayRefs.current[prev];
      const prevLabel = labelRefs.current[prev];

      tl.to(prevStrip, {
        height: COLLAPSED_H,
        duration: ANIM_DURATION,
        ease: ANIM_EASE,
      }, 0);
      tl.to(prevImg, {
        scale: 1.15,
        objectPosition: `center ${members[prev].eyePct}%`,
        duration: ANIM_DURATION,
        ease: ANIM_EASE,
      }, 0);
      if (prevOverlays) {
        tl.to(prevOverlays.querySelectorAll(".edge-fade"), {
          opacity: 1,
          duration: ANIM_DURATION * 0.6,
          ease: "power2.inOut",
        }, 0);
      }
      if (prevLabel) {
        tl.to(prevLabel, {
          opacity: 0,
          y: 8,
          duration: 0.3,
          ease: "power2.in",
        }, 0);
      }
      // Hide bio
      if (bioRef.current) {
        tl.to(bioRef.current, {
          opacity: 0,
          y: 10,
          duration: 0.3,
          ease: "power2.in",
        }, 0);
      }
    }

    // If we're expanding a new card
    if (next !== null) {
      const nextStrip = stripRefs.current[next];
      const nextImg = imgRefs.current[next];
      const nextOverlays = overlayRefs.current[next];
      const nextLabel = labelRefs.current[next];
      const startTime = prev !== null ? ANIM_DURATION * 0.15 : 0;

      tl.to(nextStrip, {
        height: EXPANDED_H,
        duration: ANIM_DURATION,
        ease: ANIM_EASE,
      }, startTime);
      tl.to(nextImg, {
        scale: 1,
        objectPosition: members[next].expandedPct,
        duration: ANIM_DURATION,
        ease: ANIM_EASE,
      }, startTime);
      if (nextOverlays) {
        tl.to(nextOverlays.querySelectorAll(".edge-fade"), {
          opacity: 0.12,
          duration: ANIM_DURATION * 0.6,
          ease: "power2.inOut",
        }, startTime);
      }
      if (nextLabel) {
        tl.to(nextLabel, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        }, startTime + ANIM_DURATION * 0.5);
      }
      // Show bio after expansion
      if (bioRef.current) {
        // Update content immediately
        expandedRef.current = next;
        forceRender((n) => n + 1);
        tl.fromTo(bioRef.current, 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          startTime + ANIM_DURATION * 0.5
        );
      }
    }
  }, []);

  const expanded = expandedRef.current;

  return (
    <section ref={sectionRef} id="team" className="overflow-hidden" style={{ paddingTop: "10rem", paddingBottom: "10rem" }}>
      {/* Header */}
      <div className="team-header-content mb-20 text-center px-4 sm:px-6 md:px-12">
        <div
          className="mb-5 text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "hsl(var(--foreground) / 0.35)" }}
        >
          OUR LEADERSHIP TEAM
        </div>

        <p
          className="mx-auto mb-10 max-w-[520px] text-[13px] uppercase tracking-[0.1em] leading-[1.8]"
          style={{ color: "hsl(var(--foreground) / 0.5)" }}
        >
          A global network of advisors, operators and investors. The people who
          built what&apos;s now, helping you build what&apos;s next.
        </p>

        <a href="#contact" className="group relative inline-block px-5 py-3 hover-target">
          <span
            className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t transition-all duration-300 group-hover:h-3.5 group-hover:w-3.5"
            style={{ borderColor: "hsl(var(--foreground) / 0.25)" }}
          />
          <span
            className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t transition-all duration-300 group-hover:h-3.5 group-hover:w-3.5"
            style={{ borderColor: "hsl(var(--foreground) / 0.25)" }}
          />
          <span
            className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l transition-all duration-300 group-hover:h-3.5 group-hover:w-3.5"
            style={{ borderColor: "hsl(var(--foreground) / 0.25)" }}
          />
          <span
            className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r transition-all duration-300 group-hover:h-3.5 group-hover:w-3.5"
            style={{ borderColor: "hsl(var(--foreground) / 0.25)" }}
          />
          <span
            className="text-[12px] uppercase tracking-[0.12em]"
            style={{ color: "hsl(var(--foreground) / 0.6)" }}
          >
            <LinkText>Meet the Team</LinkText>
          </span>
        </a>
      </div>

      {/* Photo strips */}
      <div
        ref={containerRef}
        className="team-strips-container flex items-center gap-3 px-4 sm:px-6 md:px-8"
      >
        {members.map((member, idx) => (
          <div key={member.name} className="min-w-0 flex-1 relative">
            <button
              type="button"
              className="relative block w-full text-left cursor-pointer"
              onClick={() => handleToggle(idx)}
              aria-label={`Toggle ${member.name} profile`}
            >
              <div
                ref={(el) => { stripRefs.current[idx] = el; }}
                className="relative overflow-hidden"
                style={{ height: COLLAPSED_H, borderRadius: "4px" }}
              >
                {/* Photo */}
                <img
                  ref={(el) => {
                    // Store parent div for GSAP targeting
                    if (el) imgRefs.current[idx] = el as unknown as HTMLDivElement;
                  }}
                  src={member.photo}
                  alt={member.name}
                  draggable={false}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full select-none"
                  style={{
                    objectFit: "cover",
                    objectPosition: `center ${member.eyePct}%`,
                    transform: "scale(1.15)",
                    transformOrigin: "center center",
                    willChange: "transform, object-position",
                  }}
                />

                {/* Edge fades */}
                <div ref={(el) => { overlayRefs.current[idx] = el; }}>
                  <div
                    className="edge-fade pointer-events-none absolute inset-x-0 top-0"
                    style={{
                      height: "40%",
                      background: "linear-gradient(to bottom, hsl(var(--background)), transparent)",
                    }}
                  />
                  <div
                    className="edge-fade pointer-events-none absolute inset-x-0 bottom-0"
                    style={{
                      height: "40%",
                      background: "linear-gradient(to top, hsl(var(--background)), transparent)",
                    }}
                  />
                  <div
                    className="edge-fade pointer-events-none absolute inset-y-0 left-0"
                    style={{
                      width: "20%",
                      background: "linear-gradient(to right, hsl(var(--background)), transparent)",
                    }}
                  />
                  <div
                    className="edge-fade pointer-events-none absolute inset-y-0 right-0"
                    style={{
                      width: "20%",
                      background: "linear-gradient(to left, hsl(var(--background)), transparent)",
                    }}
                  />
                </div>

                {/* Role label (hidden initially) */}
                <div
                  ref={(el) => { labelRefs.current[idx] = el; }}
                  className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-sm px-2.5 py-1.5"
                  style={{
                    opacity: 0,
                    transform: "translateY(8px)",
                    background: "hsl(var(--background) / 0.68)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "hsl(var(--foreground) / 0.55)" }}
                  />
                  <span
                    className="text-[9px] uppercase tracking-[0.14em]"
                    style={{ color: "hsl(var(--foreground) / 0.78)" }}
                  >
                    {member.role}
                  </span>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Bio section below strips */}
      <div
        ref={bioRef}
        className="mx-auto mt-12 max-w-[900px] text-center px-4"
        style={{ opacity: expanded !== null ? 1 : 0 }}
      >
        {expanded !== null && (
          <>
            <div
              className="text-[11px] uppercase tracking-[0.18em]"
              style={{ color: "hsl(var(--foreground) / 0.38)" }}
            >
              {members[expanded].name} / {members[expanded].role}
            </div>
            <p
              className="mt-4 text-[12px] uppercase tracking-[0.08em] leading-[1.8]"
              style={{ color: "hsl(var(--foreground) / 0.52)" }}
            >
              {members[expanded].bio}
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
