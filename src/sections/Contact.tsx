import CharReveal from "@/components/CharReveal";
import ScrambleText from "@/components/ScrambleText";
import Reveal from "@/components/Reveal";
import { useMagnetic } from "@/hooks/useMagnetic";

const Contact = () => {
  const mailRef = useMagnetic<HTMLAnchorElement>(0.35, 90);
  return (
    <section id="contact" data-snap className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="container-wide">
        <Reveal>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-8">
              <div className="label mb-10"><ScrambleText text="[ 06 — Contact ]" /></div>
              <h2 className="display max-w-[13ch] text-ink" style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", letterSpacing: "-0.05em" }}>
                <CharReveal stagger={19} splitBy="word">Let’s build the hard part clearly.</CharReveal>
              </h2>
              <p className="mt-9 max-w-[52ch] text-[17px] leading-[1.7] text-ink/72 md:text-[19px]">
                I am interested in thoughtful engineering problems, product-minded teams, and systems where the interface has to earn trust. If that sounds adjacent to what you are working on, I would be glad to hear about it.
              </p>
              <div className="mt-12 flex flex-wrap items-center gap-6">
                <a ref={mailRef} href="mailto:hello@kozai.ca?subject=Hello%20Aden" className="btn-slot bg-ink px-7 py-5 text-[14px] font-medium text-paper"><span className="btn-slot__label">Email Aden <span aria-hidden>↘</span></span><span className="btn-slot__label--hover bg-signal">Open a conversation <span aria-hidden>↘</span></span></a>
                <a href="https://www.linkedin.com/in/adenahmed/" target="_blank" rel="noreferrer" className="link-wipe text-[14px] text-mute hover:text-ink">LinkedIn ↗</a>
              </div>
            </div>

            <div className="md:col-span-4 md:self-end">
              <dl className="border-t border-hairline/15">
                {[
                  ["Based", "Toronto, Canada"],
                  ["Focus", "Systems + product"],
                  ["Working in", "TypeScript · Go · Rust · Python"],
                  ["Best way in", "A specific, interesting problem"],
                ].map(([label, value], i) => (
                  <div key={label} className="group border-b border-hairline/15 py-4">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.19em] text-mute group-hover:text-signal">0{i + 1} · {label}</dt>
                    <dd className="mt-2 text-[13px] leading-[1.5] text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
