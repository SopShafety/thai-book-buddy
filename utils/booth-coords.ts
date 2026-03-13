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
 * These are the corridor gaps between booth row groups.
 */
const H_AISLES = [55, 155, 248, 340, 430, 520, 615];

/**
 * X-positions of the vertical corridors between halls (and outer edges).
 * Used to connect two different horizontal aisles without crossing booths.
 *   Hall 5 (A–F) | corridor | Hall 6 (G–L) | corridor | Hall 7 (M–R) | corridor | Hall 8 (S–T)
 */
const V_CORRIDORS = [8, 327, 634, 986, 1130];

/** Nearest horizontal aisle to a single y-position. */
function nearestAisleFor(y: number): number {
  let best = H_AISLES[0];
  let bestDist = Infinity;
  for (const a of H_AISLES) {
    const d = Math.abs(y - a);
    if (d < bestDist) { bestDist = d; best = a; }
  }
  return best;
}

/** Nearest vertical corridor to a given x-position. */
function nearestCorridorFor(x: number): number {
  let best = V_CORRIDORS[0];
  let bestDist = Infinity;
  for (const v of V_CORRIDORS) {
    const d = Math.abs(x - v);
    if (d < bestDist) { bestDist = d; best = v; }
  }
  return best;
}

/**
 * Convert an ordered route into aisle-following polyline waypoints.
 *
 * Each stop exits through its OWN nearest horizontal aisle (short vertical hop).
 * When consecutive stops use different aisles, a vertical corridor connects them
 * so the line never cuts through booth areas.
 *
 * Path shape per segment:
 *   booth A → aisleA (vertical) → corridor (horizontal) → aisleB (vertical) → booth B
 * When aisleA == aisleB the corridor hop is skipped.
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

    pts.push({ x: prev.x, y: aisleA }); // exit prev position to its nearest aisle

    if (aisleA === aisleB) {
      // Same aisle — walk straight across
      pts.push({ x: stop.x, y: aisleA });
    } else {
      // Different aisles — route via the nearest vertical corridor
      const corridor = nearestCorridorFor((prev.x + stop.x) / 2);
      pts.push({ x: corridor, y: aisleA }); // walk along aisleA to corridor
      pts.push({ x: corridor, y: aisleB }); // walk down/up corridor to aisleB
      pts.push({ x: stop.x,   y: aisleB }); // walk along aisleB to destination column
    }

    pts.push({ x: stop.x, y: stop.y }); // enter destination booth
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
