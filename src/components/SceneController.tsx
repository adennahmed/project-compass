import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BUILD_PANEL_SHADERS,
  PANEL_VERTEX_SHADER,
} from "./rooms/buildShaders";
import { WORK_PANEL_SHADERS } from "./rooms/workShaders";

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

    // ---- Placeholder panels for non-build rooms ----
    // The build room (id "build") gets its own 4-panel shader wall instead;
    // its main panel slot is skipped in this loop.
    const panelMeshes: THREE.Mesh[] = [];
    const panelEdges: THREE.LineSegments[] = [];
    ROOM_PANELS.forEach((p) => {
      if (p.id === "build" || p.id === "work") return; // handled below
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

      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x2a3142, transparent: true, opacity: 0.75 });
      const edges = new THREE.LineSegments(edgeGeo, edgeMat);
      edges.position.set(p.x, p.y, p.z);
      scene.add(edges);
      panelEdges.push(edges);
    });

    // ---- Build sub-panels — 4 shader-backed monitors arranged 2x2 ----
    const buildRoom = ROOM_PANELS.find((p) => p.id === "build")!;
    const SUB_W = 1.7;
    const SUB_H = 1.0;
    const SUB_GAP_X = 0.18;
    const SUB_GAP_Y = 0.16;
    // Position offsets from buildRoom center:
    const subOffsets: Array<[number, number]> = [
      [-(SUB_W + SUB_GAP_X) / 2, (SUB_H + SUB_GAP_Y) / 2],
      [(SUB_W + SUB_GAP_X) / 2, (SUB_H + SUB_GAP_Y) / 2],
      [-(SUB_W + SUB_GAP_X) / 2, -(SUB_H + SUB_GAP_Y) / 2],
      [(SUB_W + SUB_GAP_X) / 2, -(SUB_H + SUB_GAP_Y) / 2],
    ];
    const buildSubMaterials: THREE.ShaderMaterial[] = [];
    const buildSubMeshes: THREE.Mesh[] = [];
    const buildSubEdges: THREE.LineSegments[] = [];
    const subGeo = new THREE.PlaneGeometry(SUB_W, SUB_H);
    BUILD_PANEL_SHADERS.forEach((frag, i) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: PANEL_VERTEX_SHADER,
        fragmentShader: frag,
        uniforms: {
          uTime: { value: 0 },
          uActive: { value: 0.0 }, // 0..1 — driven by scroll within the build slice
        },
      });
      const mesh = new THREE.Mesh(subGeo, mat);
      mesh.position.set(
        buildRoom.x + subOffsets[i][0],
        buildRoom.y + subOffsets[i][1],
        buildRoom.z,
      );
      mesh.userData = { id: `build-sub-${i}` };
      scene.add(mesh);
      buildSubMeshes.push(mesh);
      buildSubMaterials.push(mat);

      // Subtle outline per sub-panel
      const edgeGeo = new THREE.EdgesGeometry(subGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0x2a3142,
        transparent: true,
        opacity: 0.7,
      });
      const edges = new THREE.LineSegments(edgeGeo, edgeMat);
      edges.position.copy(mesh.position);
      scene.add(edges);
      buildSubEdges.push(edges);
    });

    // ---- Work sub-panels — 4 project-themed shader panels (2x2) ----
    const workRoom = ROOM_PANELS.find((p) => p.id === "work")!;
    const workSubMaterials: THREE.ShaderMaterial[] = [];
    const workSubMeshes: THREE.Mesh[] = [];
    const workSubEdges: THREE.LineSegments[] = [];
    WORK_PANEL_SHADERS.forEach((frag, i) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: PANEL_VERTEX_SHADER,
        fragmentShader: frag,
        uniforms: {
          uTime: { value: 0 },
          uActive: { value: 0.0 },
        },
      });
      const mesh = new THREE.Mesh(subGeo, mat);
      mesh.position.set(
        workRoom.x + subOffsets[i][0],
        workRoom.y + subOffsets[i][1],
        workRoom.z,
      );
      mesh.userData = { id: `work-sub-${i}` };
      scene.add(mesh);
      workSubMeshes.push(mesh);
      workSubMaterials.push(mat);

      const edgeGeo = new THREE.EdgesGeometry(subGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0x2a3142,
        transparent: true,
        opacity: 0.7,
      });
      const edges = new THREE.LineSegments(edgeGeo, edgeMat);
      edges.position.copy(mesh.position);
      scene.add(edges);
      workSubEdges.push(edges);
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

    // ---- Slice bounds for shader-backed rooms ----
    const total = ROOM_PANELS.length;
    const buildIdx = ROOM_PANELS.findIndex((p) => p.id === "build");
    const buildStart = buildIdx / total;
    const buildEnd = (buildIdx + 1) / total;
    const buildSpan = buildEnd - buildStart;
    const workIdx = ROOM_PANELS.findIndex((p) => p.id === "work");
    const workStart = workIdx / total;
    const workEnd = (workIdx + 1) / total;
    const workSpan = workEnd - workStart;

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

      // Drive build sub-panel uniforms
      // - uTime: continuous, even when off-screen (so panels are alive when revealed)
      // - uActive: peaks for the active sub-panel within the build slice; muted otherwise
      let buildSliceP = -1;
      if (t >= buildStart - 0.04 && t <= buildEnd + 0.04) {
        buildSliceP = (t - buildStart) / buildSpan;
      }
      const buildSubCount = buildSubMaterials.length;
      buildSubMaterials.forEach((mat, i) => {
        mat.uniforms.uTime.value = elapsed;
        if (buildSliceP < 0) {
          mat.uniforms.uActive.value = 0.25;
        } else {
          const idx = Math.min(buildSubCount - 1, Math.max(0, Math.floor(buildSliceP * buildSubCount)));
          const dist = Math.abs(idx - i);
          const target = i === idx ? 1.0 : Math.max(0.25, 1.0 - dist * 0.5);
          const cur = mat.uniforms.uActive.value as number;
          mat.uniforms.uActive.value = cur + (target - cur) * 0.08;
        }
      });

      // ---- Work sub-panel uniforms ----
      let workSliceP = -1;
      if (t >= workStart - 0.04 && t <= workEnd + 0.04) {
        workSliceP = (t - workStart) / workSpan;
      }
      const workSubCount = workSubMaterials.length;
      workSubMaterials.forEach((mat, i) => {
        mat.uniforms.uTime.value = elapsed;
        if (workSliceP < 0) {
          mat.uniforms.uActive.value = 0.25;
        } else {
          const idx = Math.min(workSubCount - 1, Math.max(0, Math.floor(workSliceP * workSubCount)));
          const dist = Math.abs(idx - i);
          const target = i === idx ? 1.0 : Math.max(0.25, 1.0 - dist * 0.5);
          const cur = mat.uniforms.uActive.value as number;
          mat.uniforms.uActive.value = cur + (target - cur) * 0.08;
        }
      });

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
      buildSubMeshes.forEach((m) => {
        (m.material as THREE.Material).dispose();
      });
      buildSubEdges.forEach((e) => {
        e.geometry.dispose();
        (e.material as THREE.Material).dispose();
      });
      workSubMeshes.forEach((m) => {
        (m.material as THREE.Material).dispose();
      });
      workSubEdges.forEach((e) => {
        e.geometry.dispose();
        (e.material as THREE.Material).dispose();
      });
      subGeo.dispose();
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
