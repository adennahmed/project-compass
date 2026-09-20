import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import Logo from "@/components/Logo";

const OUTPUTS = [
  { n: "01", title: "Operational prototypes", body: "Detailed command surfaces for dispatch, deployment, revenue, inventory, and approval workflows." },
  { n: "02", title: "Community platform", body: "A complete member system with authentication, profiles, discussions, resources, moderation, and administration." },
  { n: "03", title: "Interface language", body: "A dark, technical design system built around clarity, motion, dense information, and operator confidence." },
  { n: "04", title: "A point of view", body: "The project established the ideas I still carry forward: explicit states, observable systems, and interfaces that explain themselves." },
];

const KozaiArchive = () => (
  <section id="kozai" data-snap className="relative px-6 py-24 md:px-10 md:py-32">
    <div className="container-wide">
      <Reveal>
        <div className="grid grid-cols-1 gap-8 border-b border-hairline/15 pb-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-4">
            <div className="label"><ScrambleText text="[ 03 — Archive · Kozai ]" /></div>
            <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-signal">2025—2026 · concluded</div>
          </div>
          <div className="md:col-span-8">
            <h2 className="display max-w-[16ch] text-ink" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>A studio experiment became a systems laboratory.</h2>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-10 pt-12 md:grid-cols-12 md:gap-12">
        <Reveal className="md:col-span-5">
          <div className="theme-invert flex min-h-[390px] flex-col justify-between overflow-hidden border border-hairline/15 bg-ink p-6 text-paper md:min-h-[520px] md:p-8">
            <div className="flex items-start justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-paper/45"><span>Archive object / K-001</span><span>Read only</span></div>
            <Logo variant="white" className="w-full" style={{ height: "auto", width: "100%" }} size={180} />
            <div>
              <p className="max-w-[38ch] text-[13px] leading-[1.65] text-paper/65">Kozai was an independent software-studio initiative I created to explore how operational systems could be designed, explained, and presented with more care.</p>
              <div className="mt-6 flex gap-2"><span className="border border-paper/15 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.15em] text-paper/45">Founder</span><span className="border border-paper/15 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.15em] text-paper/45">Product</span><span className="border border-paper/15 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.15em] text-paper/45">Engineering</span></div>
            </div>
          </div>
        </Reveal>

        <div className="md:col-span-7">
          <Reveal delay={100}>
            <p className="max-w-[60ch] text-[17px] leading-[1.75] text-ink/75 md:text-[19px]">
              The studio itself is no longer active. Its useful parts remain: a body of product explorations, a working community platform, a strong visual system, and a much sharper understanding of the software I want to build next.
            </p>
          </Reveal>
          <div className="mt-10 border-t border-hairline/15">
            {OUTPUTS.map((item, i) => (
              <Reveal key={item.n} delay={150 + i * 70}>
                <div className="group grid grid-cols-12 gap-3 border-b border-hairline/15 py-6 transition-colors hover:bg-paper-2/35">
                  <span className="col-span-2 font-mono text-[9px] text-signal">{item.n}</span>
                  <h3 className="col-span-10 text-[15px] text-ink md:col-span-4">{item.title}</h3>
                  <p className="col-span-10 col-start-3 text-[12px] leading-[1.6] text-mute md:col-span-6 md:col-start-auto md:text-[13px]">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default KozaiArchive;
