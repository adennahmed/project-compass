import Reveal from "@/components/Reveal";

interface ContactProps {
  onContactClick: () => void;
}

const Contact = ({ onContactClick }: ContactProps) => {
  return (
    <section id="contact" className="relative px-6 py-32 md:px-10 md:py-40">
      <div className="container-wide">
        <Reveal>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            {/* Left: invitation */}
            <div className="md:col-span-7">
              <div className="label mb-8">[ 05 — Contact ]</div>
              <h2
                className="display max-w-[16ch] text-ink"
                style={{ fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)", letterSpacing: "-0.04em" }}
              >
                Tell us what you're trying to build.
              </h2>
              <p className="mt-8 max-w-[48ch] text-[17px] leading-[1.55] text-mute md:text-[18px]">
                A short note is enough — what the team does, what's getting in the way, what
                "shipped" would look like. We reply within 48 hours, every time.
              </p>

              <div className="mt-12 flex flex-col items-start gap-5">
                <button
                  type="button"
                  onClick={onContactClick}
                  className="group inline-flex items-center gap-3 bg-ink px-7 py-5 text-[15px] font-medium text-paper transition-all hover:bg-signal"
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

            {/* Right: studio metadata */}
            <div className="md:col-span-5">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-10 border-l border-hairline/15 pl-8 md:pl-10">
                {[
                  ["Reply", "within 48 h"],
                  ["Hours", "mon–fri · 09–18 ET"],
                  ["Studio", "toronto, ca · remote"],
                  ["Year", "est. 2026"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                      {label}
                    </dt>
                    <dd className="mt-2 text-[15px] text-ink">{value}</dd>
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
