import Reveal from "@/components/Reveal";

interface HeroProps {
  onContactClick: () => void;
}

const Hero = ({ onContactClick }: HeroProps) => {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center px-6 pt-32 pb-20 md:px-10 md:pt-40 md:pb-32"
    >
      <div className="container-wide">
        {/* Eyebrow */}
        <Reveal immediate delay={100}>
          <div className="label flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
            Software studio · Toronto · est. 2026
          </div>
        </Reveal>

        {/* Hero headline */}
        <Reveal immediate delay={250}>
          <h1
            className="display mt-7 max-w-[18ch] text-ink"
            style={{
              fontSize: "clamp(2.75rem, 7.5vw, 6.75rem)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: "0.96",
            }}
          >
            We build the tools serious teams actually depend on.
          </h1>
        </Reveal>

        {/* Hairline */}
        <Reveal immediate delay={500}>
          <div className="mt-12 h-px w-full origin-left">
            <div className="draw-hairline h-px w-full bg-ink/20" />
          </div>
        </Reveal>

        {/* Sub + CTA row */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12">
          <Reveal immediate delay={650} className="md:col-span-7">
            <p className="max-w-[52ch] text-[18px] leading-[1.55] text-mute md:text-[19px]">
              Kozai is a small software studio designing and building the internal tools,
              dashboards, and platforms that operations teams use every day. We don't sell
              software — we solve the problem behind the problem.
            </p>
          </Reveal>

          <Reveal immediate delay={800} className="md:col-span-5">
            <div className="flex flex-col items-start gap-4 md:items-end md:text-right">
              <button
                type="button"
                onClick={onContactClick}
                className="group inline-flex items-center gap-3 bg-ink px-6 py-4 text-[14px] font-medium text-paper transition-all hover:bg-signal"
              >
                <span>Start a project</span>
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">↘</span>
              </button>
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-[13px] font-medium text-mute underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                or — see what we've shipped
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Hero;
