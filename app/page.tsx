"use client";
import { useLIFF } from "../providers/liff-providers";
import OnboardingForm from "../components/OnboardingForm";

export default function Home() {
  const { liff, liffError, isLoading, isLoggedIn, needsOnboarding, logout } = useLIFF();

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-white overflow-hidden">

      {/* Logo + Title — vertically centered in remaining space */}
      <div className="flex-1 flex flex-col gap-[48px] items-center justify-center">
        {/* Logo placeholder */}
        <div className="size-[167px] rounded-[40px] bg-[#d9d9d9] shrink-0" />

        {/* Text */}
        <div className="flex flex-col gap-[16px] items-center text-black leading-normal">
          <p className="font-[family-name:var(--font-jakarta)] font-semibold text-[40px] whitespace-nowrap">
            BookFair Buddy
          </p>
          <p className="font-[family-name:var(--font-sarabun)] font-light text-[32px] whitespace-nowrap">
            เพื่อนช่วยป้ายยาหนังสือ
          </p>
        </div>
      </div>

      {/* Button — pinned to bottom */}
      <div className="shrink-0 px-[16px] pt-[12px] pb-[32px]">
        {isLoading && (
          <div className="flex h-[56px] w-full items-center justify-center rounded-[28px] bg-gray-100">
            <p className="text-gray-400 text-[20px] whitespace-nowrap">Loading...</p>
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
            <span className="font-[family-name:var(--font-jakarta)] font-medium text-[20px] text-white leading-normal whitespace-nowrap">
              Login with LINE
            </span>
          </button>
        )}

        {liff && isLoggedIn && (
          <button
            onClick={logout}
            className="flex h-[56px] w-full items-center justify-center rounded-[28px] border border-gray-300 bg-white active:scale-95 transition-all"
          >
            <span className="font-[family-name:var(--font-jakarta)] font-medium text-[20px] text-gray-700 leading-normal whitespace-nowrap">
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
