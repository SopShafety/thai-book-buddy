/**
 * Schematic floor plan placeholder for the 2569 booth layout.
 * Uses the same 1980×1488 coordinate space as the real map image
 * so the route SVG overlay aligns correctly.
 */
export default function MapPlaceholder() {
  // Main horizontal aisles (y positions) — shared with booth-coords.ts
  const H_AISLES = [100, 315, 523, 730, 938, 1145, 1380];

  // Booth sections: space between consecutive aisles
  const sections: [number, number][] = [];
  for (let i = 0; i < H_AISLES.length - 1; i++) {
    sections.push([H_AISLES[i], H_AISLES[i + 1]]);
  }

  // The three halls
  const halls = [
    { x: 60,   w: 590, label: "Hall 5", cols: 4 },
    { x: 680,  w: 580, label: "Hall 6", cols: 6 },
    { x: 1305, w: 635, label: "Hall 7", cols: 6 },
  ];

  // Zone letters A–R across the top
  const zoneLetters = "ABCDEFGHIJKLMNOPQR".split("");
  const colX: Record<string, number> = {
    A:175,B:270,C:360,D:455,E:520,F:582,G:665,H:750,
    I:838,J:925,K:1010,L:1115,M:1215,N:1330,O:1420,P:1510,Q:1620,R:1720,
  };

  return (
    <svg
      width={1980}
      height={1488}
      viewBox="0 0 1980 1488"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width={1980} height={1488} fill="#ede8e2" />

      {/* Hall outlines */}
      {halls.map((hall) => (
        <rect
          key={hall.label}
          x={hall.x}
          y={H_AISLES[0]}
          width={hall.w}
          height={H_AISLES[H_AISLES.length - 1] - H_AISLES[0]}
          fill="#e6dfd7"
          stroke="#c4b5a0"
          strokeWidth={3}
          rx={4}
        />
      ))}

      {/* Booth blocks inside each hall × each section */}
      {halls.map((hall) =>
        sections.map(([y1, y2]) => {
          const pad = 10;
          const mid = (y1 + y2) / 2;
          const gap = 28; // inner aisle between facing booth rows
          const colW = (hall.w - pad * 2) / hall.cols;

          return (
            <g key={`${hall.label}-${y1}`}>
              {/* Top booth row */}
              <rect
                x={hall.x + pad}
                y={y1 + pad}
                width={hall.w - pad * 2}
                height={mid - gap / 2 - (y1 + pad)}
                fill="#d8cfc5"
                stroke="#c4b5a0"
                strokeWidth={1.5}
                rx={3}
              />
              {/* Column dividers inside top row */}
              {Array.from({ length: hall.cols - 1 }, (_, i) => (
                <line
                  key={`top-div-${i}`}
                  x1={hall.x + pad + colW * (i + 1)}
                  y1={y1 + pad}
                  x2={hall.x + pad + colW * (i + 1)}
                  y2={mid - gap / 2}
                  stroke="#c4b5a0"
                  strokeWidth={1}
                />
              ))}

              {/* Bottom booth row */}
              <rect
                x={hall.x + pad}
                y={mid + gap / 2}
                width={hall.w - pad * 2}
                height={y2 - pad - (mid + gap / 2)}
                fill="#d8cfc5"
                stroke="#c4b5a0"
                strokeWidth={1.5}
                rx={3}
              />
              {/* Column dividers inside bottom row */}
              {Array.from({ length: hall.cols - 1 }, (_, i) => (
                <line
                  key={`bot-div-${i}`}
                  x1={hall.x + pad + colW * (i + 1)}
                  y1={mid + gap / 2}
                  x2={hall.x + pad + colW * (i + 1)}
                  y2={y2 - pad}
                  stroke="#c4b5a0"
                  strokeWidth={1}
                />
              ))}
            </g>
          );
        })
      )}

      {/* Zone letters A–R at top */}
      {zoneLetters.map((l) => (
        <text
          key={l}
          x={colX[l]}
          y={75}
          textAnchor="middle"
          fill="#a6917e"
          fontSize={28}
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          {l}
        </text>
      ))}

      {/* Zone letters A–R at bottom */}
      {zoneLetters.map((l) => (
        <text
          key={`bot-${l}`}
          x={colX[l]}
          y={1420}
          textAnchor="middle"
          fill="#a6917e"
          fontSize={28}
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          {l}
        </text>
      ))}

      {/* Hall labels at bottom */}
      {halls.map((hall) => (
        <text
          key={`lbl-${hall.label}`}
          x={hall.x + hall.w / 2}
          y={1465}
          textAnchor="middle"
          fill="#9c7a5b"
          fontSize={36}
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          {hall.label}
        </text>
      ))}

      {/* MRT entrance marker (left side) */}
      <g>
        <rect x={0} y={680} width={52} height={110} fill="#c4855a" rx={4} />
        <text
          x={26}
          y={726}
          textAnchor="middle"
          fill="white"
          fontSize={22}
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          MRT
        </text>
        <text
          x={26}
          y={754}
          textAnchor="middle"
          fill="white"
          fontSize={22}
          fontFamily="sans-serif"
        >
          ↕
        </text>
      </g>

      {/* Entry arrows at bottom of each hall */}
      {halls.map((hall) => (
        <g key={`entry-${hall.label}`}>
          <text
            x={hall.x + hall.w / 2}
            y={1440}
            textAnchor="middle"
            fill="#c4855a"
            fontSize={48}
            fontFamily="sans-serif"
          >
            ↑↓
          </text>
        </g>
      ))}

    </svg>
  );
}
