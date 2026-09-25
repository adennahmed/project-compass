import { describe, expect, it } from "vitest";
import { findGridPath, gridKey } from "@/lib/pathfinding";

describe("playground A* pathfinding", () => {
  it("finds the shortest route across an open grid", () => {
    const result = findGridPath(5, 5, { col: 0, row: 0 }, { col: 4, row: 4 }, new Set());

    expect(result.path[0]).toBe(gridKey({ col: 0, row: 0 }, 5));
    expect(result.path.at(-1)).toBe(gridKey({ col: 4, row: 4 }, 5));
    expect(result.path).toHaveLength(9);
  });

  it("routes through the only available opening", () => {
    const walls = new Set([
      gridKey({ col: 2, row: 0 }, 5),
      gridKey({ col: 2, row: 1 }, 5),
      gridKey({ col: 2, row: 3 }, 5),
      gridKey({ col: 2, row: 4 }, 5),
    ]);
    const opening = gridKey({ col: 2, row: 2 }, 5);
    const result = findGridPath(5, 5, { col: 0, row: 0 }, { col: 4, row: 0 }, walls);

    expect(result.path).toContain(opening);
  });

  it("returns an empty path when the destination is isolated", () => {
    const walls = new Set([
      gridKey({ col: 3, row: 4 }, 5),
      gridKey({ col: 4, row: 3 }, 5),
    ]);
    const result = findGridPath(5, 5, { col: 0, row: 0 }, { col: 4, row: 4 }, walls);

    expect(result.path).toEqual([]);
  });
});
