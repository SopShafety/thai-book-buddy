#!/usr/bin/env python3
"""
booth_ocr.py — Extract booth coordinates from Floorplan.svg.

Steps:
  1. Parse SVG <rect> elements → exact booth polygons + fill colours
  2. Render SVG to high-res PNG via cairosvg (crisp vector render)
  3. Run EasyOCR on rendered PNG → booth number labels + positions
  4. Snap each OCR result to the nearest SVG rect (within 60 px)
  5. Per-cell OCR on unmatched rects (at 8× scale) to catch the rest
  6. Validate matched set against Supabase booths table
  7. Write utils/booth-coords-data.ts

Usage:
  SUPABASE_KEY=eyJ... python3 scripts/booth_ocr.py

Requirements:
  pip3 install cairosvg easyocr opencv-python pytesseract pillow numpy requests
  brew install tesseract
"""

import cv2
import easyocr
import pytesseract
import cairosvg
import numpy as np
import re
import os
import sys
import json
import requests
import xml.etree.ElementTree as ET
from pathlib import Path
from collections import defaultdict

# ── Config ────────────────────────────────────────────────────────────────────

SCRIPT_DIR   = Path(__file__).parent
REPO_ROOT    = SCRIPT_DIR.parent
SVG_PATH     = Path("/Users/mangporh/claude/bookfair-buddy/Floorplan.svg")
RENDER_PATH  = Path("/tmp/floorplan_rendered.png")
OUTPUT_TS    = REPO_ROOT / "utils" / "booth-coords-data.ts"

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://eoyiqojukzbjgayabcth.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# Render at 2× for better OCR without being too slow
RENDER_SCALE = 2.0

# Full image dimensions (native SVG coordinate space)
IMG_W, IMG_H = 2560, 1932

# Booth grid crop (to skip title/legend in OCR pass)
GRID = dict(x1=190, y1=150, x2=2390, y2=1500)

# Max distance (px, native coords) to snap an OCR result to a rect center
SNAP_DIST = 60

# ── Font fix: map OCR errors in the numeric part ──────────────────────────────

BOOTH_RE = re.compile(r'^[A-T]\d{2,3}$')

def fix_font(s: str) -> str:
    """Fix common OCR misreads caused by stylised font (e.g. 2→Z)."""
    s = s.upper().strip()
    if len(s) < 3:
        return s
    letter = s[0]
    nums   = s[1:]
    nums   = (nums.replace('Z', '2').replace('S', '5')
                   .replace('I', '1').replace('O', '0')
                   .replace('B', '8'))
    return letter + nums

# ── Phase 1: Parse SVG rects ──────────────────────────────────────────────────

print(f"── Phase 1: Parse SVG ({SVG_PATH.name}) ──")

tree = ET.parse(str(SVG_PATH))
root = tree.getroot()

rects: list[dict] = []
for elem in root.iter():
    tag   = elem.tag.split('}')[-1]
    if tag != 'rect':
        continue
    w     = float(elem.get('width',  0))
    h     = float(elem.get('height', 0))
    fill  = elem.get('fill', '')
    t     = elem.get('transform', '')
    if w >= 2000:           # skip background rect
        continue
    m = re.match(r'translate\(([0-9.]+)\s+([0-9.]+)\)', t)
    if not m:
        continue
    x, y  = float(m.group(1)), float(m.group(2))
    rects.append({'x': x, 'y': y, 'w': w, 'h': h, 'fill': fill})

print(f"  {len(rects)} booth rects")

def rect_center(r: dict) -> tuple[float, float]:
    return r['x'] + r['w'] / 2, r['y'] + r['h'] / 2

def rect_polygon(r: dict) -> list[tuple[int, int]]:
    x, y, w, h = int(r['x']), int(r['y']), int(r['w']), int(r['h'])
    return [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]

# ── Phase 2: Render SVG to PNG ────────────────────────────────────────────────

