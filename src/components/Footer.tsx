import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import Logo from "./Logo";

const FooterArt = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const setSize = () => renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    setSize();

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const u = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: u,
      vertexShader: `void main(){gl_Position=vec4(position,1.0);}`,
      fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform vec2 uRes;
        void main(){
          vec2 uv=gl_FragCoord.xy/uRes;
          vec2 p=uv*2.0-1.0;
          p.x*=uRes.x/uRes.y;
          float a=atan(p.y,p.x);
          float r=length(p);
          float lines=sin(a*16.0+uTime*0.2)*0.5+0.5;
          lines*=smoothstep(1.4,0.0,r);
          vec3 col=mix(vec3(0.031),vec3(0.855,1.0,0.0)*0.18,lines);
          gl_FragColor=vec4(col,1.0);
        }
      `,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      u.uTime.value = (performance.now() - start) / 1000;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      setSize();
      u.uRes.value.set(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mat.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
};

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Studio", href: "#studio" },
  { label: "Contact", href: "#contact" },
];
const legalLinks = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-and-conditions" },
];

const Footer = () => {
  return (
    <footer className="relative isolate w-full overflow-hidden border-t border-bone/8 bg-ink">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <FooterArt />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-12 md:gap-8">
          <div className="col-span-2 md:col-span-5">
            <Logo variant="full" className="h-8 w-auto text-bone" />
            <p className="mt-6 max-w-[360px] text-sm leading-relaxed text-bone/55">
              A two-person software studio. We design and build the tools your team actually
              needs — then ship them.
            </p>
            <a
              href="mailto:hello@kozai.ca"
              className="mt-8 inline-flex items-baseline gap-3 text-2xl text-bone hover-target"
            >
              <span className="label-stack">
                <span>hello@kozai.ca</span>
                <span className="text-signal">hello@kozai.ca</span>
              </span>
            </a>
          </div>

          <div className="col-span-1 md:col-span-3 md:col-start-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">
              Sitemap
            </div>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a className="hover-target inline-flex text-bone/85" href={l.href}>
                    <span className="label-stack text-base">
                      <span>{l.label}</span>
                      <span className="text-signal">{l.label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">
              Studio
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-bone/85">
              <li>Toronto, ON · Canada</li>
              <li>Mon–Fri · 09–18 ET</li>
              <li>Available — Spring 2026</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-bone/8 pt-6 md:flex-row md:items-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-bone-mute">
            © 2026 Kozai · All rights reserved
          </div>
          <div className="flex gap-6">
            {legalLinks.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className="font-mono text-[11px] uppercase tracking-[0.24em] text-bone-mute hover:text-bone"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">
            Built in-house · No frameworks were harmed
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
