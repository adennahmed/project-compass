import CharReveal from "@/components/CharReveal";
import Reveal from "@/components/Reveal";

interface ContactProps {
  onContactClick: () => void;
}

const Contact = ({ onContactClick }: ContactProps) => {
  return (
    <section id="contact" data-snap className="section-fit relative px-6 py-24 md:px-10 md:py-28">
      <div className="container-wide">
        <Reveal>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-7">
              <div className="label mb-10">[ 05 — Contact ]</div>
              <h2
                className="display max-w-[14ch] text-ink"
                style={{ fontSize: "clamp(2.6rem, 7vw, 6rem)", letterSpacing: "-0.045em" }}
              >
                <CharReveal stagger={20} splitBy="word">
                  Tell us what you're trying to build.
                </CharReveal>
              </h2>
              <p className="mt-9 max-w-[48ch] text-[17px] leading-[1.55] text-ink/75 md:text-[18px]">
                A short note is enough — what the team does, what's getting in the way, what
                "shipped" would look like. We reply within 48 hours, every time.
              </p>

              <div className="mt-12 flex flex-col items-start gap-5">
                <button

                  type="button"
                  onClick={onContactClick}
                  className="group inline-flex items-center gap-3 bg-ink px-7 py-5 text-[15px] font-medium text-paper transition-colors hover:bg-signal"
                >
                  <span>Open project intake</span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">↘</span>
                </button>
                <a

                  href="mailto:hello@kozai.ca"
                  className="text-[14px] font-medium text-mute underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  or — direct mail · hello@kozai.ca
                </a>
              </div>
            </div>

            <div className="md:col-span-5">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-10 border-l border-hairline/20 pl-8 md:pl-12">
                {[
                  ["Reply", "within 48 h"],
                  ["Hours", "mon–fri · 09–18 ET"],
                  ["Studio", "toronto, ca"],
                  ["Year", "est. 2025"],
                  ["Cycle", "weekly demos"],
                  ["Approach", "right tool, every time"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                      {label}
                    </dt>
                    <dd className="mt-2 text-[15px] text-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              {/* Capabilities — broader breadth than a 4-language list.
                  Successful studios sell capability surface, not language picks. */}
              <div className="mt-10 border-l border-hairline/20 pl-8 md:pl-12">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                  Capabilities
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {[
                    "Web platforms",
                    "Mobile",
                    "Backend services",
                    "Data infra",
                    "Cloud + DevOps",
                    "Realtime",
                    "ML integration",
                    "Embedded",
                  ].map((c) => (
                    <span
                      key={c}
                      className="border border-hairline/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/85 transition-colors hover:border-ink hover:text-ink"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p className="mt-4 max-w-[36ch] text-[13px] leading-[1.55] text-mute">
                  We're not married to a stack — every project lands on the right tools, chosen against the problem.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
