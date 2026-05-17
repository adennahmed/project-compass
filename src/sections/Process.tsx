import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

interface Station {
  n: string;
  name: string;
  body: string;
  glyph: React.ReactNode;
}

const STATIONS: Station[] = [
  {
    n: "01",
    name: "Discover",
    body: "Sit with the work. Watch how operators move.",
    glyph: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="4.2" />
        <path d="M10.1 10.1L13.5 13.5" />
        <circle cx="7" cy="7" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    n: "02",
    name: "Map",
    body: "Sketch the truth: the actual workflow, not the wishful one.",
    glyph: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="3" cy="8" r="1.6" />
        <circle cx="13" cy="4" r="1.6" />
        <circle cx="13" cy="12" r="1.6" />
        <path d="M4.5 7.4L11.5 4.6M4.5 8.6L11.5 11.4" />
      </svg>
    ),
  },
  {
    n: "03",
    name: "Prototype",
    body: "Build the smallest thing that proves the path.",
    glyph: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
        <rect x="2" y="5" width="10" height="7" />
        <rect x="4" y="3" width="10" height="7" />
      </svg>
    ),
  },
  {
    n: "04",
    name: "Build",
    body: "Production software. Boring fonts. Loud usefulness.",
    glyph: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
        <rect x="2" y="2" width="5" height="5" />
        <rect x="9" y="2" width="5" height="5" />
        <rect x="2" y="9" width="5" height="5" />
        <rect x="9" y="9" width="5" height="5" fill="currentColor" />
      </svg>
    ),
  },
  {
    n: "05",
    name: "Operate",
    body: "Stay involved. Software is a long conversation.",
    glyph: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 8 Q4 3, 7 8 T13 8 L15 8" />
      </svg>
    ),
  },
];

const Process = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // Progress = how far this section has scrolled past the bottom of viewport.
        // 0 when top of section reaches bottom of viewport, 1 when bottom reaches top.
        const total = rect.height + vh;
        const passed = vh - rect.top;
        const p = Math.max(0, Math.min(1, passed / total));
        setProgress(p);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  const n = STATIONS.length;
  // Map progress (0–1) into the station axis. We want the fill to roughly span
  // station 1 → station 5 over a generous middle band of the section.
  const eased = Math.max(0, Math.min(1, (progress - 0.18) / 0.6));

  return (
    <section
      id="process"
      data-snap
      ref={sectionRef}
      className="relative px-6 py-24 md:px-10 md:py-28"
    >
      <div className="container-wide">
        <Reveal>
          <div className="mb-16 grid grid-cols-1 gap-8 md:mb-20 md:grid-cols-12 md:items-end md:gap-12">
            <div className="md:col-span-3">
              <div className="label">[ ✦ — How we work ]</div>
            </div>
            <div className="md:col-span-9">
              <h2
                className="display max-w-[22ch] text-ink"
                style={{ fontSize: "clamp(2rem, 5.2vw, 4rem)" }}
              >
                Five stations.
                <span className="text-mute"> Same shape, every engagement.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Desktop: horizontal track */}
        <div className="relative hidden md:block">
          <div className="relative h-px w-full bg-ink/12">
            <div
              className="absolute left-0 top-0 h-px bg-signal"
              style={{
                width: `${eased * 100}%`,
                transition: "width 0.15s linear",
              }}
            />
          </div>
          <div className="absolute left-0 right-0 top-0 -translate-y-1/2">
            <ul className="grid grid-cols-5">
              {STATIONS.map((s, i) => {
                const stationProgress = i / (n - 1);
                const past = eased >= stationProgress - 0.001;
                const isActive =
                  eased >= stationProgress - 0.12 &&
                  eased < stationProgress + 0.12;
                return (
                  <li key={s.n} className="flex justify-center">
                    <span
                      className={`relative block h-[10px] w-[10px] rounded-full border transition-colors ${
                        past
                          ? "border-signal bg-signal"
                          : "border-ink/30 bg-paper"
                      }`}
                      style={
                        isActive
                          ? {
                              animation:
                                "kz-station-pulse 2.5s cubic-bezier(0.16,1,0.3,1) infinite",
                            }
                          : undefined
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </div>
          <ul className="grid grid-cols-5 pt-10">
            {STATIONS.map((s) => (
              <li key={s.n} className="px-3">
                <div className="mb-2 flex items-center gap-2 text-ink/70">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                    [{s.n}]
                  </span>
                  <span className="text-ink/60">{s.glyph}</span>
                </div>
                <h3
                  className="display text-ink"
                  style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.45rem)" }}
                >
                  {s.name}
                </h3>
                <p className="mt-2 max-w-[24ch] text-[13px] leading-[1.55] text-mute">
                  {s.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile: vertical track */}
        <div className="relative md:hidden">
          <div className="absolute left-[7px] top-0 h-full w-px bg-ink/12">
            <div
              className="absolute left-0 top-0 w-px bg-signal"
              style={{
                height: `${eased * 100}%`,
                transition: "height 0.15s linear",
              }}
            />
          </div>
          <ul className="flex flex-col gap-8 pl-7">
            {STATIONS.map((s, i) => {
              const stationProgress = i / (n - 1);
              const past = eased >= stationProgress - 0.001;
              return (
                <li key={s.n} className="relative">
                  <span
                    className={`absolute -left-[27px] top-1 block h-[10px] w-[10px] rounded-full border transition-colors ${
                      past ? "border-signal bg-signal" : "border-ink/30 bg-paper"
                    }`}
                  />
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                      [{s.n}]
                    </span>
                    <span className="text-ink/60">{s.glyph}</span>
                  </div>
                  <h3
                    className="display text-ink"
                    style={{ fontSize: "1.35rem" }}
                  >
                    {s.name}
                  </h3>
                  <p className="mt-1.5 max-w-[36ch] text-[13.5px] leading-[1.55] text-mute">
                    {s.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Process;
