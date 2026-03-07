"use client";
import { useEffect } from "react";
import { useLIFF } from "../providers/liff-providers";
import OnboardingForm from "../components/OnboardingForm";

export default function Home() {
  const { liff, liffError, isLoading, isLoggedIn, needsOnboarding } = useLIFF();

  useEffect(() => {
    if (!isLoading && isLoggedIn && !needsOnboarding) {
      window.location.replace("/browse");
    }
  }, [isLoading, isLoggedIn, needsOnboarding]);

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#fafaf8] overflow-hidden justify-between pt-[188px]">

      {/* Logo + Title */}
      <div className="flex flex-col gap-[48px] items-center shrink-0">
        <img
          src="/mascot.png"
          alt="BookFair Buddy mascot"
          className="size-[180px] rounded-[40px] object-cover shrink-0"
        />
        <div className="flex flex-col gap-[8px] items-center leading-normal">
          <p className="font-[family-name:var(--font-jakarta)] font-extrabold text-[40px] text-[#8fad7a] whitespace-nowrap">
            BookFair Buddy
          </p>
          <p className="font-[family-name:var(--font-prompt)] font-light text-[24px] text-[#973c00] whitespace-nowrap">
            เพื่อนช่วยป้ายยาหนังสือ
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="shrink-0 px-[16px] pt-[12px] pb-[32px]">
        {isLoading && (
          <div className="flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#c4855a]/20">
            <p className="font-[family-name:var(--font-jakarta)] font-medium text-[#c4855a] text-[20px] whitespace-nowrap">Loading...</p>
          </div>
        )}
        {liffError && (
          <p className="text-red-500 text-sm text-center w-full mb-2">LIFF: {liffError}</p>
        )}
        {liff && !isLoggedIn && (
          <button
            onClick={() => (liff.login as (config?: { redirectUri?: string; botPrompt?: string }) => void)({ botPrompt: "normal" })}
            className="flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#c4855a] shadow-[2px_2px_0px_0px_#e0d0c0] active:scale-95 transition-all"
          >
            <span className="font-[family-name:var(--font-jakarta)] font-medium text-[20px] text-[#fafaf8] leading-normal whitespace-nowrap">
              Login with LINE
            </span>
          </button>
        )}
      </div>

      {isLoggedIn && needsOnboarding && <OnboardingForm />}
    </div>
  );
}
