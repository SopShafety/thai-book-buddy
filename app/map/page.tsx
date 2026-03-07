"use client";
import { Map } from "lucide-react";
import BrandHeader from "../../components/BrandHeader";
import BottomNav from "../../components/BottomNav";

export default function MapPage() {
  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#fafaf8]">
      {/* Header */}
      <div className="shrink-0 px-[16px] pt-[24px] pb-[12px]">
        <BrandHeader />
        <p className="font-[family-name:var(--font-prompt)] font-semibold text-[32px] text-[#3d2b1a] leading-tight">
          ผังงาน
        </p>
      </div>

      {/* Empty state */}
      <div className="flex-1 flex flex-col items-center justify-center gap-[24px] px-[32px]">
        <div className="bg-[#fff8ee] rounded-full size-[96px] flex items-center justify-center">
          <Map size={48} color="#e2c9a6" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-center gap-[8px]">
          <p className="font-[family-name:var(--font-prompt)] font-semibold text-[18px] text-[#3d2b1a] text-center">
            ผังงานยังไม่พร้อมใช้งาน
          </p>
          <p className="font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#9c7a5b] text-center leading-relaxed">
            ผังบูธงานสัปดาห์หนังสือจะพร้อมให้ใช้งาน{"\n"}เร็วๆ นี้
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
