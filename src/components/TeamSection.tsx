import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "./LinkText";
import adenPhoto from "@/assets/aden-ahmed.png";
import mohammedPhoto from "@/assets/mohammed-khan.jpg";
import lalaPhoto from "@/assets/lala-malik.jpg";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_COLLAPSED_H = 156;
const DESKTOP_COLLAPSED_H = 148;
const MOBILE_EXPANDED_H = 420;
const DESKTOP_MIN_EXPANDED_H = 480;
const DESKTOP_MAX_EXPANDED_H = 560;

interface TeamMember {
  name: string;
  role: string;
  title: string;
  photo: string;
  eyePct: number;
  expandedPct: string;
  collapsedScale: number;
  expandedScale: number;
  bio: string;
}

const members: TeamMember[] = [
  {
    name: "Mohammed Khan",
    role: "Chief Technology Officer",
    title: "Technology",
    photo: mohammedPhoto,
    eyePct: 34,
    expandedPct: "center 30%",
    collapsedScale: 1.1,
    expandedScale: 1,
    bio: "Seasoned technologist with deep expertise in cloud architecture, machine learning pipelines, and enterprise platform engineering. Transforms complex technical challenges into scalable, production-grade systems.",
  },
  {
    name: "Aden Ahmed",
    role: "Founder & Principal Engineer",
    title: "Leadership",
    photo: adenPhoto,
    eyePct: 31,
    expandedPct: "center 28%",
    collapsedScale: 1.08,
    expandedScale: 1,
    bio: "Full-stack engineer and founder with deep expertise in systems architecture, AI integration, and revenue technology. Building infrastructure that scales companies from ambition to market dominance.",
  },
  {
    name: "Lala Malik",
    role: "Chief Compliance & Strategy Officer",
    title: "Compliance & Strategy",
    photo: lalaPhoto,
    eyePct: 25,
    expandedPct: "center 24%",
    collapsedScale: 1.1,
    expandedScale: 1,
    bio: "Regulatory strategist and commercial operator with extensive experience in governance frameworks, risk management, and go-to-market execution. Ensures every growth lever is built on a foundation of compliance and trust.",
  },
];

