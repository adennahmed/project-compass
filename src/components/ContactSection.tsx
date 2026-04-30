import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const FluidBackground = () => {
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
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}`,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;

        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 p){
          vec2 i=floor(p),f=fract(p);
          vec2 u=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
        }
        float fbm(vec2 p){float v=0.;float a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}

        void main(){
          vec2 uv=vUv;
          vec2 p=uv*2.0-1.0;
          p.x*=uResolution.x/uResolution.y;
          float t=uTime*0.06;
          float n=fbm(p*1.4+vec2(t,t*0.7));
          n=pow(n,1.4);
          float band=smoothstep(0.4,0.55,n)-smoothstep(0.6,0.75,n);
          vec3 ink=vec3(0.031,0.031,0.035);
          vec3 sig=vec3(0.855,1.0,0.0);
          vec3 col=mix(ink,sig*0.5+ink,band*0.18);
          // mouse glow
          float m=length(uv-uMouse);
          col+=sig*0.05*smoothstep(0.4,0.0,m);
          gl_FragColor=vec4(col,1.0);
        }
      `,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      uniforms.uMouse.value.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    canvas.addEventListener("pointermove", onMove);

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      uniforms.uTime.value = (performance.now() - start) / 1000;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      setSize();
      uniforms.uResolution.value.set(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onMove);
      mat.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
};

interface ContactSectionProps {
  onContactClick?: () => void;
}

const ContactSection = ({ onContactClick }: ContactSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-line .reveal-line > span",
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.05,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".contact-meta",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative isolate w-full overflow-hidden bg-ink py-32 md:py-48"
      aria-label="Contact"
    >
      <FluidBackground />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="contact-meta md:col-span-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
              [ 06 ] — Get in touch
            </span>
            <div className="mt-6 h-px w-[80px] bg-signal" />
            <p className="mt-6 max-w-[260px] text-sm leading-relaxed text-bone/65">
              Tell us what&rsquo;s broken. We&rsquo;ll tell you if we can fix it — and how, in plain English, by Friday.
            </p>
          </div>

          <div className="md:col-span-9">
            <h2
              className="contact-line display-headline text-bone"
              style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)", lineHeight: "0.95" }}
            >
              <span className="reveal-line block"><span>Have a project?</span></span>
              <span className="reveal-line block"><span><span className="text-signal">Let&rsquo;s</span> talk.</span></span>
            </h2>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="contact-meta md:col-span-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Email</div>
                <a
                  href="mailto:hello@kozai.ca"
                  className="group mt-2 inline-flex items-baseline gap-3 text-2xl text-bone hover-target md:text-3xl"
                  data-cursor-label="Mail"
                >
                  <span className="label-stack">
                    <span>hello@kozai.ca</span>
                    <span className="text-signal">hello@kozai.ca</span>
                  </span>
                  <span className="inline-block h-px w-12 bg-bone/40 transition-all duration-500 group-hover:w-20 group-hover:bg-signal" />
                </a>
                <button
                  type="button"
                  onClick={onContactClick}
                  className="group mt-10 inline-flex items-center gap-3 border border-bone/20 px-5 py-3 text-bone transition-colors duration-300 hover:border-signal hover-target"
                >
                  <span className="block h-1.5 w-1.5 rounded-full bg-signal" />
                  <span className="label-stack font-mono text-[11px] uppercase tracking-[0.24em]">
                    <span>Open project intake</span>
                    <span className="text-signal">Tell us about it</span>
                  </span>
                  <span className="inline-block h-px w-8 bg-bone/40 transition-all duration-300 group-hover:w-14 group-hover:bg-signal" />
                </button>
              </div>

              <div className="contact-meta md:col-span-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Studio</div>
                    <div className="mt-1.5 text-sm text-bone/85">Toronto, ON</div>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Hours</div>
                    <div className="mt-1.5 text-sm text-bone/85">Mon–Fri · 09–18 ET</div>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Slot</div>
                    <div className="mt-1.5 text-sm text-bone/85">One project · May 2026</div>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Reply</div>
                    <div className="mt-1.5 text-sm text-bone/85">Within 48 hours</div>
                  </div>
                </div>

                <div className="mt-12 border-t border-bone/10 pt-6">
                  <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-mute">Not for us</div>
                  <p className="mt-2 max-w-[420px] text-sm leading-relaxed text-bone/55">
                    Marketing sites, low-code rebuilds, generic CRM rollouts. We&rsquo;re built for harder problems —
                    if that&rsquo;s yours, we&rsquo;ll happily refer you to people who do this well.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
