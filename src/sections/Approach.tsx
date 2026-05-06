import Reveal from "@/components/Reveal";

interface Step {
  n: string;
  title: string;
  body: string;
  signals: string[];
}

const STEPS: Step[] = [
  {
    n: "01",
    title: "Scope",
    body:
      "We start by understanding the actual problem — not the feature list. One or two short sessions with the people whose work the software will change. We leave with an opinion and a written proposal.",
    signals: ["Discovery sessions", "Written proposal", "Fixed scope"],
  },
  {
    n: "02",
    title: "Build",
    body:
      "Short cycles, weekly working software in your hands. No agency theatre — you talk directly to the engineer doing the work. Decisions are documented, code is reviewed, infrastructure is reproducible.",
    signals: ["Weekly demos", "Direct access", "Reproducible infra"],
  },
  {
    n: "03",
    title: "Hand-off",
    body:
      "We ship to your environment, train your team, and document everything a future engineer will need. We stay on retainer for as long as it's useful — and not a day longer.",
    signals: ["Owned by you", "Documented", "Optional retainer"],
  },
];

const Approach = () => {
  return (
    <section
      id="approach"
      className="relative bg-paper-2/60 px-6 py-32 md:px-10 md:py-40"
    >
      <div className="container-wide">
        <Reveal>
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-12">
            <div className="md:col-span-3">
              <div className="label">[ 02 — Approach ]</div>
            </div>
            <div className="md:col-span-9">
              <h2
                className="display max-w-[22ch] text-ink"
                style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
              >
                Three steps.
                <span className="text-mute"> No agency theatre.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-px bg-hairline/15 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 100}>
              <div className="flex h-full flex-col bg-paper-2/0 p-8 md:p-10">
                <div className="mb-8 flex items-baseline gap-4">
                  <span className="font-mono text-[12px] tracking-[0.18em] text-signal">
                    {step.n}
                  </span>
                  <span className="h-px flex-1 bg-hairline/15" />
                </div>
                <h3
                  className="display mb-5 text-ink"
                  style={{ fontSize: "clamp(1.75rem, 2.4vw, 2.25rem)" }}
                >
                  {step.title}
                </h3>
                <p className="mb-8 text-[16px] leading-[1.55] text-mute">
                  {step.body}
                </p>
                <ul className="mt-auto flex flex-col gap-2.5 border-t border-hairline/15 pt-6">
                  {step.signals.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mute"
                    >
                      <span aria-hidden className="h-px w-3 bg-mute/60" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Approach;