print(f"\n── Phase 2: Render SVG @ {RENDER_SCALE}× ──")
if not RENDER_PATH.exists():
    cairosvg.svg2png(url=str(SVG_PATH), write_to=str(RENDER_PATH), scale=RENDER_SCALE)
img_full = cv2.imread(str(RENDER_PATH))
rh, rw   = img_full.shape[:2]
print(f"  Rendered {rw}×{rh}px")

# ── Phase 3: Full-grid EasyOCR ────────────────────────────────────────────────

print(f"\n── Phase 3: EasyOCR full grid ──")
reader = easyocr.Reader(['en'], gpu=False, verbose=False)

gx1 = int(GRID['x1'] * RENDER_SCALE);  gy1 = int(GRID['y1'] * RENDER_SCALE)
gx2 = int(GRID['x2'] * RENDER_SCALE);  gy2 = int(GRID['y2'] * RENDER_SCALE)
grid_img = img_full[gy1:gy2, gx1:gx2]

raw_results = reader.readtext(
    grid_img, detail=1, paragraph=False,
    allowlist='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    width_ths=0.3, height_ths=0.3,
)

# Collect best OCR result per booth number (native image coords)
ocr_booths: dict[str, tuple[int, int, float]] = {}
for (bbox, text, conf) in raw_results:
    fixed = fix_font(text.strip())
    if not BOOTH_RE.match(fixed) or conf < 0.25:
        continue
    pts = np.array(bbox)
    cx  = int(pts[:, 0].mean() / RENDER_SCALE) + GRID['x1']
    cy  = int(pts[:, 1].mean() / RENDER_SCALE) + GRID['y1']
    if fixed not in ocr_booths or conf > ocr_booths[fixed][2]:
        ocr_booths[fixed] = (cx, cy, conf)

print(f"  OCR detected {len(ocr_booths)} booth labels")

# ── Phase 4: Snap OCR → nearest SVG rect ─────────────────────────────────────

print(f"\n── Phase 4: Snap OCR → SVG rects ──")

matched:    dict[str, dict] = {}       # booth_num → {rect info + pin}
used_rects: set[int]        = set()    # indices of rects already claimed

for booth_num, (cx, cy, conf) in ocr_booths.items():
    best_idx  = -1
    best_dist = float('inf')
    for i, r in enumerate(rects):
        if i in used_rects:
            continue
        rcx, rcy = rect_center(r)
        d = ((rcx - cx) ** 2 + (rcy - cy) ** 2) ** 0.5
        if d < best_dist:
            best_dist = d
            best_idx  = i
    if best_idx >= 0 and best_dist <= SNAP_DIST:
        r = rects[best_idx]
        matched[booth_num] = {
            **r,
            'pin_x':   cx,
            'pin_y':   cy,
            'polygon': rect_polygon(r),
        }
        used_rects.add(best_idx)

print(f"  Matched {len(matched)}/{len(rects)} rects  ({len(rects)-len(matched)} unmatched rects)")

# ── Phase 5: Per-cell EasyOCR on unmatched rects ─────────────────────────────

print(f"\n── Phase 5: Per-cell OCR on unmatched rects ──")
IMG_NATIVE = cv2.imread(str(REPO_ROOT / "public" / "booth-map-2569.jpg"))
CELL_SCALE = 8
PAD        = 3
recovered  = 0

unmatched_rect_indices = [i for i in range(len(rects)) if i not in used_rects]

