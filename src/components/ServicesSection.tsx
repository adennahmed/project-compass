import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    n: "01",
    title: "Internal tools & dashboards",
    line: "Your ops team stops copy-pasting between spreadsheets.",
    body: "Custom admin panels, KPI dashboards, and operations consoles built on the data you already have. Replace four browser tabs with one screen your team actually wants to open.",
    deliverables: ["Admin consoles", "Reporting dashboards", "Internal CRMs", "Approval workflows"],
  },
  {
    n: "02",
    title: "Workflow automation",
    line: "The job that took an afternoon now runs while you sleep.",
    body: "Pipelines that connect the systems your business runs on — CRM, billing, support, fulfilment — and remove the human babysitting. Reliable, observable, and built to be debugged in plain English.",
    deliverables: ["ETL & data pipelines", "Cross-system sync", "Scheduled jobs", "Webhook orchestration"],
  },
  {
    n: "03",
    title: "Client-facing platforms",
    line: "From whiteboard to first paying user.",
    body: "Production-grade web apps for startups and product teams: auth, billing, multi-tenancy, the lot. We design for launch day and the messier days that follow.",
    deliverables: ["MVPs for founders", "Customer portals", "Marketplaces", "Embedded SaaS"],
  },
  {
    n: "04",
    title: "Data & decision support",
    line: "Stop arguing about what the number is.",
    body: "Single-source-of-truth pipelines that feed reporting, ML, and the C-suite alike. We build the warehouse, the models, and the dashboards your operators trust.",
    deliverables: ["Warehouses & marts", "BI dashboards", "Forecasting models", "Decision systems"],
  },
];

