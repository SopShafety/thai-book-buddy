"use client";
import { useLIFF } from "../providers/liff-providers";

const catImage = "/cat lying on books.png";

export default function Home() {
  const { liff, liffError, isLoading } = useLIFF();

  const isLoggedIn = liff?.isLoggedIn() ?? false;

  return (
    <main className="relative flex min-h-screen w-full max-w-[393px] mx-auto flex-col items-center bg-white overflow-hidden">
      {/* Cat illustration */}
      <div className="mt-[128px] flex w-full flex-col items-center p-[8px]">
        <div className="relative h-[261px] w-full">
          <img
            alt="cat lying on books"
            src={catImage}
            className="absolute h-[99.09%] left-[27.3%] top-[4.44%] w-[81.96%] object-contain"
          />
        </div>
      </div>

      {/* Title */}
      <div className="mt-[14px] flex flex-col items-center gap-[14px] text-black text-center">
        <p className="font-[family-name:var(--font-literata)] text-[40px] leading-normal">BookFair Buddy</p>
        <p className="font-[family-name:var(--font-sarabun)] text-[24px] leading-normal">เพื่อนช่วยป้ายยาหนังสือ</p>
      </div>

      {/* Errors */}
      {liffError && (
        <p className="mt-4 text-red-500 text-sm px-4 text-center">
          LIFF error: {liffError}
        </p>
      )}

      {/* Button area pinned to bottom */}
      <div className="absolute bottom-0 left-0 w-full px-[16px] py-[32px]">
        {isLoading && (
          <div className="flex h-[56px] items-center justify-center rounded-[8px] bg-gray-100">
            <p className="text-gray-400 text-[20px]">Loading...</p>
          </div>
        )}

        {liff && !isLoggedIn && (
          <button
            onClick={() => liff.login()}
            className="flex h-[56px] w-full items-center justify-center rounded-[8px] bg-[#07c755] hover:bg-[#05b34c] active:scale-95 transition-all"
          >
            <span className="font-[family-name:var(--font-jakarta)] text-[20px] font-medium text-white">
              Login with LINE
            </span>
          </button>
        )}

        {liff && isLoggedIn && (
          <button
            onClick={() => liff.logout()}
            className="flex h-[56px] w-full items-center justify-center rounded-[8px] border border-gray-300 bg-white hover:bg-gray-50 active:scale-95 transition-all"
          >
            <span className="text-[20px] font-medium text-gray-700">
              Logout
            </span>
          </button>
        )}
      </div>
    </main>
  );
}
