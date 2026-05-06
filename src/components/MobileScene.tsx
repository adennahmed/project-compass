import { ReactNode, useEffect, useRef, useState } from "react";
import MobileShaderPanel from "./MobileShaderPanel";
import {
  SHADER_CHART,
  SHADER_FLOW,
  SHADER_GRID,
  SHADER_FORECAST,
} from "./rooms/buildShaders";
import { WORK_PANEL_SHADERS } from "./rooms/workShaders";

/**
 * Mobile fallback for the room sequence (per brief §4.9).
 *
 * Vertical scroll, full-bleed sections, each room a viewport-height block.
 * Per-room shaders still run as panel backgrounds via MobileShaderPanel,
 * driven by IntersectionObserver — only animating while in view.
 *
 * The horizontal-pinned camera dolly is dropped here. Sub-state cycling
 * inside Approach / Build / Work is replaced by stacked content (all sub
 * items shown vertically, in source order) — mobile users scroll, they
 * don't dolly.
 */

interface MobileSceneProps {
  onContactClick?: () => void;
}

const MobileScene = ({ onContactClick }: MobileSceneProps) => {
  return (
    <div className="kz-mobile relative w-full bg-ink text-bone">
      {/* Persistent frame — minimal version of the desktop frame */}
      <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-bone/10 bg-ink/90 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute backdrop-blur">
        <span>kozai · studio</span>
        <span className="flex items-center gap-2">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "rgb(var(--signal-2))" }}
          />
          <span>live · 2026</span>
        </span>
      </header>

      <OperationsMobile onContactClick={onContactClick} />
      <ApproachMobile />
      <BuildMobile />
      <WorkMobile />
      <StudioMobile />
      <ContactMobile onContactClick={onContactClick} />

      <footer className="border-t border-bone/10 px-5 py-6 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">
        <div className="flex items-center justify-between">
          <span>kozai · 2022 — 2026</span>
          <span>toronto · ca</span>
        </div>
      </footer>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section shell — observes itself; reveal-on-enter via small fade.

