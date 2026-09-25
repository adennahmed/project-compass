import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

const COLUMNS = 22;
const ROWS = 14;

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";
type GameState = "idle" | "running" | "paused" | "gameover";

const pointKey = ({ x, y }: Point) => y * COLUMNS + x;
const STARTING_SNAKE: Point[] = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }];
const FIREWALLS = new Set([
  [10, 2], [10, 3], [10, 4], [10, 9], [10, 10], [10, 11],
  [15, 5], [16, 5], [17, 5], [4, 10], [5, 10], [6, 10],
].map(([x, y]) => pointKey({ x, y })));

const findPacket = (snake: Point[]): Point => {
  const occupied = new Set(snake.map(pointKey));
  const available: Point[] = [];
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLUMNS; x += 1) {
      const point = { x, y };
      const key = pointKey(point);
      if (!occupied.has(key) && !FIREWALLS.has(key)) available.push(point);
    }
  }
  return available[Math.floor(Math.random() * available.length)] ?? { x: 18, y: 7 };
};

const opposite: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };

const PacketRun = () => {
  const [snake, setSnake] = useState<Point[]>(STARTING_SNAKE);
  const [packet, setPacket] = useState<Point>(() => findPacket(STARTING_SNAKE));
  const [status, setStatus] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<Direction>("right");
  const queuedDirectionRef = useRef<Direction>("right");
  const packetRef = useRef(packet);

  useEffect(() => {
    try { setHighScore(Number(window.localStorage.getItem("aden-packet-run-high") ?? 0)); } catch { /* private mode */ }
  }, []);

  useEffect(() => { packetRef.current = packet; }, [packet]);

  const finish = (finalScore: number) => {
    setStatus("gameover");
    setHighScore((current) => {
      const next = Math.max(current, finalScore);
      try { window.localStorage.setItem("aden-packet-run-high", String(next)); } catch { /* private mode */ }
      return next;
    });
  };

  useEffect(() => {
    if (status !== "running") return;
    const interval = window.setInterval(() => {
      setSnake((current) => {
        const direction = queuedDirectionRef.current;
        directionRef.current = direction;
        const head = current[0];
        const delta: Record<Direction, Point> = {
          up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
        };
        const next = { x: head.x + delta[direction].x, y: head.y + delta[direction].y };
        const nextKey = pointKey(next);
        const hitsBoundary = next.x < 0 || next.x >= COLUMNS || next.y < 0 || next.y >= ROWS;
        const hitsSelf = current.slice(0, -1).some((part) => part.x === next.x && part.y === next.y);
        const hitsFirewall = FIREWALLS.has(nextKey);
        if (hitsBoundary || hitsSelf || hitsFirewall) {
          finish(score);
          return current;
        }

        const collected = next.x === packetRef.current.x && next.y === packetRef.current.y;
        const nextSnake = [next, ...current];
        if (collected) {
          const nextScore = score + 10;
          setScore(nextScore);
          const nextPacket = findPacket(nextSnake);
          packetRef.current = nextPacket;
          setPacket(nextPacket);
          return nextSnake;
        }
        nextSnake.pop();
        return nextSnake;
      });
    }, Math.max(72, 155 - Math.floor(score / 20) * 9));
    return () => window.clearInterval(interval);
  }, [score, status]);

  const queueDirection = (direction: Direction) => {
    if (opposite[directionRef.current] === direction) return;
    queuedDirectionRef.current = direction;
    boardRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, Direction | undefined> = {
      ArrowUp: "up", w: "up", W: "up",
      ArrowDown: "down", s: "down", S: "down",
      ArrowLeft: "left", a: "left", A: "left",
      ArrowRight: "right", d: "right", D: "right",
    };
    const direction = map[event.key];
    if (direction) {
      event.preventDefault();
      queueDirection(direction);
    }
    if (event.key === " ") {
      event.preventDefault();
      if (status === "running") setStatus("paused");
      else if (status === "paused") setStatus("running");
    }
  };

  const restart = () => {
    const fresh = [...STARTING_SNAKE];
    const nextPacket = findPacket(fresh);
    setSnake(fresh);
    setPacket(nextPacket);
    packetRef.current = nextPacket;
    setScore(0);
    directionRef.current = "right";
    queuedDirectionRef.current = "right";
    setStatus("running");
    window.setTimeout(() => boardRef.current?.focus(), 0);
  };

  const cells = useMemo(() => Array.from({ length: COLUMNS * ROWS }, (_, key) => key), []);
  const snakeByKey = useMemo(() => new Map(snake.map((part, index) => [pointKey(part), index])), [snake]);
  const packetKey = pointKey(packet);

  return (
    <div className="kz-lab-layout kz-packet-layout">
      <div className="kz-lab-stage">
        <div className="kz-lab-stage__bar">
          <span>PACKET RUN / NODE-22</span>
          <span className={`kz-lab-status ${status === "running" ? "is-found" : status === "gameover" ? "is-blocked" : "is-ready"}`}><i />{status === "idle" ? "awaiting session" : status}</span>
        </div>

        <div
          ref={boardRef}
          className="kz-packet-board"
          role="application"
          tabIndex={0}
          aria-label="Packet Run game board. Use arrow keys or W A S D to move."
          onKeyDown={onKeyDown}
        >
          {cells.map((key) => {
            const segment = snakeByKey.get(key);
            const firewall = FIREWALLS.has(key);
            return <span key={key} aria-hidden className={`kz-packet-cell${segment === 0 ? " is-head" : segment !== undefined ? " is-body" : ""}${key === packetKey ? " is-packet" : ""}${firewall ? " is-firewall" : ""}`} />;
          })}

          {status !== "running" && (
            <div className="kz-game-overlay">
              <span>{status === "gameover" ? "CONNECTION TERMINATED" : status === "paused" ? "PROCESS SUSPENDED" : "ROUTE THE SIGNAL"}</span>
              <strong>{status === "gameover" ? `Score / ${score.toString().padStart(3, "0")}` : "Collect packets. Avoid firewalls."}</strong>
              <button type="button" onClick={status === "paused" ? () => setStatus("running") : restart}>{status === "paused" ? "Resume" : status === "gameover" ? "Recompile + run" : "Start process"} ↗</button>
            </div>
          )}
        </div>

        <div className="kz-lab-legend">
          <span><i className="is-route" />Packet</span>
          <span><i className="is-frontier" />Process</span>
          <span><i className="is-block" />Firewall</span>
        </div>
      </div>

      <aside className="kz-lab-controls">
        <div className="kz-control-copy">
          <strong>Route without dropping a packet.</strong>
          <p>A tiny deterministic game loop with collision detection, persistent scoring, and a difficulty curve that tightens as throughput rises.</p>
        </div>

        <dl className="kz-lab-metrics">
          <div><dt>Packets routed</dt><dd>{String(score / 10).padStart(2, "0")}</dd></div>
          <div><dt>High score</dt><dd>{highScore.toString().padStart(3, "0")}</dd></div>
          <div><dt>Clock</dt><dd>{Math.max(72, 155 - Math.floor(score / 20) * 9)} ms</dd></div>
        </dl>

        <div>
          <span className="kz-control-label">Direction controls</span>
          <div className="kz-dpad" aria-label="Game direction controls">
            <button type="button" className="is-up" onClick={() => queueDirection("up")} aria-label="Move up">↑</button>
            <button type="button" className="is-left" onClick={() => queueDirection("left")} aria-label="Move left">←</button>
            <button type="button" className="is-down" onClick={() => queueDirection("down")} aria-label="Move down">↓</button>
            <button type="button" className="is-right" onClick={() => queueDirection("right")} aria-label="Move right">→</button>
          </div>
        </div>

        <div className="kz-control-actions">
          <button type="button" className="is-primary" onClick={status === "running" ? () => setStatus("paused") : status === "paused" ? () => setStatus("running") : restart}>{status === "running" ? "Pause process" : status === "paused" ? "Resume process" : "Start process"} <span>{status === "running" ? "Ⅱ" : "▶"}</span></button>
          <button type="button" onClick={restart}>New session</button>
        </div>
      </aside>
    </div>
  );
};

export default PacketRun;
