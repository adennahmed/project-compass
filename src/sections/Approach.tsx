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
      className="relative bg-paper-2/70 px-6 py-32 md:px-10 md:py-40"
    >
      <div className="container-wide">
        <Reveal>
          <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-12">
            <div className="md:col-span-3">
              <div className="label">[ 02 — Approach ]</div>
            </div>
            <div className="md:col-span-9">
              <p className="max-w-[36ch] text-[15px] uppercase tracking-[0.18em] text-mute">
                Three things we say to every prospective client. They are the entire engagement model.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col">
          {TRIADS.map((t, i) => (
            <article
              key={t.n}
              className={`grid grid-cols-1 gap-8 py-14 md:grid-cols-12 md:gap-12 md:py-20 ${
                i > 0 ? "border-t border-hairline/15" : ""
              }`}
            >
              {/* Left rail — number + body */}
              <div className="md:col-span-4">
                <Reveal delay={i * 60}>
                  <div className="mb-8 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.22em] text-mute">
                    {t.n}
                    <span aria-hidden className="h-px w-12 bg-ink/30" />
                  </div>
                  <p className="max-w-[40ch] text-[16px] leading-[1.6] text-ink/80">
                    {t.body}
                  </p>
                </Reveal>
              </div>

              {/* Right — the triad, monstrously large */}
              <div className="md:col-span-8">
                <h3
                  className="display text-ink"
                  style={{
                    fontSize: "clamp(2.25rem, 6.4vw, 5.75rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.045em",
                    lineHeight: "0.96",
                  }}
                >
                  {t.words.map((w, wi) => (
                    <span key={wi} className="mr-3 inline-block">
                      <CharReveal
                        stagger={22}
                        delay={wi * 130}
                        splitBy="char"
                        className={wi === 1 && t.n === "02" ? "italic-editorial text-mute" : ""}
                      >
                        {w}
                      </CharReveal>
                    </span>
                  ))}
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
