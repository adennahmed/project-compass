import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  n: string;
  client: string;
  name: string;
  one: string;
  body: string;
  stack: string[];
  year: string;
  metric: string;
}

const projects: Project[] = [
  {
    n: "01",
    client: "Meridian Logistics",
    name: "Real-time fleet console",
    one: "A real-time fleet tracking dashboard that replaced four separate tools.",
    body: "We rebuilt Meridian's dispatch operations on a single Postgres-backed platform with live vehicle telemetry, exception alerts, and shift planning. Their dispatch team went from four browser tabs to one, and from twelve daily incidents to two.",
    stack: ["Postgres", "Next.js", "Mapbox", "TypeScript"],
    year: "2025",
    metric: "−83% incidents",
  },
  {
    n: "02",
    client: "Kindred Health",
    name: "Clinician charting suite",
    one: "Charting that lets clinicians finish notes before the patient leaves the room.",
    body: "An EHR companion built for a 40-clinician practice that turned a 14-minute charting flow into a 3-minute one. Voice capture, smart templates, and a queue that knows what's next.",
    stack: ["Rust", "SQLite", "Whisper", "React"],
    year: "2024",
    metric: "−78% charting time",
  },
  {
    n: "03",
    client: "Tessera Capital",
    name: "Deal flow operating system",
    one: "A bespoke CRM that knows what a partner means by 'follow up next week'.",
    body: "Replaced a sprawl of spreadsheets and a generic CRM with an opinionated deal-flow tool: each partner has a queue, every meeting writes back to the pipeline, and reporting falls out of the data instead of being assembled by hand.",
    stack: ["Postgres", "Remix", "Inngest", "Resend"],
    year: "2024",
    metric: "+41% reply rate",
  },
  {
    n: "04",
    client: "Lumen Studios",
    name: "Render pipeline & client portal",
    one: "From file dropbox to a portal that knows what shot is in revision and why.",
    body: "A production-tracking platform for an independent animation studio: brief intake, shot status, version comments, and an automated render queue that bills back to the project. Built so the studio's producer could ship a project without opening a single spreadsheet.",
    stack: ["Go", "Postgres", "S3", "Svelte"],
    year: "2025",
    metric: "−6 days / project",
  },
];

const ProjectMockup = ({ idx }: { idx: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const dl = new THREE.DirectionalLight(0xe9dfc9, 0.7);
    dl.position.set(2, 4, 5);
    scene.add(dl);
    const sig = new THREE.PointLight(0xc57346, 0.8, 12);
    sig.position.set(-3, 2, 2);
    scene.add(sig);

    const group = new THREE.Group();

    const slabMat = new THREE.MeshStandardMaterial({ color: 0x1e1a14, metalness: 0.7, roughness: 0.3 });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.4, 0.12), slabMat);
    group.add(slab);

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(3.62, 2.42, 0.10),
      new THREE.MeshStandardMaterial({ color: 0xe9dfc9, metalness: 0.4, roughness: 0.5 })
    );
    frame.position.z = -0.02;
    group.add(frame);

    const screenMat = new THREE.MeshBasicMaterial({ color: 0xe9dfc9, transparent: true, opacity: 0.06 });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.2), screenMat);
    screen.position.z = 0.07;
    group.add(screen);

    const uiGroup = new THREE.Group();
    uiGroup.position.z = 0.075;
    if (idx === 0) {
      for (let i = 0; i < 8; i++) {
        const h = 0.2 + Math.random() * 0.7;
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(0.15, h),
          new THREE.MeshBasicMaterial({ color: 0xe9dfc9, transparent: true, opacity: 0.28 })
        );
        m.position.set(-1.3 + i * 0.2, -0.55 + h / 2, 0);
        uiGroup.add(m);
      }
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.04), new THREE.MeshBasicMaterial({ color: 0xc57346 }));
      stripe.position.set(0, 0.55, 0);
      uiGroup.add(stripe);
    } else if (idx === 1) {
      for (let i = 0; i < 12; i++) {
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(2 + Math.random() * 0.8, 0.05),
          new THREE.MeshBasicMaterial({ color: 0xe9dfc9, transparent: true, opacity: 0.22 + Math.random() * 0.2 })
        );
        m.position.set(0, 0.85 - i * 0.13, 0);
        uiGroup.add(m);
      }
      const accent = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.04), new THREE.MeshBasicMaterial({ color: 0xc57346 }));
      accent.position.set(-0.7, 0.85, 0);
      uiGroup.add(accent);
    } else if (idx === 2) {
      for (let c = 0; c < 4; c++) {
        const col = new THREE.Mesh(
          new THREE.PlaneGeometry(0.7, 1.7),
          new THREE.MeshBasicMaterial({ color: 0xe9dfc9, transparent: true, opacity: 0.06 })
        );
        col.position.set(-1.2 + c * 0.8, 0, 0);
        uiGroup.add(col);
        for (let r = 0; r < 3; r++) {
          const card = new THREE.Mesh(
            new THREE.PlaneGeometry(0.6, 0.32),
            new THREE.MeshBasicMaterial({ color: r === 0 && c === 1 ? 0xc57346 : 0xe9dfc9, transparent: true, opacity: r === 0 && c === 1 ? 0.95 : 0.22 })
          );
          card.position.set(-1.2 + c * 0.8, 0.55 - r * 0.42, 0.001);
          uiGroup.add(card);
        }
      }
    } else {
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
          const tile = new THREE.Mesh(
            new THREE.PlaneGeometry(0.55, 0.45),
            new THREE.MeshBasicMaterial({ color: i === 2 && j === 1 ? 0xc57346 : 0xe9dfc9, transparent: true, opacity: i === 2 && j === 1 ? 0.95 : 0.16 })
          );
          tile.position.set(-1.4 + i * 0.62, 0.55 - j * 0.55, 0);
          uiGroup.add(tile);
        }
      }
    }
    group.add(uiGroup);
    group.rotation.set(-0.18, 0.32, 0);
    scene.add(group);

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      if (document.body.dataset.drawerOpen === "1") {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = (performance.now() - start) / 1000;
      group.rotation.y = 0.32 + Math.sin(t * 0.4) * 0.08;
      group.rotation.x = -0.18 + Math.sin(t * 0.3) * 0.04;
      group.position.y = Math.sin(t * 0.5) * 0.05;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    if (!reduced) tick();
    else renderer.render(scene, camera);

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [idx]);

  return <div ref={ref} className="absolute inset-0" />;
};

