import { useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import DecodeHeading from "@/components/DecodeHeading";
import ScrambleText from "@/components/ScrambleText";
import PathfinderLab from "@/components/playground/PathfinderLab";
import GravityLab from "@/components/playground/GravityLab";
import PacketRun from "@/components/playground/PacketRun";
import SignalLab from "@/components/playground/SignalLab";
import SwarmLab from "@/components/playground/SwarmLab";

const EXPERIMENTS = [
  {
    id: "pathfinder",
    number: "LAB-01",
    name: "Route / A*",
    kind: "Algorithm visualizer",
    description: "Draw a constrained map, move its endpoints, and watch a heuristic search resolve the optimal route in real time.",
    prompt: "Draw walls · move S/G · run search",
    stack: ["TypeScript", "A* search", "Graph traversal", "Animation queue"],
    component: PathfinderLab,
  },
  {
    id: "gravity",
    number: "LAB-02",
    name: "Orbital Field",
    kind: "Physics sandbox",
    description: "A live N-body gravity model. Introduce mass, tune the constant, and perturb a system whose bodies all influence one another.",
    prompt: "Click field · add mass · tune gravity",
    stack: ["Canvas", "N-body physics", "rAF loop", "Numerical integration"],
    component: GravityLab,
  },
  {
    id: "swarm",
    number: "LAB-03",
    name: "Swarm / Hash",
    kind: "Emergent systems field",
    description: "A flocking simulation accelerated with a spatial hash. Bend the field, add agents, and tune the local rules that create global motion.",
    prompt: "Move pointer · spawn agents · tune rules",
    stack: ["Canvas", "Spatial hashing", "Steering rules", "Real-time telemetry"],
    component: SwarmLab,
  },
  {
    id: "signal",
    number: "LAB-04",
    name: "Signal / 16",
    kind: "Audio sequencer",
    description: "A programmable drum-and-tone instrument with a look-ahead scheduler that keeps every trigger aligned to the browser audio clock.",
    prompt: "Toggle steps · press play · shape timing",
    stack: ["Web Audio", "Clock scheduler", "Signal synthesis", "State machine"],
    component: SignalLab,
  },
  {
    id: "packet-run",
    number: "LAB-05",
    name: "Packet Run",
    kind: "Arcade systems game",
    description: "Route a growing process through a hostile grid, collect packets, avoid firewalls, and keep the connection alive.",
    prompt: "Arrow keys / WASD · touch controls",
    stack: ["Game loop", "Collision model", "Local persistence", "Responsive input"],
    component: PacketRun,
  },
] as const;

const Playground = () => {
  const [active, setActive] = useState(0);
  const experiment = EXPERIMENTS[active];
  const ActiveExperiment = useMemo(() => experiment.component, [experiment.component]);

  return (
    <section id="playground" data-snap className="kz-playground relative overflow-hidden px-6 py-24 md:px-10 md:py-32">
      <div className="kz-playground-grid" aria-hidden />
      <div className="container-wide relative">
        <Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <div className="label mb-5"><ScrambleText text="[ 02 — Software playground ]" /></div>
              <h2 className="display max-w-[14ch] text-ink" style={{ fontSize: "clamp(2.6rem, 6.5vw, 5.8rem)" }}>
                <DecodeHeading text="Small systems." stagger={15} hover />{" "}
                <span className="text-signal"><DecodeHeading text="Fully alive." stagger={19} delay={130} hover /></span>
              </h2>
            </div>
            <div className="md:col-span-5 md:justify-self-end">
              <p className="max-w-[48ch] text-[15px] leading-[1.7] text-mute md:text-[16px]">
                A few after-hours builds for the joy of making software move. They are not mockups: every field, simulation, and game below is running locally in your browser.
              </p>
              <div className="mt-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-mute"><span className="h-1.5 w-1.5 animate-pulse bg-signal" />Five processes online · input enabled</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-14 md:mt-20">
          <div className="kz-playground-selector" role="tablist" aria-label="Software playground projects">
            {EXPERIMENTS.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="playground-live-project"
                  className={selected ? "is-active" : ""}
                  onClick={() => setActive(index)}
                >
                  <span className="kz-playground-selector__top"><i>{item.number}</i><b>{selected ? "RUNNING" : "READY"}</b></span>
                  <strong>{item.name}</strong>
                  <small>{item.kind}</small>
                  <span className="kz-playground-selector__edge" aria-hidden />
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={180} className="mt-4">
          <div id="playground-live-project" role="tabpanel" className="kz-playground-window">
            <header className="kz-playground-window__header">
              <div><span className="kz-window-mark">A/A</span><span>{experiment.number} / {experiment.name}</span></div>
              <div><span className="kz-window-live"><i />LOCAL PROCESS</span><span className="hidden sm:inline">NO INSTALLATION</span><span>↗</span></div>
            </header>

            <div className="kz-playground-window__intro">
              <div><span>{experiment.kind}</span><h3>{experiment.name}</h3></div>
              <p>{experiment.description}</p>
              <span>{experiment.prompt}</span>
            </div>

            <div key={experiment.id} className="kz-playground-runtime">
              <ActiveExperiment />
            </div>

            <footer className="kz-playground-window__footer">
              <div>{experiment.stack.map((item) => <span key={item}>{item}</span>)}</div>
              <span>Built as a real interaction—not a rendered demo.</span>
            </footer>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div className="kz-playground-note">
            <span>PLAY IS A TEST HARNESS.</span>
            <p>Small projects are where input models, state machines, algorithms, rendering loops, and edge cases can be made visible—and fun enough to keep testing.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Playground;
