import { useCallback, useEffect, useRef } from "react";

const HeroParticleSphere = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animFrameRef = useRef<number>(0);

  const initSphere = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(window.innerWidth * 0.62, window.innerHeight * 0.76, 760);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.41;
    const numPoints = 1400;
    const foreground = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "0 0% 100%";

    const points: { theta: number; phi: number }[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < numPoints; i++) {
      const theta = Math.acos(1 - (2 * (i + 0.5)) / numPoints);
      const phi = (2 * Math.PI * i) / goldenRatio;
      points.push({ theta, phi });
    }

    let rotationX = 0;
    let rotationY = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      const targetRotX = (mouseRef.current.y - 0.5) * 0.8;
      const targetRotY = (mouseRef.current.x - 0.5) * 0.8;
      rotationX += (targetRotX - rotationX) * 0.03;
      rotationY += (targetRotY - rotationY) * 0.03;

      const time = Date.now() * 0.0003;

      for (let i = 0; i < numPoints; i++) {
        const { theta, phi } = points[i];
        const x = Math.sin(theta) * Math.cos(phi + time);
        const y = Math.cos(theta);
        const z = Math.sin(theta) * Math.sin(phi + time);

        const cosRX = Math.cos(rotationX);
        const sinRX = Math.sin(rotationX);
        const cosRY = Math.cos(rotationY);
        const sinRY = Math.sin(rotationY);

        const y1 = y * cosRX - z * sinRX;
        const z1 = y * sinRX + z * cosRX;
        const x1 = x * cosRY + z1 * sinRY;
        const z2 = -x * sinRY + z1 * cosRY;

        const scale = 1 / (1 + z2 * 0.28);
        const px = cx + x1 * radius * scale;
        const py = cy + y1 * radius * scale;

        const depth = (z2 + 1) / 2;
        const dotSize = 0.6 + depth * 2.4;
        const alpha = 0.08 + depth * 0.5;

        ctx.beginPath();
        ctx.arc(px, py, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${foreground} / ${alpha})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  useEffect(() => {
    const cleanup = initSphere();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };

    const handleResize = () => {
      cancelAnimationFrame(animFrameRef.current);
      initSphere();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      cleanup?.();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [initSphere]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

export default HeroParticleSphere;