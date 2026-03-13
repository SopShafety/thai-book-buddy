"use client";
import { useEffect, useState } from "react";
import { MapPin, Route, Clock } from "lucide-react";
import BrandHeader from "../../components/BrandHeader";
import BottomNav from "../../components/BottomNav";
import { useLIFF } from "../../providers/liff-providers";
import { getSupabase } from "../../utils/supabase";

export default function MapPage() {
  const { isLoggedIn } = useLIFF();
  const [publisherCount, setPublisherCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    async function loadCount() {
      try {
        const supabase = getSupabase();
        const { count } = await supabase
          .from("user_selections")
          .select("*", { count: "exact", head: true });
        setPublisherCount(count ?? 0);
      } catch {
        // non-critical
      }
    }
    loadCount();
  }, [isLoggedIn]);

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#fafaf8] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-[16px] pt-[24px] pb-[12px]">
        <BrandHeader />
        <p className="font-[family-name:var(--font-prompt)] font-semibold text-[32px] text-[#3d2b1a] leading-tight">
          ผังงาน
        </p>
      </div>

      {/* Map image preview */}
      <div className="relative flex-1 overflow-hidden">
        {/* Last year's map as background */}
        <img
          src="/booth-map-2024.png"
          alt="ผังบูธงานสัปดาห์หนังสือ"
          className="absolute inset-0 w-full h-full object-cover object-left-top opacity-40"
        />

        {/* Overlay gradient — bottom panel bleeds up */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf8] via-[#fafaf8]/60 to-transparent" />

        {/* Last year badge */}
        <div className="absolute top-[12px] left-[16px]">
          <div className="flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-black/30 backdrop-blur-sm">
            <p className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-white">
              ผังบูธปี 2568 (ตัวอย่าง)
            </p>
          </div>
        </div>

        {/* Bottom panel */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-[20px] px-[16px] pb-[24px]">

          {/* Personalized hook */}
          {isLoggedIn && publisherCount !== null && publisherCount > 0 && (
            <div className="flex items-center gap-[10px] bg-[#f0e4d4] border border-[#c4855a] rounded-[12px] px-[16px] py-[12px]">
              <MapPin size={18} color="#c4855a" strokeWidth={2} className="shrink-0" />
              <p className="font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a]">
                คุณบันทึก{" "}
                <span className="font-semibold text-[#c4855a]">{publisherCount} สำนักพิมพ์</span>
                {" "}พร้อมคำนวณเส้นทางแล้ว
              </p>
            </div>
          )}

          {/* Feature cards */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-start gap-[12px] bg-white/80 backdrop-blur-sm border border-[#f0e4d4] rounded-[16px] px-[16px] py-[14px]">
              <div className="shrink-0 size-[36px] rounded-full bg-[#f0e4d4] flex items-center justify-center">
                <Route size={18} color="#c4855a" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-[2px]">
                <p className="font-[family-name:var(--font-prompt)] font-semibold text-[15px] text-[#3d2b1a]">
                  เส้นทางเดินที่ดีที่สุด
                </p>
                <p className="font-[family-name:var(--font-prompt)] font-light text-[13px] text-[#9c7a5b] leading-relaxed">
                  คำนวณเส้นทางสั้นที่สุดผ่านทุกบูธในรายการของคุณ ประหยัดเวลาเดินในงาน
                </p>
              </div>
            </div>

            <div className="flex items-start gap-[12px] bg-white/80 backdrop-blur-sm border border-[#f0e4d4] rounded-[16px] px-[16px] py-[14px]">
              <div className="shrink-0 size-[36px] rounded-full bg-[#f0e4d4] flex items-center justify-center">
                <Clock size={18} color="#c4855a" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-[2px]">
                <p className="font-[family-name:var(--font-prompt)] font-semibold text-[15px] text-[#3d2b1a]">
                  กำลังจะมาเร็วๆ นี้
                </p>
                <p className="font-[family-name:var(--font-prompt)] font-light text-[13px] text-[#9c7a5b] leading-relaxed">
                  ผังบูธงานสัปดาห์หนังสือปีนี้กำลังจะเปิดตัว เพิ่มสำนักพิมพ์ในรายการไว้รอได้เลย
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
