import Reveal from "@/components/Reveal";

interface Service {
  n: string;
  title: string;
  blurb: string;
  meta: string;
}

const SERVICES: Service[] = [
  {
    n: "01",
    title: "Internal tools & dashboards",
    blurb:
      "Custom admin panels, KPI dashboards, and operations consoles built on the data you already have. Replace four browser tabs with one screen your team actually wants to open.",
    meta: "Ops · Admin · Reporting",
  },
  {
    n: "02",
    title: "Workflow automation",
    blurb:
      "Pipelines that connect the systems your business runs on — CRM, billing, support, fulfilment. Reliable, observable, debuggable in plain English.",
    meta: "Glue · Pipelines · Jobs",
  },
  {
    n: "03",
    title: "Client-facing platforms",
    blurb:
      "Production-grade web apps for startups and product teams: auth, billing, multi-tenancy, the lot. Designed for launch day and the messier days that follow.",
    meta: "SaaS · Web · Mobile",
  },
  {
    n: "04",
    title: "Data & decision support",
    blurb:
      "Single-source-of-truth pipelines that feed reporting, ML, and the C-suite alike. We build the warehouse, the models, and the dashboards your operators trust.",
    meta: "Warehouse · ML · Insights",
  },
];

const Services = () => {
  return (
    <section id="services" className="relative px-6 py-32 md:px-10 md:py-40">
      <div className="container-wide">
        <Reveal>
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-12">
            <div className="md:col-span-3">
              <div className="label">[ 01 — Services ]</div>
            </div>
            <div className="md:col-span-9">
              <h2
                className="display max-w-[20ch] text-ink"
                style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
              >
                Four kinds of work.
                <span className="text-mute"> We don't take on the rest.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="hairline mb-px h-px w-full" />

        <div className="grid grid-cols-1 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <article
                className={`group relative flex h-full flex-col gap-5 px-1 py-10 md:px-8 md:py-14 ${
                  i % 2 === 0 ? "" : "md:border-l md:border-hairline/15"
                } ${i < 2 ? "border-b border-hairline/15" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[12px] tracking-[0.18em] text-mute">{s.n}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute opacity-60 transition-opacity group-hover:opacity-100">
                    {s.meta}
                  </span>
                </div>
                <h3
                  className="display text-ink transition-colors group-hover:text-signal"
                  style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)" }}
                >
                  {s.title}
                </h3>
                <p className="max-w-[44ch] text-[16px] leading-[1.55] text-mute">
                  {s.blurb}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