const Section = ({
  id,
  eyebrow,
  shader,
  children,
}: {
  id: string;
  eyebrow: string;
  shader: string;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.18 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden border-t border-bone/10 px-5 py-16"
    >
      {/* Shader backdrop — sits behind content, dimmed */}
      <div className="pointer-events-none absolute inset-0 -z-0 opacity-[0.55]">
        <MobileShaderPanel
          fragmentShader={shader}
          className="absolute inset-0 h-full w-full"
        />
        {/* Vignette to keep text readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 60%, rgba(6,8,15,0.25) 0%, rgba(6,8,15,0.85) 70%, rgba(6,8,15,0.95) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">
        {eyebrow}
      </div>

      <div
        className="relative z-10 mt-auto flex flex-col gap-6 transition-all duration-700 ease-out"
        style={{
          opacity: seen ? 1 : 0,
          transform: seen ? "translateY(0)" : "translateY(18px)",
        }}
      >
        {children}
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 01 / OPERATIONS

const OperationsMobile = ({ onContactClick }: { onContactClick?: () => void }) => (
  <Section id="operations" eyebrow="[ 01 / OPERATIONS ] · console" shader={SHADER_CHART}>
    <div
      className="font-mono"
      style={{
        fontSize: "clamp(1.5rem, 7.5vw, 2.4rem)",
        lineHeight: "1.18",
        letterSpacing: "-0.01em",
      }}
    >
      {[
        "we don't sell software.",
        "we solve the problem",
        "behind the problem.",
      ].map((line, i) => (
        <div key={i} className="text-bone">
          <span style={{ color: "rgb(var(--signal))" }}>&gt;&nbsp;</span>
          {line}
        </div>
      ))}
    </div>

    <p className="max-w-[460px] text-sm leading-relaxed text-bone/70">
      Kozai is a software studio designing and building the internal tools,
      dashboards, and platforms that small teams and enterprise operators rely
      on every day.
    </p>

    <div className="grid grid-cols-3 gap-x-4">
      <Meta label="Studio" value="Toronto · Remote" />
      <Meta label="Focus" value="Tools" />
      <Meta label="Stack" value="TS · Go · Rust" />
    </div>

    <button
      type="button"
      onClick={onContactClick}
      className="hover-target group inline-flex items-center gap-3 self-start border border-bone/15 bg-ink-rise/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.32em] text-bone backdrop-blur"
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: "rgb(var(--signal))" }}
      />
      <span>start a project</span>
      <span className="text-bone/40 group-hover:text-bone">→</span>
    </button>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 02 / APPROACH — three triads stacked vertically (no cycling on mobile)

const TRIADS = [
  {
    n: "01",
    words: ["SCOPED.", "OPINIONATED.", "SHIPPED."],
    body:
      "We ship the smallest tool that solves the real problem, then iterate. " +
      "No platform-shaped roadmaps for two-feature problems.",
  },
  {
    n: "02",
    words: ["ENGINEERS.", "NOT", "VENDORS."],
    italic: 1,
    body:
      "You communicate directly with the engineers building your system. " +
      "Clear technical discussion in place of account managers and project intermediaries.",
  },
  {
    n: "03",
    words: ["BUILT.", "TO.", "OWN."],
    body:
      "Clean code, plain stack, real documentation. When we hand off, your team " +
      "can pick it up the same day.",
  },
];

const ApproachMobile = () => (
  <Section id="approach" eyebrow="[ 02 / APPROACH ] · principles" shader={SHADER_FLOW}>
    <div className="flex flex-col gap-12">
      {TRIADS.map((t) => (
        <div key={t.n} className="border-t border-bone/15 pt-5">
          <div
            className="font-mono text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "rgb(var(--signal))" }}
          >
            / {t.n}
          </div>
          <h3
            className="display-headline mt-3 flex flex-wrap items-baseline gap-x-3 text-bone"
            style={{ fontSize: "clamp(1.7rem, 9vw, 3rem)", lineHeight: "1.02" }}
          >
            {t.words.map((w, j) => (
              <span
                key={j}
                style={
                  t.italic === j
                    ? {
                        fontStyle: "italic",
                        fontFamily: "'Times New Roman', Georgia, serif",
                        fontWeight: 400,
                      }
                    : undefined
                }
              >
                {w}
              </span>
            ))}
          </h3>
          <p className="mt-4 max-w-[520px] text-sm leading-relaxed text-bone/65">
            {t.body}
          </p>
        </div>
      ))}
    </div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 03 / BUILD — services list, each with its own mini-shader thumbnail

const SERVICES = [
  {
    n: "01",
    title: "Internal tools & dashboards",
    line: "Your ops team stops copy-pasting between spreadsheets.",
    shader: SHADER_CHART,
    deliverables: ["Admin consoles", "Reporting", "Internal CRMs", "Approvals"],
  },
  {
    n: "02",
    title: "Workflow automation",
    line: "The job that took an afternoon now runs while you sleep.",
    shader: SHADER_FLOW,
    deliverables: ["ETL pipelines", "Cross-system sync", "Scheduled jobs", "Webhooks"],
  },
  {
    n: "03",
    title: "Client-facing platforms",
    line: "From whiteboard to first paying user.",
    shader: SHADER_GRID,
    deliverables: ["MVPs", "Customer portals", "Marketplaces", "Embedded SaaS"],
  },
  {
    n: "04",
    title: "Data & decision support",
    line: "Stop arguing about what the number is.",
    shader: SHADER_FORECAST,
    deliverables: ["Warehouses", "BI dashboards", "Forecasting", "Decision systems"],
  },
];

const BuildMobile = () => (
  <Section id="build" eyebrow="[ 03 / WHAT WE BUILD ] · services" shader={SHADER_GRID}>
    <div className="flex flex-col gap-10">
      {SERVICES.map((s) => (
        <article key={s.n} className="border-t border-bone/15 pt-5">
          <div className="flex items-center justify-between">
            <div
              className="font-mono text-[10px] uppercase tracking-[0.32em]"
              style={{ color: "rgb(var(--signal))" }}
            >
              / {s.n}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">
              service
            </div>
          </div>
          <h3
            className="display-headline mt-3 text-bone"
            style={{ fontSize: "clamp(1.5rem, 7vw, 2.4rem)", lineHeight: "1.05" }}
          >
            {s.title}
          </h3>
          <p
            className="mt-3 font-mono text-sm"
            style={{ color: "rgb(var(--signal))" }}
          >
            {s.line}
          </p>

          {/* Inline shader thumbnail */}
          <div className="relative mt-5 aspect-[16/9] w-full overflow-hidden border border-bone/15 bg-ink-rise/50">
            <MobileShaderPanel
              fragmentShader={s.shader}
              className="absolute inset-0 h-full w-full"
            />
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/55">
            {s.deliverables.map((d) => (
              <li key={d} className="border-t border-bone/15 pt-2">
                {d}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 04 / WORK — projects stacked, each with its own shader

const PROJECTS = [
  {
    n: "01",
    client: "Meridian Logistics",
    year: "2025",
    name: "Real-time fleet console",
    metric: "−83% incidents",
    one: "A real-time fleet tracking dashboard that replaced four separate tools.",
    body:
      "We rebuilt Meridian's dispatch operations on a single Postgres-backed platform " +
      "with live vehicle telemetry, exception alerts, and shift planning.",
    stack: ["Postgres", "Next.js", "Mapbox", "TypeScript"],
  },
  {
    n: "02",
    client: "Kindred Health",
    year: "2024",
    name: "Clinician charting suite",
    metric: "−78% charting time",
    one: "Charting that lets clinicians finish notes before the patient leaves the room.",
    body:
      "An EHR companion that turned a 14-minute charting flow into a 3-minute one. " +
      "Voice capture, smart templates, and a queue that knows what's next.",
    stack: ["Rust", "SQLite", "Whisper", "React"],
  },
  {
    n: "03",
    client: "Tessera Capital",
    year: "2024",
    name: "Deal flow operating system",
    metric: "+41% reply rate",
    one: "A bespoke CRM that knows what 'follow up next week' means.",
    body:
      "Replaced spreadsheets and a generic CRM with an opinionated deal-flow tool: " +
      "each partner has a queue, every meeting writes back to the pipeline.",
    stack: ["Postgres", "Remix", "Inngest", "Resend"],
  },
  {
    n: "04",
    client: "Lumen Studios",
    year: "2025",
    name: "Render pipeline & client portal",
    metric: "−6 days / project",
    one: "From file dropbox to a portal that knows what shot is in revision and why.",
    body:
      "A production-tracking platform: brief intake, shot status, version comments, " +
      "and an automated render queue that bills back to the project.",
    stack: ["Go", "Postgres", "S3", "Svelte"],
  },
];

const WorkMobile = () => (
  <Section id="work" eyebrow="[ 04 / SELECTED WORK ] · case studies" shader={WORK_PANEL_SHADERS[0]}>
    <div className="flex flex-col gap-10">
      {PROJECTS.map((p, i) => (
        <article key={p.n} className="border-t border-bone/15 pt-5">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.32em]">
            <span style={{ color: "rgb(var(--signal))" }}>/ {p.n}</span>
            <span className="text-bone-mute">{p.year}</span>
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">
            {p.client}
          </div>
          <h3
            className="display-headline mt-2 text-bone"
            style={{ fontSize: "clamp(1.4rem, 6vw, 2.2rem)", lineHeight: "1.05" }}
          >
            {p.name}
          </h3>

          <div className="mt-4 flex items-baseline justify-between border-y border-bone/15 py-3">
            <span
              className="font-mono"
              style={{
                fontSize: "clamp(1.5rem, 8vw, 2.4rem)",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.02em",
              }}
            >
              {p.metric}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">
              outcome
            </span>
          </div>

          <p
            className="mt-4 font-mono text-sm"
            style={{ color: "rgb(var(--signal))" }}
          >
            {p.one}
          </p>
          <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-bone/65">
            {p.body}
          </p>

          <div className="relative mt-5 aspect-[16/9] w-full overflow-hidden border border-bone/15 bg-ink-rise/50">
            <MobileShaderPanel
              fragmentShader={WORK_PANEL_SHADERS[i % WORK_PANEL_SHADERS.length]}
              className="absolute inset-0 h-full w-full"
            />
          </div>

          <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/55">
            {p.stack.map((s) => (
              <li key={s} className="border border-bone/15 px-2 py-1">
                {s}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 05 / STUDIO

const MEMBERS = [
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

const StudioMobile = () => (
  <Section id="studio" eyebrow="[ 05 / THE STUDIO ] · team" shader={SHADER_FORECAST}>
    <h2
      className="display-headline text-bone"
      style={{ fontSize: "clamp(1.7rem, 8vw, 2.6rem)", lineHeight: "1.02" }}
    >
      Senior engineers.
      <br />
      <span style={{ color: "rgb(var(--bone-mute))" }}>Direct access.</span>
    </h2>
    <p className="max-w-[520px] text-sm leading-relaxed text-bone/65">
      Kozai is a software studio working at the intersection of engineering and
      operations. You work directly with the engineers building your system —
      every call, every commit, every release.
    </p>

    <div className="grid grid-cols-2 gap-x-6 gap-y-5 font-mono">
      <Meta label="Founded" value="2022" />
      <Meta label="Location" value="Toronto, CA" />
      <Meta label="Practice" value="Independent" />
      <Meta label="Stack" value="TS · Go · Rust" />
    </div>

    <div className="mt-4 flex flex-col gap-8">
      {MEMBERS.map((m) => (
        <div key={m.name} className="border-t border-bone/15 pt-5">
          <div className="flex items-baseline justify-between">
            <h3
              className="text-bone"
              style={{ fontSize: "clamp(1.1rem, 5vw, 1.4rem)", letterSpacing: "-0.02em", fontWeight: 500 }}
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
          <p className="mt-4 text-sm leading-relaxed text-bone/70">{m.bio}</p>
          <p
            className="mt-3 text-sm leading-relaxed text-bone/45"
            style={{ fontFamily: "'Times New Roman', Georgia, serif", fontStyle: "italic" }}
          >
            {m.detail}
          </p>
        </div>
      ))}
    </div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 06 / CONTACT

const ContactMobile = ({ onContactClick }: { onContactClick?: () => void }) => (
  <Section id="contact" eyebrow="[ 06 / CONTACT ] · kozai.contact ~ tty01" shader={WORK_PANEL_SHADERS[3]}>
    <div
      className="font-mono text-bone/85"
      style={{ fontSize: "clamp(0.85rem, 3.6vw, 1.05rem)", lineHeight: "1.6" }}
    >
      <div>
        <span style={{ color: "rgb(var(--signal))" }}>&gt;&nbsp;</span>
        <span className="text-bone-mute">kozai.contact:~$ </span>
        <span className="text-bone">help</span>
      </div>
      <div>&nbsp;</div>
      {[
        ["email", "hello@kozai.ca"],
        ["hours", "mon–fri · 09–18 et"],
        ["reply", "within 48 hours"],
        ["studio", "toronto, ca · remote"],
      ].map(([k, v]) => (
        <div key={k} className="grid grid-cols-[auto_1fr] gap-x-5">
          <span
            className="font-mono uppercase tracking-[0.18em] text-bone-mute"
            style={{ fontSize: "0.78em" }}
          >
            {k}
          </span>
          <span className="text-bone">{v}</span>
        </div>
      ))}
      <div>&nbsp;</div>
      <div className="text-bone/65">
        <span style={{ color: "rgb(var(--signal))" }}>// </span>
        tell us what you're trying to build.
      </div>
      <div className="mt-2">
        <span style={{ color: "rgb(var(--signal))" }}>&gt;&nbsp;</span>
        <span className="text-bone-mute">kozai.contact:~$ </span>
        <span className="kz-cursor">_</span>
      </div>
    </div>

    <button
      type="button"
      onClick={onContactClick}
      className="hover-target group inline-flex items-center justify-between border border-bone/15 bg-ink-rise/60 px-5 py-4 backdrop-blur"
    >
      <span className="flex items-center gap-3">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "rgb(var(--signal))" }}
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone">
          Open project intake
        </span>
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute group-hover:text-bone">
        return ↵
      </span>
    </button>

    <a
      href="mailto:hello@kozai.ca"
      className="hover-target font-mono text-[11px] uppercase tracking-[0.32em] text-bone/55 hover:text-bone"
    >
      or — direct mail · hello@kozai.ca
    </a>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">
      {label}
    </div>
    <div className="mt-1.5 text-sm text-bone/85">{value}</div>
  </div>
);

export default MobileScene;
