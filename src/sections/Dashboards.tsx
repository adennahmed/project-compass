import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import DashboardSlider from "@/components/DashboardSlider";

/**
 * Dashboards — full-width band that showcases the (placeholder) product
 * surfaces in a coverflow carousel. Lives below the hero so the dashboards get
 * the whole horizontal stage.
 */
const Dashboards = () => {
  return (
    <section id="dashboards" data-snap className="relative px-6 py-20 md:px-10 md:py-28">
      <div className="container-wide">
        <Reveal>
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="label mb-4">
                <ScrambleText text="[ ✦ — What we make ]" />
              </div>
              <h2
                className="display max-w-[18ch] text-ink"
                style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}
              >
                Live software, not slideware.
              </h2>
            </div>
            <p className="max-w-[42ch] text-[15px] leading-[1.6] text-mute md:text-right md:text-[16px]">
              A sample of the operational surfaces we build — deploy consoles, revenue pipelines,
              fleet telemetry. Page through; every reading is moving.
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <DashboardSlider />
        </Reveal>
      </div>
    </section>
  );
};

export default Dashboards;
