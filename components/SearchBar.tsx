"use client";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({ onSearch, placeholder = "ค้นหา...", debounceMs = 200 }: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function handleChange(newValue: string) {
    setValue(newValue);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(newValue), debounceMs);
  }

  function handleClear() {
    setValue("");
    if (timerRef.current) clearTimeout(timerRef.current);
    onSearch("");
  }

  return (
    <div className={`flex items-center gap-[9px] h-[48px] px-[12px] rounded-[16px] bg-[#fafaf8] border transition-colors ${
      focused ? "border-[#973c00]" : "border-[#f0e4d4]"
    }`}>
      <Search size={20} color={focused ? "#973c00" : "#746d67"} strokeWidth={1.8} className="shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent font-[family-name:var(--font-sarabun)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none"
      />
      {value && (
        <button onClick={handleClear} className="shrink-0 text-[#746d67]">
          <X size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
