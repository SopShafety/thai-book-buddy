"use client";

interface Booth {
  zone: string;
  booth_number: string;
}

interface Publisher {
  id: string;
  name_th: string;
  name_en: string | null;
  category: string[];
  booths: Booth[];
}

interface Props {
  publisher: Publisher;
  selected: boolean;
  onToggle: (id: string) => void;
}

export default function PublisherCard({ publisher, selected, onToggle }: Props) {
  const booths = publisher.booths ?? [];

  return (
    <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-gray-100">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-[family-name:var(--font-prompt)] font-medium text-[16px] text-black leading-snug truncate">
          {publisher.name_th}
        </p>
        {publisher.name_en && publisher.name_en !== publisher.name_th && (
          <p className="font-[family-name:var(--font-jakarta)] text-[13px] text-gray-400 truncate">
            {publisher.name_en}
          </p>
        )}
        {/* Booth badges */}
        {booths.length > 0 && (
          <div className="flex gap-[6px] mt-[6px] flex-wrap">
            {booths.map((b) => (
              <span
                key={b.booth_number}
                className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] bg-[#4f46e5]/10 text-[#4f46e5] font-[family-name:var(--font-jakarta)] font-medium text-[12px]"
              >
                {b.booth_number}
              </span>
            ))}
            {publisher.category?.[0] && (
              <span className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] bg-gray-100 text-gray-500 font-[family-name:var(--font-prompt)] text-[12px]">
                {publisher.category[0].replace("โซน", "").trim()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Add / Remove button */}
      <button
        onClick={() => onToggle(publisher.id)}
        className={`shrink-0 size-[36px] rounded-full flex items-center justify-center transition-all active:scale-90 ${
          selected
            ? "bg-[#4f46e5] text-white"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {selected ? (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