for i in unmatched_rect_indices:
    r = rects[i]
    x1 = max(0, int(r['x']) - PAD)
    y1 = max(0, int(r['y']) - PAD)
    x2 = min(IMG_W, int(r['x'] + r['w']) + PAD)
    y2 = min(IMG_H, int(r['y'] + r['h']) + PAD)

    # Run on rendered SVG crop (crisper than JPEG)
    rx1 = int(x1 * RENDER_SCALE); ry1 = int(y1 * RENDER_SCALE)
    rx2 = int(x2 * RENDER_SCALE); ry2 = int(y2 * RENDER_SCALE)
    cell_render = img_full[ry1:ry2, rx1:rx2]
    if cell_render.size == 0:
        continue
    cell_up = cv2.resize(cell_render, None, fx=4, fy=4, interpolation=cv2.INTER_CUBIC)

    detections = reader.readtext(
        cell_up, detail=1, paragraph=False,
        allowlist='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    )
    for (bbox, text, conf) in detections:
        fixed = fix_font(text.strip())
        if not BOOTH_RE.match(fixed) or conf < 0.2:
            continue
        if fixed in matched:
            continue
        rcx, rcy = rect_center(r)
        matched[fixed] = {
            **r,
            'pin_x':   int(rcx),
            'pin_y':   int(rcy),
            'polygon': rect_polygon(r),
        }
        used_rects.add(i)
        recovered += 1
        break

print(f"  Recovered {recovered} additional booths  (total: {len(matched)})")
still_unmatched = [i for i in range(len(rects)) if i not in used_rects]
print(f"  Still unmatched SVG rects: {len(still_unmatched)}")
if still_unmatched:
    for i in still_unmatched[:10]:
        r = rects[i]
        print(f"    rect @ ({r['x']:.0f},{r['y']:.0f}) {r['w']:.0f}×{r['h']:.0f}  fill={r['fill']}")

# ── Phase 5.2: Pre-reserve manual overrides before DB-spatial match ──────────
# Booths that are difficult/impossible to detect automatically.
# Identified by inspecting nearest-unmatched-rect output across multiple runs.
# Rect positions verified against Floorplan.svg directly.

MANUAL: dict[str, dict] = {
    "B44": {'x': 579,  'y': 354,  'w': 154, 'h': 92,  'fill': '#1D85C6'},
    "C24": {'x': 763,  'y': 881,  'w': 61,  'h': 20,  'fill': '#1D85C6'},
    "D26": {'x': 887,  'y': 830,  'w': 30,  'h': 20,  'fill': '#1D85C6'},
    "G41": {'x': 1132, 'y': 477,  'w': 30,  'h': 60,  'fill': '#1D85C6'},
    "G45": {'x': 1163, 'y': 477,  'w': 30,  'h': 122, 'fill': '#1D85C6'},
    "G49": {'x': 989,  'y': 354,  'w': 265, 'h': 92,  'fill': '#1D85C6'},
    "I26": {'x': 1163, 'y': 830,  'w': 30,  'h': 20,  'fill': '#1D85C6'},
    "I27": {'x': 1163, 'y': 851,  'w': 30,  'h': 30,  'fill': '#1D85C6'},
    "I29": {'x': 1132, 'y': 830,  'w': 30,  'h': 20,  'fill': '#1D85C6'},
    "I30": {'x': 1132, 'y': 851,  'w': 30,  'h': 30,  'fill': '#1D85C6'},
    "I32": {'x': 1224, 'y': 636,  'w': 30,  'h': 152, 'fill': '#1D85C6'},
    "M25": {'x': 1531, 'y': 882,  'w': 30,  'h': 20,  'fill': '#1D85C6'},
    "O02": {'x': 1714, 'y': 1344, 'w': 30,  'h': 30,  'fill': '#1D85C6'},
    "O08": {'x': 1775, 'y': 1283, 'w': 30,  'h': 30,  'fill': '#1D85C6'},
    "O32": {'x': 1775, 'y': 636,  'w': 30,  'h': 152, 'fill': '#F68724'},
    "I41": {'x': 1224, 'y': 477,  'w': 30,  'h': 90,  'fill': '#1D85C6'},
    "I44": {'x': 1296, 'y': 354,  'w': 162, 'h': 92,  'fill': '#1D85C6'},
    "O01": {'x': 1714, 'y': 1344, 'w': 30,  'h': 30,  'fill': '#1D85C6'},
    "O03": {'x': 1775, 'y': 1314, 'w': 30,  'h': 60,  'fill': '#1D85C6'},
    "O07": {'x': 1714, 'y': 1283, 'w': 30,  'h': 60,  'fill': '#1D85C6'},
}

manual_added = 0
for booth_num, r in MANUAL.items():
    if booth_num not in matched:
        rcx = int(r['x'] + r['w'] / 2)
        rcy = int(r['y'] + r['h'] / 2)
        matched[booth_num] = {
            **r,
            'pin_x':   rcx,
            'pin_y':   rcy,
            'polygon': rect_polygon(r),
        }
        # Mark the nearest rect as used so Phase 5.5 doesn't re-claim it
        best_i, best_d = -1, float('inf')
        for i, rect in enumerate(rects):
            if i in used_rects:
                continue
            d = ((rect['x'] + rect['w']/2 - rcx)**2 + (rect['y'] + rect['h']/2 - rcy)**2)**0.5
            if d < best_d:
                best_d, best_i = d, i
        if best_i >= 0 and best_d < 80:
            used_rects.add(best_i)
        manual_added += 1

print(f"\n── Phase 5.2: Manual overrides ──")
print(f"  Pre-reserved {manual_added} booths  (total: {len(matched)})")

# ── Phase 5.5: DB-spatial match for remaining unmatched rects ────────────────

print(f"\n── Phase 5.5: DB-spatial match ──")

if SUPABASE_KEY:
    try:
        resp = requests.get(
            f"{SUPABASE_URL}/rest/v1/booths?select=booth_number",
            headers={
                "apikey":        SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
            },
            timeout=10,
        )
        resp.raise_for_status()
        db_all       = {row["booth_number"] for row in resp.json()}
        db_unmatched = db_all - set(matched.keys())   # DB booths we haven't located yet
        unmatched_ri = [i for i in range(len(rects)) if i not in used_rects]

        print(f"  {len(db_unmatched)} DB booths unlocated, {len(unmatched_ri)} SVG rects unclaimed")

        # Build a rough column→x_center map from already-matched booths
        col_x: dict[str, list[float]] = defaultdict(list)
        for bn, d in matched.items():
            col_x[bn[0]].append(d['x'] + d['w'] / 2)
        col_x_center = {c: np.mean(xs) for c, xs in col_x.items()}

        # Interpolate missing columns (I between H/J, O between N/P)
        for missing, left, right in [('I', 'H', 'J'), ('O', 'N', 'P')]:
            if missing not in col_x_center and left in col_x_center and right in col_x_center:
                col_x_center[missing] = (col_x_center[left] + col_x_center[right]) / 2
                print(f"  Interpolated {missing} column x-center: {col_x_center[missing]:.0f}")

        # Build row→y_center map similarly
        row_y: dict[int, list[float]] = defaultdict(list)
        for bn, d in matched.items():
            row_y[int(bn[1:])].append(d['y'] + d['h'] / 2)
        row_y_center = {r: np.mean(ys) for r, ys in row_y.items()}

        def expected_pos(booth_num: str) -> tuple[float, float] | None:
            """Estimate where a booth should be based on its column + row number."""
            col  = booth_num[0]
            row  = int(booth_num[1:])
            cx   = col_x_center.get(col)
            cy   = row_y_center.get(row)
            if cx is None or cy is None:
                return None
            return cx, cy

        spatial_recovered = 0
        for booth_num in sorted(db_unmatched):   # sort for deterministic ordering
            pos = expected_pos(booth_num)
            if pos is None:
                continue
            ex, ey = pos
            best_idx  = -1
            best_dist = float('inf')
            for i in unmatched_ri:
                rcx, rcy = rect_center(rects[i])
                d = ((rcx - ex) ** 2 + (rcy - ey) ** 2) ** 0.5
                if d < best_dist:
                    best_dist = d
                    best_idx  = i
            # Accept match if within 2× column pitch (~120 px)
            if best_idx >= 0 and best_dist < 120:
                r = rects[best_idx]
                rcx, rcy = rect_center(r)
                matched[booth_num] = {
                    **r,
                    'pin_x':   int(rcx),
                    'pin_y':   int(rcy),
                    'polygon': rect_polygon(r),
                }
                used_rects.add(best_idx)
                unmatched_ri.remove(best_idx)
                spatial_recovered += 1

        print(f"  DB-spatial matched {spatial_recovered} additional booths  (total: {len(matched)})")

        # Remove OCR false positives (detected but not in DB)
        false_positives = set(matched.keys()) - db_all
        for fp in false_positives:
            del matched[fp]
        if false_positives:
            print(f"  Removed {len(false_positives)} OCR false positives: {sorted(false_positives)}")

        print(f"  Final: {len(matched)} booths  |  still missing: {len(db_all - set(matched.keys()))}")

    except Exception as e:
        print(f"  ⚠️  Supabase error in Phase 5.5: {e}")
        db_all = set()
else:
    db_all = set()
    print("  ⚠️  SUPABASE_KEY not set — skipping DB-spatial match")

# ── Phase 6: Validate against Supabase ───────────────────────────────────────

print(f"\n── Phase 6: Supabase validation ──")

if SUPABASE_KEY:
    try:
        resp = requests.get(
            f"{SUPABASE_URL}/rest/v1/booths?select=booth_number",
            headers={
                "apikey":        SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
            },
            timeout=10,
        )
        resp.raise_for_status()
        db_booths = {row["booth_number"] for row in resp.json()}
        ocr_set   = set(matched.keys())

        in_db_only  = db_booths  - ocr_set
        in_ocr_only = ocr_set    - db_booths

        if in_db_only:
            print(f"\n  ⚠️  In DB but NOT detected ({len(in_db_only)}) — add manually:")
            for b in sorted(in_db_only):
                print(f"     {b}")
        if in_ocr_only:
            print(f"\n  ⚠️  Detected but NOT in DB ({len(in_ocr_only)}) — possible misread:")
            for b in sorted(in_ocr_only):
                print(f"     {b}")

        print(f"\n  ✅ {len(ocr_set & db_booths)}/{len(db_booths)} DB booths located")
    except Exception as e:
        print(f"  ⚠️  Supabase error: {e}")
else:
    print("  ⚠️  SUPABASE_KEY not set — skipping")
    print("     Re-run: SUPABASE_KEY=eyJ... python3 scripts/booth_ocr.py")

# ── Phase 7: Write TypeScript ─────────────────────────────────────────────────

print(f"\n── Phase 7: Write {OUTPUT_TS.name} ──")

lines = [
    "// AUTO-GENERATED by scripts/booth_ocr.py — do not edit manually.",
    f"// Source: Floorplan.svg  ({IMG_W}×{IMG_H}px native coordinate space)",
    "// Re-run: python3 scripts/booth_ocr.py",
    "",
    "export interface BoothData {",
    "  /** Center of the booth number text label — used for map pins */",
    "  pinX: number;",
    "  pinY: number;",
    "  /** Fill colour from the SVG — used for booth category colour */",
    "  fill: string;",
    "  /** Polygon vertices for SVG mask cutout (supports L-shaped booths) */",
    "  polygon: [number, number][];",
    "}",
    "",
    f"export const IMAGE_W = {IMG_W};",
    f"export const IMAGE_H = {IMG_H};",
    "",
    "export const BOOTH_DATA: Record<string, BoothData> = {",
]

for booth_num in sorted(matched.keys()):
    d    = matched[booth_num]
    poly = ", ".join(f"[{x},{y}]" for x, y in d['polygon'])
    lines.append(
        f'  "{booth_num}": {{'
        f' pinX: {d["pin_x"]}, pinY: {d["pin_y"]},'
        f' fill: "{d["fill"]}",'
        f' polygon: [{poly}] }},'
    )

lines += ["};", ""]
OUTPUT_TS.write_text("\n".join(lines))
print(f"  ✅ Wrote {len(matched)} booths → {OUTPUT_TS}")

# Summary per column
print("\n── Summary ──")
col_counts = defaultdict(list)
for b in matched:
    col_counts[b[0]].append(int(b[1:]))
for col in sorted(col_counts):
    print(f"  {col}: {len(col_counts[col])} booths — {sorted(col_counts[col])}")
