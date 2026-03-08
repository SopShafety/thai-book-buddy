"use client";

import { useState } from "react";
import { useLIFF } from "../providers/liff-providers";
import BrandHeader from "./BrandHeader";

const GENDER_OPTIONS = [
  { value: "male", label: "ชาย" },
  { value: "female", label: "หญิง" },
  { value: "other", label: "อื่นๆ" },
  { value: "prefer_not_to_say", label: "ไม่ระบุ" },
];

export default function OnboardingForm() {
  const { completeProfile } = useLIFF();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ageNum = parseInt(age, 10);
    if (!ageNum || ageNum < 1 || ageNum > 120) {
      setError("กรุณากรอกอายุที่ถูกต้อง");
      return;
    }
    if (!gender) {
      setError("กรุณาเลือกเพศ");
      return;
    }
    setSubmitting(true);
    setError(null);
    const err = await completeProfile(ageNum, gender);
    if (err) {
      setError(err);
      setSubmitting(false);
    }
  }

  return (
    <div className="absolute inset-0 bg-[#fafaf8] flex flex-col px-[16px] pt-[24px] pb-[32px]">
      <BrandHeader />

      <div className="mt-[24px] mb-[32px]">
        <p className="font-[family-name:var(--font-prompt)] font-semibold text-[32px] text-[#3d2b1a] leading-tight">
          บอกเราเพิ่มเติม
        </p>
        <p className="font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#9c7a5b] mt-[4px]">
          ช่วยให้เราแนะนำหนังสือได้ตรงใจมากขึ้น
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[24px] flex-1">
        {/* Age */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-[family-name:var(--font-prompt)] font-medium text-[14px] text-[#3d2b1a]">
            อายุ
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="เช่น 25"
            className="h-[48px] w-full rounded-[16px] border border-[#f0e4d4] bg-[#fafaf8] px-[16px] font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none focus:border-[#973c00] transition-colors"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-[family-name:var(--font-prompt)] font-medium text-[14px] text-[#3d2b1a]">
            เพศ
          </label>
          <div className="grid grid-cols-2 gap-[8px]">
            {GENDER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setGender(opt.value)}
                className={`h-[48px] rounded-[12px] border text-[14px] font-[family-name:var(--font-prompt)] transition-all ${
                  gender === opt.value
                    ? "bg-[#c4855a] border-[#c4855a] text-[#fafaf8] font-semibold shadow-[2px_2px_0px_0px_#e0d0c0]"
                    : "bg-[#fff8ee] border-[#f0e4d4] text-[#9c7a5b] font-light"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-[13px] font-[family-name:var(--font-prompt)]">
            {error}
          </p>
        )}

        <div className="mt-auto">
          <button
            type="submit"
            disabled={submitting}
            className="flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#c4855a] shadow-[2px_2px_0px_0px_#e0d0c0] active:scale-95 transition-all disabled:opacity-60"
          >
            <span className="font-[family-name:var(--font-jakarta)] font-medium text-[20px] text-[#fafaf8] leading-normal whitespace-nowrap">
              {submitting ? "กำลังบันทึก..." : "ยืนยัน"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
