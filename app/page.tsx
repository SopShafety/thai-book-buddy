"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLIFF } from "../providers/liff-providers";
import OnboardingForm from "../components/OnboardingForm";

export default function Home() {
  const { liff, liffError, isLoading, isLoggedIn, needsOnboarding, logout } = useLIFF();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isLoggedIn && !needsOnboarding) {
      router.replace("/browse");
    }
  }, [isLoading, isLoggedIn, needsOnboarding, router]);

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-white overflow-hidden">

      {/* Logo + Title */}
      <div className="flex-1 flex flex-col gap-[48px] items-center justify-center">
        <div className="size-[167px] rounded-[40px] bg-[#d9d9d9] shrink-0" />
        <div className="flex flex-col gap-[8px] items-center text-black leading-normal">
          <p className="font-[family-name:var(--font-jakarta)] font-semibold text-[40px] whitespace-nowrap">
            BookFair Buddy
          </p>
          <p className="font-[family-name:var(--font-prompt)] font-light text-[24px] whitespace-nowrap">
            เพื่อนช่วยป้ายยาหนังสือ
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="shrink-0 px-[16px] pt-[12px] pb-[32px]">
        {isLoading && (
          <div className="flex h-[56px] w-full items-center justify-center rounded-[8px] bg-gray-100">
            <p className="text-gray-400 text-[20px] whitespace-nowrap">Loading...</p>
          </div>
        )}
        {liffError && (
          <p className="text-red-500 text-sm text-center w-full mb-2">LIFF: {liffError}</p>
        )}
        {liff && !isLoggedIn && (
          <button
            onClick={() => (liff.login as (config?: { redirectUri?: string; botPrompt?: string }) => void)({ botPrompt: "normal" })}
            className="flex h-[56px] w-full items-center justify-center rounded-[8px] bg-[#4f46e5] active:scale-95 transition-all"
          >
            <span className="font-[family-name:var(--font-jakarta)] font-medium text-[20px] text-white leading-normal whitespace-nowrap">
              Login with LINE
            </span>
          </button>
        )}
      </div>

      {isLoggedIn && needsOnboarding && <OnboardingForm />}
    </div>
  );
}
