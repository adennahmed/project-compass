import Reveal from "@/components/Reveal";
import adenImg from "@/assets/aden-ahmed.png";
import muhammadImg from "@/assets/mohammed-khan.jpg";

interface Member {
  name: string;
  role: string;
  bio: string;
  detail: string;
  image: string;
  signature: string;
}

const MEMBERS: Member[] = [
  {
    name: "Aden Ahmed",
    role: "Principal Engineer & Founder",
    bio:
      "Builds the operational platforms mid-market and enterprise teams depend on. Background spans data infrastructure, distributed services, and the interfaces operators rely on every day.",
    detail:
      "Specialises in turning ambiguous requirements into systems that hold up under production load.",
    image: adenImg,
    signature: "AA — 2026",
  },
  {
    name: "Muhammad Khan",
    role: "Senior Systems Engineer",
    bio:
      "Distributed systems and reliability engineering. Deep experience with high-availability architectures, observability, and the edge cases that determine whether a system can be trusted under load.",
    detail:
      "Focuses on resilience engineering — building systems that fail gracefully and recover predictably.",
    image: muhammadImg,
    signature: "MK — 2026",
  },
];

const Studio = () => {
  return (
    <section
      id="studio"
      className="relative bg-paper-2/70 px-6 py-32 md:px-10 md:py-40"
    >
      <div className="container-wide">
        <Reveal>
          <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-12">
            <div className="md:col-span-3">
              <div className="label">[ 04 — Studio ]</div>
            </div>
            <div className="md:col-span-9">
              <h2
                className="display max-w-[26ch] text-ink"
                style={{ fontSize: "clamp(2rem, 5.2vw, 4rem)" }}
              >
                The work — not a sales pitch.
                <span className="text-mute"> You talk to the engineers building it.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {MEMBERS.map((m, i) => (
            <Reveal key={m.name} delay={i * 100}>
              <article data-magnetic className="group flex flex-col gap-6">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-3">
                  {/* Image — desaturated by default, restores to color on hover */}
                  <img
                    src={m.image}
                    alt={`${m.name} — ${m.role}`}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out"
                    style={{
                      filter: "grayscale(100%) contrast(1.05)",
                    }}
                    loading="lazy"
                  />
                  <img
                    src={m.image}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
                    loading="lazy"
                  />
                  {/* Frame corner notation */}
                  <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper mix-blend-difference">
                    {`0${i + 1}`}
                  </div>
                  <div className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper mix-blend-difference">
                    Toronto, CA
                  </div>
                  <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper mix-blend-difference">
                    {m.signature}
                  </div>
                </div>
                <div>
                  <h3
                    className="display text-ink"
                    style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)" }}
                  >
                    {m.name}
                  </h3>
                  <div className="mt-1.5 font-mono text-[12px] uppercase tracking-[0.22em] text-mute">
                    {m.role}
                  </div>
                  <p className="mt-5 max-w-[44ch] text-[16px] leading-[1.55] text-ink/75">{m.bio}</p>
                  <p className="mt-4 max-w-[44ch] text-[15px] italic-editorial leading-[1.55] text-ink/55">
                    {m.detail}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Selection — what we say yes/no to */}
        <Reveal>
          <div className="mt-28 grid grid-cols-1 gap-8 border-t border-hairline/15 pt-12 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-3">
              <div className="label">Selection</div>
            </div>
            <div className="md:col-span-9">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                    We accept
                  </div>
                  <ul className="mt-5 flex flex-col gap-3">
                    {[
                      "Operational software",
                      "Internal platforms",
                      "Long-horizon systems",
                      "Data infrastructure",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-[15px] text-ink"
                      >
                        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                    We decline
                  </div>
                  <ul className="mt-5 flex flex-col gap-3">
                    {["Marketing sites", "Low-code rebuilds", "CRM rollouts", "AI demo wrappers"].map(
                      (item) => (
                        <li
                          key={item}
                          className="flex items-center gap-3 text-[15px] text-mute line-through decoration-mute/40"
                        >
                          <span
                            aria-hidden
                            className="inline-block h-1.5 w-1.5 rounded-full bg-mute/40"
                          />
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Studio;
