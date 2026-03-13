"use client";
import { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Navigation, MapPin, Search } from "lucide-react";
import Link from "next/link";
import BrandHeader from "../../components/BrandHeader";
import BottomNav from "../../components/BottomNav";
import { useLIFF } from "../../providers/liff-providers";
import { getSupabase } from "../../utils/supabase";
import { resolveBooths, optimiseRoute, routeToWaypoints, type BoothCoords } from "../../utils/booth-coords";

const IMAGE_W = 1980;
const IMAGE_H = 1102;
// Native image resolution — SVG viewBox uses this coordinate space
const NATIVE_W = 1137;
const NATIVE_H = 633;

interface RouteStop extends BoothCoords {
  name_th: string;
}

export default function MapPage() {
  const { isLoggedIn } = useLIFF();
  const [route, setRoute] = useState<RouteStop[]>([]);
  const [showList, setShowList] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      if (!isLoggedIn) {
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

        if (pairs.length > 0) {
          setRoute(buildRoute(pairs));
        }
      } catch {
        // silently show empty state on error
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
              ผังปี 2569
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/booth-map-2569.png" alt="ผังบูธปี 2569" width={IMAGE_W} height={IMAGE_H} />
            {/* White overlay to soften map */}
            <div style={{ position: "absolute", top: 0, left: 0, width: IMAGE_W, height: IMAGE_H, background: "rgba(255,255,255,0.5)", pointerEvents: "none" }} />
            {/* SVG route overlay — viewBox keeps booth-coords in native pixel space */}
            {loaded && route.length > 0 && (
              <svg
                width={IMAGE_W}
                height={IMAGE_H}
                viewBox={`0 0 ${NATIVE_W} ${NATIVE_H}`}
                style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
              >
                <defs>
                  {/* Glow filter for route line */}
                  <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  {/* Drop shadow for pins */}
                  <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#1e3a5f" floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* Glow layer — wide soft stroke underneath */}
                <polyline
                  points={routeToWaypoints(route).map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="#4a7fa5"
                  strokeWidth={10}
                  strokeOpacity={0.3}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* Route dashed line */}
                <polyline
                  points={routeToWaypoints(route).map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="#4a7fa5"
                  strokeWidth={5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray="12 8"
                  filter="url(#line-glow)"
                />
                {/* Numbered pins */}
                {route.map((c, i) => (
                  <g key={`${c.booth}-${i}`} filter="url(#pin-shadow)">
                    <circle cx={c.x} cy={c.y} r={11} fill="#4a7fa5" />
                    <text
                      x={c.x}
                      y={c.y + 4}
                      textAnchor="middle"
                      fill="white"
                      fontSize={10}
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


        {/* Empty state — no saved publishers */}
        {loaded && route.length === 0 && (
          <div className="absolute inset-0 flex items-end justify-center pb-[24px] pointer-events-none z-10">
            <div className="pointer-events-auto mx-[16px] w-full max-w-[360px] rounded-[20px] bg-[#fafaf8] shadow-lg px-[20px] py-[20px] flex flex-col gap-[12px]">
              <div className="flex items-center gap-[10px]">
                <div className="shrink-0 size-[40px] rounded-full bg-[#f0e4d4] flex items-center justify-center">
                  <MapPin size={20} color="#c4855a" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <p className="font-[family-name:var(--font-prompt)] font-semibold text-[16px] text-[#3d2b1a]">
                    ยังไม่มีเส้นทางของคุณ
                  </p>
                  <p className="font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#9c7a5b] leading-snug">
                    เพิ่มสำนักพิมพ์ที่ชอบในหน้าค้นหา แล้วกลับมาดูเส้นทางเดินที่นี่
                  </p>
                </div>
              </div>
              <Link
                href="/browse"
                className="flex items-center justify-center gap-[6px] h-[44px] rounded-[12px] bg-[#c4855a] active:scale-95 transition-all"
              >
                <Search size={15} color="white" strokeWidth={2} />
                <span className="font-[family-name:var(--font-prompt)] font-medium text-[14px] text-white">
                  ค้นหาสำนักพิมพ์
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Route stop list */}
      {loaded && route.length > 0 && (
        <div className="shrink-0 border-t border-[#f0e4d4] bg-[#fafaf8]">
          {/* Header row — always visible */}
          <div className="flex items-center justify-between px-[16px] pt-[12px] pb-[8px]">
            <p className="font-[family-name:var(--font-prompt)] font-medium text-[13px] text-[#9c7a5b]">
              ลำดับการเดิน · เริ่มจากทางเข้า MRT
            </p>
            <button
              onClick={() => setShowList((v) => !v)}
              className="flex items-center gap-[6px] px-[12px] py-[4px] rounded-full border border-[#c4855a] active:scale-95 transition-all"
            >
              <Navigation size={12} color="#c4855a" strokeWidth={2} />
              <span className="font-[family-name:var(--font-prompt)] text-[12px] text-[#c4855a] font-medium">
                {showList ? "ซ่อน" : `${route.length} บูธ`}
              </span>
            </button>
          </div>
          {/* Collapsible stop list */}
          {showList && (
          <div className="max-h-[32vh] overflow-y-auto">
          <div className="flex flex-col px-[16px] pb-[8px] gap-[10px]">
            {route.map((stop, i) => (
              <div key={`list-${stop.booth}-${i}`} className="flex items-center gap-[12px]">
                <div className="shrink-0 size-[28px] rounded-full border border-[#8fad7a] bg-[#f3ffeb] flex items-center justify-center">
                  <span className="font-[family-name:var(--font-jakarta)] font-bold text-[12px] text-[#8fad7a]">
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
          </div>
          </div>
          )}
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
