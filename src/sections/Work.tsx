import Reveal from "@/components/Reveal";

interface Project {
  n: string;
  year: string;
  client: string;
  name: string;
  metric: string;
  blurb: string;
  stack: string[];
}

const PROJECTS: Project[] = [
  {
    n: "01",
    year: "2025",
    client: "Meridian Logistics",
    name: "Real-time fleet console",
    metric: "−83% incidents",
    blurb:
      "A real-time fleet tracking dashboard that replaced four separate tools for dispatchers covering 220+ vehicles across three provinces.",
    stack: ["Next.js", "Postgres", "MapLibre", "WebSockets"],
  },
  {
    n: "02",
    year: "2024",
    client: "Kindred Health",
    name: "Clinician charting suite",
    metric: "−78% charting time",
    blurb:
      "Charting that lets clinicians finish notes before the patient leaves the room. Voice capture, structured templates, EHR integration.",
    stack: ["TypeScript", "tRPC", "Whisper", "FHIR"],
  },
  {
    n: "03",
    year: "2024",
    client: "Tessera Capital",
    name: "Deal flow operating system",
    metric: "+41% reply rate",
    blurb:
      "A bespoke CRM that knows what a partner means by 'follow up next week.' LLM-summarised threads, pipeline forecasting, calendar-aware reminders.",
    stack: ["Remix", "Prisma", "OpenAI", "Inngest"],
  },
  {
    n: "04",
    year: "2025",
    client: "Lumen Studios",
    name: "Render pipeline & client portal",
    metric: "−6 days / project",
    blurb:
      "From file dropbox to a portal that knows what shot is in revision and why. Renders queued, reviewed, and approved without ever touching email.",
    stack: ["Astro", "Cloudflare", "S3", "ffmpeg"],
  },
];

const Work = () => {
  return (
    <section id="work" className="relative px-6 py-32 md:px-10 md:py-40">
      <div className="container-wide">
        <Reveal>
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-12">
            <div className="md:col-span-3">
              <div className="label">[ 03 — Selected work ]</div>
            </div>
            <div className="md:col-span-9">
              <h2
                className="display max-w-[22ch] text-ink"
                style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
              >
                Recent shipments.
                <span className="text-mute"> Numbers from the operators using them.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        <ul className="border-t border-hairline/15">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.n} delay={i * 60} as="li" className="block">
              <article className="group relative grid grid-cols-12 items-start gap-4 border-b border-hairline/15 py-8 transition-colors hover:bg-paper-2/40 md:gap-8 md:py-10">
                {/* Number + year */}
                <div className="col-span-3 flex flex-col gap-1 md:col-span-2">
                  <span className="font-mono text-[12px] tracking-[0.18em] text-mute">{p.n}</span>
                  <span className="font-mono text-[11px] tracking-[0.18em] text-mute/70">{p.year}</span>
                </div>

                {/* Client + project */}
                <div className="col-span-9 md:col-span-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                    {p.client}
                  </div>
                  <h3
                    className="display mt-2 text-ink transition-colors group-hover:text-signal"
                    style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.875rem)" }}
                  >
                    {p.name}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.55] text-mute md:hidden">
                    {p.blurb}
                  </p>
                </div>

                {/* Blurb (desktop) */}
                <div className="hidden md:col-span-3 md:block">
                  <p className="text-[14px] leading-[1.55] text-mute">{p.blurb}</p>
                </div>

                {/* Metric */}
                <div className="col-span-12 mt-4 flex items-center justify-between md:col-span-2 md:mt-0 md:flex-col md:items-end md:gap-3 md:text-right">
                  <span
                    className="display text-signal"
                    style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.4rem)", letterSpacing: "-0.02em" }}
                  >
                    {p.metric}
                  </span>
                  <div className="flex flex-wrap justify-end gap-1.5 md:max-w-[140px]">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="border border-hairline/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mute"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <p className="mt-12 max-w-[60ch] font-mono text-[12px] uppercase tracking-[0.18em] text-mute">
            More references on request — we're selective about what we publish.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Work;
