import { useEffect, useRef } from "react";
import * as THREE from "three";

interface HeroSceneProps {
  active: boolean;
}

/**
 * Architectural fragments scene — floating beams + a refractive central
 * crystal that responds to mouse movement and scroll. The composition is
 * intentionally sparse: 7 timber-like beams orbiting a central glass core.
 */
const HeroScene = ({ active }: HeroSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const stateRef = useRef({
    mouse: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(0, 0),
    scroll: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x080809, 0);
    container.appendChild(renderer.domElement);

    // Lighting — moody key + signal rim
    const ambient = new THREE.AmbientLight(0xffffff, 0.18);
    const key = new THREE.DirectionalLight(0xfff7e0, 0.9);
    key.position.set(4, 5, 4);
    const rim = new THREE.PointLight(0xdaff00, 1.2, 18);
    rim.position.set(-3, -1, 3);
    const fill = new THREE.PointLight(0xeae8e2, 0.4, 22);
    fill.position.set(0, 4, -2);
    scene.add(ambient, key, rim, fill);

    // Beams — long thin boxes with bone-coloured matte material
    const beams: THREE.Mesh[] = [];
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0xeae8e2,
      roughness: 0.45,
      metalness: 0.05,
      flatShading: true,
    });
    const beamCount = mobile ? 5 : 8;
    for (let i = 0; i < beamCount; i++) {
      const len = 2.6 + Math.random() * 2.2;
      const w = 0.06 + Math.random() * 0.06;
      const geo = new THREE.BoxGeometry(len, w, w);
      const mesh = new THREE.Mesh(geo, beamMat);
      const angle = (i / beamCount) * Math.PI * 2;
      const radius = 2.4 + Math.random() * 0.9;
      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2.4,
        (Math.random() - 0.5) * 2.6
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      mesh.userData.spin = {
        x: (Math.random() - 0.5) * 0.0025,
        y: (Math.random() - 0.5) * 0.0025,
        z: (Math.random() - 0.5) * 0.0025,
      };
      mesh.userData.float = {
        amp: 0.05 + Math.random() * 0.12,
        speed: 0.4 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        baseY: mesh.position.y,
      };
      scene.add(mesh);
      beams.push(mesh);
    }

    // Central refractive crystal — octahedron with translucent material
    const crystalGeo = new THREE.OctahedronGeometry(0.95, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xeae8e2,
      transmission: 0.85,
      thickness: 0.6,
      roughness: 0.06,
      metalness: 0,
      ior: 1.35,
      transparent: true,
      opacity: 0.92,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    scene.add(crystal);

    // Crystal wireframe overlay — emphasises construction language
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xdaff00,
      transparent: true,
      opacity: 0.55,
    });
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(crystalGeo), wireMat);
    wire.scale.setScalar(1.001);
    crystal.add(wire);

    // Particle field — depth haze
    const particleCount = mobile ? 280 : 700;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xeae8e2,
      size: 0.018,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // Pointer + scroll handlers
    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      stateRef.current.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      stateRef.current.mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onScroll = () => {
      stateRef.current.scroll = window.scrollY / Math.max(window.innerHeight, 1);
    };
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000;

      // Smooth mouse follow
      stateRef.current.target.x += (stateRef.current.mouse.x - stateRef.current.target.x) * 0.05;
      stateRef.current.target.y += (stateRef.current.mouse.y - stateRef.current.target.y) * 0.05;

      // Camera parallax + scroll dolly
      camera.position.x = stateRef.current.target.x * 0.6;
      camera.position.y = stateRef.current.target.y * 0.4;
      camera.position.z = 8 - stateRef.current.scroll * 1.2;
      camera.lookAt(0, 0, 0);

      // Beams orbit + float
      beams.forEach((b, i) => {
        const s = b.userData.spin;
        const f = b.userData.float;
        b.rotation.x += s.x;
        b.rotation.y += s.y;
        b.rotation.z += s.z;
        b.position.y = f.baseY + Math.sin(t * f.speed + f.offset) * f.amp;
        // group orbit
        const angle = (i / beams.length) * Math.PI * 2 + t * 0.04;
        const radius = 2.4 + Math.sin(t * 0.3 + i) * 0.18;
        b.position.x = Math.cos(angle) * radius;
        b.position.z = Math.sin(angle) * radius;
      });

      // Crystal — gentle rotation + reactive scale
      crystal.rotation.x = t * 0.12 + stateRef.current.target.y * 0.4;
      crystal.rotation.y = t * 0.18 + stateRef.current.target.x * 0.4;
      crystal.scale.setScalar(1 + Math.sin(t * 0.6) * 0.04);

      // Particles drift
      particles.rotation.y = t * 0.01;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    if (!reduced) tick();
    else renderer.render(scene, camera);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      beams.forEach((b) => b.geometry.dispose());
      crystalGeo.dispose();
      crystalMat.dispose();
      wireMat.dispose();
      partGeo.dispose();
      partMat.dispose();
      beamMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Fade in once preloader hands off
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    c.style.opacity = active ? "1" : "0";
    c.style.transition = "opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
  }, [active]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10"
      style={{ opacity: 0 }}
      aria-hidden
    />
  );
};

export default HeroScene;
