export default function LoadingScreen() {
  return (
    <div className="flex w-full h-[100dvh] items-center justify-center bg-[#fafaf8]">
      <div className="flex items-center gap-[6px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block size-[8px] rounded-full bg-[#c4855a]"
            style={{ animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
