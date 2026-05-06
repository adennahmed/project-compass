import { useEffect, useRef } from "react";
import gsap from "gsap";
import { studioHoverTargets } from "./studioState";

/**
 * Studio room — two portrait panels (in 3D, owned by SceneController)
 * with bios as monospace caption blocks beneath. Hovering a portrait
 * caption resolves the corresponding pixel-quantize shader from
 * coarse RGB-split mosaic to clean photo.
 *
 * Per brief §5.8.
 */

interface MemberDef {
  initials: string;
  name: string;
  role: string;
  bio: string;
  detail: string;
}

const MEMBERS: MemberDef[] = [
  {
    initials: "AA",
    name: "Aden Ahmed",
    role: "Principal Engineer & Founder",
    bio:
      "Builds the operational platforms mid-market and enterprise teams depend on. " +
      "Background spans data infrastructure, distributed services, and the interfaces " +
      "operators rely on every day.",
    detail:
      "Specializes in turning ambiguous requirements into systems that hold up under production load.",
  },
  {
    initials: "MK",
    name: "Muhammad Khan",
    role: "Senior Systems Engineer",
    bio:
      "Distributed systems and reliability engineering. Deep experience with high-availability " +
      "architectures, observability, and the edge cases that determine whether a system can be " +
      "trusted under load.",
    detail:
      "Focuses on resilience engineering — building systems that fail gracefully and recover predictably.",
  },
];

interface StudioRoomProps {
  active: boolean;
}

const StudioRoom = ({ active }: StudioRoomProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !active || playedRef.current) return;
    playedRef.current = true;

    const eyebrow = root.querySelector<HTMLDivElement>(".kz-st-eyebrow");
    const title = root.querySelector<HTMLDivElement>(".kz-st-title");
    const meta = root.querySelectorAll<HTMLDivElement>(".kz-st-meta");
    const cards = root.querySelectorAll<HTMLDivElement>(".kz-st-card");
    const studioBlurb = root.querySelector<HTMLParagraphElement>(".kz-st-blurb");

    gsap.fromTo(eyebrow,     { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
    gsap.fromTo(title,       { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: 0.08 });
    gsap.fromTo(studioBlurb, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.18 });
    gsap.fromTo(meta,        { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", delay: 0.28, stagger: 0.05 });
    gsap.fromTo(cards,       { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: 0.42, stagger: 0.12 });
  }, [active]);

  const setHover = (i: number, v: number) => {
    studioHoverTargets[i] = v;
  };

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 z-10 flex h-full w-full flex-col px-6 pt-20 pb-24 md:px-12 md:pt-24 md:pb-28"
    >
      {/* Eyebrow */}
      <div className="kz-st-eyebrow font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute opacity-0">
        [ 05 / THE STUDIO ]
        <span className="mx-3 text-bone/30">·</span>
        team
      </div>

      {/* Identity block */}
      <div className="mt-10 grid w-full grid-cols-1 gap-8 md:mt-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2
            className="kz-st-title display-headline text-bone opacity-0"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)", lineHeight: "1.0" }}
          >
            Senior engineers.
            <br />
            <span style={{ color: "rgb(var(--bone-mute))" }}>Direct access.</span>
          </h2>
          <p className="kz-st-blurb mt-6 max-w-[420px] text-sm leading-relaxed text-bone/65 opacity-0 md:text-[15px]">
            Kozai is a software studio working at the intersection of engineering and
            operations. You work directly with the engineers building your system —
            every call, every commit, every release. No intermediaries between you
            and the people writing the code.
          </p>
        </div>

        <div className="md:col-span-4 md:col-start-7">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 font-mono">
            <MetaBlock label="Founded" value="2022" />
            <MetaBlock label="Location" value="Toronto, CA" />
            <MetaBlock label="Practice" value="Independent" />
            <MetaBlock label="Stack" value="TS · Go · Rust · SQL" />
          </div>
        </div>
      </div>

      {/* Member captions — hovering activates the corresponding portrait shader */}
      <div className="mt-auto grid w-full grid-cols-1 gap-8 pt-10 md:grid-cols-2 md:gap-12">
        {MEMBERS.map((m, i) => (
          <div
            key={m.name}
            className="kz-st-card hover-target cursor-none border-t border-bone/15 pt-5 opacity-0"
            onMouseEnter={() => setHover(i, 1)}
            onMouseLeave={() => setHover(i, 0)}
            onFocus={() => setHover(i, 1)}
            onBlur={() => setHover(i, 0)}
            tabIndex={0}
          >
            <div className="flex items-baseline justify-between">
              <h3
                className="text-bone"
                style={{
                  fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)",
                  letterSpacing: "-0.02em",
                  fontWeight: 500,
                }}
              >
                {m.name}
              </h3>
              <span
                className="font-mono text-[11px] uppercase tracking-[0.32em]"
                style={{ color: "rgb(var(--signal))" }}
              >
                {m.initials}
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">
              {m.role}
            </p>
            <p className="mt-4 max-w-[440px] text-sm leading-relaxed text-bone/70">
              {m.bio}
            </p>
            <p
              className="mt-3 max-w-[440px] text-sm leading-relaxed text-bone/45"
              style={{ fontFamily: "'Times New Roman', Georgia, serif", fontStyle: "italic" }}
            >
              {m.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const MetaBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="kz-st-meta opacity-0">
    <div className="text-[10px] uppercase tracking-[0.32em] text-bone-mute">{label}</div>
    <div
      className="mt-1.5 text-sm text-bone/85"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {value}
    </div>
  </div>
);

export default StudioRoom;
