"use client";
import { useLIFF } from "../providers/liff-providers";
import OnboardingForm from "../components/OnboardingForm";

export default function Home() {
  const { liff, liffError, isLoading, isLoggedIn, needsOnboarding, logout } = useLIFF();

  return (
    <div className="relative w-full h-[100dvh] bg-white overflow-hidden">

      {/* Image Container */}
      <div className="absolute top-[128px] left-0 right-0 flex flex-col items-center px-[8px]">
        <div className="relative h-[261px] w-full">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              alt="cat lying on books"
              className="absolute h-[99.09%] left-[27.3%] max-w-none top-[4.44%] w-[81.96%] object-contain"
              src="/cat lying on books.png"
            />
          </div>
        </div>
      </div>

      {/* Title Container */}
      <div className="absolute top-[405px] left-0 right-0 flex flex-col gap-[14px] items-center text-black leading-normal">
        <p className="font-[family-name:var(--font-literata)] text-[40px] font-normal">
          BookFair Buddy
        </p>
        <p className="font-[family-name:var(--font-sarabun)] text-[24px]">
          เพื่อนช่วยป้ายยาหนังสือ
        </p>
      </div>

      {/* Button Container — pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-[16px] py-[32px]">
        {isLoading && (
          <div className="flex h-[56px] w-full items-center justify-center rounded-[8px] bg-gray-100">
            <p className="text-gray-400 text-[20px]">Loading...</p>
          </div>
        )}

        {liffError && (
          <p className="text-red-500 text-sm text-center w-full mb-2">LIFF: {liffError}</p>
        )}

        {liff && !isLoggedIn && (
          <button
            onClick={() => liff.login({ botPrompt: "normal" })}
            className="flex h-[56px] w-full items-center justify-center rounded-[8px] bg-[#4f46e5] active:scale-95 transition-all"
          >
            <span className="font-[family-name:var(--font-jakarta)] font-medium text-[20px] text-white leading-normal">
              Login with LINE
            </span>
          </button>
        )}

        {liff && isLoggedIn && (
          <button
            onClick={logout}
            className="flex h-[56px] w-full items-center justify-center rounded-[8px] border border-gray-300 bg-white active:scale-95 transition-all"
          >
            <span className="font-[family-name:var(--font-jakarta)] font-medium text-[20px] text-gray-700 leading-normal">
              Logout
            </span>
          </button>
        )}
      </div>

      {/* Onboarding overlay — shown after first login if age/gender not yet collected */}
      {isLoggedIn && needsOnboarding && <OnboardingForm />}
    </div>
  );
}