interface WorkSectionProps {
  onContactClick?: () => void;
}

const WorkSection = ({ onContactClick }: WorkSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;
    const track = trackRef.current;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 64),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth + 200}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.fromTo(
        ".work-header > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full overflow-hidden bg-ink"
      aria-label="Selected work"
    >
      <div className="px-6 pt-20 md:px-12 md:pt-24 lg:pt-32">
        <div className="work-header mx-auto flex max-w-[1440px] items-end justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
              [ 04 ] — Selected work
            </span>
            <h2
              className="display-headline mt-6 text-bone"
              style={{ fontSize: "clamp(2rem, 5vw, 4.6rem)" }}
            >
              Things we&rsquo;ve <span className="text-signal">shipped</span>.
            </h2>
          </div>
          <p className="hidden max-w-[360px] text-sm leading-relaxed text-bone/55 md:block">
            A selection of recent work, picked for what they say about how we operate. Scroll to explore.
          </p>
        </div>
      </div>

      <div className="relative mt-6 overflow-hidden md:mt-10">
        <div
          ref={trackRef}
          className="flex flex-nowrap gap-6 px-6 will-change-transform md:gap-10 md:px-12"
        >
          {projects.map((p, i) => (
            <article
              key={p.n}
              className="relative flex w-[88vw] shrink-0 flex-col border border-bone/10 bg-ink-rise/40 p-5 md:w-[58vw] md:max-w-[780px] md:p-8 lg:w-[48vw]"
              style={{ aspectRatio: "16/10" }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-signal">{p.n}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
                  {p.client} · {p.year}
                </span>
              </div>

              <div className="relative mt-6 flex-1 overflow-hidden border border-bone/8 bg-ink">
                <ProjectMockup idx={i} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/0 via-transparent to-ink/0" />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
                <div className="md:col-span-7">
                  <h3 className="text-2xl font-medium text-bone md:text-3xl" style={{ letterSpacing: "-0.02em" }}>
                    {p.name}
                  </h3>
                  <p className="mt-2 max-w-[480px] text-sm text-bone/70">{p.one}</p>
                </div>
                <div className="md:col-span-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Outcome</div>
                  <div className="mt-1 text-2xl font-medium text-signal" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {p.metric}
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <li
                        key={s}
                        className="border border-bone/12 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/60"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
          <div className="flex w-[40vw] shrink-0 items-center justify-start pr-12">
            <button
              type="button"
              onClick={onContactClick}
              className="group inline-flex items-center gap-3 text-bone hover-target"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
                Have a similar problem?
              </span>
              <span className="text-2xl">
                Bring it to us <span className="text-signal transition-transform duration-300 inline-block group-hover:translate-x-2">→</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
