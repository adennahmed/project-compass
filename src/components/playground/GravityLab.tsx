import { useEffect, useRef, useState, type PointerEvent } from "react";

const WIDTH = 900;
const HEIGHT = 460;

type TrailPoint = { x: number; y: number };
type Body = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  color: string;
  trail: TrailPoint[];
};

const createSystem = (): Body[] => [
  { id: 1, x: 450, y: 230, vx: 0, vy: 0, mass: 6200, color: "#F4313A", trail: [] },
  { id: 2, x: 610, y: 230, vx: 0, vy: 2.35, mass: 62, color: "#EBEDF3", trail: [] },
  { id: 3, x: 270, y: 230, vx: 0, vy: -2.12, mass: 92, color: "#9EA5B2", trail: [] },
  { id: 4, x: 450, y: 102, vx: 2.55, vy: 0, mass: 28, color: "#5A8BB0", trail: [] },
  { id: 5, x: 450, y: 398, vx: -1.93, vy: 0, mass: 46, color: "#C7CBD4", trail: [] },
];

const GravityLab = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bodiesRef = useRef<Body[]>(createSystem());
  const runningRef = useRef(true);
  const gravityRef = useRef(0.16);
  const nextIdRef = useRef(10);
  const [running, setRunning] = useState(true);
  const [gravity, setGravity] = useState(0.16);
  const [bodyCount, setBodyCount] = useState(bodiesRef.current.length);
  const [cycles, setCycles] = useState(0);
  const [energy, setEnergy] = useState(0);

  useEffect(() => { runningRef.current = running; }, [running]);
  useEffect(() => { gravityRef.current = gravity; }, [gravity]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      runningRef.current = false;
      setRunning(false);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let animationFrame = 0;
    let previous = performance.now();
    let frame = 0;

    const update = (delta: number) => {
      const bodies = bodiesRef.current;
      const accelerations = bodies.map(() => ({ x: 0, y: 0 }));

      for (let i = 0; i < bodies.length; i += 1) {
        for (let j = i + 1; j < bodies.length; j += 1) {
          const dx = bodies[j].x - bodies[i].x;
          const dy = bodies[j].y - bodies[i].y;
          const distanceSquared = dx * dx + dy * dy + 220;
          const distance = Math.sqrt(distanceSquared);
          const factor = gravityRef.current / (distanceSquared * distance);
          accelerations[i].x += dx * factor * bodies[j].mass;
          accelerations[i].y += dy * factor * bodies[j].mass;
          accelerations[j].x -= dx * factor * bodies[i].mass;
          accelerations[j].y -= dy * factor * bodies[i].mass;
        }
      }

      bodies.forEach((body, index) => {
        body.vx += accelerations[index].x * delta;
        body.vy += accelerations[index].y * delta;
        body.x += body.vx * delta;
        body.y += body.vy * delta;

        if (body.x < -24) body.x = WIDTH + 24;
        if (body.x > WIDTH + 24) body.x = -24;
        if (body.y < -24) body.y = HEIGHT + 24;
        if (body.y > HEIGHT + 24) body.y = -24;

        if (frame % 2 === 0) {
          body.trail.push({ x: body.x, y: body.y });
          if (body.trail.length > 72) body.trail.shift();
        }
      });
    };

    const draw = () => {
      context.clearRect(0, 0, WIDTH, HEIGHT);
      context.fillStyle = "#090B0F";
      context.fillRect(0, 0, WIDTH, HEIGHT);

      context.strokeStyle = "rgba(235,237,243,0.055)";
      context.lineWidth = 1;
      for (let x = 0; x <= WIDTH; x += 50) {
        context.beginPath(); context.moveTo(x, 0); context.lineTo(x, HEIGHT); context.stroke();
      }
      for (let y = 0; y <= HEIGHT; y += 50) {
        context.beginPath(); context.moveTo(0, y); context.lineTo(WIDTH, y); context.stroke();
      }

      context.strokeStyle = "rgba(244,49,58,0.18)";
      context.beginPath(); context.moveTo(WIDTH / 2 - 12, HEIGHT / 2); context.lineTo(WIDTH / 2 + 12, HEIGHT / 2); context.stroke();
      context.beginPath(); context.moveTo(WIDTH / 2, HEIGHT / 2 - 12); context.lineTo(WIDTH / 2, HEIGHT / 2 + 12); context.stroke();

      bodiesRef.current.forEach((body) => {
        if (body.trail.length > 1) {
          context.beginPath();
          body.trail.forEach((point, index) => index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y));
          context.strokeStyle = `${body.color}55`;
          context.lineWidth = body.mass > 1000 ? 1.5 : 1;
          context.stroke();
        }

        const radius = Math.max(3.2, Math.min(15, Math.sqrt(body.mass) * 0.18));
        const glow = context.createRadialGradient(body.x, body.y, 0, body.x, body.y, radius * 3.2);
        glow.addColorStop(0, `${body.color}88`);
        glow.addColorStop(1, `${body.color}00`);
        context.fillStyle = glow;
        context.beginPath(); context.arc(body.x, body.y, radius * 3.2, 0, Math.PI * 2); context.fill();

        context.fillStyle = body.color;
        context.beginPath(); context.arc(body.x, body.y, radius, 0, Math.PI * 2); context.fill();
        context.strokeStyle = "rgba(235,237,243,0.45)";
        context.stroke();
      });

      context.fillStyle = "rgba(235,237,243,0.34)";
      context.font = "9px 'Martian Mono', monospace";
      context.fillText("SIMULATION PLANE / 900×460", 18, 24);
      context.fillText("CLICK FIELD TO INTRODUCE MASS", WIDTH - 246, 24);
    };

    const loop = (now: number) => {
      const delta = Math.min(1.4, Math.max(0.35, (now - previous) / 16.667));
      previous = now;
      frame += 1;
      if (runningRef.current) update(delta);
      draw();

      if (frame % 20 === 0) {
        const kinetic = bodiesRef.current.reduce((total, body) => total + 0.5 * body.mass * (body.vx ** 2 + body.vy ** 2), 0);
        setEnergy(Math.round(kinetic));
        if (runningRef.current) setCycles((value) => value + 20);
      }
      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const addBody = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * HEIGHT;
    const dx = x - WIDTH / 2;
    const dy = y - HEIGHT / 2;
    const distance = Math.max(60, Math.sqrt(dx * dx + dy * dy));
    const speed = Math.sqrt((gravityRef.current * 6200) / distance);
    const palette = ["#EBEDF3", "#5A8BB0", "#F4313A", "#A7ABB5"];
    const mass = 28 + Math.random() * 64;

    bodiesRef.current.push({
      id: nextIdRef.current++,
      x,
      y,
      vx: (-dy / distance) * speed,
      vy: (dx / distance) * speed,
      mass,
      color: palette[nextIdRef.current % palette.length],
      trail: [],
    });
    setBodyCount(bodiesRef.current.length);
  };

  const reset = () => {
    bodiesRef.current = createSystem();
    setBodyCount(bodiesRef.current.length);
    setCycles(0);
    setEnergy(0);
  };

  const clear = () => {
    bodiesRef.current = [];
    setBodyCount(0);
    setCycles(0);
    setEnergy(0);
  };

  return (
    <div className="kz-lab-layout kz-gravity-layout">
      <div className="kz-lab-stage">
        <div className="kz-lab-stage__bar">
          <span>N-BODY / SYMPLECTIC STEP</span>
          <span className={`kz-lab-status ${running ? "is-found" : "is-ready"}`}><i />{running ? "simulation live" : "simulation paused"}</span>
        </div>
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="kz-gravity-canvas"
          aria-label="Interactive gravitational orbit simulation. Click to introduce a new body."
          onPointerDown={addBody}
        />
        <div className="kz-lab-legend">
          <span><i className="is-route" />Primary mass</span>
          <span><i className="is-frontier" />Orbital body</span>
          <span><i className="is-vector" />Computed trail</span>
        </div>
      </div>

      <aside className="kz-lab-controls">
        <div className="kz-control-copy">
          <strong>Build a solar system.</strong>
          <p>Click anywhere in the field to inject a body with a tangential velocity. Every object affects every other object in real time.</p>
        </div>

        <div>
          <div className="kz-range-heading"><span className="kz-control-label">Gravity constant</span><output>{gravity.toFixed(2)}</output></div>
          <input className="kz-range" type="range" min="0.06" max="0.28" step="0.01" value={gravity} onChange={(event) => setGravity(Number(event.target.value))} aria-label="Gravity constant" />
        </div>

        <dl className="kz-lab-metrics">
          <div><dt>Active bodies</dt><dd>{bodyCount.toString().padStart(2, "0")}</dd></div>
          <div><dt>Integration cycles</dt><dd>{cycles.toLocaleString()}</dd></div>
          <div><dt>Kinetic energy</dt><dd>{energy.toLocaleString()}</dd></div>
        </dl>

        <div className="kz-control-actions">
          <button type="button" className="is-primary" onClick={() => setRunning((value) => !value)}>{running ? "Pause field" : "Resume field"} <span>{running ? "Ⅱ" : "▶"}</span></button>
          <button type="button" onClick={reset}>Restore system</button>
          <button type="button" onClick={clear}>Clear field</button>
        </div>
      </aside>
    </div>
  );
};

export default GravityLab;
