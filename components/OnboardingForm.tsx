"use client";

import { useState } from "react";
import { useLIFF } from "../providers/liff-providers";

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
    <div className="absolute inset-0 bg-white flex flex-col px-[16px] py-[48px]">
      <p className="font-[family-name:var(--font-literata)] text-[28px] text-black leading-normal mb-2">
        บอกเราเพิ่มเติม
      </p>
      <p className="font-[family-name:var(--font-sarabun)] text-[16px] text-gray-500 mb-[32px]">
        ช่วยให้เราแนะนำหนังสือได้ตรงใจมากขึ้น
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[24px] flex-1">
        {/* Age */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-[family-name:var(--font-sarabun)] text-[16px] font-medium text-black">
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
            className="h-[52px] w-full rounded-[8px] border border-gray-300 px-[16px] text-[16px] font-[family-name:var(--font-sarabun)] outline-none focus:border-[#4F46E5]"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-[family-name:var(--font-sarabun)] text-[16px] font-medium text-black">
            เพศ
          </label>
          <div className="grid grid-cols-2 gap-[8px]">
            {GENDER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setGender(opt.value)}
                className={`h-[52px] rounded-[8px] border text-[16px] font-[family-name:var(--font-sarabun)] transition-all ${
                  gender === opt.value
                    ? "border-[#4F46E5] bg-[#4F46E5]/10 text-[#4F46E5] font-medium"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-[14px] font-[family-name:var(--font-sarabun)]">
            {error}
          </p>
        )}

        <div className="mt-auto">
          <button
            type="submit"
            disabled={submitting}
            className="flex h-[56px] w-full items-center justify-center rounded-[8px] bg-[#4F46E5] active:scale-95 transition-all disabled:opacity-60"
          >
            <span className="font-[family-name:var(--font-jakarta)] font-medium text-[20px] text-white leading-normal">
              {submitting ? "กำลังบันทึก..." : "ยืนยัน"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
