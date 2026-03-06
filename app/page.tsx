"use client";
import { useLIFF } from "../providers/liff-providers";
import OnboardingForm from "../components/OnboardingForm";

export default function Home() {
  const { liff, liffError, isLoading, isLoggedIn, needsOnboarding, logout } = useLIFF();

  return (
    <div className="relative w-full h-[100dvh] bg-white overflow-hidden">

      {/* Logo + Title — centered */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[188px] flex flex-col gap-[48px] items-center">
        {/* Logo placeholder */}
        <div className="size-[167px] rounded-[40px] bg-[#d9d9d9] shrink-0" />

        {/* Text */}
        <div className="flex flex-col gap-[16px] items-center text-black leading-normal">
          <p className="font-[family-name:var(--font-jakarta)] font-semibold text-[40px]">
            BookFair Buddy
          </p>
          <p className="font-[family-name:var(--font-sarabun)] font-light text-[32px]">
            เพื่อนช่วยป้ายยาหนังสือ
          </p>
        </div>
      </div>

      {/* Button — pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-[16px] pt-[12px] pb-[32px]">
        {isLoading && (
          <div className="flex h-[56px] w-full items-center justify-center rounded-[28px] bg-gray-100">
            <p className="text-gray-400 text-[20px]">Loading...</p>
          </div>
        )}

        {liffError && (
          <p className="text-red-500 text-sm text-center w-full mb-2">LIFF: {liffError}</p>
        )}

        {liff && !isLoggedIn && (
          <button
            onClick={() => (liff.login as (config?: { redirectUri?: string; botPrompt?: string }) => void)({ botPrompt: "normal" })}
            className="flex h-[56px] w-full items-center justify-center rounded-[28px] bg-[#4f46e5] active:scale-95 transition-all"
          >
            <span className="font-[family-name:var(--font-jakarta)] font-medium text-[20px] text-white leading-normal">
              Login with LINE
            </span>
          </button>
        )}

        {liff && isLoggedIn && (
          <button
            onClick={logout}
            className="flex h-[56px] w-full items-center justify-center rounded-[28px] border border-gray-300 bg-white active:scale-95 transition-all"
          >
            <span className="font-[family-name:var(--font-jakarta)] font-medium text-[20px] text-gray-700 leading-normal">
              Logout
            </span>
          </button>
        )}
      </div>

      {/* Onboarding overlay */}
      {isLoggedIn && needsOnboarding && <OnboardingForm />}
    </div>
  );
}
