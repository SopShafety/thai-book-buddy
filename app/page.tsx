"use client";
import { useLIFF } from "../providers/liff-providers";

export default function Home() {
  const { liff, liffError, isLoading } = useLIFF();
  const isLoggedIn = liff?.isLoggedIn() ?? false;

  return (
    <div className="bg-white relative w-[393px] h-screen mx-auto overflow-hidden">

      {/* Image Container — top: 128px, centered */}
      <div className="-translate-x-1/2 absolute left-1/2 top-[128px] flex flex-col items-center p-[8px] w-[393px]">
        <div className="h-[261px] relative w-full">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              alt="cat lying on books"
              className="absolute h-[99.09%] left-[27.3%] max-w-none top-[4.44%] w-[81.96%] object-contain"
              src="/cat lying on books.png"
            />
          </div>
        </div>
      </div>

      {/* Title Container — top: 405px, centered */}
      <div className="-translate-x-1/2 absolute left-1/2 top-[405px] flex flex-col gap-[14px] items-center w-[393px] text-black whitespace-nowrap leading-normal">
        <p className="font-[family-name:var(--font-literata)] text-[40px] font-normal">
          BookFair Buddy
        </p>
        <p className="font-[family-name:var(--font-sarabun)] text-[24px] not-italic">
          เพื่อนช่วยป้ายยาหนังสือ
        </p>
      </div>

      {/* Button Container — pinned to bottom */}
      <div className="absolute bottom-0 left-0 flex flex-col items-start px-[16px] py-[32px] w-[393px]">
        {isLoading && (
          <div className="flex h-[56px] w-full items-center justify-center rounded-[8px] bg-gray-100">
            <p className="text-gray-400 text-[20px]">Loading...</p>
          </div>
        )}

        {liffError && (
          <p className="text-red-500 text-sm text-center w-full mb-2">
            {liffError}
          </p>
        )}

        {liff && !isLoggedIn && (
          <button
            onClick={() => liff.login()}
            className="flex h-[56px] w-full items-center justify-center rounded-[8px] bg-[#07c755] hover:bg-[#05b34c] active:scale-95 transition-all"
          >
            <span className="font-[family-name:var(--font-jakarta)] font-medium text-[20px] text-white whitespace-nowrap leading-normal">
              Login with LINE
            </span>
          </button>
        )}

        {liff && isLoggedIn && (
          <button
            onClick={() => liff.logout()}
            className="flex h-[56px] w-full items-center justify-center rounded-[8px] border border-gray-300 bg-white hover:bg-gray-50 active:scale-95 transition-all"
          >
            <span className="font-[family-name:var(--font-jakarta)] font-medium text-[20px] text-gray-700 whitespace-nowrap leading-normal">
              Logout
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
