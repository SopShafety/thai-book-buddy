/**
 * Booth coordinate mapping for the 2569 booth layout.
 * Image dimensions: 1137 x 633px (native coordinate space)
 *
 * Column letters A–T map to approximate x-center pixel positions.
 * Row numbers 01–50 map to y positions via linear interpolation
 * (low numbers = bottom of hall, high numbers = top of hall).
 *
 * Calibrated from the 2569 official booth map image.
 */

// X-center for each column letter (px, on 1137px-wide image)
const COL_X: Record<string, number> = {
  A:   22,
  B:   82,
  C:  133,
  D:  188,
  E:  244,
  F:  296,
  G:  358,
  H:  408,
  I:  458,
  J:  511,
  K:  557,
  L:  608,
  M:  661,
  N:  722,
  O:  779,
  P:  833,
  Q:  894,
  R:  952,
  S: 1020,
  T: 1097,
};

// Row number range present in the map
const ROW_MIN = 1;
const ROW_MAX = 50;

// Y pixel range for row numbers (1137x633 image)
// Row 1 → near bottom of hall, Row 50 → near top
const Y_ROW_MIN = 608; // y for row 1
const Y_ROW_MAX =  25; // y for row 50

// MRT entrance: left outer edge, mid-height
export const MRT_ENTRANCE = { x: 8, y: 320 };

export interface BoothCoords {
  x: number;
  y: number;
  booth: string;
}

/**
 * Parse a booth number string like "J30" or "B46" into { col, row }.
 * Returns null for unrecognised formats (e.g. "U01" special booths).
 */
function parseBooth(booth: string): { col: string; row: number } | null {
  const match = booth.trim().match(/^([A-Ta-t])(\d+)$/);
  if (!match) return null;
  const col = match[1].toUpperCase();
  const row = parseInt(match[2], 10);
  if (!COL_X[col] || row < ROW_MIN || row > ROW_MAX) return null;
  return { col, row };
}

/**
 * Convert a booth number string to pixel coordinates on the 1137×633 map image.
 * Returns null if the booth number can't be parsed.
 */
export function boothToCoords(booth: string): BoothCoords | null {
  const parsed = parseBooth(booth);
  if (!parsed) return null;

  const x = COL_X[parsed.col];
  const t = (parsed.row - ROW_MIN) / (ROW_MAX - ROW_MIN); // 0 = bottom, 1 = top
  const y = Y_ROW_MIN + t * (Y_ROW_MAX - Y_ROW_MIN);

  return { x, y: Math.round(y), booth };
}

/**
 * Given a list of booth numbers, return only those that map to valid coordinates.
 */
export function resolveBooths(boothNumbers: string[]): BoothCoords[] {
  return boothNumbers.flatMap((b) => {
    const c = boothToCoords(b);
    return c ? [c] : [];
  });
}

// ---------------------------------------------------------------------------
// Walkable grid
// ---------------------------------------------------------------------------

/**
 * Y-positions of the 7 main horizontal aisles on the 633px-tall image.
 */
const H_AISLES = [55, 155, 248, 340, 430, 520, 615];

/**
 * X-positions of all 21 vertical walkways.
 * Left outer edge (MRT side) plus one walkway per column A–T.
 */
const V_CORRIDORS = [
  8,                                                   // left outer / MRT
  22, 82, 133, 188, 244, 296, 358, 408, 458, 511,     // A – J
  557, 608, 661, 722, 779, 833, 894, 952, 1020, 1097, // K – T
];

function nearestAisleFor(y: number): number {
  return H_AISLES.reduce((best, a) =>
    Math.abs(a - y) < Math.abs(best - y) ? a : best
  );
}

function nearestCorridorFor(x: number): number {
  return V_CORRIDORS.reduce((best, v) =>
    Math.abs(v - x) < Math.abs(best - x) ? v : best
  );
}

// ---------------------------------------------------------------------------
// Route optimisation — true alternating serpentine
// ---------------------------------------------------------------------------

/**
 * Orders booths as a clean lawnmower sweep:
 *
 * 1. Group booths by nearest horizontal aisle.
 * 2. Visit aisles top-to-bottom (or bottom-to-top if that extreme is closer
 *    to the MRT entrance).
 * 3. Strictly alternate sweep direction aisle-by-aisle: the first aisle
 *    sweeps LEFT→RIGHT (MRT is on the left), the next RIGHT→LEFT, and so on.
 *
 * This guarantees the path never crosses itself horizontally — no zigzags.
 */
export function optimiseRoute(booths: BoothCoords[]): BoothCoords[] {
  if (booths.length === 0) return [];

  // Group by nearest aisle
  const aisleGroups = new Map<number, BoothCoords[]>();
  for (const booth of booths) {
    const aisle = nearestAisleFor(booth.y);
    const group = aisleGroups.get(aisle) ?? [];
    group.push(booth);
    aisleGroups.set(aisle, group);
  }

  // Start from whichever extreme (top or bottom) is closer to MRT entrance
  const aisleOrder = Array.from(aisleGroups.keys()).sort((a, b) => a - b);
  const distToTop    = Math.abs(aisleOrder[0]                     - MRT_ENTRANCE.y);
  const distToBottom = Math.abs(aisleOrder[aisleOrder.length - 1] - MRT_ENTRANCE.y);
  if (distToBottom < distToTop) aisleOrder.reverse();

  // Alternate direction each aisle — first sweep is L→R (MRT is on the left)
  const route: BoothCoords[] = [];
  let leftToRight = true;

  for (const aisle of aisleOrder) {
    const group = aisleGroups.get(aisle)!;
    const sorted = [...group].sort((a, b) => a.x - b.x);
    if (!leftToRight) sorted.reverse();
    route.push(...sorted);
    leftToRight = !leftToRight;
  }

  return route;
}

// ---------------------------------------------------------------------------
// Waypoint generation — minimal L-shaped segments along walkways
// ---------------------------------------------------------------------------

/**
 * Converts an ordered route into polyline waypoints that follow the walkable
 * grid. Each segment between consecutive stops uses the minimum number of
 * bends: one bend (same aisle) or three bends (different aisles via corridor).
 */
export function routeToWaypoints(
  route: BoothCoords[]
): { x: number; y: number }[] {
  if (route.length === 0) return [];

  const pts: { x: number; y: number }[] = [MRT_ENTRANCE];
  let prev: { x: number; y: number } = MRT_ENTRANCE;

  for (const stop of route) {
    const aisleA = nearestAisleFor(prev.y);
    const aisleB = nearestAisleFor(stop.y);

    pts.push({ x: prev.x, y: aisleA });

    if (aisleA === aisleB) {
      pts.push({ x: stop.x, y: aisleA });
    } else {
      const corridor = nearestCorridorFor((prev.x + stop.x) / 2);
      pts.push({ x: corridor, y: aisleA });
      pts.push({ x: corridor, y: aisleB });
      pts.push({ x: stop.x,  y: aisleB });
    }

    pts.push({ x: stop.x, y: stop.y });
    prev = stop;
  }

  return pts;
}
