import Reveal from "@/components/Reveal";
import DecodeHeading from "@/components/DecodeHeading";
import ScrambleText from "@/components/ScrambleText";
import adenImg from "@/assets/aden-ahmed.png";
import { PORTFOLIO_STACK } from "@/data/portfolio";

const SIGNALS = [
  ["01", "Systems", "I enjoy finding the model underneath a messy workflow: its states, constraints, ownership, and failure paths."],
  ["02", "Interfaces", "I care about the last metre between a complicated system and the person who has to trust it under pressure."],
  ["03", "Products", "I build end to end—framing the problem, shaping the interaction, engineering the system, and tightening the details."],
];

const AboutAden = () => (
  <section id="about" data-snap className="theme-invert relative overflow-hidden bg-ink px-6 py-24 text-paper md:px-10 md:py-32">
    <div className="container-wide">
      <Reveal>
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-paper/45">
          <ScrambleText text="[ 04 — About Aden ]" />
          <span className="hidden md:block">Toronto · Canada</span>
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-14">
        <Reveal className="md:col-span-5">
          <div className="relative overflow-hidden border border-paper/15">
            <img src={adenImg} alt="Aden Ahmed" className="aspect-[4/5] w-full object-cover object-[50%_30%] grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
              <div>
                <div className="display text-[30px] text-paper">Aden Ahmed</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/55">Software engineer · product builder</div>
              </div>
              <span className="font-mono text-[9px] text-signal">AA / 01</span>
            </div>
            <span className="absolute left-0 top-0 h-px w-full origin-left bg-signal" style={{ animation: "kz-scan-x 5s ease-in-out infinite" }} />
          </div>
        </Reveal>

        <div className="md:col-span-7">
          <Reveal delay={100}>
            <h2 className="display max-w-[15ch] text-paper" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.98 }}>
              <DecodeHeading text="I build the layer between" stagger={14} hover />{" "}
              <span className="text-signal"><DecodeHeading text="complexity" stagger={18} delay={180} hover /></span>{" "}
              <DecodeHeading text="and action." stagger={16} delay={320} hover />
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-8 max-w-[62ch] text-[16px] leading-[1.75] text-paper/70 md:text-[18px]">
              I am a Toronto-based software engineer interested in ambitious systems with practical edges: operations software, data-heavy products, trustworthy AI interfaces, and resilient tools for work that happens outside a perfect network connection. I like projects where architecture and interaction design have to agree with each other.
            </p>
          </Reveal>

          <div className="mt-12 border-t border-paper/12">
            {SIGNALS.map(([n, title, body], i) => (
              <Reveal key={title} delay={220 + i * 80}>
                <div className="group grid grid-cols-12 gap-4 border-b border-paper/12 py-5 transition-colors hover:bg-paper/5">
                  <div className="col-span-2 font-mono text-[9px] text-signal">{n}</div>
                  <div className="col-span-10 md:col-span-3"><h3 className="text-[15px] text-paper">{title}</h3></div>
                  <p className="col-span-10 col-start-3 text-[12px] leading-[1.6] text-paper/55 md:col-span-7 md:col-start-auto md:text-[13px]">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={420}>
            <div className="mt-9 flex flex-wrap gap-2">
              {PORTFOLIO_STACK.map((item) => <span key={item} className="border border-paper/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/55 transition-colors hover:border-signal hover:text-paper">{item}</span>)}
            </div>
            <a href="https://www.linkedin.com/in/adenahmed/" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper transition-colors hover:text-signal">LinkedIn profile <span aria-hidden>↗</span></a>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default AboutAden;
