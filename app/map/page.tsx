"use client";
import { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Navigation } from "lucide-react";
import BrandHeader from "../../components/BrandHeader";
import BottomNav from "../../components/BottomNav";
import { useLIFF } from "../../providers/liff-providers";
import { getSupabase } from "../../utils/supabase";
import { resolveBooths, optimiseRoute, routeToWaypoints, type BoothCoords } from "../../utils/booth-coords";

const IMAGE_W = 1980;
const IMAGE_H = 1488;

// Sample booths spread across the map for demo mode
const DEMO_BOOTHS = [
  { booth: "J30", name_th: "ตัวอย่าง: สำนักพิมพ์ J" },
  { booth: "F08", name_th: "ตัวอย่าง: สำนักพิมพ์ F" },
  { booth: "B32", name_th: "ตัวอย่าง: สำนักพิมพ์ B" },
  { booth: "N20", name_th: "ตัวอย่าง: สำนักพิมพ์ N" },
  { booth: "A15", name_th: "ตัวอย่าง: สำนักพิมพ์ A" },
  { booth: "H25", name_th: "ตัวอย่าง: สำนักพิมพ์ H" },
];

interface RouteStop extends BoothCoords {
  name_th: string;
}

export default function MapPage() {
  const { isLoggedIn } = useLIFF();
  const [route, setRoute] = useState<RouteStop[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [showList, setShowList] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      if (!isLoggedIn) {
        setIsDemo(true);
        setRoute(buildRoute(DEMO_BOOTHS));
        setLoaded(true);
        return;
      }
      try {
        const supabase = getSupabase();
        const { data: sels } = await supabase
          .from("user_selections")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .select("publishers(name_th, booths(booth_number))") as any;

        const pairs: { booth: string; name_th: string }[] = [];
        if (sels) {
          for (const sel of sels) {
            const pub = Array.isArray(sel.publishers) ? sel.publishers[0] : sel.publishers;
            if (!pub) continue;
            const booth = pub.booths?.[0]?.booth_number;
            if (booth) pairs.push({ booth, name_th: pub.name_th });
          }
        }

        if (pairs.length === 0) {
          setIsDemo(true);
          setRoute(buildRoute(DEMO_BOOTHS));
        } else {
          setRoute(buildRoute(pairs));
        }
      } catch {
        setIsDemo(true);
        setRoute(buildRoute(DEMO_BOOTHS));
      }
      setLoaded(true);
    }
    load();
  }, [isLoggedIn]);

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#fafaf8] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-[16px] pt-[24px] pb-[10px]">
        <BrandHeader />
        <div className="flex items-center justify-between">
          <p className="font-[family-name:var(--font-prompt)] font-semibold text-[32px] text-[#3d2b1a] leading-tight">
            ผังงาน
          </p>
          <div className="px-[10px] py-[4px] rounded-full bg-[#f0e4d4]">
            <p className="font-[family-name:var(--font-prompt)] font-light text-[11px] text-[#973c00]">
              {isDemo ? "ตัวอย่าง • " : ""}ผังปี 2568
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1 overflow-hidden bg-[#e0dbd4]">
        <TransformWrapper
          initialScale={0.2}
          minScale={0.1}
          maxScale={4}
          centerOnInit
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{ width: IMAGE_W, height: IMAGE_H, position: "relative" }}
          >
            <img
              src="/booth-map-2024.png"
              alt="ผังบูธ"
              width={IMAGE_W}
              height={IMAGE_H}
              style={{ display: "block" }}
            />
            {/* SVG route overlay */}
            {loaded && route.length > 0 && (
              <svg
                width={IMAGE_W}
                height={IMAGE_H}
                style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
              >
                {/* Route dashed line — follows horizontal aisles */}
                <polyline
                  points={routeToWaypoints(route).map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="#c4855a"
                  strokeWidth={14}
                  strokeOpacity={0.75}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray="30 18"
                />
                {/* Numbered pins */}
                {route.map((c, i) => (
                  <g key={`${c.booth}-${i}`}>
                    <circle cx={c.x} cy={c.y} r={28} fill="rgba(0,0,0,0.2)" />
                    <circle cx={c.x} cy={c.y} r={26} fill="#c4855a" />
                    <text
                      x={c.x}
                      y={c.y + 9}
                      textAnchor="middle"
                      fill="white"
                      fontSize={24}
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {i + 1}
                    </text>
                  </g>
                ))}
              </svg>
            )}
          </TransformComponent>
        </TransformWrapper>

        {/* Toggle route list button */}
        <button
          onClick={() => setShowList((v) => !v)}
          className="absolute bottom-[12px] right-[12px] z-10 flex items-center gap-[6px] px-[14px] py-[8px] rounded-full bg-[#c4855a] shadow-lg active:scale-95 transition-all"
        >
          <Navigation size={14} color="white" strokeWidth={2} />
          <p className="font-[family-name:var(--font-prompt)] text-[13px] text-white font-medium">
            {showList ? "ซ่อนเส้นทาง" : `เส้นทาง ${route.length} บูธ`}
          </p>
        </button>
      </div>

      {/* Route stop list */}
      {showList && route.length > 0 && (
        <div className="shrink-0 max-h-[38vh] overflow-y-auto border-t border-[#f0e4d4] bg-[#fafaf8]">
          <div className="flex flex-col px-[16px] pt-[12px] pb-[8px] gap-[10px]">
            <p className="font-[family-name:var(--font-prompt)] font-medium text-[13px] text-[#9c7a5b]">
              ลำดับการเดิน · เริ่มจากทางเข้า MRT
            </p>
            {route.map((stop, i) => (
              <div key={`list-${stop.booth}-${i}`} className="flex items-center gap-[12px]">
                <div className="shrink-0 size-[28px] rounded-full bg-[#c4855a] flex items-center justify-center">
                  <span className="font-[family-name:var(--font-jakarta)] font-bold text-[12px] text-white">
                    {i + 1}
                  </span>
                </div>
                <p className="flex-1 min-w-0 font-[family-name:var(--font-prompt)] text-[14px] text-[#3d2b1a] truncate">
                  {stop.name_th}
                </p>
                <div className="shrink-0 px-[8px] py-[2px] rounded-full bg-[#fff8ee] border border-[#f0e4d4]">
                  <p className="font-[family-name:var(--font-jakarta)] font-medium text-[12px] text-[#9c7a5b]">
                    {stop.booth}
                  </p>
                </div>
              </div>
            ))}
            {isDemo && (
              <p className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#a6a09b] pb-[4px]">
                เพิ่มสำนักพิมพ์ในรายการเพื่อดูเส้นทางของคุณ
              </p>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function buildRoute(pairs: { booth: string; name_th: string }[]): RouteStop[] {
  const coords = optimiseRoute(resolveBooths(pairs.map((p) => p.booth)));
  return coords.map((c) => {
    const match = pairs.find((p) => p.booth === c.booth);
    return { ...c, name_th: match?.name_th ?? c.booth };
  });
}
