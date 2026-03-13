/**
 * Booth coordinate mapping for the 2569 booth layout.
 * Image dimensions: 1137 x 633px
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

// MRT entrance: starting point for route optimisation (left side, mid-height)
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

/**
 * Y-positions of the 7 main horizontal walkable aisles on the 633px-tall image.
 * Derived from the visible corridor gaps in the 2569 booth layout.
 */
const H_AISLES = [55, 155, 248, 340, 430, 520, 615];

/**
 * Return the horizontal aisle y-position that minimises total vertical travel
 * for a walk from y1 to y2.
 */
function nearestAisle(y1: number, y2: number): number {
  let best = H_AISLES[0];
  let bestCost = Infinity;
  for (const a of H_AISLES) {
    const cost = Math.abs(y1 - a) + Math.abs(y2 - a);
    if (cost < bestCost) { bestCost = cost; best = a; }
  }
  return best;
}

/**
 * Convert an ordered route into aisle-following polyline waypoints.
 * Each segment goes: booth → nearest aisle → move horizontally → next booth.
 * This avoids cutting straight through other booths.
 */
export function routeToWaypoints(
  route: BoothCoords[]
): { x: number; y: number }[] {
  if (route.length === 0) return [];

  const pts: { x: number; y: number }[] = [MRT_ENTRANCE];
  let prev: { x: number; y: number } = MRT_ENTRANCE;

  for (const stop of route) {
    if (prev.x === stop.x) {
      // Same column — go straight, no need to use a horizontal aisle
      pts.push({ x: stop.x, y: stop.y });
    } else {
      const aisleY = nearestAisle(prev.y, stop.y);
      pts.push({ x: prev.x, y: aisleY });   // walk to aisle
      pts.push({ x: stop.x, y: aisleY });   // walk along aisle
      pts.push({ x: stop.x, y: stop.y });   // walk to booth
    }
    prev = stop;
  }

  return pts;
}

/**
 * Euclidean distance between two points.
 */
function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Nearest-neighbour route optimisation starting from the MRT entrance.
 * Returns the booths in suggested walking order.
 */
export function optimiseRoute(booths: BoothCoords[]): BoothCoords[] {
  if (booths.length === 0) return [];

  const remaining = [...booths];
  const route: BoothCoords[] = [];
  let current: { x: number; y: number } = MRT_ENTRANCE;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = dist(current, remaining[0]);
    for (let i = 1; i < remaining.length; i++) {
      const d = dist(current, remaining[i]);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }
    const next = remaining.splice(nearestIdx, 1)[0];
    route.push(next);
    current = next;
  }

  return route;
}
