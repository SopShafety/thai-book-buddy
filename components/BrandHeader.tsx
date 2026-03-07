"use client";
import { Sparkles } from "lucide-react";

export default function BrandHeader() {
  return (
    <div className="flex items-center gap-[4px] mb-[4px]">
      <Sparkles size={20} color="#8fad7a" fill="#8fad7a" />
      <p className="font-[family-name:var(--font-jakarta)] font-bold text-[16px] text-[#8fad7a]">
        BookFair Buddy
      </p>
    </div>
  );
}
