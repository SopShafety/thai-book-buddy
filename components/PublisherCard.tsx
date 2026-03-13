"use client";
import { Plus, Check } from "lucide-react";
import type { Publisher } from "../types";

interface Props {
  publisher: Publisher;
  selected: boolean;
  onToggle: (id: string) => void;
}

export default function PublisherCard({ publisher, selected, onToggle }: Props) {
  const booths = publisher.booths ?? [];
  const primaryBooth = booths[0]?.booth_number ?? "—";
  const category = publisher.category?.[0]?.replace("โซน", "").trim();

  return (
    <div className="bg-white border border-[#fff8ee] rounded-[16px] flex gap-[16px] items-start p-[24px]">
      {/* Booth number */}
      <div className="shrink-0 w-[56px]">
        <p className="font-[family-name:var(--font-jakarta)] font-extrabold text-[24px] text-[#3d2b1a] leading-none">
          {primaryBooth}
        </p>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <p className="font-[family-name:var(--font-prompt)] font-medium text-[16px] text-[#3d2b1a] leading-snug">
            {publisher.name_th}
          </p>
          {publisher.name_en && publisher.name_en !== publisher.name_th && (
            <p className="font-[family-name:var(--font-jakarta)] font-light text-[12px] text-[#3d2b1a] leading-snug">
              {publisher.name_en}
            </p>
          )}
        </div>
        {category && (
          <div className="inline-flex self-start items-center px-[12px] py-[4px] rounded-[20px] bg-[#fff8ee]">
            <span className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#9c7a5b]">
              {category}
            </span>
          </div>
        )}
      </div>

      {/* Add / Added button */}
      <button
        onClick={() => onToggle(publisher.id)}
        className="shrink-0 flex items-center gap-[4px] active:scale-90 transition-all"
      >
        {selected ? (
          <>
            <Check size={18} color="#9c7a5b" strokeWidth={2} />
            <span className="font-[family-name:var(--font-prompt)] font-medium text-[16px] text-[#9c7a5b]">
              เพิ่มแล้ว
            </span>
          </>
        ) : (
          <>
            <Plus size={18} color="#c4855a" strokeWidth={2} />
            <span className="font-[family-name:var(--font-prompt)] font-medium text-[16px] text-[#c4855a]">
              เพิ่ม
            </span>
          </>
        )}
      </button>
    </div>
  );
}
