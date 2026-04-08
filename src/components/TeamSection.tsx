import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "./LinkText";
import adenPhoto from "@/assets/aden-ahmed.png";
import mohammedPhoto from "@/assets/mohammed-khan.jpg";
// import lalaPhoto from "@/assets/lala-malik.jpg"; // Preserved for future restoration
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  name: string;
  role: string;
  title: string;
  photo: string;
  eyePct: number;
  expandedPos: string;
  bio: string;
  fullBio: string;
  linkedin: string;
}

// Lala Malik data preserved for future restoration
// const lalaData: TeamMember = {
//   name: "Lala Malik",
//   role: "Chief Compliance & Strategy Officer",
//   title: "Compliance & Strategy",
//   photo: lalaPhoto,
//   eyePct: 25,
//   expandedPos: "center 15%",
//   bio: "Regulatory strategist and commercial operator with extensive experience in governance frameworks, risk management, and go-to-market execution. Ensures every growth lever is built on a foundation of compliance and trust.",
//   fullBio: "Lala keeps Kozai and its clients on solid ground. She handles compliance, risk, and go-to-market strategy, making sure growth doesn't come at the cost of trust. She's worked across multiple regulatory environments and knows how to build systems that scale without cutting corners.",
//   linkedin: "https://www.linkedin.com/in/lalamalik/",
// };

const members: TeamMember[] = [
  {
    name: "Muhammad Khan",
    role: "Chief Technology Officer",
    title: "Technology",
    photo: mohammedPhoto,
    eyePct: 31,
    expandedPos: "center 20%",
    bio: "Seasoned technologist with deep expertise in cloud architecture, machine learning pipelines, and enterprise platform engineering. Transforms complex technical challenges into scalable, production-grade systems.",
    fullBio:
      "Muhammad leads Kozai's technical direction, from infrastructure and cloud systems to machine learning and platform engineering. Before Kozai, he built and scaled backend systems at high-growth startups. He cares about clean architecture, fast iteration, and shipping things that actually work.",
    linkedin: "https://www.linkedin.com/in/ehabkhan/",
  },
  {
    name: "Aden Ahmed",
    role: "Founder & Principal Engineer",
    title: "Leadership",
    photo: adenPhoto,
    eyePct: 29,
    expandedPos: "center 18%",
    bio: "Full-stack engineer and founder with deep expertise in systems architecture, AI integration, and revenue technology. Building infrastructure that scales companies from ambition to market dominance.",
    fullBio:
      "Aden founded Kozai to give growing companies access to the kind of engineering they shouldn't have to wait for. He's a full-stack builder with experience across SaaS, fintech, and AI — focused on turning good ideas into production-grade products.",
    linkedin: "https://www.linkedin.com/in/adenahmed/",
  },
];

const COLLAPSED_H = 120;
const EXPANDED_H = 560;
const ANIM_MS = 0.75;
const EASE = "expo.inOut";

/* Bracket button matching existing site style */
const BracketButton = ({ label, href, onClick }: { label: string; href?: string; onClick?: () => void }) => {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      onClick={onClick}
      className="group relative inline-block px-5 py-2.5 hover-target"
    >
      <span
        className="absolute left-0 top-0 h-2 w-2 border-l border-t transition-all duration-300 group-hover:h-3 group-hover:w-3"
        style={{ borderColor: "hsl(var(--foreground) / 0.25)" }}
      />
      <span
        className="absolute right-0 top-0 h-2 w-2 border-r border-t transition-all duration-300 group-hover:h-3 group-hover:w-3"
        style={{ borderColor: "hsl(var(--foreground) / 0.25)" }}
      />
      <span
        className="absolute bottom-0 left-0 h-2 w-2 border-b border-l transition-all duration-300 group-hover:h-3 group-hover:w-3"
        style={{ borderColor: "hsl(var(--foreground) / 0.25)" }}
      />
      <span
        className="absolute bottom-0 right-0 h-2 w-2 border-b border-r transition-all duration-300 group-hover:h-3 group-hover:w-3"
        style={{ borderColor: "hsl(var(--foreground) / 0.25)" }}
      />
      <span className="text-[10px] uppercase tracking-[0.14em]" style={{ color: "hsl(var(--foreground) / 0.6)" }}>
        <LinkText>{label}</LinkText>
      </span>
    </Tag>
  );
};

