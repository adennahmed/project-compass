import { useEffect, useRef, useState } from "react";
import CharReveal from "@/components/CharReveal";
import Reveal from "@/components/Reveal";
import adenImg from "@/assets/aden-ahmed.png";
import muhammadImg from "@/assets/mohammed-khan.jpg";

interface Member {
  initials: string;
  name: string;
  role: string;
  triadWords: string[]; // five words max for predictable wrap
  italicAt: number;
  bio: string;
  image: string;
}

const MEMBERS: Member[] = [
  {
    initials: "AA",
    name: "Aden Ahmed",
    role: "Principal Engineer & Founder",
    triadWords: ["We", "architect", "what", "operators", "use."],
    italicAt: 3,
    bio:
      "Builds the operational platforms mid-market and enterprise teams depend on. Background spans data infrastructure, distributed services, and the interfaces operators rely on every day.",
    image: adenImg,
  },
  {
    initials: "MK",
    name: "Muhammad Khan",
    role: "Senior Systems Engineer",
    triadWords: ["We", "see", "edges", "before", "production."],
    italicAt: 2,
    bio:
      "Distributed systems and reliability engineering. Deep experience with high-availability architectures, observability, and the edge cases that determine whether a system can be trusted under load.",
    image: muhammadImg,
  },
];

const Studio = () => {
  const [active, setActive] = useState<number | null>(null);

  const toggle = (i: number) =>
    setActive((prev) => (prev === i ? null : i));

  return (
    <section
      id="studio"
      data-snap
      className="section-fit relative overflow-hidden bg-ink px-6 py-24 text-paper md:px-10 md:py-28"
    >
      <div className="container-wide flex w-full flex-col">
        {/* Header strip — eyebrow + framed badge */}
        <Reveal>
          <div className="flex items-center justify-between text-paper/55">
            <div className="font-mono text-[11px] uppercase tracking-[0.32em]">
              [ 04 — Studio ]
            </div>
            <div className="hidden font-mono text-[11px] uppercase tracking-[0.32em] md:block">
              Toronto · 2026
            </div>
          </div>
        </Reveal>

        {/* Centred title row */}
        <Reveal delay={120}>
          <div className="my-12 flex items-center justify-center md:my-14">
            <div className="relative inline-flex items-center px-6 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-paper/85">
              <span aria-hidden className="absolute -left-1 -top-1 h-2.5 w-2.5 border-l border-t border-paper/35" />
              <span aria-hidden className="absolute -right-1 -top-1 h-2.5 w-2.5 border-r border-t border-paper/35" />
              <span aria-hidden className="absolute -bottom-1 -left-1 h-2.5 w-2.5 border-b border-l border-paper/35" />
              <span aria-hidden className="absolute -bottom-1 -right-1 h-2.5 w-2.5 border-b border-r border-paper/35" />
              Meet the team
            </div>
          </div>
        </Reveal>

        {/* Cards — both same height regardless of state */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          {MEMBERS.map((m, i) => (
            <MemberCard
              key={m.name}
              member={m}
              index={i}
              isActive={active === i}
              isDimmed={active !== null && active !== i}
              onClick={() => toggle(i)}
            />
          ))}
        </div>

        {/* Detail panel — slides down beneath the cards when one is active */}
        <div className={`studio-detail ${active !== null ? "is-open" : ""}`}>
          {active !== null && <DetailPanel member={MEMBERS[active]} index={active} />}
        </div>

        {/* Footer hint */}
        {active === null && (
          <Reveal delay={300}>
            <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-paper/45">
              ↘ Click a portrait for the full bio
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
};

interface MemberCardProps {
  member: Member;
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  onClick: () => void;
}

const MemberCard = ({
  member,
  index,
  isActive,
  isDimmed,
  onClick,
}: MemberCardProps) => {
  const portraitRef = useRef<HTMLDivElement>(null);
  const [pillPos, setPillPos] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    const el = portraitRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setPillPos({ x: e.clientX - r.left, y: e.clientY - r.top, visible: true });
    };
    const onLeave = () => setPillPos((p) => ({ ...p, visible: false }));
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <Reveal delay={index * 100}>
      <article
        className={`studio-card ${isActive ? "is-active" : ""} ${
          isDimmed ? "is-dimmed" : ""
        }`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-pressed={isActive}
        aria-label={`${isActive ? "Hide" : "View"} ${member.name}'s bio`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {/* Portrait eye-strip */}
        <div ref={portraitRef} className="studio-portrait">
          <img
            src={member.image}
            alt={`${member.name} — ${member.role}`}
            className="studio-portrait__img"
            loading="lazy"
          />
          {/* Top-corner annotations */}
          <div className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65">
            {String(index + 1).padStart(2, "0")} / 02
          </div>
          <div className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65">
            {member.initials}
          </div>
          {/* Cursor-tracking pill */}
          <div
            className="studio-portrait__pill"
            style={{
              left: pillPos.x,
              top: pillPos.y,
              opacity: pillPos.visible ? 1 : 0,
              transform: `translate(-50%, -50%) scale(${pillPos.visible ? 1 : 0.85})`,
            }}
          >
            {isActive ? "Hide ↗" : "View ↘"}
          </div>
        </div>

        {/* Name + role row — same height for both cards */}
        <div className="flex items-baseline justify-between border-b border-paper/12 pb-3">
          <div>
            <div className="text-[18px] font-semibold text-paper md:text-[20px]">
              {member.name}
            </div>
            <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">
              {member.role}
            </div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
            {String(index + 1).padStart(2, "0")} / 02
          </div>
        </div>

        {/* Triad — heavy uppercase, italic accent on a single key word */}
        <h3
          className="text-paper"
          style={{
            fontSize: "clamp(1.25rem, 1.95vw, 1.7rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: "1.18",
            textTransform: "uppercase",
          }}
        >
          {member.triadWords.map((w, wi) => {
            const isAccent = wi === member.italicAt;
            return (
              <span key={wi} className="mr-[0.28em] inline-block">
                <CharReveal
                  stagger={22}
                  splitBy="word"
                  className={isAccent ? "italic-editorial text-signal" : ""}
                >
                  {w}
                </CharReveal>
              </span>
            );
          })}
        </h3>
      </article>
    </Reveal>
  );
};

const DetailPanel = ({ member, index }: { member: Member; index: number }) => (
  <>
    <div className="studio-detail__portrait">
      <img src={member.image} alt={`${member.name} — full portrait`} />
    </div>
    <div className="flex flex-col justify-center">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55">
        {String(index + 1).padStart(2, "0")} / 02 · {member.role}
      </div>
      <div className="mt-2 text-[28px] font-semibold leading-tight text-paper md:text-[34px]">
        {member.name}
      </div>
      <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.65] text-paper/75 md:text-[16px]">
        {member.bio}
      </p>
      <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
        <a
          href={`mailto:hello@kozai.ca?subject=${encodeURIComponent(`For ${member.name}`)}`}
          onClick={(e) => e.stopPropagation()}
          className="link-wipe font-mono text-[11px] uppercase tracking-[0.22em] text-paper/85 hover:text-paper"
        >
          Connect ↘
        </a>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="link-wipe font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper"
        >
          Full bio →
        </button>
      </div>
    </div>
  </>
);

export default Studio;
