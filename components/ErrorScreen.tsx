"use client";

interface Props {
  onRetry: () => void;
}

export default function ErrorScreen({ onRetry }: Props) {
  return (
    <div className="flex flex-col w-full h-[100dvh] items-center justify-center bg-[#fafaf8] px-[32px] gap-[24px]">
      <div className="flex flex-col items-center gap-[8px]">
        <p className="font-[family-name:var(--font-sarabun)] font-semibold text-[18px] text-[#3d2b1a] text-center">
          ไม่สามารถโหลดข้อมูลได้
        </p>
        <p className="font-[family-name:var(--font-sarabun)] font-light text-[14px] text-[#9c7a5b] text-center leading-relaxed">
          กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
        </p>
      </div>
      <button
        onClick={onRetry}
        className="flex h-[48px] px-[32px] items-center justify-center rounded-[12px] bg-[#c4855a] active:scale-95 transition-all"
      >
        <span className="font-[family-name:var(--font-sarabun)] text-[16px] text-white">ลองใหม่</span>
      </button>
    </div>
  );
}
