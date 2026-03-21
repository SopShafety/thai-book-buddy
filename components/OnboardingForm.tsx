"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useLIFF } from "../providers/liff-providers";
import BrandHeader from "./BrandHeader";

const GENDER_OPTIONS = [
  { value: "male", label: "ชาย" },
  { value: "female", label: "หญิง" },
  { value: "other", label: "อื่นๆ" },
  { value: "prefer_not_to_say", label: "ไม่ระบุ" },
];

const AGE_RANGES = [
  { value: "under_18", label: "ต่ำกว่า 18 ปี" },
  { value: "18_24", label: "18 – 24 ปี" },
  { value: "25_34", label: "25 – 34 ปี" },
  { value: "35_44", label: "35 – 44 ปี" },
  { value: "45_54", label: "45 – 54 ปี" },
  { value: "55_plus", label: "55 ปีขึ้นไป" },
];

export default function OnboardingForm() {
  const { completeProfile, skipOnboarding } = useLIFF();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!age) {
      setError("กรุณาเลือกช่วงอายุ");
      return;
    }
    if (!gender) {
      setError("กรุณาเลือกเพศ");
      return;
    }
    setSubmitting(true);
    setError(null);
    const err = await completeProfile(age, gender);
    if (err) {
      setError(err);
      setSubmitting(false);
    }
  }

  return (
    <div className="absolute inset-0 bg-[#fafaf8] flex flex-col px-[16px] pt-[24px] pb-[32px] overflow-y-auto">
      <BrandHeader />

      <div className="mt-[24px] mb-[32px]">
        <p className="font-[family-name:var(--font-sarabun)] font-semibold text-[32px] text-[#3d2b1a] leading-tight">
          บอกเราเพิ่มเติม
        </p>
        <p className="font-[family-name:var(--font-sarabun)] font-light text-[14px] text-[#9c7a5b] mt-[4px]">
          ช่วยให้เราแนะนำหนังสือได้ตรงใจมากขึ้น
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[32px] flex-1">
        {/* Age range */}
        <div className="flex flex-col gap-[12px]">
          <p className="font-[family-name:var(--font-sarabun)] font-medium text-[16px] text-[#3d2b1a]">
            ช่วงอายุ
          </p>
          <div className="grid grid-cols-2 gap-[8px]">
            {AGE_RANGES.map((opt) => {
              const selected = age === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAge(opt.value)}
                  className={`flex items-center justify-between h-[48px] px-[16px] rounded-[12px] border transition-all ${
                    selected
                      ? "bg-[#c4855a] border-[#c4855a] text-white"
                      : "bg-[#fff8ee] border-[#f0e4d4] text-[#9c7a5b]"
                  }`}
                >
                  <span className={`font-[family-name:var(--font-sarabun)] text-[14px] ${selected ? "font-medium" : "font-light"}`}>
                    {opt.label}
                  </span>
                  {selected && (
                    <div className="shrink-0 size-[18px] rounded-full bg-white/30 flex items-center justify-center">
                      <Check size={11} color="white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-[12px]">
          <p className="font-[family-name:var(--font-sarabun)] font-medium text-[16px] text-[#3d2b1a]">
            เพศ
          </p>
          <div className="grid grid-cols-2 gap-[8px]">
            {GENDER_OPTIONS.map((opt) => {
              const selected = gender === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGender(opt.value)}
                  className={`flex items-center justify-between h-[48px] px-[16px] rounded-[12px] border transition-all ${
                    selected
                      ? "bg-[#c4855a] border-[#c4855a] text-white"
                      : "bg-[#fff8ee] border-[#f0e4d4] text-[#9c7a5b]"
                  }`}
                >
                  <span className={`font-[family-name:var(--font-sarabun)] text-[14px] ${selected ? "font-medium" : "font-light"}`}>
                    {opt.label}
                  </span>
                  {selected && (
                    <div className="shrink-0 size-[18px] rounded-full bg-white/30 flex items-center justify-center">
                      <Check size={11} color="white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="font-[family-name:var(--font-sarabun)] font-light text-[13px] text-red-400 -mt-[16px]">
            {error}
          </p>
        )}

        <div className="mt-auto flex flex-col gap-[12px]">
          <button
            type="submit"
            disabled={submitting || !age || !gender}
            className="flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#c4855a] active:scale-95 transition-all disabled:opacity-40"
          >
            <span className="font-[family-name:var(--font-sarabun)] font-semibold text-[18px] text-white">
              {submitting ? "กำลังบันทึก..." : "ยืนยัน"}
            </span>
          </button>
          <button
            type="button"
            onClick={skipOnboarding}
            className="flex h-[48px] w-full items-center justify-center active:opacity-60 transition-opacity"
          >
            <span className="font-[family-name:var(--font-sarabun)] font-light text-[16px] text-[#9c7a5b]">
              ข้ามไปก่อน
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
