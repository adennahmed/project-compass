import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PANEL_VERTEX_SHADER } from "./rooms/buildShaders";

/**
 * Lightweight single-shader panel for mobile.
 *
 * On mobile we drop the camera-dolly scene but keep the per-room shaders
 * as section backdrops (per brief §4.9). One canvas per panel, tied to an
 * IntersectionObserver so the render loop only runs while visible.
 */

interface MobileShaderPanelProps {
  fragmentShader: string;
  className?: string;
  /** Whether the panel is the active "spotlight" (drives uActive). */
  active?: boolean;
}

const MobileShaderPanel = ({
  fragmentShader,
  className,
  active = true,
}: MobileShaderPanelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const setSize = () => {
      const rect = canvas.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
    };
    setSize();

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const mat = new THREE.ShaderMaterial({
      vertexShader: PANEL_VERTEX_SHADER,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uActive: { value: active ? 1.0 : 0.5 },
      },
      transparent: true,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);

    let raf = 0;
    let visible = false;
    let renderingPaused = !active;
    const start = performance.now();

    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      mat.uniforms.uTime.value = elapsed;
      const target = activeRef.current ? 1.0 : 0.45;
      const cur = mat.uniforms.uActive.value as number;
      mat.uniforms.uActive.value = cur + (target - cur) * 0.08;
      renderer.render(scene, camera);
      if (!renderingPaused) raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          if (visible && !raf && !reduced) {
            renderingPaused = false;
            tick();
          } else if (!visible && raf) {
            renderingPaused = true;
            cancelAnimationFrame(raf);
            raf = 0;
          }
        }
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(canvas);

    if (reduced) renderer.render(scene, camera);

    const onResize = () => {
      setSize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      mesh.geometry.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, [fragmentShader]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
    />
  );
};

export default MobileShaderPanel;
