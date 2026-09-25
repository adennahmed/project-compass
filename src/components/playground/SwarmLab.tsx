import { useEffect, useRef, useState, type PointerEvent } from "react";

const WIDTH = 900;
const HEIGHT = 460;
const HASH_SIZE = 72;

type Agent = { id: number; x: number; y: number; vx: number; vy: number; phase: number };
type PointerState = { x: number; y: number; active: boolean };

const createAgents = (count = 96): Agent[] => {
  let seed = 8173;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: count }, (_, id) => {
    const angle = random() * Math.PI * 2;
    return {
      id,
      x: 90 + random() * (WIDTH - 180),
      y: 60 + random() * (HEIGHT - 120),
      vx: Math.cos(angle) * (0.8 + random() * 1.4),
      vy: Math.sin(angle) * (0.8 + random() * 1.4),
      phase: random() * Math.PI * 2,
    };
  });
};

const SwarmLab = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const agentsRef = useRef<Agent[]>(createAgents());
  const runningRef = useRef(true);
  const cohesionRef = useRef(46);
  const separationRef = useRef(62);
  const speedRef = useRef(32);
  const pointerRef = useRef<PointerState>({ x: WIDTH / 2, y: HEIGHT / 2, active: false });
  const nextIdRef = useRef(200);
  const [running, setRunning] = useState(true);
  const [cohesion, setCohesion] = useState(46);
  const [separation, setSeparation] = useState(62);
  const [speed, setSpeed] = useState(32);
  const [telemetry, setTelemetry] = useState({ fps: 60, checks: 0, cells: 0 });
  const [agentCount, setAgentCount] = useState(agentsRef.current.length);

  useEffect(() => { runningRef.current = running; }, [running]);
  useEffect(() => { cohesionRef.current = cohesion; }, [cohesion]);
  useEffect(() => { separationRef.current = separation; }, [separation]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      runningRef.current = false;
      setRunning(false);
    }
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let animationFrame = 0;
    let previous = performance.now();
    let frame = 0;
    let lastChecks = 0;
    let lastCells = 0;

    const buildHash = () => {
      const hash = new Map<string, Agent[]>();
      agentsRef.current.forEach((agent) => {
        const key = `${Math.floor(agent.x / HASH_SIZE)}:${Math.floor(agent.y / HASH_SIZE)}`;
        const bucket = hash.get(key);
        if (bucket) bucket.push(agent); else hash.set(key, [agent]);
      });
      return hash;
    };

    const update = (delta: number) => {
      const hash = buildHash();
      const pointer = pointerRef.current;
      let checks = 0;
      const maxSpeed = 1.25 + speedRef.current / 18;

      agentsRef.current.forEach((agent) => {
        const cellX = Math.floor(agent.x / HASH_SIZE);
        const cellY = Math.floor(agent.y / HASH_SIZE);
        let centerX = 0;
        let centerY = 0;
        let alignX = 0;
        let alignY = 0;
        let separateX = 0;
        let separateY = 0;
        let neighbors = 0;

        for (let ox = -1; ox <= 1; ox += 1) {
          for (let oy = -1; oy <= 1; oy += 1) {
            const bucket = hash.get(`${cellX + ox}:${cellY + oy}`) ?? [];
            bucket.forEach((other) => {
              if (other.id === agent.id) return;
              checks += 1;
              const dx = other.x - agent.x;
              const dy = other.y - agent.y;
              const distanceSquared = dx * dx + dy * dy;
              if (distanceSquared > 4900) return;
              neighbors += 1;
              centerX += other.x;
              centerY += other.y;
              alignX += other.vx;
              alignY += other.vy;
              if (distanceSquared < 900) {
                const strength = 1 / Math.max(8, distanceSquared);
                separateX -= dx * strength;
                separateY -= dy * strength;
              }
            });
          }
        }

        let ax = 0;
        let ay = 0;
        if (neighbors > 0) {
          centerX /= neighbors;
          centerY /= neighbors;
          alignX /= neighbors;
          alignY /= neighbors;
          ax += (centerX - agent.x) * (cohesionRef.current / 100) * 0.0014;
          ay += (centerY - agent.y) * (cohesionRef.current / 100) * 0.0014;
          ax += (alignX - agent.vx) * 0.018;
          ay += (alignY - agent.vy) * 0.018;
          ax += separateX * (separationRef.current / 100) * 0.52;
          ay += separateY * (separationRef.current / 100) * 0.52;
        }

        if (pointer.active) {
          const dx = pointer.x - agent.x;
          const dy = pointer.y - agent.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < 52000) {
            const pull = Math.max(0, 1 - distanceSquared / 52000) * 0.075;
            ax += dx * pull * 0.02;
            ay += dy * pull * 0.02;
          }
        }

        agent.vx += ax * delta;
        agent.vy += ay * delta;
        const magnitude = Math.sqrt(agent.vx * agent.vx + agent.vy * agent.vy) || 1;
        if (magnitude > maxSpeed) {
          agent.vx = (agent.vx / magnitude) * maxSpeed;
          agent.vy = (agent.vy / magnitude) * maxSpeed;
        }
        agent.x += agent.vx * delta;
        agent.y += agent.vy * delta;
        agent.phase += 0.025 * delta;
        if (agent.x < -8) agent.x = WIDTH + 8;
        if (agent.x > WIDTH + 8) agent.x = -8;
        if (agent.y < -8) agent.y = HEIGHT + 8;
        if (agent.y > HEIGHT + 8) agent.y = -8;
      });

      lastChecks = checks;
      lastCells = hash.size;
    };

    const draw = () => {
      context.fillStyle = "rgba(9,11,15,0.28)";
      context.fillRect(0, 0, WIDTH, HEIGHT);

      context.strokeStyle = "rgba(235,237,243,0.045)";
      context.lineWidth = 1;
      for (let x = HASH_SIZE; x < WIDTH; x += HASH_SIZE) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, HEIGHT); context.stroke(); }
      for (let y = HASH_SIZE; y < HEIGHT; y += HASH_SIZE) { context.beginPath(); context.moveTo(0, y); context.lineTo(WIDTH, y); context.stroke(); }

      if (pointerRef.current.active) {
        const pointer = pointerRef.current;
        context.strokeStyle = "rgba(244,49,58,0.38)";
        context.beginPath(); context.arc(pointer.x, pointer.y, 28 + Math.sin(frame * 0.08) * 4, 0, Math.PI * 2); context.stroke();
        context.beginPath(); context.moveTo(pointer.x - 7, pointer.y); context.lineTo(pointer.x + 7, pointer.y); context.stroke();
        context.beginPath(); context.moveTo(pointer.x, pointer.y - 7); context.lineTo(pointer.x, pointer.y + 7); context.stroke();
      }

      agentsRef.current.forEach((agent, index) => {
        const angle = Math.atan2(agent.vy, agent.vx);
        const size = index === 0 ? 8 : 5.2;
        context.save();
        context.translate(agent.x, agent.y);
        context.rotate(angle);
        context.beginPath();
        context.moveTo(size, 0);
        context.lineTo(-size * 0.8, size * 0.55);
        context.lineTo(-size * 0.42, 0);
        context.lineTo(-size * 0.8, -size * 0.55);
        context.closePath();
        context.fillStyle = index === 0 ? "#F4313A" : `rgba(196,205,214,${0.46 + Math.sin(agent.phase) * 0.16})`;
        context.fill();
        context.restore();

        context.strokeStyle = index === 0 ? "rgba(244,49,58,0.38)" : "rgba(90,139,176,0.16)";
        context.beginPath();
        context.moveTo(agent.x - agent.vx * 4, agent.y - agent.vy * 4);
        context.lineTo(agent.x - agent.vx * 11, agent.y - agent.vy * 11);
        context.stroke();
      });

      context.fillStyle = "rgba(235,237,243,0.32)";
      context.font = "9px 'Martian Mono', monospace";
      context.fillText("SPATIAL HASH / CELL 72", 18, 24);
      context.fillText("MOVE POINTER TO BEND FIELD", WIDTH - 234, 24);
    };

    context.fillStyle = "#090B0F";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    const loop = (now: number) => {
      const elapsed = now - previous;
      const delta = Math.min(1.5, Math.max(0.3, elapsed / 16.667));
      previous = now;
      frame += 1;
      if (runningRef.current) update(delta);
      draw();
      if (frame % 24 === 0) setTelemetry({ fps: Math.round(1000 / Math.max(1, elapsed)), checks: lastChecks, cells: lastCells });
      animationFrame = requestAnimationFrame(loop);
    };
    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const pointerPosition = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: ((event.clientX - rect.left) / rect.width) * WIDTH, y: ((event.clientY - rect.top) / rect.height) * HEIGHT };
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    pointerRef.current = { ...pointerPosition(event), active: true };
  };

  const addBurst = (event: PointerEvent<HTMLCanvasElement>) => {
    const point = pointerPosition(event);
    const additions = Array.from({ length: 14 }, (_, index): Agent => {
      const angle = (index / 14) * Math.PI * 2;
      return { id: nextIdRef.current++, x: point.x, y: point.y, vx: Math.cos(angle) * 2.4, vy: Math.sin(angle) * 2.4, phase: angle };
    });
    agentsRef.current.push(...additions);
    setAgentCount(agentsRef.current.length);
  };

  const reset = () => {
    agentsRef.current = createAgents();
    setAgentCount(agentsRef.current.length);
  };

  const scatter = () => {
    agentsRef.current.forEach((agent) => {
      const angle = Math.random() * Math.PI * 2;
      agent.vx = Math.cos(angle) * 4.2;
      agent.vy = Math.sin(angle) * 4.2;
    });
  };

  return (
    <div className="kz-lab-layout kz-swarm-layout">
      <div className="kz-lab-stage">
        <div className="kz-lab-stage__bar">
          <span>SWARM / HASH-72</span>
          <span className={`kz-lab-status ${running ? "is-found" : "is-ready"}`}><i />{running ? "field live" : "field paused"}</span>
        </div>
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="kz-swarm-canvas"
          aria-label="Interactive flocking simulation. Move the pointer to attract agents and click to add a burst."
          onPointerMove={onPointerMove}
          onPointerLeave={() => { pointerRef.current.active = false; }}
          onPointerDown={addBurst}
        />
        <div className="kz-lab-legend">
          <span><i className="is-route" />Lead agent</span>
          <span><i className="is-frontier" />Flock</span>
          <span><i className="is-vector" />Velocity vector</span>
        </div>
      </div>

      <aside className="kz-lab-controls">
        <div className="kz-control-copy">
          <strong>Bend the flock.</strong>
          <p>Move over the field to introduce an attractor; click to spawn a burst. A spatial hash limits each agent’s search to nearby cells.</p>
        </div>

        <div className="kz-signal-ranges">
          <label><span className="kz-range-heading"><span className="kz-control-label">Cohesion</span><output>{cohesion}%</output></span><input className="kz-range" type="range" min="0" max="100" value={cohesion} onChange={(event) => setCohesion(Number(event.target.value))} /></label>
          <label><span className="kz-range-heading"><span className="kz-control-label">Separation</span><output>{separation}%</output></span><input className="kz-range" type="range" min="0" max="100" value={separation} onChange={(event) => setSeparation(Number(event.target.value))} /></label>
          <label><span className="kz-range-heading"><span className="kz-control-label">Velocity cap</span><output>{speed}</output></span><input className="kz-range" type="range" min="10" max="60" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /></label>
        </div>

        <dl className="kz-lab-metrics">
          <div><dt>Agents</dt><dd>{agentCount.toString().padStart(3, "0")}</dd></div>
          <div><dt>Neighbor checks</dt><dd>{telemetry.checks.toLocaleString()}</dd></div>
          <div><dt>Hash cells / fps</dt><dd>{telemetry.cells} / {telemetry.fps}</dd></div>
        </dl>

        <div className="kz-control-actions">
          <button type="button" className="is-primary" onClick={() => setRunning((value) => !value)}>{running ? "Pause field" : "Resume field"} <span>{running ? "Ⅱ" : "▶"}</span></button>
          <button type="button" onClick={scatter}>Inject entropy</button>
          <button type="button" onClick={reset}>Restore flock</button>
        </div>
      </aside>
    </div>
  );
};

export default SwarmLab;
