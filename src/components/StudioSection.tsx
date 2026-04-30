import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import adenImg from "@/assets/aden-ahmed.png";
import mohammedImg from "@/assets/mohammed-khan.jpg";

gsap.registerPlugin(ScrollTrigger);

interface Member {
  name: string;
  role: string;
  src: string;
  bio: string;
  detail: string;
  initials: string;
}

const members: Member[] = [
  {
    name: "Aden Ahmed",
    role: "Founder · Engineering",
    src: adenImg,
    initials: "AA",
    bio: "Ten years building the kind of internal tools that operations teams quietly depend on. Comfortable from Postgres up to the React the dispatcher actually clicks.",
    detail: "Lives in the trade-off between elegance and shipping. Ships.",
  },
  {
    name: "Mohammed Khan",
    role: "Engineering · Systems",
    src: mohammedImg,
    initials: "MK",
    bio: "Distributed systems person who finds the weird race condition in production at 2am, fixes it, and writes the post-mortem before anyone notices. Patient with messy data.",
    detail: "Reads compiler papers for fun. Drinks too much green tea.",
  },
];

/**
 * Photo with a subtle shader effect — RGB split + grain on hover, controlled
 * via mouse proximity. Uses an Image + Three.js plane to keep alignment and
 * fall back gracefully on touch.
 */
const ShaderPortrait = ({ src, alt }: { src: string; alt: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const uniforms = {
      uTime: { value: 0 },
      uHover: { value: 0 },
      uTexture: { value: new THREE.Texture() },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
      uTexAspect: { value: 1 },
    };

    loader.load(src, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      uniforms.uTexture.value = tex;
      uniforms.uTexAspect.value = tex.image.width / tex.image.height;
    });

    const mat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform float uHover;
        uniform vec2 uMouse;
        uniform float uAspect;
        uniform float uTexAspect;

        // cover-fit
        vec2 cover(vec2 uv) {
          float r = uAspect / uTexAspect;
          vec2 scale = r > 1.0 ? vec2(1.0, 1.0 / r) : vec2(r, 1.0);
          vec2 off = (1.0 - scale) * 0.5;
          return uv * scale + off;
        }

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

        void main() {
          vec2 uv = cover(vUv);
          float d = distance(vUv, uMouse);
          float h = uHover * smoothstep(0.5, 0.05, d);
          float split = 0.005 + h * 0.018;
          float r = texture2D(uTexture, uv + vec2(split, 0.0)).r;
          float g = texture2D(uTexture, uv).g;
          float b = texture2D(uTexture, uv - vec2(split, 0.0)).b;
          float a = texture2D(uTexture, uv).a;
          vec3 col = vec3(r, g, b);

          // desaturate slightly + warm tint
          float lum = dot(col, vec3(0.299, 0.587, 0.114));
          col = mix(vec3(lum), col, 0.78);
          col *= mix(vec3(0.94, 0.92, 0.88), vec3(1.0), 0.6);

          // grain
          float n = hash(vUv * 800.0 + uTime * 0.3) - 0.5;
          col += n * 0.045;

          // subtle vignette
          float v = smoothstep(1.4, 0.4, length(vUv - 0.5));
          col *= v;

          gl_FragColor = vec4(col, a);
        }
      `,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);

    let raf = 0;
    let hover = 0;
    let target = 0;
    const start = performance.now();
    const tick = () => {
      hover += (target - hover) * 0.07;
      uniforms.uTime.value = (performance.now() - start) / 1000;
      uniforms.uHover.value = hover;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    if (!reduced) tick();
    else renderer.render(scene, camera);

    const onEnter = () => (target = 1);
    const onLeave = () => (target = 0);
    const onMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      uniforms.uMouse.value.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointerleave", onLeave);
    container.addEventListener("pointermove", onMove);

    const onResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      uniforms.uAspect.value = container.clientWidth / container.clientHeight;
    };
    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointerleave", onLeave);
      container.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mat.dispose();
      mesh.geometry.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, [src]);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-rise">
      <div ref={containerRef} className="absolute inset-0" aria-label={alt} />
    </div>
  );
};

const StudioSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".studio-meta",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="studio"
      className="relative w-full overflow-hidden bg-ink py-32 md:py-44"
      aria-label="The studio"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="studio-meta md:col-span-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
              [ 05 ] — Studio
            </span>
            <h2
              className="display-headline mt-6 text-bone"
              style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
            >
              Two engineers.<br />
              <span className="text-bone/55">Zero middlemen.</span>
            </h2>
            <p className="mt-8 max-w-[360px] text-sm leading-relaxed text-bone/65">
              Kozai is intentionally small. You get the people writing the code on every call,
              every commit, and every release. We pick projects we can ship at a level we&rsquo;d
              put our names on — because we have to.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Founded</div>
                <div className="mt-1 text-xl text-bone" style={{ fontVariantNumeric: "tabular-nums" }}>2022</div>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Location</div>
                <div className="mt-1 text-xl text-bone">Toronto, CA</div>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Headcount</div>
                <div className="mt-1 text-xl text-bone">02</div>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Languages</div>
                <div className="mt-1 text-xl text-bone">TS · Go · Rust · SQL</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {members.map((m) => (
                <article key={m.name} className="studio-meta group">
                  <ShaderPortrait src={m.src} alt={m.name} />
                  <div className="mt-6 flex items-baseline justify-between">
                    <h3 className="text-2xl font-medium text-bone" style={{ letterSpacing: "-0.02em" }}>
                      {m.name}
                    </h3>
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-signal">{m.initials}</span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.24em] text-bone-mute">
                    {m.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-bone/70">{m.bio}</p>
                  <p className="mt-3 text-sm italic leading-relaxed text-bone/45">{m.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioSection;
