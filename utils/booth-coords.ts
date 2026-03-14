/**
 * Booth coordinate mapping for the 2569 booth layout.
 * Image dimensions: 2048 x 1024px (native coordinate space)
 *
 * Column letters A–T map to approximate x-center pixel positions.
 * Row numbers 01–50 map to y positions via linear interpolation
 * (low numbers = bottom of hall, high numbers = top of hall).
 *
 * Calibrated from the 2569 official booth map image.
 */

// Column letters A-T mark the AISLE (vertical corridor) x-positions.
// Booth centers are midpoints between adjacent aisles.
// Aisle x-positions measured from column-letter pixel scan at y=82.
// Booth center = midpoint between consecutive aisle x-positions.
// OCR-verified: K28 Δx=-8,Δy=0 | K16 Δx=1,Δy=0 | M16 Δx=2,Δy=0
const COL_X: Record<string, number> = {
  A:  859, // midpoint(831, 887)
  B:  916, // midpoint(887, 944)
  C:  972, // midpoint(944, 1000)
  D: 1028, // midpoint(1000, 1056)
  E: 1085, // midpoint(1056, 1113)
  F: 1141, // midpoint(1113, 1169)
  G: 1197, // midpoint(1169, 1225)
  H: 1253, // midpoint(1225, 1281)
  I: 1310, // midpoint(1281, 1338)
  J: 1367, // midpoint(1338, 1395)
  K: 1423, // midpoint(1395, 1451)  ← OCR verified
  L: 1480, // midpoint(1451, 1508)
  M: 1535, // midpoint(1508, 1562)  ← OCR verified
  N: 1591, // midpoint(1562, 1619)
  O: 1648, // midpoint(1619, 1676)
  P: 1704, // midpoint(1676, 1732)
  Q: 1761, // midpoint(1732, 1789)
  R: 1817, // midpoint(1789, 1845)
  S: 1874, // midpoint(1845, 1902)
  T: 1971, // midpoint(1902, 2040)
};

// Row number range present in the map
const ROW_MIN = 1;
const ROW_MAX = 50;

// Y pixel range for row numbers (2048x1024 image)
// OCR-calibrated: K28 → y=417, K16 → y=506; linear fit → row1=617, row50=254.
// Row 1 → near bottom of hall, Row 50 → near top.
const Y_ROW_MIN = 617; // y for row 1
const Y_ROW_MAX = 254; // y for row 50

// MRT entrance: first vertical aisle (x=831), at middle horizontal aisle
export const MRT_ENTRANCE = { x: 831, y: 447 };

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

// Y-positions of horizontal aisles measured from pixel scan at x=860
const H_AISLES = [98, 168, 263, 322, 382, 447, 563, 659, 755];

function nearestAisleFor(y: number): number {
  return H_AISLES.reduce((best, a) =>
    Math.abs(a - y) < Math.abs(best - y) ? a : best
  );
}

// ---------------------------------------------------------------------------
// Route ordering — column sweep left → right
// ---------------------------------------------------------------------------

/**
 * Orders booths by sweeping columns left → right.
 * Column 1 (leftmost): top → bottom
 * Column 2: bottom → top
 * Column 3: top → bottom  ... and so on.
 */
export function optimiseRoute(booths: BoothCoords[]): BoothCoords[] {
  if (booths.length === 0) return [];

  // Group by x (each unique x value is one column)
  const colGroups = new Map<number, BoothCoords[]>();
  for (const booth of booths) {
    const group = colGroups.get(booth.x) ?? [];
    group.push(booth);
    colGroups.set(booth.x, group);
  }

  // Visit columns left → right
  const colOrder = Array.from(colGroups.keys()).sort((a, b) => a - b);

  const route: BoothCoords[] = [];
  let topToBottom = true;

  for (const col of colOrder) {
    const group = colGroups.get(col)!;
    // low y = top of image, high y = bottom of image
    const sorted = [...group].sort((a, b) => a.y - b.y);
    if (!topToBottom) sorted.reverse();
    route.push(...sorted);
    topToBottom = !topToBottom;
  }

  return route;
}

// ---------------------------------------------------------------------------
// Waypoint generation — route line follows the walkable grid
// ---------------------------------------------------------------------------

/**
 * Converts the ordered route into polyline waypoints on the aisle grid.
 * The line never cuts through booth blocks.
 *
 * Within a column: walk vertically along the column.
 * Between columns: walk horizontally along the current aisle to the new column,
 *                  then continue vertically.
 */
export function routeToWaypoints(
  route: BoothCoords[]
): { x: number; y: number }[] {
  if (route.length === 0) return [];

  const pts: { x: number; y: number }[] = [MRT_ENTRANCE];
  let curX = MRT_ENTRANCE.x;
  let curY = MRT_ENTRANCE.y;

  for (const stop of route) {
    const aisle = nearestAisleFor(stop.y);

    if (curX !== stop.x) {
      // Changing column: walk horizontally at the current y to the new column,
      // then walk vertically to the stop's aisle.
      pts.push({ x: curX, y: curY });   // stay (redundant but explicit)
      pts.push({ x: stop.x, y: curY }); // walk horizontally
      pts.push({ x: stop.x, y: aisle }); // walk vertically to the aisle
    } else {
      // Same column: walk vertically to the aisle
      pts.push({ x: curX, y: aisle });
    }

    curX = stop.x;
    curY = aisle;
  }

  return pts;
}
