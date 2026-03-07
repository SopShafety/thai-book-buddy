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
  const primaryBooth = booths[0]?.booth_number ?? "—";
  const category = publisher.category?.[0]?.replace("โซน", "").trim();

  return (
    <div className="bg-white border border-[#fff8ee] rounded-[16px] shadow-[3px_3px_0px_0px_#f0e4d4] flex gap-[16px] items-start p-[24px]">
      {/* Booth number */}
      <div className="shrink-0 w-[56px]">
        <p className="font-[family-name:var(--font-jakarta)] font-extrabold text-[24px] text-[#3d2b1a] leading-none">
          {primaryBooth}
        </p>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <p className="font-[family-name:var(--font-prompt)] font-medium text-[16px] text-[#3d2b1a] leading-snug">
            {publisher.name_th}
          </p>
          {publisher.name_en && publisher.name_en !== publisher.name_th && (
            <p className="font-[family-name:var(--font-jakarta)] font-light text-[12px] text-[#3d2b1a] leading-snug">
              {publisher.name_en}
            </p>
          )}
        </div>
        {category && (
          <div className="inline-flex self-start items-center px-[12px] py-[4px] rounded-[20px] bg-[#fff8ee]">
            <span className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#9c7a5b]">
              {category}
            </span>
          </div>
        )}
      </div>

      {/* Add / Remove button */}
      <button
        onClick={() => onToggle(publisher.id)}
        className="shrink-0 size-[32px] flex items-center justify-center transition-all active:scale-90"
      >
        {selected ? (
          <svg width="32" height="32" fill="#c4855a" viewBox="0 0 24 24">
            <path d="M12 21C7 15.5 2 12.2 2 8a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 4.2-5 7.5-10 13Z" />
          </svg>
        ) : (
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path d="M12 21C7 15.5 2 12.2 2 8a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 4.2-5 7.5-10 13Z" stroke="#c4855a" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
