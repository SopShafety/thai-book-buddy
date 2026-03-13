/**
 * Booth coordinate mapping for the 2568 (last year) booth layout.
 * Image dimensions: 1980 x 1488px
 *
 * Column letters A–R map to approximate x-center pixel positions.
 * Row numbers 01–49 map to y positions via linear interpolation
 * (low numbers = bottom of hall, high numbers = top of hall).
 *
 * These are intentionally approximate — good enough for a route overlay demo.
 * Will be replaced with precise coordinates once the 2569 layout is released.
 */

// X-center for each column letter (px, on 1980px-wide image)
const COL_X: Record<string, number> = {
  A: 175,
  B: 270,
  C: 360,
  D: 455,
  E: 520,
  F: 582,
  G: 665,
  H: 750,
  I: 838,
  J: 925,
  K: 1010,
  L: 1115,
  M: 1215,
  N: 1330,
  O: 1420,
  P: 1510,
  Q: 1620,
  R: 1720,
};

// Row number range present in the map
const ROW_MIN = 1;
const ROW_MAX = 49;

// Y pixel range for row numbers (1980x1488 image)
// Row 1 → near bottom of hall, Row 49 → near top
const Y_ROW_MIN = 1340; // y for row 1
const Y_ROW_MAX = 95;   // y for row 49

// MRT entrance: starting point for route optimisation (left side, mid-height)
export const MRT_ENTRANCE = { x: 60, y: 750 };

export interface BoothCoords {
  x: number;
  y: number;
  booth: string;
}

/**
 * Parse a booth number string like "J30" or "B46" into { col, row }.
 * Returns null for unrecognised formats (e.g. "S01" special booths).
 */
function parseBooth(booth: string): { col: string; row: number } | null {
  const match = booth.trim().match(/^([A-Ra-r])(\d+)$/);
  if (!match) return null;
  const col = match[1].toUpperCase();
  const row = parseInt(match[2], 10);
  if (!COL_X[col] || row < ROW_MIN || row > ROW_MAX) return null;
  return { col, row };
}

/**
 * Convert a booth number string to pixel coordinates on the 1980×1488 map image.
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
