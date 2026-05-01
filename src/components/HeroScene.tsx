import { useEffect, useRef } from "react";
import * as THREE from "three";

interface HeroSceneProps {
  active: boolean;
}

const HeroScene = ({ active }: HeroSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const stateRef = useRef({
    mouse: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(0, 0),
    scroll: 0,
    spawnProgress: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x080809, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Lighting — warm key, cool fill, signal rim
    const ambient = new THREE.AmbientLight(0xffffff, 0.12);
    const key = new THREE.DirectionalLight(0xfff0d4, 1.1);
    key.position.set(5, 6, 4);
    const fill = new THREE.DirectionalLight(0xc8d4ff, 0.3);
    fill.position.set(-4, 3, -3);
    const rim = new THREE.PointLight(0xdaff00, 1.6, 16);
    rim.position.set(-3, -2, 4);
    const topGlow = new THREE.PointLight(0xeae8e2, 0.5, 20);
    topGlow.position.set(0, 5, 2);
    scene.add(ambient, key, fill, rim, topGlow);

    // Structural beams — arranged as a deconstructed lattice/frame
    const beams: THREE.Mesh[] = [];
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0xd8d4cc,
      roughness: 0.55,
      metalness: 0.08,
    });
    const signalMat = new THREE.MeshStandardMaterial({
      color: 0xdaff00,
      roughness: 0.3,
      metalness: 0.15,
      emissive: 0xdaff00,
      emissiveIntensity: 0.08,
    });

    const beamDefs = mobile ? [
      { len: 3.8, w: 0.055, pos: [-1.4, 1.2, -0.3], rot: [0, 0, 0.15], signal: false },
      { len: 2.6, w: 0.055, pos: [1.2, 0.8, 0.2], rot: [0, 0.3, -0.4], signal: false },
      { len: 3.2, w: 0.055, pos: [-0.6, -0.4, -0.8], rot: [0.2, 0, 0.7], signal: true },
      { len: 2.0, w: 0.055, pos: [1.8, -0.9, 0.1], rot: [0, 0, Math.PI / 2], signal: false },
      { len: 2.8, w: 0.04, pos: [0.3, -1.5, 0.5], rot: [0.1, 0.5, 0.2], signal: false },
    ] : [
      // Horizontal structural bars
      { len: 4.2, w: 0.055, pos: [-1.6, 1.4, -0.5], rot: [0, 0, 0.12], signal: false },
      { len: 3.4, w: 0.055, pos: [1.0, 1.0, 0.3], rot: [0, 0.2, -0.3], signal: false },
      // Cross beams
      { len: 3.6, w: 0.06, pos: [-0.8, -0.2, -0.6], rot: [0.15, 0, 0.65], signal: true },
      { len: 2.8, w: 0.05, pos: [1.6, -0.5, 0.4], rot: [0, 0.1, -0.55], signal: false },
      // Vertical posts
      { len: 2.2, w: 0.055, pos: [-2.2, 0, -0.2], rot: [0, 0, Math.PI / 2 + 0.1], signal: false },
      { len: 2.6, w: 0.055, pos: [2.4, 0.3, 0.1], rot: [0, 0.15, Math.PI / 2 - 0.08], signal: false },
      // Accent diagonals
      { len: 1.8, w: 0.04, pos: [0.2, -1.6, 0.6], rot: [0.1, 0.4, 0.3], signal: false },
      { len: 2.2, w: 0.04, pos: [-1.0, -1.2, 0.2], rot: [0, 0.2, -0.45], signal: true },
      // Deeper background struts
      { len: 3.0, w: 0.035, pos: [0, 0.6, -2.0], rot: [0.3, 0, 0.2], signal: false },
      { len: 2.4, w: 0.035, pos: [-0.5, -0.8, -1.8], rot: [0.2, 0.5, 0.6], signal: false },
    ];

    beamDefs.forEach((def, i) => {
      const geo = new THREE.BoxGeometry(def.len, def.w, def.w);
      const mesh = new THREE.Mesh(geo, def.signal ? signalMat : beamMat);
      mesh.position.set(def.pos[0], def.pos[1], def.pos[2]);
      mesh.rotation.set(def.rot[0], def.rot[1], def.rot[2]);

      // Start at zero length — will draw in along the beam axis
      mesh.scale.set(0.001, 1, 1);

      mesh.userData = {
        // Leading delay so the spawn animation lands AFTER the preloader peels
        spawnDelay: 1.0 + i * 0.18,
        spawnDone: false,
        floatAmp: 0.03 + Math.random() * 0.06,
        floatSpeed: 0.3 + Math.random() * 0.3,
        floatOffset: Math.random() * Math.PI * 2,
        basePos: mesh.position.clone(),
      };

      scene.add(mesh);
      beams.push(mesh);
    });

    // Central crystal — icosahedron for more facets and visual interest
    const crystalGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xeae8e2,
      transmission: 0.88,
      thickness: 0.8,
      roughness: 0.04,
      metalness: 0,
      ior: 1.45,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.2,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.scale.set(0, 0, 0);
    crystal.userData = { spawnDelay: 2.0, spawnDone: false };
    scene.add(crystal);

    // Wireframe accent on crystal
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xdaff00,
      transparent: true,
      opacity: 0.45,
    });
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(crystalGeo), wireMat);
    wire.scale.setScalar(1.002);
    crystal.add(wire);

    // Particle field — fine dust for depth
    const particleCount = mobile ? 220 : 600;
    const positions = new Float32Array(particleCount * 3);
    const opacities = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      opacities[i] = 0;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xeae8e2,
      size: 0.016,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // Input handlers
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
    // Spawn waits until activeRef flips true (preloader transition start)
    let spawnStart = 0;

    const tick = () => {
      // Pause rendering while the contact drawer is open
      if (document.body.dataset.drawerOpen === "1") {
        raf = requestAnimationFrame(tick);
        return;
      }
      const now = performance.now();
      const t = (now - start) / 1000;
      const st = stateRef.current;

      // Smooth mouse follow
      st.target.x += (st.mouse.x - st.target.x) * 0.04;
      st.target.y += (st.mouse.y - st.target.y) * 0.04;

      // Camera parallax + scroll dolly
      camera.position.x = st.target.x * 0.5;
      camera.position.y = st.target.y * 0.35;
      camera.position.z = 8 - st.scroll * 1.2;
      camera.lookAt(0, 0, 0);

      // Latch spawn start to the moment active flips true
      if (activeRef.current && spawnStart === 0) spawnStart = now;
      const elapsed = spawnStart > 0 ? (now - spawnStart) / 1000 : 0;

      // Beams — draw in along X-axis (length), slow enough to remain
      // animating after the preloader's shutters peel back (~1.2s in)
      beams.forEach((b) => {
        const ud = b.userData;
        const spawnT = Math.max(0, elapsed - ud.spawnDelay);
        if (spawnT > 0 && !ud.spawnDone) {
          const progress = Math.min(1, spawnT / 1.6);
          const eased = 1 - Math.pow(1 - progress, 4);
          b.scale.x = Math.max(0.001, eased);
          if (progress >= 1) ud.spawnDone = true;
        }
        // Gentle float
        if (ud.spawnDone || spawnT > 0.3) {
          const bp = ud.basePos as THREE.Vector3;
          b.position.y = bp.y + Math.sin(t * ud.floatSpeed + ud.floatOffset) * ud.floatAmp;
        }
      });

      // Crystal spawn — uniform scale-in with slight overshoot
      const cSpawn = Math.max(0, elapsed - crystal.userData.spawnDelay);
      if (cSpawn > 0 && !crystal.userData.spawnDone) {
        const progress = Math.min(1, cSpawn / 1.4);
        // Back-out: overshoot then settle
        const eased = progress < 0.7
          ? 1 - Math.pow(1 - progress / 0.7, 3)
          : 1 + Math.sin((progress - 0.7) / 0.3 * Math.PI) * 0.06 * (1 - (progress - 0.7) / 0.3);
        crystal.scale.setScalar(Math.max(0.001, eased));
        if (progress >= 1) crystal.userData.spawnDone = true;
      }
      crystal.rotation.x = t * 0.1 + st.target.y * 0.3;
      crystal.rotation.y = t * 0.15 + st.target.x * 0.3;

      // Particle fade-in — starts after preloader peels
      if (elapsed > 1.2) {
        const pFade = Math.min(1, (elapsed - 1.2) / 1.5);
        partMat.opacity = 0.45 * pFade;
      }
      particles.rotation.y = t * 0.008;

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
      signalMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Latch active so the spawn animation starts when the preloader peels.
  // Container snaps to opacity 1 — the preloader's shutters handle the reveal,
  // and the user sees the actual beam draw-in animation as they peel back.
  useEffect(() => {
    activeRef.current = active;
    const c = containerRef.current;
    if (!c) return;
    c.style.opacity = active ? "1" : "0";
    c.style.transition = "none";
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