/* Full Bio Modal */
const FullBioModal = ({ member, onClose }: { member: TeamMember | null; onClose: () => void }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (member) {
      setVisible(true);
      const tl = gsap.timeline();
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0);
      tl.fromTo(
        panelRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "expo.out" },
        0.1,
      );
    }
  }, [member]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onClose();
      },
    });
    tl.to(panelRef.current, { opacity: 0, y: 20, scale: 0.97, duration: 0.35, ease: "power2.in" }, 0);
    tl.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0.1);
  };

  if (!member && !visible) return null;
  const m = member || members[0];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ opacity: 0 }}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current || !panelRef.current?.contains(e.target as Node)) {
          handleClose();
        }
      }}
    >
      {/* Backdrop — pointer-events-none so clicks pass through to overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "hsl(var(--background) / 0.85)", backdropFilter: "blur(12px)" }}
      />

      {/* Panel — side by side layout */}
      <div
        ref={panelRef}
        className="relative z-10 flex flex-col md:flex-row w-[95vw] md:w-[90vw] max-w-[880px] overflow-hidden max-h-[90vh] md:max-h-[80vh]"
        style={{
          background: "hsl(var(--background))",
          border: "1px solid hsl(var(--foreground) / 0.08)",
          opacity: 0,
        }}
      >
        {/* Left: Photo */}
        <div
          className="relative w-full md:w-[42%] shrink-0 overflow-hidden h-[240px] md:h-auto"
          style={{ minHeight: undefined }}
        >
          <img
            src={m.photo}
            alt={m.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 10%" }}
          />
          {/* Subtle right-edge fade */}
          <div
            className="absolute inset-y-0 right-0 w-16 pointer-events-none"
            style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }}
          />
        </div>

        {/* Right: Content */}
        <div className="flex-1 flex flex-col justify-between p-6 md:p-8 relative overflow-y-auto">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center hover-target transition-opacity hover:opacity-100"
            style={{ opacity: 0.5 }}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="1" y1="1" x2="13" y2="13" />
              <line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>

          <div>
            {/* Name & role */}
            <h3
              className="text-[13px] uppercase tracking-[0.14em] font-medium mb-1"
              style={{ color: "hsl(var(--foreground) / 0.9)" }}
            >
              {m.name}
            </h3>
            <div
              className="text-[10px] uppercase tracking-[0.16em] mb-5"
              style={{ color: "hsl(var(--foreground) / 0.4)" }}
            >
              {m.role}
            </div>

            {/* Gold accent line */}
            <div className="w-8 h-px mb-5" style={{ background: "hsl(var(--accent) / 0.5)" }} />

            {/* Bio */}
            <p
              className="text-[11px] uppercase tracking-[0.08em] leading-[2] mb-6"
              style={{ color: "hsl(var(--foreground) / 0.5)" }}
            >
              {m.fullBio}
            </p>
          </div>

          {/* Bottom: divider + actions */}
          <div>
            <div className="w-full h-px mb-5" style={{ background: "hsl(var(--foreground) / 0.07)" }} />
            <div className="flex items-center gap-3">
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-sm hover-target"
                style={{ border: "1px solid hsl(var(--foreground) / 0.15)" }}
                aria-label="LinkedIn"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "hsl(var(--foreground) / 0.5)" }}
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <BracketButton label={`Connect with ${m.name.split(" ")[0]}`} href={m.linkedin} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TeamSectionProps {
  onOpenSidebar?: () => void;
}

