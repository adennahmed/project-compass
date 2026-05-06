import CountUp from "@/components/CountUp";
import CharReveal from "@/components/CharReveal";
import Reveal from "@/components/Reveal";

interface Project {
  n: string;
  year: string;
  client: string;
  name: string;
  metric: { prefix: string; value: number; suffix: string; label: string };
  blurb: string;
  stack: string[];
  domain: string;
}

const PROJECTS: Project[] = [
  {
    n: "01",
    year: "2025",
    client: "Meridian Logistics",
    name: "Real-time fleet console",
    metric: { prefix: "−", value: 83, suffix: "%", label: "Incidents" },
    blurb:
      "A real-time fleet tracking dashboard that replaced four separate tools for dispatchers covering 220+ vehicles across three provinces.",
    stack: ["Next.js", "Postgres", "MapLibre", "WebSockets"],
    domain: "Logistics · Operations",
  },
  {
    n: "02",
    year: "2024",
    client: "Kindred Health",
    name: "Clinician charting suite",
    metric: { prefix: "−", value: 78, suffix: "%", label: "Charting time" },
    blurb:
      "Charting that lets clinicians finish notes before the patient leaves the room. Voice capture, structured templates, EHR integration.",
    stack: ["TypeScript", "tRPC", "Whisper", "FHIR"],
    domain: "Healthcare · Clinical",
  },
  {
    n: "03",
    year: "2024",
    client: "Tessera Capital",
    name: "Deal flow operating system",
    metric: { prefix: "+", value: 41, suffix: "%", label: "Reply rate" },
    blurb:
      "A bespoke CRM that knows what a partner means by 'follow up next week.' LLM-summarised threads, pipeline forecasting, calendar-aware reminders.",
    stack: ["Remix", "Prisma", "OpenAI", "Inngest"],
    domain: "Venture · Workflow",
  },
  {
    n: "04",
    year: "2025",
    client: "Lumen Studios",
    name: "Render pipeline & client portal",
    metric: { prefix: "−", value: 6, suffix: "d", label: "Per project" },
    blurb:
      "From file dropbox to a portal that knows what shot is in revision and why. Renders queued, reviewed, and approved without ever touching email.",
    stack: ["Astro", "Cloudflare", "S3", "ffmpeg"],
    domain: "Studio · Pipeline",
  },
];

const Work = () => {
  return (
    <section id="work" className="relative px-6 py-32 md:px-10 md:py-40">
      <div className="container-wide">
        <Reveal>
          <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-12">
            <div className="md:col-span-3">
              <div className="label">[ 03 — Selected work ]</div>
            </div>
            <div className="md:col-span-9">
              <h2
                className="display max-w-[26ch] text-ink"
                style={{ fontSize: "clamp(2rem, 5.2vw, 4rem)" }}
              >
                Recent shipments —
                <span className="text-mute"> with the numbers operators reported.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-32 md:gap-40">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.n} delay={50}>
              <article
                data-magnetic
                className="group relative grid grid-cols-12 gap-6 md:gap-10"
              >
                {/* Index column — fixed-width side label */}
                <div className="col-span-12 md:col-span-2">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                    <div className="text-ink">{p.n} / {String(PROJECTS.length).padStart(2, "0")}</div>
                    <div className="mt-1">{p.year}</div>
                  </div>
                </div>

                {/* Main */}
                <div className="col-span-12 md:col-span-7">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                    {p.client} · {p.domain}
                  </div>
                  <h3
                    className="display mt-3 max-w-[18ch] text-ink"
                    style={{ fontSize: "clamp(2rem, 5.4vw, 4.25rem)" }}
                  >
                    <CharReveal stagger={18} splitBy="word">
                      {p.name}
                    </CharReveal>
                  </h3>
                  <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.6] text-ink/75 md:text-[17px]">
                    {p.blurb}
                  </p>

                  {/* Stack tags — float in on scroll-in */}
                  <div className="mt-7 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="border border-hairline/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute transition-colors hover:border-ink hover:text-ink"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metric — supersize counter */}
                <div className="col-span-12 md:col-span-3">
                  <div className="border-l border-hairline/15 pl-6 md:pl-8">
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                      {p.metric.label}
                    </div>
                    <div
                      className="display mt-2 text-signal"
                      style={{
                        fontSize: "clamp(3rem, 6.5vw, 5.25rem)",
                        letterSpacing: "-0.05em",
                        lineHeight: "0.96",
                      }}
                    >
                      <CountUp
                        prefix={p.metric.prefix}
                        suffix={p.metric.suffix}
                        to={p.metric.value}
                        duration={1600}
                      />
                    </div>
                    <div className="mt-3 max-w-[20ch] text-[13px] leading-[1.5] text-mute">
                      reported by the operator team six months in.
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-24 max-w-[60ch] font-mono text-[12px] uppercase tracking-[0.18em] text-mute">
            More references on request — we're selective about what we publish.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Work;
