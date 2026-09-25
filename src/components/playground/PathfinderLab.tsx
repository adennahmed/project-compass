import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { findGridPath, gridKey, type GridPoint, type PathResult } from "@/lib/pathfinding";

const COLUMNS = 20;
const ROWS = 12;
const DEFAULT_START: GridPoint = { col: 1, row: 5 };
const DEFAULT_GOAL: GridPoint = { col: 18, row: 6 };

const initialWalls = () => {
  const walls = new Set<number>();
  [
    [5, 1], [5, 2], [5, 3], [5, 4], [5, 6], [5, 7], [5, 8],
    [10, 3], [10, 4], [10, 5], [10, 6], [10, 7], [10, 9], [10, 10],
    [14, 1], [14, 2], [14, 4], [14, 5], [14, 6], [14, 7], [14, 8],
  ].forEach(([col, row]) => walls.add(gridKey({ col, row }, COLUMNS)));
  return walls;
};

type EditMode = "wall" | "start" | "goal";
type SolveState = "ready" | "searching" | "found" | "blocked";

const PathfinderLab = () => {
  const [start, setStart] = useState(DEFAULT_START);
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [walls, setWalls] = useState<Set<number>>(initialWalls);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [path, setPath] = useState<Set<number>>(new Set());
  const [mode, setMode] = useState<EditMode>("wall");
  const [state, setState] = useState<SolveState>("ready");
  const [runtime, setRuntime] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const timerRef = useRef<number | null>(null);
  const paintingRef = useRef(false);
  const paintValueRef = useRef(true);

  const startKey = gridKey(start, COLUMNS);
  const goalKey = gridKey(goal, COLUMNS);

  const stopAnimation = useCallback(() => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    const endPaint = () => { paintingRef.current = false; };
    window.addEventListener("pointerup", endPaint);
    return () => window.removeEventListener("pointerup", endPaint);
  }, []);

  useEffect(() => stopAnimation, [stopAnimation]);

  const clearTrace = useCallback(() => {
    stopAnimation();
    setVisited(new Set());
    setPath(new Set());
    setPathLength(0);
    setState("ready");
  }, [stopAnimation]);

  const editCell = (key: number, forcedWallValue?: boolean) => {
    clearTrace();
    if (mode === "start") {
      if (key !== goalKey && !walls.has(key)) setStart({ col: key % COLUMNS, row: Math.floor(key / COLUMNS) });
      return;
    }
    if (mode === "goal") {
      if (key !== startKey && !walls.has(key)) setGoal({ col: key % COLUMNS, row: Math.floor(key / COLUMNS) });
      return;
    }
    if (key === startKey || key === goalKey) return;
    setWalls((current) => {
      const next = new Set(current);
      const shouldAdd = forcedWallValue ?? !next.has(key);
      if (shouldAdd) next.add(key); else next.delete(key);
      return next;
    });
  };

  const onCellPointerDown = (key: number) => {
    if (mode !== "wall") {
      editCell(key);
      return;
    }
    paintingRef.current = true;
    paintValueRef.current = !walls.has(key);
    editCell(key, paintValueRef.current);
  };

  const onCellPointerEnter = (key: number) => {
    if (mode === "wall" && paintingRef.current) editCell(key, paintValueRef.current);
  };

  const animateResult = (result: PathResult) => {
    let visitIndex = 0;
    let pathIndex = 0;
    setState("searching");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisited(new Set(result.visited));
      setPath(new Set(result.path));
      setPathLength(Math.max(0, result.path.length - 1));
      setState(result.path.length ? "found" : "blocked");
      return;
    }

    timerRef.current = window.setInterval(() => {
      if (visitIndex < result.visited.length) {
        const batch = result.visited.slice(visitIndex, visitIndex + 5);
        visitIndex += batch.length;
        setVisited((current) => new Set([...current, ...batch]));
        return;
      }
      if (pathIndex < result.path.length) {
        const key = result.path[pathIndex++];
        setPath((current) => new Set(current).add(key));
        return;
      }
      stopAnimation();
      setPathLength(Math.max(0, result.path.length - 1));
      setState(result.path.length ? "found" : "blocked");
    }, 24);
  };

  const solve = () => {
    clearTrace();
    const began = performance.now();
    const result = findGridPath(COLUMNS, ROWS, start, goal, walls);
    setRuntime(performance.now() - began);
    animateResult(result);
  };

  const randomize = () => {
    clearTrace();
    const next = new Set<number>();
    for (let key = 0; key < COLUMNS * ROWS; key += 1) {
      if (key !== startKey && key !== goalKey && Math.random() < 0.23) next.add(key);
    }
    setWalls(next);
  };

  const reset = () => {
    clearTrace();
    setStart(DEFAULT_START);
    setGoal(DEFAULT_GOAL);
    setWalls(initialWalls());
  };

  const cells = useMemo(() => Array.from({ length: COLUMNS * ROWS }, (_, key) => key), []);
  const stateCopy: Record<SolveState, string> = {
    ready: "Edit the field, then run A*",
    searching: "Exploring lowest-cost frontier",
    found: "Optimal route resolved",
    blocked: "No valid route found",
  };

  return (
    <div className="kz-lab-layout">
      <div className="kz-lab-stage">
        <div className="kz-lab-stage__bar">
          <span>GRAPH / 20×12</span>
          <span className={`kz-lab-status is-${state}`}><i />{stateCopy[state]}</span>
        </div>
        <div className="kz-path-grid" role="grid" aria-label="Editable pathfinding grid">
          {cells.map((key) => {
            const isStart = key === startKey;
            const isGoal = key === goalKey;
            const isWall = walls.has(key);
            const isPath = path.has(key) && !isStart && !isGoal;
            const isVisited = visited.has(key) && !isPath && !isStart && !isGoal;
            return (
              <button
                key={key}
                type="button"
                className={`kz-path-cell${isWall ? " is-wall" : ""}${isVisited ? " is-visited" : ""}${isPath ? " is-path" : ""}${isStart ? " is-start" : ""}${isGoal ? " is-goal" : ""}`}
                aria-label={`${isStart ? "Start" : isGoal ? "Destination" : isWall ? "Wall" : "Open"} cell, column ${(key % COLUMNS) + 1}, row ${Math.floor(key / COLUMNS) + 1}`}
                onPointerDown={() => onCellPointerDown(key)}
                onPointerEnter={() => onCellPointerEnter(key)}
              >
                {isStart && <span>S</span>}
                {isGoal && <span>G</span>}
              </button>
            );
          })}
        </div>
        <div className="kz-lab-legend">
          <span><i className="is-frontier" />Explored</span>
          <span><i className="is-route" />Optimal route</span>
          <span><i className="is-block" />Constraint</span>
        </div>
      </div>

      <aside className="kz-lab-controls">
        <div>
          <span className="kz-control-label">Edit mode</span>
          <div className="kz-segmented">
            {(["wall", "start", "goal"] as EditMode[]).map((item) => (
              <button key={item} type="button" aria-pressed={mode === item} onClick={() => setMode(item)}>{item}</button>
            ))}
          </div>
        </div>

        <div className="kz-control-copy">
          <strong>Drag to draw constraints.</strong>
          <p>Move the start or destination, then watch the heuristic search resolve the least-cost path.</p>
        </div>

        <dl className="kz-lab-metrics">
          <div><dt>Nodes explored</dt><dd>{visited.size.toString().padStart(3, "0")}</dd></div>
          <div><dt>Route length</dt><dd>{pathLength ? `${pathLength} hops` : "—"}</dd></div>
          <div><dt>Solve time</dt><dd>{runtime ? `${runtime.toFixed(2)} ms` : "—"}</dd></div>
        </dl>

        <div className="kz-control-actions">
          <button type="button" className="is-primary" onClick={solve} disabled={state === "searching"}>Run A* <span>↗</span></button>
          <button type="button" onClick={randomize}>Random field</button>
          <button type="button" onClick={reset}>Reset</button>
        </div>
      </aside>
    </div>
  );
};

export default PathfinderLab;
