import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The room engine. Owns the single Three.js scene that all six "rooms"
 * inhabit. The camera follows a Catmull-Rom spline through six panel
 * positions; vertical scroll progress drives the camera along the spline.
 *
 * Per brief §4.4 / §4.6:
 *   - One environment, six rooms, one camera dollying laterally
 *   - Trading-floor plane stretching into the distance
 *   - Sparse 3D-rendered "panels" — flat rectangles, one per room
 *   - Vertical scroll = horizontal camera position
 *
 * This component renders the *backbone*: the floor, the grid, the panel
 * placeholders, and the camera. Subsequent steps will render shader
 * content into each panel via the registry. For now panels are dark
 * empty rectangles that hold their place in the scene.
 */

export interface PanelSpec {
  id: string;
  x: number;        // X position along the trading floor
  y: number;        // Vertical lift above the plane
  z: number;        // Depth (mostly 0; some panels can sit deeper)
  width: number;
  height: number;
}

export const ROOM_PANELS: PanelSpec[] = [
  { id: "operations", x: 0,  y: 0.6, z: 0,    width: 4.4, height: 2.6 },
  { id: "approach",   x: 12, y: 0.6, z: 0,    width: 4.4, height: 2.6 },
  { id: "build",      x: 24, y: 0.6, z: 0,    width: 4.4, height: 2.6 },
  { id: "work",       x: 36, y: 0.6, z: 0,    width: 4.4, height: 2.6 },
  { id: "studio",     x: 48, y: 0.6, z: 0,    width: 4.4, height: 2.6 },
  { id: "contact",    x: 60, y: 0.6, z: 0,    width: 4.4, height: 2.6 },
];

interface SceneControllerProps {
  /** CSS selector of the pinned scroll trigger element. */
  pinSelector: string;
}

const SceneController = ({ pinSelector }: SceneControllerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- Renderer ----
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x06080f, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // ---- Scene + camera ----
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x06080f, 18, 90);

    const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.5, 200);

    // ---- Trading-floor plane ----
    const floorGeo = new THREE.PlaneGeometry(240, 80, 1, 1);
    const floorMat = new THREE.MeshBasicMaterial({ color: 0x0a0d16 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.4;
    scene.add(floor);

    // ---- Grid lines on the floor ----
    const gridGeo = new THREE.BufferGeometry();
    const gridLines: number[] = [];
    // Lines running in Z (parallel to the dolly direction)
    for (let z = -16; z <= 16; z += 2) {
      gridLines.push(-120, -1.39, z, 120, -1.39, z);
    }
    // Lines running in X (perpendicular to the dolly direction)
    for (let x = -120; x <= 120; x += 2) {
      gridLines.push(x, -1.39, -16, x, -1.39, 16);
    }
    gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(gridLines, 3));
    const gridMat = new THREE.LineBasicMaterial({ color: 0x1b2230, transparent: true, opacity: 0.45 });
    const grid = new THREE.LineSegments(gridGeo, gridMat);
    scene.add(grid);

    // ---- Placeholder panels ----
    // Each panel is a thin 3D rectangle floating above the floor. Subsequent
    // steps will replace the placeholder material with shader content per panel.
    const panelMeshes: THREE.Mesh[] = [];
    const panelEdges: THREE.LineSegments[] = [];
    ROOM_PANELS.forEach((p) => {
      const geo = new THREE.PlaneGeometry(p.width, p.height);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x0c111b,
        transparent: true,
        opacity: 0.94,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.x, p.y, p.z);
      mesh.userData = { id: p.id };
      scene.add(mesh);
      panelMeshes.push(mesh);

      // Crisp outline for each panel — the room's identity edge
      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x2a3142, transparent: true, opacity: 0.75 });
      const edges = new THREE.LineSegments(edgeGeo, edgeMat);
      edges.position.set(p.x, p.y, p.z);
      scene.add(edges);
      panelEdges.push(edges);
    });

    // ---- Light dust particles for atmosphere ----
    const particleCount = 350;
    const partPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Spread along the full X range, modest Y and Z variance
      partPositions[i * 3 + 0] = Math.random() * 80 - 10; // x: -10 to 70 (spans all panels + edges)
      partPositions[i * 3 + 1] = Math.random() * 4 - 1.0;
      partPositions[i * 3 + 2] = Math.random() * 14 - 7;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x7a7e8a,
      size: 0.02,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // ---- Camera spline — Catmull-Rom through panel positions ----
    // The camera sits a few units back in Z and slightly below the panels'
    // vertical centre, looking at each panel as it dollies past.
    const camPath = new THREE.CatmullRomCurve3(
      ROOM_PANELS.map((p) => new THREE.Vector3(p.x, 0.3, 6.6)),
      false,
      "catmullrom",
      0.1,
    );
    const lookPath = new THREE.CatmullRomCurve3(
      ROOM_PANELS.map((p) => new THREE.Vector3(p.x, 0.55, 0)),
      false,
      "catmullrom",
      0.1,
    );

    // Init at panel 0
    camera.position.copy(camPath.getPoint(0));
    camera.lookAt(lookPath.getPoint(0));

    // ---- ScrollTrigger drives spline progress ----
    let scrollTrigger: ScrollTrigger | null = null;
    const initScroll = () => {
      const trigger = document.querySelector(pinSelector);
      if (!trigger) {
        // DOM not yet mounted — try again next frame
        requestAnimationFrame(initScroll);
        return;
      }
      scrollTrigger = ScrollTrigger.create({
        trigger,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });
    };
    initScroll();

    // ---- Render loop ----
    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const t = progressRef.current;
      const camPos = camPath.getPoint(t);
      const lookPos = lookPath.getPoint(t);
      camera.position.copy(camPos);
      camera.lookAt(lookPos);

      // Drift the dust slightly so the scene breathes
      const elapsed = (performance.now() - start) / 1000;
      particles.position.y = Math.sin(elapsed * 0.18) * 0.06;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    if (!reduced) tick();
    else renderer.render(scene, camera);

    // ---- Resize ----
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      scrollTrigger?.kill();
      panelMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      panelEdges.forEach((e) => {
        e.geometry.dispose();
        (e.material as THREE.Material).dispose();
      });
      floorGeo.dispose();
      floorMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      partGeo.dispose();
      partMat.dispose();
      renderer.dispose();
    };
  }, [pinSelector]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 h-full w-full"
      aria-hidden
    />
  );
};

export default SceneController;
