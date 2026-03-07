"use client";
import BottomNav from "../../components/BottomNav";

export default function MapPage() {
  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#fafaf8]">
      {/* Header */}
      <div className="shrink-0 px-[16px] pt-[24px] pb-[12px]">
        <div className="flex items-center gap-[4px] mb-[4px]">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" fill="#8fad7a" />
            <path d="M19 16l.75 2.25L22 19l-2.25.75L19 22l-.75-2.25L16 19l2.25-.75L19 16Z" fill="#8fad7a" />
          </svg>
          <p className="font-[family-name:var(--font-jakarta)] font-bold text-[16px] text-[#8fad7a]">
            BookFair Buddy
          </p>
        </div>
        <p className="font-[family-name:var(--font-prompt)] font-semibold text-[32px] text-[#3d2b1a] leading-tight">
          ผังงาน
        </p>
      </div>

      {/* Empty state */}
      <div className="flex-1 flex flex-col items-center justify-center gap-[24px] px-[32px]">
        <div className="bg-[#fff8ee] rounded-full size-[96px] flex items-center justify-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
            <path
              d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7Z"
              stroke="#e2c9a6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 4v13M15 7v13"
              stroke="#e2c9a6"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
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
