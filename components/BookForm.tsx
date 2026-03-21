"use client";
import { Trash2 } from "lucide-react";

interface Props {
  title: string;
  price: string;
  onTitleChange: (v: string) => void;
  onPriceChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving?: boolean;
  /** "inline" — price + buttons on same row (add flow)
   *  "stacked" — price full-width, buttons below (edit flow) */
  layout?: "inline" | "stacked";
  formRef?: React.RefObject<HTMLDivElement | null>;
}

export default function BookForm({
  title,
  price,
  onTitleChange,
  onPriceChange,
  onSave,
  onCancel,
  onDelete,
  saving,
  layout = "inline",
  formRef,
}: Props) {
  const canSave = !!title.trim() && !saving;

  const saveBtn = (
    <button
      onClick={onSave}
      disabled={!canSave}
      className={`h-[48px] px-[17px] py-px rounded-[12px] border font-[family-name:var(--font-prompt)] text-[16px] text-white transition-all ${
        canSave ? "bg-[#c4855a] border-[#c4855a]" : "bg-[#e2c9a6] border-[#e2c9a6]"
      } ${layout === "stacked" ? "flex-1" : "shrink-0"}`}
    >
      บันทึก
    </button>
  );

  const cancelBtn = (
    <button
      onClick={onCancel}
      className={`h-[48px] px-[17px] py-px rounded-[12px] border border-[#e2c9a6] bg-[#fafaf8] font-[family-name:var(--font-prompt)] text-[16px] text-[#c4855a] ${
        layout === "stacked" ? "flex-1" : "shrink-0"
      }`}
    >
      ยกเลิก
    </button>
  );

  return (
    <div ref={formRef} className="flex flex-col gap-[8px]">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="ชื่อหนังสือ"
        autoFocus
        className="h-[48px] w-full rounded-[16px] border bg-[#fafaf8] px-[12px] font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none focus:border-[#973c00] border-[#f0e4d4] transition-colors"
      />

      {layout === "inline" ? (
        <div className="flex gap-[8px] items-start">
          <input
            type="number"
            inputMode="numeric"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder="ราคา (บาท)"
            className="flex-1 min-w-0 h-[48px] rounded-[16px] border border-[#f0e4d4] bg-[#fafaf8] px-[12px] font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none focus:border-[#973c00] transition-colors"
          />
          <div className="flex shrink-0 gap-[8px]">
            {saveBtn}
            {cancelBtn}
          </div>
        </div>
      ) : (
        <>
          <input
            type="number"
            inputMode="numeric"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder="ราคา (บาท)"
            className="h-[48px] w-full rounded-[16px] border border-[#f0e4d4] bg-[#fafaf8] px-[12px] font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none focus:border-[#973c00] transition-colors"
          />
          <div className="flex gap-[8px]">
            {saveBtn}
            {cancelBtn}
          </div>
        </>
      )}

      {onDelete && (
        <>
          <div className="h-px bg-[#f0e4d4]" />
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-[4px] w-full active:opacity-60 transition-opacity"
          >
            <Trash2 size={20} color="#df442b" strokeWidth={1.8} />
            <span className="font-[family-name:var(--font-prompt)] text-[16px] text-[#df442b]">ลบรายการ</span>
          </button>
        </>
      )}
    </div>
  );
}
