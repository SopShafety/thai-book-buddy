"use client";
import { useLIFF } from "../providers/liff-providers";

export default function Home() {
  const { liff, liffError, isLoading } = useLIFF();

  const isLoggedIn = liff?.isLoggedIn() ?? false;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Thai Book Buddy</h1>

      {isLoading && (
        <p className="text-gray-500">Loading...</p>
      )}

      {liffError && (
        <p className="text-red-500 text-sm">LIFF error: {liffError}</p>
      )}

      {liff && !isLoggedIn && (
        <button
          onClick={() => liff.login()}
          className="flex items-center gap-3 rounded-xl bg-[#06C755] px-6 py-3 text-white font-semibold text-lg shadow-md hover:bg-[#05b34c] active:scale-95 transition-all"
        >
          {/* LINE logo */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-white">
            <path d="M12 2C6.477 2 2 6.038 2 11.001c0 4.442 3.584 8.163 8.438 8.864.328.07.775.214.888.492.102.254.067.651.033.908l-.144.857c-.044.254-.202.995.873.543 1.075-.453 5.797-3.415 7.91-5.845C21.353 14.925 22 13.038 22 11.001 22 6.038 17.523 2 12 2zm-4.5 13.5h-2a.5.5 0 0 1-.5-.5v-6a.5.5 0 0 1 1 0v5.5h1.5a.5.5 0 0 1 0 1zm2 0a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 1 0v6zm5 0h-2a.5.5 0 0 1-.5-.5v-6a.5.5 0 0 1 1 0v2.5l2.1-2.8a.5.5 0 0 1 .9.3v6a.5.5 0 0 1-1 0v-3.2l-2 2.667V15a.5.5 0 0 1-.5.5zm5.5-.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-6a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-1.5v1.5H20a.5.5 0 0 1 0 1h-1.5V14H20a.5.5 0 0 1 .5.5z" />
          </svg>
          Login with LINE
        </button>
      )}

      {liff && isLoggedIn && (
        <button
          onClick={() => liff.logout()}
          className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-gray-700 font-semibold text-lg shadow-sm hover:bg-gray-100 active:scale-95 transition-all"
        >
          Logout
        </button>
      )}
    </main>
  );
}