const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== "undefined" ? window.innerWidth >= 768 : false));

  const getCollapsedHeight = () => (isDesktop ? DESKTOP_COLLAPSED_H : MOBILE_COLLAPSED_H);

  const getExpandedHeight = (el: HTMLDivElement) => {
    if (!isDesktop) return MOBILE_EXPANDED_H;
    return Math.min(DESKTOP_MAX_EXPANDED_H, Math.max(DESKTOP_MIN_EXPANDED_H, el.offsetWidth * 0.8));
  };

  const syncCardState = (idx: number, expanded: boolean) => {
    const shell = stripRefs.current[idx];
    const image = imageRefs.current[idx];
    const member = members[idx];

    if (!shell || !image) return;

    gsap.set(shell, {
      height: expanded ? getExpandedHeight(shell) : getCollapsedHeight(),
    });

    gsap.set(image, {
      objectPosition: expanded ? member.expandedPct : `center ${member.eyePct}%`,
      scale: expanded ? member.expandedScale : member.collapsedScale,
    });
  };

  const animateCard = (idx: number, expanded: boolean) => {
    const shell = stripRefs.current[idx];
    const image = imageRefs.current[idx];
    const member = members[idx];

    if (!shell || !image) return;

    gsap.killTweensOf(shell);
    gsap.killTweensOf(image);

    gsap.to(shell, {
      height: expanded ? getExpandedHeight(shell) : getCollapsedHeight(),
      duration: expanded ? 0.95 : 0.75,
      ease: "expo.inOut",
      overwrite: true,
    });

    gsap.to(image, {
      objectPosition: expanded ? member.expandedPct : `center ${member.eyePct}%`,
      scale: expanded ? member.expandedScale : member.collapsedScale,
      duration: expanded ? 0.95 : 0.75,
      ease: "expo.inOut",
      overwrite: true,
    });
  };

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

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    members.forEach((_, idx) => syncCardState(idx, expandedIdx === idx));
  }, [isDesktop]);

  const handleToggle = (idx: number) => {
    const nextExpanded = expandedIdx === idx ? null : idx;

    if (expandedIdx !== null && expandedIdx !== idx) {
      animateCard(expandedIdx, false);
    }

    if (nextExpanded !== null) {
      animateCard(nextExpanded, true);
    }

    if (expandedIdx === idx) {
      animateCard(idx, false);
    }

    setExpandedIdx(nextExpanded);
  };

  return (
    <section ref={sectionRef} id="team" className="py-24 md:py-40 overflow-hidden">
      <div className="mb-8 text-center px-4 sm:px-6 md:px-12">
        <div className="mb-4 text-[11px] uppercase tracking-[0.18em]" style={{ color: "hsl(var(--foreground) / 0.35)" }}>
          OUR LEADERSHIP TEAM
        </div>

        <p
          className="team-headline mx-auto mb-8 max-w-[520px] text-[13px] uppercase tracking-[0.1em] leading-[1.8]"
          style={{ color: "hsl(var(--foreground) / 0.5)" }}
        >
          A global network of advisors, operators and investors. The people who built what&apos;s now, helping you build what&apos;s next.
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
          <span className="text-[12px] uppercase tracking-[0.12em]" style={{ color: "hsl(var(--foreground) / 0.6)" }}>
            <LinkText>Meet the Team</LinkText>
          </span>
        </a>
      </div>

      <div
        className={`team-strip-row ${
          isDesktop
            ? "relative mt-14 flex items-center gap-3 px-4 sm:px-6 md:px-12"
            : "mx-auto mt-12 flex flex-col gap-4 px-4 sm:px-6 md:px-12"
        }`}
      >
        {members.map((member, idx) => {
          const isExpanded = expandedIdx === idx;

          return (
            <div key={member.name} className="min-w-0 flex-1 relative">
              <button
                type="button"
                className="relative block w-full text-left"
                onClick={() => handleToggle(idx)}
                aria-expanded={isExpanded}
                aria-label={`Toggle ${member.name} profile`}
              >
                <div
                  ref={(el) => {
                    stripRefs.current[idx] = el;
                  }}
                  className="relative overflow-hidden"
                  style={{
                    height: isDesktop ? DESKTOP_COLLAPSED_H : MOBILE_COLLAPSED_H,
                    borderRadius: "4px",
                  }}
                >
                  <img
                    ref={(el) => {
                      imageRefs.current[idx] = el;
                    }}
                    src={member.photo}
                    alt={member.name}
                    draggable={false}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full select-none"
                    style={{
                      objectFit: "cover",
                      objectPosition: isExpanded ? member.expandedPct : `center ${member.eyePct}%`,
                      transform: `scale(${isExpanded ? member.expandedScale : member.collapsedScale})`,
                      transformOrigin: "center center",
                      willChange: "transform, object-position",
                    }}
                  />

                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 transition-opacity duration-500"
                    style={{
                      height: "38%",
                      background: "linear-gradient(to bottom, hsl(var(--background)), transparent)",
                      opacity: isExpanded ? 0.12 : 1,
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 transition-opacity duration-500"
                    style={{
                      height: "38%",
                      background: "linear-gradient(to top, hsl(var(--background)), transparent)",
                      opacity: isExpanded ? 0.12 : 1,
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 transition-opacity duration-500"
                    style={{
                      width: "18%",
                      background: "linear-gradient(to right, hsl(var(--background)), transparent)",
                      opacity: isExpanded ? 0.35 : 1,
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 transition-opacity duration-500"
                    style={{
                      width: "18%",
                      background: "linear-gradient(to left, hsl(var(--background)), transparent)",
                      opacity: isExpanded ? 0.35 : 1,
                    }}
                  />

                  <div
                    className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-sm px-2.5 py-1.5 transition-all duration-500 md:bottom-4 md:left-4"
                    style={{
                      opacity: isExpanded ? 1 : 0,
                      transform: isExpanded ? "translateY(0)" : "translateY(8px)",
                      background: "hsl(var(--background) / 0.68)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: "hsl(var(--foreground) / 0.55)" }} />
                    <span className="text-[8px] uppercase tracking-[0.14em] md:text-[9px]" style={{ color: "hsl(var(--foreground) / 0.78)" }}>
                      {member.role}
                    </span>
                  </div>
                </div>
              </button>

              {!isDesktop && (
                <>
                  <div className="mt-3 flex items-center justify-between px-1">
                    <div className="text-[10px] uppercase tracking-[0.15em]" style={{ color: "hsl(var(--foreground) / 0.35)" }}>
                      {String(idx + 1).padStart(2, "0")} / {String(members.length).padStart(2, "0")}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "hsl(var(--foreground) / 0.7)" }}>
                        {member.name}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.1em]" style={{ color: "hsl(var(--foreground) / 0.35)" }}>
                        {member.title}
                      </span>
                    </div>
                  </div>

                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: isExpanded ? "220px" : "0px",
                      opacity: isExpanded ? 1 : 0,
                      transition: "max-height 0.5s cubic-bezier(0.76,0,0.24,1), opacity 0.35s ease",
                    }}
                  >
                    <div className="mt-3 px-1">
                      <p className="text-[10px] uppercase tracking-[0.06em] leading-[1.7]" style={{ color: "hsl(var(--foreground) / 0.48)" }}>
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {isDesktop && expandedIdx !== null && (
        <div className="mx-auto mt-10 max-w-[900px] text-center animate-fade-in">
          <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "hsl(var(--foreground) / 0.38)" }}>
            {members[expandedIdx].name} / {members[expandedIdx].role}
          </div>
          <p className="mt-4 text-[12px] uppercase tracking-[0.08em] leading-[1.8]" style={{ color: "hsl(var(--foreground) / 0.52)" }}>
            {members[expandedIdx].bio}
          </p>
        </div>
      )}
    </section>
  );
};

export default TeamSection;