const ServiceVisual = ({ index }: { index: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(Math.max(container.clientWidth, 1), Math.max(container.clientHeight, 1), false);
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 10);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dl = new THREE.DirectionalLight(0xeae8e2, 0.6);
    dl.position.set(2, 3, 4);
    scene.add(dl);
    const sig = new THREE.PointLight(0xdaff00, 0.7, 10);
    sig.position.set(-2, 2, 2);
    scene.add(sig);

    let object: THREE.Object3D;
    if (index === 0) {
      // Stacked dashboard cards
      const group = new THREE.Group();
      for (let i = 0; i < 5; i++) {
        const w = 2.4 - i * 0.18;
        const h = 1.4 - i * 0.1;
        const geo = new THREE.PlaneGeometry(w, h);
        const mat = new THREE.MeshBasicMaterial({
          color: i === 0 ? 0xdaff00 : 0xeae8e2,
          transparent: true,
          opacity: i === 0 ? 0.85 : 0.08 + i * 0.04,
          side: THREE.DoubleSide,
        });
        const m = new THREE.Mesh(geo, mat);
        m.position.set(i * 0.05, -i * 0.08, -i * 0.18);
        m.userData.idle = i;
        group.add(m);
      }
      object = group;
    } else if (index === 1) {
      // Connected nodes — automation
      const group = new THREE.Group();
      const positions = [
        [-1.5, 0.85, 0],
        [0, 1.0, 0],
        [1.5, 0.55, 0],
        [-1.4, -0.7, 0],
        [0, -1.0, 0],
        [1.5, -0.7, 0],
      ];
      const nodes: THREE.Mesh[] = [];
      const nm = new THREE.MeshStandardMaterial({ color: 0xeae8e2, roughness: 0.3, metalness: 0.1 });
      positions.forEach((p) => {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), nm);
        s.position.set(p[0], p[1], p[2]);
        nodes.push(s);
        group.add(s);
      });
      const lineMat = new THREE.LineBasicMaterial({ color: 0xdaff00, transparent: true, opacity: 0.7 });
      const links = [
        [0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [1, 4], [2, 5],
      ];
      links.forEach(([a, b]) => {
        const g = new THREE.BufferGeometry().setFromPoints([nodes[a].position, nodes[b].position]);
        const l = new THREE.Line(g, lineMat);
        group.add(l);
      });
      object = group;
    } else if (index === 2) {
      // Layered glass slab — platform
      const group = new THREE.Group();
      for (let i = 0; i < 4; i++) {
        const geo = new THREE.BoxGeometry(2.6, 0.05, 1.7);
        const mat = new THREE.MeshPhysicalMaterial({
          color: i === 0 ? 0xdaff00 : 0xeae8e2,
          transmission: i === 0 ? 0.0 : 0.8,
          thickness: 0.3,
          roughness: 0.1,
          metalness: 0.0,
          opacity: i === 0 ? 1 : 0.6,
          transparent: true,
        });
        const m = new THREE.Mesh(geo, mat);
        m.position.y = -0.6 + i * 0.42;
        m.rotation.y = i * 0.06;
        group.add(m);
      }
      object = group;
    } else {
      // Bar/data sculpture
      const group = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ color: 0xeae8e2, roughness: 0.4, metalness: 0.1 });
      for (let i = 0; i < 10; i++) {
        const h = 0.3 + Math.random() * 1.4;
        const geo = new THREE.BoxGeometry(0.16, h, 0.16);
        const m = new THREE.Mesh(geo, i === 4 ? new THREE.MeshStandardMaterial({ color: 0xdaff00, roughness: 0.2 }) : mat);
        m.position.set((i - 4.5) * 0.22, h / 2 - 0.6, 0);
        m.userData.h = h;
        group.add(m);
      }
      object = group;
    }
    scene.add(object);

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      if (document.body.dataset.drawerOpen === "1") {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = (performance.now() - start) / 1000;
      object.rotation.y = Math.sin(t * 0.4) * 0.3;
      object.rotation.x = Math.sin(t * 0.2) * 0.12;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    if (!reduced) tick();
    else renderer.render(scene, camera);

    // ResizeObserver handles both initial sizing and any later reflows
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, [index]);

  return <div ref={ref} className="absolute inset-0" aria-hidden />;
};

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;
    const track = trackRef.current;
    const panels = track.querySelectorAll<HTMLElement>(".service-panel");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${panels.length * 80}%`,
          pin: true,
          scrub: 0.6,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) {
          gsap.set(panel, { autoAlpha: 1 });
        } else {
          gsap.set(panel, { autoAlpha: 0 });
        }
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        tl
          .to(panels[i - 1], { autoAlpha: 0, duration: 0.5 }, "+=0.4")
          .fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, "<")
          .call(() => {
            const indicator = sectionRef.current?.querySelector(".service-progress-fill") as HTMLElement;
            if (indicator) indicator.style.width = `${((i + 1) / panels.length) * 100}%`;
          });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full bg-ink"
      style={{ overflow: "clip", height: "100svh", minHeight: "620px" }}
      aria-label="What we build"
    >
      <div className="mx-auto flex h-full max-w-[1440px] flex-col px-6 pt-14 md:px-12 md:pt-16 lg:pt-20">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
              [ 03 ] — What we build
            </span>
            <h2
              className="display-headline mt-6 text-bone"
              style={{ fontSize: "clamp(2rem, 5vw, 4.6rem)" }}
            >
              Four shapes of work.
            </h2>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
              {String(1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
            </span>
            <div className="h-px w-[200px] overflow-hidden bg-bone/15">
              <div className="service-progress-fill h-full w-[25%] bg-signal transition-[width] duration-500" />
            </div>
          </div>
        </div>

        <div className="relative mt-6 grid min-h-0 flex-1 grid-cols-1 gap-8 md:mt-8 md:grid-cols-12 md:items-center md:gap-8">
          {/* Visual stage — locked to the left of the active description */}
          <div className="relative order-2 hidden min-h-0 md:order-1 md:col-span-5 md:flex md:h-[420px] md:items-center md:justify-end lg:col-span-6">
            <div
              className="relative shrink-0"
              style={{ width: "min(30vw, 360px)", height: "min(30vw, 360px)" }}
            >
              {services.map((_, i) => (
                <div key={i} className="service-visual absolute inset-0">
                  <ServiceVisual index={i} active={i} />
                </div>
              ))}
            </div>
          </div>

          {/* Content rows — stacked, only one visible at a time */}
          <div ref={trackRef} className="relative order-1 min-h-0 overflow-hidden md:order-2 md:col-span-7 md:h-[420px] lg:col-span-6">
            <div className="relative h-full pr-4 md:pr-0">
              {services.map((s) => (
                <div
                  key={s.n}
                  className="service-row absolute inset-0 flex flex-col justify-center overflow-y-auto pb-4"
                >
                  <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-signal">
                    {s.n}
                  </div>
                  <h3
                    className="display-headline mt-3 text-bone"
                    style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.2rem)", lineHeight: "1.05" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-[520px] text-base text-signal">
                    {s.line}
                  </p>
                  <p className="mt-2 max-w-[560px] text-sm leading-relaxed text-bone/65">
                    {s.body}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.deliverables.map((d) => (
                      <li
                        key={d}
                        className="border border-bone/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bone/70"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
