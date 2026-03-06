"use client";
import BottomNav from "../../components/BottomNav";

export default function MyListPage() {
  return (
    <div className="flex flex-col w-full h-[100dvh] bg-white">
      <div className="flex-1 flex items-center justify-center">
        <p className="font-[family-name:var(--font-prompt)] text-gray-400 text-[16px]">
          รายการของฉัน — เร็วๆ นี้
        </p>
      </div>
      <BottomNav />
    </div>
  );
}
