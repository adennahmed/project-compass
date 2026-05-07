import { useEffect, useRef, useState } from "react";
import CharReveal from "@/components/CharReveal";
import Reveal from "@/components/Reveal";
import adenImg from "@/assets/aden-ahmed.png";
import muhammadImg from "@/assets/mohammed-khan.jpg";

interface Member {
  initials: string;
  name: string;
  role: string;
  triadA: string;
  triadAItalic?: number; // word index to italicize
  triadB: string;
  bio: string;
  detail: string;
  image: string;
}

const MEMBERS: Member[] = [
  {
    initials: "AA",
    name: "Aden Ahmed",
    role: "Principal Engineer & Founder",
    triadA: "We architect what operators actually use.",
    triadAItalic: 3,
    triadB: "We turn ambiguity into shipped systems.",
    bio:
      "Builds the operational platforms mid-market and enterprise teams depend on. Background spans data infrastructure, distributed services, and the interfaces operators rely on every day.",
    detail:
      "Specialises in turning ambiguous requirements into systems that hold up under production load.",
    image: adenImg,
  },
  {
    initials: "MK",
    name: "Muhammad Khan",
    role: "Senior Systems Engineer",
    triadA: "We see edge cases before production does.",
    triadAItalic: 3,
    triadB: "We build for the hardest week.",
    bio:
      "Distributed systems and reliability engineering. Deep experience with high-availability architectures, observability, and the edge cases that determine whether a system can be trusted under load.",
    detail:
      "Focuses on resilience engineering — building systems that fail gracefully and recover predictably.",
    image: muhammadImg,
  },
];

const Studio = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (i: number) =>
    setExpanded((prev) => (prev === i ? null : i));

  return (
    <section
      id="studio"
      className="relative overflow-hidden bg-ink px-6 py-32 text-paper md:px-10 md:py-40"
    >
      {/* Header */}
      <div className="container-wide">
        <Reveal>
          <div className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
            Our team
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mb-12 max-w-[42ch] text-center text-[14px] uppercase leading-[1.7] tracking-[0.18em] text-paper/55">
            The engineers building Kozai's work — and the only people you'll
            ever talk to during a project.
          </p>
        </Reveal>

        {/* "MEET THE TEAM" framed badge */}
        <Reveal delay={220}>
          <div className="mx-auto mb-20 inline-flex w-full justify-center">
            <div className="relative inline-flex items-center px-6 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-paper/85">
              <span aria-hidden className="absolute -left-1 -top-1 h-2.5 w-2.5 border-l border-t border-paper/35" />
              <span aria-hidden className="absolute -right-1 -top-1 h-2.5 w-2.5 border-r border-t border-paper/35" />
              <span aria-hidden className="absolute -bottom-1 -left-1 h-2.5 w-2.5 border-b border-l border-paper/35" />
              <span aria-hidden className="absolute -bottom-1 -right-1 h-2.5 w-2.5 border-b border-r border-paper/35" />
              Meet the team
            </div>
          </div>
        </Reveal>

        {/* Member layout — eye-strips with triads, expand on click */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {MEMBERS.map((m, i) => (
            <MemberCard
              key={m.name}
              member={m}
              index={i}
              isExpanded={expanded === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* Bottom strip — visible only when one is expanded */}
        <div
          className="overflow-hidden transition-all duration-700 ease-out"
          style={{
            maxHeight: expanded !== null ? "320px" : "0px",
            opacity: expanded !== null ? 1 : 0,
            marginTop: expanded !== null ? "3.5rem" : "0",
          }}
        >
          {expanded !== null && (
            <BioPanel member={MEMBERS[expanded]} index={expanded} />
          )}
        </div>
      </div>
    </section>
  );
};

interface MemberCardProps {
  member: Member;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const MemberCard = ({ member, index, isExpanded, onToggle }: MemberCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pillPos, setPillPos] = useState({ x: 0, y: 0, visible: false });

  // Track cursor position over the portrait so the VIEW/HIDE pill follows it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setPillPos({
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        visible: true,
      });
    };
    const onLeave = () => setPillPos((p) => ({ ...p, visible: false }));
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const triadAWords = member.triadA.split(" ");

  return (
    <Reveal delay={index * 120}>
      <article className="flex flex-col gap-6">
        {/* Triad A — top */}
        <h3
          className="text-paper"
          style={{
            fontSize: "clamp(1.35rem, 2.2vw, 1.85rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: "1.1",
            textTransform: "uppercase",
          }}
        >
          {triadAWords.map((word, wi) => {
            const isItalic = wi === member.triadAItalic;
            return (
              <span key={wi} className="mr-[0.3em] inline-block">
                <CharReveal
                  stagger={20}
                  splitBy="word"
                  className={isItalic ? "italic-editorial text-signal" : ""}
                >
                  {word}
                </CharReveal>
              </span>
            );
          })}
        </h3>

        {/* Portrait — the click target */}
        <div
          ref={ref}
          className={`kz-portrait group relative cursor-pointer ${isExpanded ? "is-expanded" : ""}`}
          onClick={onToggle}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? "Hide" : "View"} ${member.name}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
        >
          <div className="relative w-full overflow-hidden bg-ink/60">
            <img
              src={member.image}
              alt={`${member.name} — ${member.role}`}
              className="kz-portrait__img"
              loading="lazy"
            />
            {/* Frame corners */}
            <div className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
              {String(index + 1).padStart(2, "0")} / 02
            </div>
            <div className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
              {member.initials}
            </div>
            {/* Bottom badge — role */}
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
                {member.role}
              </span>
            </div>
          </div>

          {/* Hover pill — follows cursor */}
          <div
            className="kz-portrait__hover-pill"
            style={{
              left: pillPos.x,
              top: pillPos.y,
              opacity: pillPos.visible ? 1 : 0,
              transform: `translate(-50%, -50%) scale(${pillPos.visible ? 1 : 0.85})`,
            }}
          >
            {isExpanded ? "Hide ↗" : "View ↘"}
          </div>
        </div>

        {/* Triad B — below the portrait */}
        <h3
          className="text-paper"
          style={{
            fontSize: "clamp(1.35rem, 2.2vw, 1.85rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: "1.1",
            textTransform: "uppercase",
          }}
        >
          <CharReveal stagger={20} splitBy="word">
            {member.triadB}
          </CharReveal>
        </h3>
      </article>
    </Reveal>
  );
};

const BioPanel = ({ member, index }: { member: Member; index: number }) => (
  <div className="grid grid-cols-1 gap-6 border-t border-paper/15 pt-7 md:grid-cols-12 md:gap-10">
    <div className="md:col-span-3">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">
        {String(index + 1).padStart(2, "0")} / 02 · {member.role}
      </div>
      <div className="mt-2 text-[28px] font-semibold leading-tight text-paper md:text-[32px]">
        {member.name}
      </div>
    </div>
    <div className="md:col-span-6">
      <p className="text-[15px] leading-[1.6] text-paper/80 md:text-[16px]">{member.bio}</p>
      <p className="mt-3 italic-editorial text-[14px] leading-[1.6] text-paper/55">
        {member.detail}
      </p>
    </div>
    <div className="flex gap-3 md:col-span-3 md:flex-col md:items-end md:gap-4">
      <a
        href={`mailto:hello@kozai.ca?subject=${encodeURIComponent(`For ${member.name}`)}`}
        className="link-wipe font-mono text-[11px] uppercase tracking-[0.22em] text-paper/85 hover:text-paper"
      >
        Connect ↘
      </a>
      <button
        type="button"
        className="link-wipe font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper"
      >
        Full bio →
      </button>
    </div>
  </div>
);

export default Studio;
