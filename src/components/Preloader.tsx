import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";

interface PreloaderProps {
  onComplete: () => void;
  onTransitionStart: () => void;
}

const noiseShader = {
  vertex: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uProgress;
    uniform vec2 uResolution;

    // Hash + value noise — lightweight, GPU-friendly
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.02;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv;
      vec2 p = uv * 2.4;
      p.x *= uResolution.x / uResolution.y;

      float t = uTime * 0.08;
      float n = fbm(p + vec2(t, -t * 0.6));
      n = pow(n, 1.6);

      // Subtle radial vignette from the center
      vec2 c = uv - 0.5;
      c.x *= uResolution.x / uResolution.y;
      float r = length(c);
      float v = smoothstep(0.95, 0.18, r);

      // Energy band that scans with progress
      float band = smoothstep(0.018, 0.0, abs(uv.y - (0.05 + uProgress * 0.9)));
      vec3 ink = vec3(0.031, 0.031, 0.035);
      vec3 mid = mix(ink, vec3(0.085, 0.09, 0.10), n * v);
      vec3 col = mix(mid, vec3(0.855, 1.0, 0.0), band * 0.18);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

const Preloader = ({ onComplete, onTransitionStart }: PreloaderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pct, setPct] = useState(0);
  const pctRef = useRef({ value: 0 });

  // WebGL background — noise + scan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader: noiseShader.vertex,
      fragmentShader: noiseShader.fragment,
      uniforms,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      uniforms.uTime.value = (performance.now() - start) / 1000;
      uniforms.uProgress.value = pctRef.current.value / 100;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
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

  // Animation timeline — count up + reveal mark + scrub away
  useEffect(() => {
    document.documentElement.classList.add("is-loading");

    const ctx = gsap.context(() => {
      gsap.to(pctRef.current, {
        value: 100,
        duration: 2.6,
        ease: "power2.inOut",
        onUpdate: () => setPct(Math.round(pctRef.current.value)),
      });

      // Construct logo glyph by drawing strokes
      gsap.fromTo(
        ".kz-glyph__rect",
        { strokeDashoffset: 200 },
        { strokeDashoffset: 0, duration: 1.5, ease: "power3.out", delay: 0.25 }
      );
      gsap.fromTo(
        ".kz-glyph__line",
        { strokeDashoffset: 80 },
        { strokeDashoffset: 0, duration: 1.1, ease: "power3.out", delay: 0.85 }
      );
      gsap.fromTo(
        ".kz-glyph__dot",
        { scale: 0, transformOrigin: "20px 20px" },
        { scale: 1, duration: 0.5, ease: "back.out(2.4)", delay: 1.5 }
      );

      gsap.fromTo(
        ".kz-pre__line span",
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, ease: "power3.out", delay: 0.45, stagger: 0.05 }
      );

      gsap
        .timeline({
          delay: 2.85,
          onStart: onTransitionStart,
          onComplete: () => {
            document.documentElement.classList.remove("is-loading");
            onComplete();
          },
        })
        .to(".kz-pre__content", { opacity: 0, y: -12, duration: 0.6, ease: "power2.in" }, 0)
        .to(".kz-pre__shutter--top", { yPercent: -100, duration: 1.05, ease: "power4.inOut" }, 0.15)
        .to(".kz-pre__shutter--bottom", { yPercent: 100, duration: 1.05, ease: "power4.inOut" }, 0.15);
    }, rootRef);

    return () => {
      document.documentElement.classList.remove("is-loading");
      ctx.revert();
    };
  }, [onComplete, onTransitionStart]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[999999] overflow-hidden bg-ink">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Shutter panels that drop away */}
      <div className="kz-pre__shutter kz-pre__shutter--top absolute inset-x-0 top-0 z-10 h-1/2 bg-ink" />
      <div className="kz-pre__shutter kz-pre__shutter--bottom absolute inset-x-0 bottom-0 z-10 h-1/2 bg-ink" />

      {/* Foreground content */}
      <div className="kz-pre__content absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
        <svg
          width="80"
          height="80"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          className="text-bone"
        >
          <rect
            className="kz-glyph__rect"
            x="6"
            y="6"
            width="28"
            height="28"
            stroke="currentColor"
            strokeWidth="1.2"
            transform="rotate(45 20 20)"
            strokeDasharray="200"
            strokeDashoffset="200"
          />
          <line
            className="kz-glyph__line"
            x1="2"
            y1="20"
            x2="38"
            y2="20"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="80"
            strokeDashoffset="80"
          />
          <circle className="kz-glyph__dot" cx="20" cy="20" r="2.2" fill="currentColor" />
        </svg>

        <div className="mt-12 flex items-baseline gap-4">
          <span className="kz-pre__line inline-flex overflow-hidden font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
            <span>Kozai • building</span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute" style={{ fontVariantNumeric: "tabular-nums" }}>
            {String(pct).padStart(3, "0")}
          </span>
        </div>

        {/* Progress hairline */}
        <div className="mt-4 h-px w-[200px] overflow-hidden bg-bone/10">
          <div
            className="h-full bg-signal"
            style={{ width: `${pct}%`, transition: "width 0.12s linear" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
