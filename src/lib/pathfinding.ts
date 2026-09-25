export type GridPoint = { col: number; row: number };

export type PathResult = {
  visited: number[];
  path: number[];
};

export const gridKey = (point: GridPoint, columns: number) => point.row * columns + point.col;

const pointFromKey = (key: number, columns: number): GridPoint => ({
  col: key % columns,
  row: Math.floor(key / columns),
});

const manhattan = (a: GridPoint, b: GridPoint) => Math.abs(a.col - b.col) + Math.abs(a.row - b.row);

/** A small, deterministic A* implementation used by the live route lab. */
export const findGridPath = (
  columns: number,
  rows: number,
  start: GridPoint,
  goal: GridPoint,
  walls: ReadonlySet<number>,
): PathResult => {
  const startKey = gridKey(start, columns);
  const goalKey = gridKey(goal, columns);
  const open = new Set<number>([startKey]);
  const cameFrom = new Map<number, number>();
  const gScore = new Map<number, number>([[startKey, 0]]);
  const fScore = new Map<number, number>([[startKey, manhattan(start, goal)]]);
  const visited: number[] = [];

  while (open.size > 0) {
    let current = -1;
    let currentScore = Number.POSITIVE_INFINITY;

    for (const candidate of open) {
      const score = fScore.get(candidate) ?? Number.POSITIVE_INFINITY;
      if (score < currentScore || (score === currentScore && candidate < current)) {
        current = candidate;
        currentScore = score;
      }
    }

    if (current < 0) break;
    open.delete(current);
    visited.push(current);

    if (current === goalKey) {
      const path = [current];
      while (cameFrom.has(path[0])) path.unshift(cameFrom.get(path[0]) as number);
      return { visited, path };
    }

    const point = pointFromKey(current, columns);
    const neighbors: GridPoint[] = [
      { col: point.col + 1, row: point.row },
      { col: point.col - 1, row: point.row },
      { col: point.col, row: point.row + 1 },
      { col: point.col, row: point.row - 1 },
    ];

    for (const neighbor of neighbors) {
      if (neighbor.col < 0 || neighbor.col >= columns || neighbor.row < 0 || neighbor.row >= rows) continue;
      const neighborKey = gridKey(neighbor, columns);
      if (walls.has(neighborKey) && neighborKey !== goalKey) continue;

      const tentative = (gScore.get(current) ?? Number.POSITIVE_INFINITY) + 1;
      if (tentative >= (gScore.get(neighborKey) ?? Number.POSITIVE_INFINITY)) continue;

      cameFrom.set(neighborKey, current);
      gScore.set(neighborKey, tentative);
      fScore.set(neighborKey, tentative + manhattan(neighbor, goal));
      open.add(neighborKey);
    }
  }

  return { visited, path: [] };
};
