import CharReveal from "@/components/CharReveal";
import Reveal from "@/components/Reveal";

interface Triad {
  n: string;
  words: [string, string, string];
  body: string;
}

const TRIADS: Triad[] = [
  {
    n: "01",
    words: ["SCOPED.", "OPINIONATED.", "SHIPPED."],
    body:
      "We start by understanding the actual problem — not the feature list. Two short sessions and we leave with an opinion, a written proposal, and a timeline.",
  },
  {
    n: "02",
    words: ["ENGINEERS.", "NOT", "VENDORS."],
    body:
      "You talk directly to the engineer doing the work. Every call, every commit, every release. No project managers parsing what you said.",
  },
  {
    n: "03",
    words: ["BUILT.", "TO", "OWN."],
    body:
      "We ship to your environment, train your team, document everything. We stay on retainer for as long as it's useful — and not a day longer.",
  },
];

const Approach = () => {
  return (
    <section
      id="approach"
      data-snap
      className="section-fit relative bg-ink px-6 py-20 text-paper md:px-10 md:py-24"
    >
      <div className="container-wide w-full">
        <Reveal>
          <div className="mb-10 grid grid-cols-1 gap-6 md:mb-14 md:grid-cols-12 md:items-end md:gap-12">
            <div className="md:col-span-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50">
                [ 02 — Approach ]
              </div>
            </div>
            <div className="md:col-span-9">
              <p className="max-w-[36ch] text-[14px] uppercase tracking-[0.18em] text-paper/55">
                Three things we say to every prospective client. They are the entire engagement model.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col">
          {TRIADS.map((t, i) => (
            <article
              key={t.n}
              className={`grid grid-cols-1 gap-6 py-7 md:grid-cols-12 md:gap-12 md:py-9 ${
                i > 0 ? "border-t border-paper/10" : ""
              }`}
            >
              <div className="md:col-span-4">
                <Reveal delay={i * 60}>
                  <div className="mb-4 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.22em] text-paper/55">
                    {t.n}
                    <span aria-hidden className="h-px w-12 bg-paper/30" />
                  </div>
                  <p className="max-w-[40ch] text-[15px] leading-[1.55] text-paper/75 md:text-[16px]">
                    {t.body}
                  </p>
                </Reveal>
              </div>

              <div className="md:col-span-8">
                <h3
                  className="display text-paper"
                  style={{
                    fontSize: "clamp(2rem, 5.4vw, 4.75rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.045em",
                    lineHeight: "0.96",
                  }}
                >
                  {t.words.map((w, wi) => {
                    const isAccent =
                      (t.n === "02" && wi === 1) || (t.n === "03" && wi === 1);
                    return (
                      <span key={wi} className="mr-3 inline-block">
                        <CharReveal
                          stagger={22}
                          delay={wi * 130}
                          splitBy="char"
                          className={isAccent ? "italic-editorial text-signal" : ""}
                        >
                          {w}
                        </CharReveal>
                      </span>
                    );
                  })}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Approach;