const TeamSection = ({ onOpenSidebar }: TeamSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bioContainerRef = useRef<HTMLDivElement>(null);
  const bioInnerRef = useRef<HTMLDivElement>(null);
  const expandedIdx = useRef<number | null>(null);
  const busy = useRef(false);
  const [bioData, setBioData] = useState<number | null>(null);
  const [modalMember, setModalMember] = useState<TeamMember | null>(null);
  const isMobile = useIsMobile();

  const collapsedH = isMobile ? 80 : COLLAPSED_H;
  const expandedH = isMobile ? 320 : EXPANDED_H;

  useEffect(() => {
    members.forEach((m, i) => {
      const s = stripRefs.current[i];
      const img = imgRefs.current[i];
      if (s) gsap.set(s, { height: collapsedH });
      if (img) gsap.set(img, { scale: 1.18, objectPosition: `center ${m.eyePct}%` });
    });
  }, [collapsedH]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".team-header-content", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".team-header-content", start: "top 82%" },
      });
      gsap.from(".team-strips-row", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".team-strips-row", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleToggle = useCallback(
    (idx: number) => {
      if (busy.current) return;
      busy.current = true;

      const prev = expandedIdx.current;
      const isCollapse = prev === idx;
      const next = isCollapse ? null : idx;
      const isSwitching = prev !== null && next !== null;

      const tl = gsap.timeline({
        onComplete: () => {
          expandedIdx.current = next;
          busy.current = false;
          if (!isSwitching) setBioData(next);
        },
      });

      if (prev !== null) {
        const ps = stripRefs.current[prev];
        const pi = imgRefs.current[prev];
        const pl = labelRefs.current[prev];

        if (ps) tl.to(ps, { height: collapsedH, duration: ANIM_MS, ease: EASE, overwrite: true }, 0);
        if (pi)
          tl.to(
            pi,
            {
              scale: 1.18,
              objectPosition: `center ${members[prev].eyePct}%`,
              duration: ANIM_MS,
              ease: EASE,
              overwrite: true,
            },
            0,
          );
        if (pl) tl.to(pl, { opacity: 0, y: 8, duration: 0.25, ease: "power2.in" }, 0);

        if (!isSwitching && bioContainerRef.current) {
          tl.to(bioContainerRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0);
        }
      }

      if (next !== null) {
        const ns = stripRefs.current[next];
        const ni = imgRefs.current[next];
        const nl = labelRefs.current[next];
        const delay = prev !== null ? 0.1 : 0;

        if (ns) tl.to(ns, { height: expandedH, duration: ANIM_MS, ease: EASE, overwrite: true }, delay);
        if (ni)
          tl.to(
            ni,
            { scale: 1, objectPosition: members[next].expandedPos, duration: ANIM_MS, ease: EASE, overwrite: true },
            delay,
          );
        if (nl) tl.to(nl, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, delay + ANIM_MS * 0.55);

        if (isSwitching) {
          if (bioInnerRef.current) {
            tl.to(
              bioInnerRef.current,
              {
                opacity: 0,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => setBioData(next),
              },
              delay + 0.05,
            );
            tl.to(
              bioInnerRef.current,
              {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
              },
              delay + 0.3,
            );
          }
        } else {
          setBioData(next);
          if (bioContainerRef.current) {
            tl.fromTo(
              bioContainerRef.current,
              { opacity: 0 },
              { opacity: 1, duration: 0.45, ease: "power2.out" },
              delay + ANIM_MS * 0.45,
            );
          }
        }
      }
    },
    [collapsedH, expandedH],
  );

  const firstName = bioData !== null ? members[bioData].name.split(" ")[0] : "";

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative overflow-hidden flex flex-col"
      style={{ minHeight: "100vh", background: "hsl(var(--background))" }}
    >
      {/* Full Bio Modal */}
      <FullBioModal member={modalMember} onClose={() => setModalMember(null)} />

      {/* Header */}
      <div className="team-header-content text-center px-4 pt-16 pb-8">
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
          A global network of advisors, operators and investors. The people who built what&apos;s now, helping you build
          what&apos;s next.
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

      {/* Center — grid overlay: text behind, strips in front */}
      <div className="flex-1 flex flex-col justify-center">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "1fr" }}>
          {/* Bold text layer — behind photos, two columns with top+bottom text per member */}
          <div
            className="pointer-events-none grid grid-cols-2 w-full max-w-[88vw] md:max-w-[66%] mx-auto self-center"
            style={{ gridArea: "1 / 1", zIndex: 0 }}
          >
            {/* Muhammad column */}
            <div className="flex flex-col items-center justify-center gap-[calc(var(--strip-h,120px)+2rem)]">
              <p
                className="text-center text-[clamp(0.9rem,1.8vw,1.6rem)] font-bold uppercase leading-[1.15] tracking-[-0.01em]"
                style={{ color: "hsl(var(--foreground) / 0.85)", fontFamily: "'Inter', sans-serif" }}
              >
                WE ARCHITECT WHAT
                <br />
                THE MARKET DEMANDS.
              </p>
              <p
                className="text-center text-[clamp(0.9rem,1.8vw,1.6rem)] font-bold uppercase leading-[1.15] tracking-[-0.01em]"
                style={{ color: "hsl(var(--foreground) / 0.85)", fontFamily: "'Inter', sans-serif" }}
              >
                WE TURN COMPLEXITY INTO
                <br />
                DECISIVE SYSTEMS.
              </p>
            </div>
            {/* Aden column */}
            <div className="flex flex-col items-center justify-center gap-[calc(var(--strip-h,120px)+2rem)]">
              <p
                className="text-center text-[clamp(0.9rem,1.8vw,1.6rem)] font-bold uppercase leading-[1.15] tracking-[-0.01em]"
                style={{ color: "hsl(var(--foreground) / 0.85)", fontFamily: "'Inter', sans-serif" }}
              >
                WE SPOT GAPS BEFORE
                <br />
                THEY'RE OBVIOUS.
              </p>
              <p
                className="text-center text-[clamp(0.9rem,1.8vw,1.6rem)] font-bold uppercase leading-[1.15] tracking-[-0.01em]"
                style={{ color: "hsl(var(--foreground) / 0.85)", fontFamily: "'Inter', sans-serif" }}
              >
                ENGINEER IDEAS INTO
                <br />
                SYSTEMS THAT SCALE.
              </p>
            </div>
          </div>

          {/* Strips row — in front */}
          <div
            className="team-strips-row flex w-full max-w-[88vw] md:max-w-[66%] mx-auto items-center self-center"
            style={{ gridArea: "1 / 1", zIndex: 2 }}
          >
            {members.map((member, idx) => (
              <div key={member.name} className="flex-1 min-w-0">
                <button
                  type="button"
                  className="relative block w-full text-left cursor-pointer"
                  onClick={() => handleToggle(idx)}
                  aria-label={`Toggle ${member.name} profile`}
                >
                  <div
                    ref={(el) => {
                      stripRefs.current[idx] = el;
                    }}
                    className="relative overflow-hidden"
                    style={{ height: collapsedH }}
                  >
                    <img
                      ref={(el) => {
                        imgRefs.current[idx] = el;
                      }}
                      src={member.photo}
                      alt={member.name}
                      draggable={false}
                      className="absolute inset-0 h-full w-full select-none"
                      style={{
                        objectFit: "cover",
                        objectPosition: `center ${member.eyePct}%`,
                        transform: "scale(1.18)",
                        transformOrigin: "center center",
                        willChange: "transform, object-position",
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0"
                      style={{
                        height: "35%",
                        background: "linear-gradient(to bottom, hsl(var(--background)), transparent)",
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0"
                      style={{
                        height: "35%",
                        background: "linear-gradient(to top, hsl(var(--background)), transparent)",
                      }}
                    />
                    <div
                      ref={(el) => {
                        labelRefs.current[idx] = el;
                      }}
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
        </div>
      </div>

      {/* Bio footer */}
      <div ref={bioContainerRef} className="px-6 md:px-10 pb-10" style={{ opacity: 0, minHeight: 120 }}>
        <div ref={bioInnerRef}>
          <div className="w-full h-px mb-5" style={{ background: "hsl(var(--foreground) / 0.1)" }} />

          <div className="relative flex flex-col md:flex-row md:items-baseline mb-5 gap-1 md:gap-0">
            <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "hsl(var(--foreground) / 0.35)" }}>
              {bioData !== null
                ? `${String(bioData + 1).padStart(2, "0")} / ${String(members.length).padStart(2, "0")}`
                : "\u00A0"}
            </div>
            <div
              className="md:absolute md:left-1/2 md:-translate-x-1/2 text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "hsl(var(--foreground) / 0.5)" }}
            >
              {bioData !== null && (
                <>
                  <span style={{ color: "hsl(var(--foreground) / 0.6)" }}>{members[bioData].name}</span>
                  <span className="mx-2 md:mx-4" style={{ color: "hsl(var(--foreground) / 0.2)" }}>
                    |
                  </span>
                  <span>{members[bioData].title}</span>
                </>
              )}
            </div>
          </div>

          <div className="w-full h-px mb-5" style={{ background: "hsl(var(--foreground) / 0.07)" }} />

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-3 shrink-0">
              {/* LinkedIn icon */}
              <a
                href={bioData !== null ? members[bioData].linkedin : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-sm hover-target"
                style={{ border: "1px solid hsl(var(--foreground) / 0.15)" }}
                aria-label="LinkedIn"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "hsl(var(--foreground) / 0.5)" }}
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <BracketButton
                label={`Connect with ${firstName}`}
                href={bioData !== null ? members[bioData].linkedin : "#"}
              />
              <div className="h-5 w-px" style={{ background: "hsl(var(--foreground) / 0.12)" }} />
              <BracketButton
                label="Full Bio"
                onClick={() => {
                  if (bioData !== null) setModalMember(members[bioData]);
                }}
              />
            </div>

            <div className="flex-1 flex justify-start">
              <p
                className="max-w-[620px] text-[10px] uppercase tracking-[0.1em] leading-[1.9]"
                style={{ color: "hsl(var(--foreground) / 0.45)" }}
              >
                {bioData !== null ? members[bioData].bio : "\u00A0"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
